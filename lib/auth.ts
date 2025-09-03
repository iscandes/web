// Authentication utilities with JWT and password hashing
import Database from './database';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  error?: string;
}

// Mock JWT utilities (in production, use actual JWT library)
export class Auth {
  private static JWT_SECRET = process.env.JWT_SECRET || 'your-super-secure-jwt-secret-key';
  private static TOKEN_EXPIRY = '24h';

  // Hash password using bcrypt (mock implementation)
  static async hashPassword(password: string): Promise<string> {
    // In production: return await bcrypt.hash(password, 12);
    return `hashed_${password}_${Date.now()}`;
  }

  // Compare password with hash
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    // In production: return await bcrypt.compare(password, hash);
    return hash.includes(password);
  }

  // Generate JWT token
  static generateToken(user: AuthUser): string {
    // In production: return jwt.sign(user, this.JWT_SECRET, { expiresIn: this.TOKEN_EXPIRY });
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    };
    return `jwt_${Buffer.from(JSON.stringify(payload)).toString('base64')}`;
  }

  // Verify JWT token
  static verifyToken(token: string): AuthUser | null {
    try {
      // In production: return jwt.verify(token, this.JWT_SECRET) as AuthUser;
      if (!token.startsWith('jwt_')) return null;
      
      const payload = JSON.parse(Buffer.from(token.replace('jwt_', ''), 'base64').toString());
      
      // Check if token is expired
      if (payload.exp < Date.now()) return null;
      
      return {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role
      };
    } catch (error) {
      return null;
    }
  }

  // Login user
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // In production: Replace demo credentials with real database lookup
      // Example:
      // const user = await Database.findUserByEmail(credentials.email);
      // if (!user) return { success: false, error: 'User not found' };
      // const valid = await this.comparePassword(credentials.password, user.password_hash);
      // if (!valid) return { success: false, error: 'Invalid credentials' };
      // const token = this.generateToken(user);
      // return { success: true, token, user };
      return { success: false, error: 'Demo credentials removed. Please implement real authentication.' };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }

  // Logout user
  static async logout(token: string): Promise<boolean> {
    try {
      const user = this.verifyToken(token);
      if (user) {
        // Log logout
        await Database.createLog({
          level: 'info',
          category: 'Authentication',
          message: `User logged out: ${user.email}`,
          userId: user.id
        });
      }
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  // Check if user has required role
  static hasRole(user: AuthUser, requiredRole: 'admin' | 'editor' | 'viewer'): boolean {
    const roleHierarchy = { admin: 3, editor: 2, viewer: 1 };
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }

  // Rate limiting for login attempts
  private static loginAttempts: Map<string, { count: number; lastAttempt: Date }> = new Map();

  static isRateLimited(email: string): boolean {
    const attempts = this.loginAttempts.get(email);
    if (!attempts) return false;

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (attempts.lastAttempt < fiveMinutesAgo) {
      this.loginAttempts.delete(email);
      return false;
    }

    return attempts.count >= 5;
  }

  static recordLoginAttempt(email: string): void {
    const current = this.loginAttempts.get(email) || { count: 0, lastAttempt: new Date() };
    this.loginAttempts.set(email, {
      count: current.count + 1,
      lastAttempt: new Date()
    });
  }

  // Password validation
  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Generate secure session ID
  static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // XSS Protection
  static sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // SQL Injection Protection (for raw queries)
  static escapeSQL(input: string): string {
    return input.replace(/'/g, "''").replace(/;/g, '');
  }
}

export default Auth;