import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    try {
      // Try to get user from database first
      const user = await MySQLDatabase.getUserByEmail(email);

      if (user) {
        // In production, you should hash passwords with bcrypt
        // For now, we're doing simple comparison since we stored plain text in init
        if (user.password_hash !== password) {
          return NextResponse.json(
            { error: 'Invalid email or password' },
            { status: 401 }
          );
        }

        // Update last login
        await MySQLDatabase.updateUserLastLogin(user.id!);

        // Log successful login
        await MySQLDatabase.createLog({
          level: 'info',
          category: 'Authentication',
          message: `User ${user.email} logged in successfully`,
          user_id: user.id,
          ip_address: (request as any).ip ?? request.headers.get('x-forwarded-for') ?? 'unknown'
        });

        // Return user data (excluding password)
        const { password_hash, ...userWithoutPassword } = user;
        
        return NextResponse.json({
          success: true,
          user: userWithoutPassword,
          token: 'authenticated' // In production, use JWT
        });
      }
    } catch (dbError) {
      console.log('Database not available, using fallback authentication');
    }

    // Fallback authentication when database is not available
    // Use updated admin credentials
    const defaultAdmin = {
      email: 'admin@example.com',
      password: 'Eamma###2024-'
    };

    if (email === defaultAdmin.email && password === defaultAdmin.password) {
      const adminUser = {
        id: 1,
        email: defaultAdmin.email,
        name: 'Admin',
        role: 'admin' as const,
        is_active: true,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        user: adminUser,
        token: 'authenticated' // In production, use JWT
      });
    }

    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}