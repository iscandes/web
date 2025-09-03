import mysql from 'mysql2/promise';

// Database configuration with your provided credentials
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  ssl: {
    rejectUnauthorized: false
  },
  // Minimal connection limits to avoid exceeding server limits
  connectionLimit: 1,
  queueLimit: 5,
  // Connection pool options supported by mysql2
  enableKeepAlive: false,
  idleTimeout: 30000,
  maxIdle: 0,
  // Additional connection management
  multipleStatements: false
  // Removed invalid options: acquireTimeout, timeout, reconnect, releaseTimeout
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Interfaces for database entities
export interface Project {
  id?: number;
  name: string;
  slug: string;
  project_name?: string;
  sub_project?: string;
  display_title?: string;
  developer: string;
  developer_id?: number;
  location: string;
  price?: string;
  starting_price?: string;
  status?: string;
  project_type?: string;
  type?: string;
  category?: string;
  color_palette?: string | null;
  property_type?: string[];
  property_types?: string[];
  sub_projects?: string[];
  bedrooms?: number;
  bathrooms?: number;
  studios?: number;
  units_1bedroom?: number;
  units_2bedroom?: number;
  units_3bedroom?: number;
  units_4bedroom?: number;
  units_5bedroom?: number;
  units_office?: number;
  living_rooms?: number;
  units?: string[];
  area: string;
  description: string;
  image: string;
  gallery?: string[];
  coordinates_lat: number;
  coordinates_lng: number;
  features?: string[];
  amenities?: string[];
  is_featured?: boolean;
  featured?: boolean; // Alias for is_featured
  brochure_url?: string;
  theme_color?: string;
  voice_over_url?: string;
  // PowerPoint presentation fields (legacy)
  presentation_file?: string | null;
  presentation_url?: string;
  presentation_slides?: PresentationSlide[];
  presentation_animations?: any;
  presentation_effects?: any;
  media_type?: 'pdf' | 'video';
  media_files?: Array<{
    id?: number;
    file_name?: string;
    file_path?: string;
    url?: string;
    name?: string;
    media_type?: string;
    type?: string;
    mime_type?: string;
  }>;
  featured_video?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Developer {
  id?: number;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  established?: string;
  projects_count: number;
  location?: string;
  website?: string;
  phone?: string;
  email?: string;
  status: 'Active' | 'Inactive';
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id?: number;
  email: string;
  password_hash: string;
  role: 'admin' | 'editor' | 'viewer';
  name: string;
  last_login?: Date;
  created_at?: Date;
  is_active: boolean;
}

export interface HeroSection {
  id?: number;
  page: string;
  title: string;
  subtitle: string;
  description: string;
  background_image: string;
  cta_text: string;
  cta_link: string;
  is_active: boolean;
  updated_at?: Date;
}

export interface Article {
  id?: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author: string;
  author_id?: number;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  tags?: string[];
  category?: string;
  read_time?: number;
  meta_title?: string;
  meta_description?: string;
  featured?: boolean;
  views_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MediaFile {
  id?: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  // Optional camelCase aliases for compatibility with client payloads
  path?: string;
  size?: number;
  mimeType?: string;
  uploadedAt?: string;
  alt_text?: string;
  uploaded_by?: number;
  created_at?: string;
}

export interface SystemLog {
  id?: number;
  timestamp?: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  category: string;
  message: string;
  user_id?: number;
  ip_address?: string;
  user_agent?: string;
  details?: string;
}

export interface ChatMessage {
  id?: number;
  session_id: string;
  message: string;
  response: string;
  timestamp?: Date;
  response_time: number;
  user_ip?: string;
}

export interface PresentationSlide {
  id?: number;
  project_id: number;
  slide_number: number;
  title: string;
  content: string;
  description?: string;
  image_url?: string;
  background_image?: string;
  animation_type?: string;
  duration?: number;
  voice_over_url?: string;
  created_at?: Date;
}

export interface HeroImage {
  id?: number;
  url: string;
  title: string;
  description?: string;
  alt_text?: string;
  is_active: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface AIApiSettings {
  id?: number;
  openai_api_key: string;
  openai_model: string;
  openai_max_tokens: number;
  openai_temperature: number;
  gemini_api_key: string;
  gemini_model: string;
  claude_api_key: string;
  claude_model: string;
  deepseek_api_key: string;
  deepseek_model: string;
  deepseek_max_tokens: number;
  deepseek_temperature: number;
  default_provider: string;
  ai_enabled: boolean;
  rate_limit_per_minute: number;
  rate_limit_per_hour: number;
  system_prompt: string;
  property_suggestions_enabled: boolean;
  property_suggestions_count: number;
  contact_info_in_responses: boolean;
  created_at?: string;
  updated_at?: string;
}

// Database class with MySQL operations
export class MySQLDatabase {
  // Test database connection
  static async testConnection(): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      await connection.ping();
      connection.release();
      console.log('✅ Database connection successful');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }

  // Cleanup database connections
  static async cleanup(): Promise<void> {
    try {
      await pool.end();
      console.log('✅ Database connections closed');
    } catch (error) {
      console.error('❌ Error closing database connections:', error);
    }
  }

  // Generic query execution method
  static async executeQuery(query: string, params: any[] = []): Promise<any> {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(query, params);
      connection.release();
      return result;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  // Query method for backward compatibility
  static async query(sql: string, params: any[] = []): Promise<any> {
    return this.executeQuery(sql, params);
  }

  // Initialize database connection and tables
  static async initialize(): Promise<boolean> {
    try {
      // Test connection first
      const isConnected = await this.testConnection();
      if (!isConnected) {
        throw new Error('Database connection failed');
      }
      
      // Initialize tables
      return await this.initializeTables();
    } catch (error) {
      console.error('❌ Failed to initialize database:', error);
      return false;
    }
  }

  // Add missing columns to site_settings table
  static async addMissingSocialColumns(): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      
      // Check if columns exist and add them if they don't
      const alterTableSQL = `
        ALTER TABLE site_settings 
        ADD COLUMN IF NOT EXISTS social_tiktok VARCHAR(500),
        ADD COLUMN IF NOT EXISTS social_snapchat VARCHAR(500),
        ADD COLUMN IF NOT EXISTS social_telegram VARCHAR(500),
        ADD COLUMN IF NOT EXISTS social_whatsapp VARCHAR(500);
      `;
      
      await connection.execute(alterTableSQL);
      connection.release();
      console.log('✅ Missing social media columns added successfully');
      return true;
    } catch (error) {
      console.error('❌ Error adding missing columns:', error);
      return false;
    }
  }

  // Initialize database tables
  static async initializeTables(): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      
      // Create tables if they don't exist
      const createTablesSQL = `
        -- Users table
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
          name VARCHAR(255) NOT NULL,
          last_login TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          is_active BOOLEAN DEFAULT TRUE
        );

        -- Developers table
        CREATE TABLE IF NOT EXISTS developers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          description TEXT,
          logo VARCHAR(500),
          established VARCHAR(50),
          projects_count INT DEFAULT 0,
          location VARCHAR(255),
          website VARCHAR(500),
          phone VARCHAR(50),
          email VARCHAR(255),
          status ENUM('Active', 'Inactive') DEFAULT 'Active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        -- Projects table
        CREATE TABLE IF NOT EXISTS projects (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          developer VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          price VARCHAR(100) NOT NULL,
          status ENUM('Available', 'Sold', 'Under Construction') DEFAULT 'Available',
          bedrooms INT NOT NULL,
          bathrooms INT NOT NULL,
          studios INT DEFAULT 0,
          area VARCHAR(100) NOT NULL,
          description TEXT,
          image VARCHAR(500),
          gallery JSON,
          coordinates_lat DECIMAL(10, 8),
          coordinates_lng DECIMAL(11, 8),
          features JSON,
          amenities JSON,
          presentation_file VARCHAR(500),
          presentation_url VARCHAR(500),
          presentation_slides JSON,
          presentation_animations JSON,
          presentation_effects JSON,
          media_files JSON,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        -- Hero sections table
        CREATE TABLE IF NOT EXISTS hero_sections (
          id INT AUTO_INCREMENT PRIMARY KEY,
          page VARCHAR(100) NOT NULL,
          title VARCHAR(255) NOT NULL,
          subtitle VARCHAR(255),
          description TEXT,
          background_image VARCHAR(500),
          cta_text VARCHAR(100),
          cta_link VARCHAR(500),
          is_active BOOLEAN DEFAULT TRUE,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        -- Articles table
        CREATE TABLE IF NOT EXISTS articles (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          content LONGTEXT,
          excerpt TEXT,
          featured_image VARCHAR(500),
          author VARCHAR(255),
          status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
          published_at TIMESTAMP NULL,
          tags JSON,
          category VARCHAR(100),
          read_time INT DEFAULT 5,
          meta_description TEXT,
          featured BOOLEAN DEFAULT FALSE,
          views_count INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        -- Media files table
        CREATE TABLE IF NOT EXISTS media_files (
          id INT AUTO_INCREMENT PRIMARY KEY,
          filename VARCHAR(255) NOT NULL,
          original_name VARCHAR(255) NOT NULL,
          file_path VARCHAR(500) NOT NULL,
          file_size BIGINT NOT NULL,
          mime_type VARCHAR(100) NOT NULL,
          alt_text VARCHAR(255),
          uploaded_by INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
        );

        -- System logs table
        CREATE TABLE IF NOT EXISTS system_logs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          level ENUM('info', 'warning', 'error', 'success') NOT NULL,
          category VARCHAR(100) NOT NULL,
          message TEXT NOT NULL,
          user_id INT,
          ip_address VARCHAR(45),
          user_agent TEXT,
          details JSON,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        );

        -- Chat messages table
        CREATE TABLE IF NOT EXISTS chat_messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          session_id VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          response TEXT NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          response_time INT NOT NULL,
          user_ip VARCHAR(45)
        );

        -- Presentation slides table
        CREATE TABLE IF NOT EXISTS presentation_slides (
          id INT AUTO_INCREMENT PRIMARY KEY,
          project_id INT NOT NULL,
          slide_number INT NOT NULL,
          title VARCHAR(255),
          content TEXT,
          image_url VARCHAR(500),
          animation_type VARCHAR(100),
          duration INT DEFAULT 5000,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        );

        -- Site settings table
        CREATE TABLE IF NOT EXISTS site_settings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          site_title VARCHAR(255) DEFAULT 'Premium Choice',
          site_description TEXT DEFAULT 'Your trusted partner in Dubai real estate',
          site_logo VARCHAR(500) DEFAULT '/logo.png',
          site_favicon VARCHAR(500) DEFAULT '/favicon.ico',
          contact_email VARCHAR(255) DEFAULT 'admin@example.com',
    contact_phone VARCHAR(50) DEFAULT NULL,
    contact_address TEXT DEFAULT 'Dubai, UAE',
    contact_whatsapp VARCHAR(50) DEFAULT NULL,
          social_facebook VARCHAR(500),
          social_instagram VARCHAR(500),
          social_twitter VARCHAR(500),
          social_linkedin VARCHAR(500),
          social_youtube VARCHAR(500),
          social_tiktok VARCHAR(500),
          social_snapchat VARCHAR(500),
          social_telegram VARCHAR(500),
          social_whatsapp VARCHAR(500),
          seo_meta_title VARCHAR(255) DEFAULT 'Premium Choice - Dubai Real Estate',
          seo_meta_description TEXT DEFAULT 'Discover premium real estate opportunities in Dubai with Premium Choice. Your trusted partner for luxury properties and investment solutions.',
          seo_keywords TEXT DEFAULT 'Dubai real estate, luxury properties, investment, Premium Choice',
          features_enable_blog BOOLEAN DEFAULT TRUE,
          features_enable_newsletter BOOLEAN DEFAULT TRUE,
          features_enable_whatsapp BOOLEAN DEFAULT TRUE,
          features_enable_live_chat BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        -- Project media table for enhanced media management
        CREATE TABLE IF NOT EXISTS project_media (
          id INT AUTO_INCREMENT PRIMARY KEY,
          project_id INT NOT NULL,
          file_name VARCHAR(255) NOT NULL,
          file_path VARCHAR(500) NOT NULL,
          file_size BIGINT NOT NULL,
          media_type ENUM('image', 'video', 'animation', 'pdf', 'pptx') NOT NULL,
          file_extension VARCHAR(10) NOT NULL,
          upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        );

        -- Hero images table for landing page carousel
        CREATE TABLE IF NOT EXISTS hero_images (
          id INT AUTO_INCREMENT PRIMARY KEY,
          url VARCHAR(500) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          alt_text VARCHAR(255),
          is_active BOOLEAN DEFAULT TRUE,
          order_index INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_active_order (is_active, order_index)
        );

        -- AI API settings table for AI integration control
        CREATE TABLE IF NOT EXISTS ai_api_settings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          openai_api_key VARCHAR(255),
          openai_model VARCHAR(100) DEFAULT 'gpt-3.5-turbo',
          openai_max_tokens INT DEFAULT 1000,
          openai_temperature DECIMAL(3,2) DEFAULT 0.70,
          google_api_key VARCHAR(255),
          google_model VARCHAR(100) DEFAULT 'gemini-pro',
          google_max_tokens INT DEFAULT 1000,
          google_temperature DECIMAL(3,2) DEFAULT 0.70,
          anthropic_api_key VARCHAR(255),
          anthropic_model VARCHAR(100) DEFAULT 'claude-3-sonnet-20240229',
          anthropic_max_tokens INT DEFAULT 1000,
          anthropic_temperature DECIMAL(3,2) DEFAULT 0.70,
          default_provider ENUM('openai', 'google', 'anthropic') DEFAULT 'openai',
          ai_enabled BOOLEAN DEFAULT TRUE,
          rate_limit_per_minute INT DEFAULT 10,
          rate_limit_per_hour INT DEFAULT 100,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `;

      await connection.execute(createTablesSQL);
      connection.release();
      console.log('✅ Database tables initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize tables:', error);
      return false;
    }
  }

  // Insert default admin user
  static async createDefaultAdmin(): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      
      // Check if admin user already exists
      const [existingUsers] = await connection.execute(
        'SELECT id FROM users WHERE role = "admin"'
      );

      if ((existingUsers as any[]).length === 0) {
        // Create default admin user with your credentials
        await connection.execute(
          `INSERT INTO users (email, password_hash, role, name, is_active) 
           VALUES (?, ?, 'admin', 'Admin', TRUE)`,
          ['admin@example.com', 'Abedyr57..'] // In production, hash this password and change email
        );
        console.log('✅ Default admin user created');
      } else {
        console.log('ℹ️ Admin user already exists');
      }

      connection.release();
      return true;
    } catch (error) {
      console.error('❌ Failed to create admin user:', error);
      return false;
    }
  }

  // Update articles table with missing columns
  static async updateArticlesTable(): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      
      // Check if columns exist and add them if they don't
      const columnsToAdd = [
        { name: 'tags', definition: 'JSON' },
        { name: 'category', definition: 'VARCHAR(100)' },
        { name: 'read_time', definition: 'INT DEFAULT 5' },
        { name: 'meta_description', definition: 'TEXT' },
        { name: 'featured', definition: 'BOOLEAN DEFAULT FALSE' },
        { name: 'views_count', definition: 'INT DEFAULT 0' }
      ];

      for (const column of columnsToAdd) {
        try {
          // Check if column exists
          const [rows] = await connection.execute(
            `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
             WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'articles' AND COLUMN_NAME = ?`,
            [column.name]
          );
          
          if ((rows as any[]).length === 0) {
            // Column doesn't exist, add it
            await connection.execute(`ALTER TABLE articles ADD COLUMN ${column.name} ${column.definition}`);
            console.log(`✅ Added column '${column.name}' to articles table`);
          } else {
            console.log(`ℹ️ Column '${column.name}' already exists in articles table`);
          }
        } catch (error) {
          console.error(`❌ Failed to add column '${column.name}':`, error);
        }
      }

      connection.release();
      return true;
    } catch (error) {
      console.error('❌ Failed to update articles table:', error);
      return false;
    }
  }

  // Projects CRUD operations
  static async getProjects(): Promise<Project[]> {
    let connection;
    try {
      console.log('🔗 Attempting to get database connection...');
      connection = await pool.getConnection();
      console.log('✅ Database connection acquired');
      
      const [rows] = await connection.execute('SELECT * FROM projects ORDER BY created_at DESC');
      console.log(`📊 Retrieved ${(rows as any[]).length} projects from database`);
      
      // Parse JSON fields for each project
      const parseJsonField = (field: any) => {
        if (!field) return null;
        if (typeof field === 'string') {
          try {
            return JSON.parse(field);
          } catch {
            return field.split(',').map((item: string) => item.trim()).filter(Boolean);
          }
        }
        return field;
      };

      const projects = (rows as Project[]).map(project => ({
        ...project,
        gallery: parseJsonField(project.gallery),
        features: parseJsonField(project.features),
        amenities: parseJsonField(project.amenities),
        property_types: parseJsonField((project as any).property_types),
        sub_projects: parseJsonField((project as any).sub_projects),
        media_files: parseJsonField((project as any).media_files),
        units: parseJsonField(project.units),
        property_type: parseJsonField(project.property_type)
      }));
      
      console.log('✅ Projects parsed successfully');
      return projects;
    } catch (error) {
      console.error('❌ Error fetching projects:', error);
      if (error instanceof Error && error.message.includes('max_user_connections')) {
        console.error('🚫 Database connection limit exceeded. Consider reducing concurrent connections.');
      }
      return [];
    } finally {
      if (connection) {
        try {
          connection.release();
          console.log('🔓 Database connection released');
        } catch (releaseError) {
          console.error('⚠️ Error releasing connection:', releaseError);
        }
      }
    }
  }

  static async getProjectsByDeveloper(developerName: string): Promise<Project[]> {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM projects WHERE developer = ? ORDER BY created_at DESC', [developerName]);
      connection.release();
      
      // Parse JSON fields for each project
      const parseJsonField = (field: any) => {
        if (!field) return null;
        if (typeof field === 'string') {
          try {
            return JSON.parse(field);
          } catch {
            return field.split(',').map((item: string) => item.trim()).filter(Boolean);
          }
        }
        return field;
      };

      return (rows as Project[]).map(project => ({
        ...project,
        gallery: parseJsonField(project.gallery),
        features: parseJsonField(project.features),
        amenities: parseJsonField(project.amenities),
        property_types: parseJsonField((project as any).property_types),
        sub_projects: parseJsonField((project as any).sub_projects),
        media_files: parseJsonField((project as any).media_files),
        units: parseJsonField(project.units),
        property_type: parseJsonField(project.property_type)
      }));
    } catch (error) {
      console.error('Error fetching projects by developer:', error);
      return [];
    }
  }

  static async getProjectBySlug(slug: string): Promise<Project | null> {
    try {
      const connection = await pool.getConnection();
      
      // Get project data
      const [projectRows] = await connection.execute('SELECT * FROM projects WHERE slug = ?', [slug]);
      const projects = projectRows as Project[];
      
      if (projects.length === 0) {
        connection.release();
        return null;
      }
      
      const project = projects[0];
      
      // Get presentation slides for this project
      const [slideRows] = await connection.execute(
        'SELECT * FROM presentation_slides WHERE project_id = ? ORDER BY slide_number ASC',
        [project.id]
      );
      
      connection.release();
      
      // Parse JSON fields and add presentation slides
      const parseJsonField = (field: any) => {
        if (!field) return null;
        if (typeof field === 'string') {
          try {
            return JSON.parse(field);
          } catch {
            return field.split(',').map((item: string) => item.trim()).filter(Boolean);
          }
        }
        return field;
      };

      // Parse color palette safely
      const parseColorPalette = (colorPalette: any) => {
        if (!colorPalette) return null;
        if (typeof colorPalette === 'string') {
          try {
            return JSON.parse(colorPalette);
          } catch {
            return null;
          }
        }
        return colorPalette;
      };

      return {
        ...project,
        gallery: parseJsonField(project.gallery),
        features: parseJsonField(project.features),
        amenities: parseJsonField(project.amenities),
        property_types: parseJsonField((project as any).property_types),
        sub_projects: parseJsonField((project as any).sub_projects),
        media_files: parseJsonField((project as any).media_files),
        presentation_slides: slideRows as PresentationSlide[]
      };
    } catch (error) {
      console.error('Error fetching project by slug:', error);
      return null;
    }
  }

  static async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project | null> {
    let connection;
    try {
      // Validate required fields
      if (!project.name || project.name.trim() === '') {
        throw new Error('Project name is required');
      }
      if (!project.description || project.description.trim() === '') {
        throw new Error('Project description is required');
      }

      connection = await pool.getConnection();
      
      // Helper function to convert undefined to null
      const toNullIfUndefined = (value: any) => value === undefined ? null : value;
      
      // Ensure slug is unique by adding timestamp if needed
      let finalSlug = project.slug || '';
      
      // Always check if slug already exists and make it unique
      const [existingRows] = await connection.execute('SELECT id FROM projects WHERE slug = ?', [finalSlug]);
      if ((existingRows as any[]).length > 0) {
        finalSlug = `${finalSlug}-${Date.now()}`;
      }
      
      const [result] = await connection.execute(
        `INSERT INTO projects (name, slug, developer, developer_id, location, price, status, bedrooms, bathrooms, area, 
         description, image, gallery, coordinates_lat, coordinates_lng, features, amenities,
         presentation_file, presentation_url, presentation_slides, presentation_animations, presentation_effects, 
         featured_video, studios, media_files)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          project.name || '', 
          finalSlug, 
          project.developer || '', 
          (project as any).developer_id || null,
          project.location || '', 
          project.price || 'Price on Request',
          project.status || 'Available', 
          project.bedrooms || 0, 
          project.bathrooms || 0, 
          project.area || '', 
          project.description || '',
          project.image || '', 
          JSON.stringify(project.gallery || []), 
          project.coordinates_lat || 0, 
          project.coordinates_lng || 0,
          JSON.stringify(project.features || []), 
          JSON.stringify(project.amenities || []), 
          toNullIfUndefined(project.presentation_file), 
          toNullIfUndefined(project.presentation_url), 
          JSON.stringify(project.presentation_slides || {}),
          JSON.stringify(project.presentation_animations || {}),
          JSON.stringify(project.presentation_effects || {}),
          toNullIfUndefined(project.featured_video),
          project.studios || 0,
          JSON.stringify(project.media_files || [])
        ]
      );
      
      const insertId = (result as any).insertId;
      
      // Update developer project count automatically
      if ((project as any).developer_id) {
        // Get developer name by ID for the count update
        const [devRows] = await connection.execute('SELECT name FROM developers WHERE id = ?', [(project as any).developer_id]);
        if ((devRows as any[]).length > 0) {
          await this.updateDeveloperProjectCount((devRows as any[])[0].name);
        }
      } else if (project.developer) {
        await this.updateDeveloperProjectCount(project.developer);
      }
      
      connection.release();
      
      return await this.getProjectById(insertId);
    } catch (error: any) {
      if (connection) {
        connection.release();
      }
      
      console.error('Error creating project:', error);
      
      // Check for specific MySQL errors
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('name')) {
          throw new Error('A project with this name already exists. Please choose a different name.');
        } else if (error.message.includes('slug')) {
          throw new Error('A project with this URL slug already exists. Please modify the project name.');
        } else {
          throw new Error('A project with these details already exists. Please check for duplicates.');
        }
      } else if (error.code === 'ER_DATA_TOO_LONG') {
        throw new Error('One or more fields contain too much data. Please shorten your input.');
      } else if (error.code === 'ER_BAD_NULL_ERROR') {
        throw new Error('Required field is missing. Please fill in all required fields.');
      } else if (error.message.includes('required')) {
        // Our custom validation errors
        throw error;
      } else {
        throw new Error('Database error occurred while creating the project. Please try again.');
      }
    }
  }

  static async getProjectById(id: number): Promise<Project | null> {
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM projects WHERE id = ?', [id]);
      const projects = rows as Project[];
      
      if (projects.length === 0) {
        return null;
      }
      
      const project = projects[0];
      
      // Parse JSON fields
      const parseJsonField = (field: any) => {
        if (!field) return null;
        if (typeof field === 'string') {
          try {
            return JSON.parse(field);
          } catch {
            return field.split(',').map((item: string) => item.trim()).filter(Boolean);
          }
        }
        return field;
      };

      return {
        ...project,
        gallery: parseJsonField(project.gallery),
        features: parseJsonField(project.features),
        amenities: parseJsonField(project.amenities),
        property_types: parseJsonField((project as any).property_types),
        sub_projects: parseJsonField((project as any).sub_projects),
        media_files: parseJsonField((project as any).media_files),
        units: parseJsonField(project.units),
        property_type: parseJsonField(project.property_type)
      };
    } catch (error) {
      console.error('Error fetching project by ID:', error);
      throw error; // Re-throw to let API handle the error properly
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  static async updateProject(id: number, updateData: Partial<Project>): Promise<Project | null> {
    try {
      const connection = await pool.getConnection();
      
      // Get the current project data to check if developer is changing
      const [currentRows] = await connection.execute('SELECT developer FROM projects WHERE id = ?', [id]);
      const currentProject = (currentRows as any[])[0];
      const oldDeveloper = currentProject?.developer;
      
      // Build dynamic update query
      const fields = Object.keys(updateData).filter(key => key !== 'id');
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => {
        const value = (updateData as any)[field];
        return typeof value === 'object' ? JSON.stringify(value) : value;
      });
      
      await connection.execute(
        `UPDATE projects SET ${setClause}, updated_at = NOW() WHERE id = ?`,
        [...values, id]
      );
      
      // Update project counts if developer changed
      const newDeveloper = updateData.developer;
      if (newDeveloper && newDeveloper !== oldDeveloper) {
        // Update count for old developer
        if (oldDeveloper) {
          await this.updateDeveloperProjectCount(oldDeveloper);
        }
        // Update count for new developer
        await this.updateDeveloperProjectCount(newDeveloper);
      }
      
      connection.release();
      return await this.getProjectById(id);
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  }

  static async deleteProject(id: number): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      
      // First check if the project exists and get developer name
      const [checkRows] = await connection.execute('SELECT id, developer FROM projects WHERE id = ?', [id]);
      if ((checkRows as any[]).length === 0) {
        connection.release();
        console.log(`Project with id ${id} not found`);
        return false;
      }
      
      const projectData = (checkRows as any[])[0];
      const developerName = projectData.developer;
      
      // Delete the project (CASCADE will handle related records)
      const [result] = await connection.execute('DELETE FROM projects WHERE id = ?', [id]);
      
      // Update developer project count automatically
      if (developerName) {
        await this.updateDeveloperProjectCount(developerName);
      }
      
      connection.release();
      
      // Check if any rows were affected
      const affectedRows = (result as any).affectedRows;
      console.log(`Delete operation affected ${affectedRows} rows for project id ${id}`);
      
      return affectedRows > 0;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }

  // Developers CRUD operations
  static async getDevelopers(): Promise<Developer[]> {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM developers ORDER BY name ASC');
      connection.release();
      return rows as Developer[];
    } catch (error) {
      console.error('Error fetching developers:', error);
      return [];
    }
  }

  static async createDeveloper(developer: Omit<Developer, 'id' | 'created_at' | 'updated_at'>): Promise<Developer | null> {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        `INSERT INTO developers (name, slug, description, logo, established, projects_count, 
         location, website, phone, email, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          developer.name, developer.slug, developer.description, developer.logo,
          developer.established, developer.projects_count, developer.location,
          developer.website, developer.phone, developer.email, developer.status
        ]
      );
      
      const insertId = (result as any).insertId;
      connection.release();
      
      return await this.getDeveloperById(insertId);
    } catch (error) {
      console.error('Error creating developer:', error);
      return null;
    }
  }

  static async getDeveloperById(id: number): Promise<Developer | null> {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM developers WHERE id = ?', [id]);
      connection.release();
      const developers = rows as Developer[];
      return developers.length > 0 ? developers[0] : null;
    } catch (error) {
      console.error('Error fetching developer by ID:', error);
      return null;
    }
  }

  static async updateDeveloper(id: number, updateData: Partial<Developer>): Promise<Developer | null> {
    try {
      const connection = await pool.getConnection();
      
      const fields = Object.keys(updateData).filter(key => key !== 'id');
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => (updateData as any)[field]);
      
      await connection.execute(
        `UPDATE developers SET ${setClause}, updated_at = NOW() WHERE id = ?`,
        [...values, id]
      );
      
      connection.release();
      return await this.getDeveloperById(id);
    } catch (error) {
      console.error('Error updating developer:', error);
      return null;
    }
  }

  static async deleteDeveloper(id: number): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      await connection.execute('DELETE FROM developers WHERE id = ?', [id]);
      connection.release();
      return true;
    } catch (error) {
      console.error('Error deleting developer:', error);
      return false;
    }
  }

  static async updateDeveloperProjectCount(developerName: string): Promise<void> {
    try {
      const connection = await pool.getConnection();
      
      // Count projects for this developer
      const [countRows] = await connection.execute(
        'SELECT COUNT(*) as project_count FROM projects WHERE developer = ?',
        [developerName]
      );
      
      const projectCount = (countRows as any[])[0].project_count;
      
      // Update the developer's project count
      await connection.execute(
        'UPDATE developers SET projects_count = ?, updated_at = NOW() WHERE name = ?',
        [projectCount, developerName]
      );
      
      connection.release();
      console.log(`Updated project count for developer ${developerName}: ${projectCount} projects`);
    } catch (error) {
      console.error('Error updating developer project count:', error);
    }
  }

  // Enhanced project-developer relationship methods
  static async getProjectsByDeveloperId(developerId: number): Promise<Project[]> {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        `SELECT p.*, d.name as developer_name, d.slug as developer_slug 
         FROM projects p 
         LEFT JOIN developers d ON p.developer_id = d.id 
         WHERE p.developer_id = ? 
         ORDER BY p.created_at DESC`,
        [developerId]
      );
      connection.release();
      return rows as Project[];
    } catch (error) {
      console.error('Error fetching projects by developer ID:', error);
      return [];
    }
  }

  static async getDeveloperWithProjects(developerId: number): Promise<Developer & { projects: Project[] } | null> {
    try {
      const connection = await pool.getConnection();
      
      // Get developer details
      const [developerRows] = await connection.execute(
        'SELECT * FROM developers WHERE id = ?',
        [developerId]
      );
      
      if ((developerRows as any[]).length === 0) {
        connection.release();
        return null;
      }
      
      const developer = (developerRows as any[])[0] as Developer;
      
      // Get associated projects
      const [projectRows] = await connection.execute(
        'SELECT * FROM projects WHERE developer_id = ? ORDER BY created_at DESC',
        [developerId]
      );
      
      connection.release();
      
      return {
        ...developer,
        projects: projectRows as Project[]
      };
    } catch (error) {
      console.error('Error fetching developer with projects:', error);
      return null;
    }
  }

  static async assignProjectToDeveloper(projectId: number, developerId: number): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      
      // Update project with developer_id
      await connection.execute(
        'UPDATE projects SET developer_id = ?, updated_at = NOW() WHERE id = ?',
        [developerId, projectId]
      );
      
      // Update developer's project count
      await connection.execute(
        'UPDATE developers SET projects_count = projects_count + 1, updated_at = NOW() WHERE id = ?',
        [developerId]
      );
      
      connection.release();
      return true;
    } catch (error) {
      console.error('Error assigning project to developer:', error);
      return false;
    }
  }

  static async unassignProjectFromDeveloper(projectId: number): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      
      // Get current developer_id before removing
      const [projectRows] = await connection.execute(
        'SELECT developer_id FROM projects WHERE id = ?',
        [projectId]
      );
      
      if ((projectRows as any[]).length > 0) {
        const currentDeveloperId = (projectRows as any[])[0].developer_id;
        
        if (currentDeveloperId) {
          // Remove developer assignment
          await connection.execute(
            'UPDATE projects SET developer_id = NULL, updated_at = NOW() WHERE id = ?',
            [projectId]
          );
          
          // Update developer's project count
          await connection.execute(
            'UPDATE developers SET projects_count = projects_count - 1, updated_at = NOW() WHERE id = ?',
            [currentDeveloperId]
          );
        }
      }
      
      connection.release();
      return true;
    } catch (error) {
      console.error('Error unassigning project from developer:', error);
      return false;
    }
  }

  static async deleteDeveloperWithCascade(id: number): Promise<{ success: boolean; deletedProjects: number }> {
    try {
      const connection = await pool.getConnection();
      
      // Start transaction
      await connection.beginTransaction();
      
      try {
        // Count projects that will be deleted
        const [countRows] = await connection.execute(
          'SELECT COUNT(*) as project_count FROM projects WHERE developer_id = ?',
          [id]
        );
        const deletedProjects = (countRows as any[])[0].project_count;
        
        // Delete associated projects (cascading delete)
        await connection.execute(
          'DELETE FROM projects WHERE developer_id = ?',
          [id]
        );
        
        // Delete the developer
        await connection.execute(
          'DELETE FROM developers WHERE id = ?',
          [id]
        );
        
        // Commit transaction
        await connection.commit();
        connection.release();
        
        return { success: true, deletedProjects };
      } catch (error) {
        // Rollback transaction on error
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      console.error('Error deleting developer with cascade:', error);
      return { success: false, deletedProjects: 0 };
    }
  }

  static async createProjectWithDeveloper(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>, developerId?: number): Promise<Project | null> {
    try {
      const connection = await pool.getConnection();
      
      // Start transaction
      await connection.beginTransaction();
      
      try {
        // Create the project with developer_id
        const projectToCreate = {
          ...projectData,
          developer_id: developerId || null
        };
        
        const [result] = await connection.execute(
          `INSERT INTO projects (
            name, slug, project_name, sub_project, display_title, developer, developer_id,
            location, price, starting_price, status, project_type, type, category,
            color_palette, property_type, property_types, sub_projects, bedrooms, bathrooms,
            studios, units_1bedroom, units_2bedroom, units_3bedroom, units_4bedroom,
            units_5bedroom, units_office, living_rooms, units, area, description, image,
            gallery, coordinates_lat, coordinates_lng, features, amenities, is_featured,
            brochure_url, theme_color, voice_over_url, presentation_file, presentation_url,
            media_type, featured_video, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            projectToCreate.name,
            projectToCreate.slug,
            projectToCreate.project_name || null,
            projectToCreate.sub_project || null,
            projectToCreate.display_title || null,
            projectToCreate.developer,
            projectToCreate.developer_id,
            projectToCreate.location,
            projectToCreate.price || null,
            projectToCreate.starting_price || null,
            projectToCreate.status || 'Active',
            projectToCreate.project_type || null,
            projectToCreate.type || null,
            projectToCreate.category || null,
            projectToCreate.color_palette || null,
            JSON.stringify(projectToCreate.property_type || []),
            JSON.stringify(projectToCreate.property_types || []),
            JSON.stringify(projectToCreate.sub_projects || []),
            projectToCreate.bedrooms || 0,
            projectToCreate.bathrooms || 0,
            projectToCreate.studios || 0,
            projectToCreate.units_1bedroom || 0,
            projectToCreate.units_2bedroom || 0,
            projectToCreate.units_3bedroom || 0,
            projectToCreate.units_4bedroom || 0,
            projectToCreate.units_5bedroom || 0,
            projectToCreate.units_office || 0,
            projectToCreate.living_rooms || 0,
            JSON.stringify(projectToCreate.units || []),
            projectToCreate.area,
            projectToCreate.description,
            projectToCreate.image,
            JSON.stringify(projectToCreate.gallery || []),
            projectToCreate.coordinates_lat,
            projectToCreate.coordinates_lng,
            JSON.stringify(projectToCreate.features || []),
            JSON.stringify(projectToCreate.amenities || []),
            projectToCreate.is_featured || false,
            projectToCreate.brochure_url || null,
            projectToCreate.theme_color || null,
            projectToCreate.voice_over_url || null,
            projectToCreate.presentation_file || null,
            projectToCreate.presentation_url || null,
            projectToCreate.media_type || null,
            projectToCreate.featured_video || null
          ]
        );
        
        const insertId = (result as any).insertId;
        
        // Update developer's project count if assigned
        if (developerId) {
          await connection.execute(
            'UPDATE developers SET projects_count = projects_count + 1, updated_at = NOW() WHERE id = ?',
            [developerId]
          );
        }
        
        // Commit transaction
        await connection.commit();
        
        // Fetch and return the created project
        const [projectRows] = await connection.execute(
          'SELECT * FROM projects WHERE id = ?',
          [insertId]
        );
        
        connection.release();
        
        if ((projectRows as any[]).length > 0) {
          const project = (projectRows as any[])[0] as Project;
          return {
            ...project,
            property_type: project.property_type ? (typeof project.property_type === 'string' ? JSON.parse(project.property_type) : project.property_type) : [],
            property_types: project.property_types ? (typeof project.property_types === 'string' ? JSON.parse(project.property_types) : project.property_types) : [],
            sub_projects: project.sub_projects ? (typeof project.sub_projects === 'string' ? JSON.parse(project.sub_projects) : project.sub_projects) : [],
            units: project.units ? (typeof project.units === 'string' ? JSON.parse(project.units) : project.units) : [],
            gallery: project.gallery ? (typeof project.gallery === 'string' ? JSON.parse(project.gallery) : project.gallery) : [],
            features: project.features ? (typeof project.features === 'string' ? JSON.parse(project.features) : project.features) : [],
            amenities: project.amenities ? (typeof project.amenities === 'string' ? JSON.parse(project.amenities) : project.amenities) : []
          };
        }
        
        return null;
      } catch (error) {
        // Rollback transaction on error
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      console.error('Error creating project with developer:', error);
      return null;
    }
  }

  // Articles CRUD operations
  static async getArticles(): Promise<Article[]> {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM articles ORDER BY created_at DESC');
      connection.release();
      const articles = rows as Article[];
      
      // Parse JSON tags field and handle missing columns
      return articles.map(article => ({
        ...article,
        tags: article.tags ? (typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags) : [],
        category: article.category || '',
        read_time: article.read_time || 5,
        meta_description: article.meta_description || '',
        featured: article.featured || false,
        views_count: article.views_count || 0
      }));
    } catch (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
  }

  static async createArticle(article: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<Article | null> {
    try {
      const connection = await pool.getConnection();
      
      // First try with all columns
      try {
        const [result] = await connection.execute(
          `INSERT INTO articles (title, slug, content, excerpt, featured_image, author, status, published_at, tags, category, read_time, meta_description, featured, views_count)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            article.title, article.slug, article.content, article.excerpt,
            article.featured_image, article.author, article.status, article.published_at,
            JSON.stringify(article.tags || []), article.category, article.read_time,
            article.meta_description, article.featured || false, article.views_count || 0
          ]
        );
        
        const insertId = (result as any).insertId;
        connection.release();
        return await this.getArticleById(insertId);
      } catch (insertError) {
        console.log('Full insert failed, trying basic insert:', insertError);
        
        // If that fails, try with basic columns only
        const [result] = await connection.execute(
          `INSERT INTO articles (title, slug, content, excerpt, featured_image, author, status, published_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            article.title, article.slug, article.content, article.excerpt,
            article.featured_image, article.author, article.status, article.published_at
          ]
        );
        
        const insertId = (result as any).insertId;
        connection.release();
        return await this.getArticleById(insertId);
      }
    } catch (error) {
      console.error('Error creating article:', error);
      return null;
    }
  }

  static async getArticleById(id: number): Promise<Article | null> {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM articles WHERE id = ?', [id]);
      connection.release();
      const articles = rows as Article[];
      if (articles.length > 0) {
        const article = articles[0];
        return {
          ...article,
          tags: article.tags ? (typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags) : [],
          category: article.category || '',
          read_time: article.read_time || 5,
          meta_description: article.meta_description || '',
          featured: article.featured || false,
          views_count: article.views_count || 0
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching article by ID:', error);
      return null;
    }
  }

  static async updateArticle(id: number, updateData: Partial<Article>): Promise<Article | null> {
    try {
      const connection = await pool.getConnection();
      
      // Convert tags array to JSON string if present
      const processedData = { ...updateData };
      if (processedData.tags) {
        processedData.tags = JSON.stringify(processedData.tags) as any;
      }
      
      const fields = Object.keys(processedData).filter(key => key !== 'id');
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => (processedData as any)[field]);
      
      await connection.execute(
        `UPDATE articles SET ${setClause}, updated_at = NOW() WHERE id = ?`,
        [...values, id]
      );
      
      connection.release();
      return await this.getArticleById(id);
    } catch (error) {
      console.error('Error updating article:', error);
      return null;
    }
  }

  static async deleteArticle(id: number): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      await connection.execute('DELETE FROM articles WHERE id = ?', [id]);
      connection.release();
      return true;
    } catch (error) {
      console.error('Error deleting article:', error);
      return false;
    }
  }

  static async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM articles WHERE slug = ? AND status = "published"', [slug]);
      connection.release();
      const articles = rows as Article[];
      if (articles.length > 0) {
        const article = articles[0];
        return {
          ...article,
          tags: article.tags ? (typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags) : [],
          category: article.category || '',
          read_time: article.read_time || 5,
          meta_description: article.meta_description || '',
          featured: article.featured || false,
          views_count: article.views_count || 0
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching article by slug:', error);
      return null;
    }
  }

  static async getPublishedArticles(options?: {
    limit?: number;
    category?: string;
    featured?: boolean;
  }): Promise<Article[]> {
    try {
      const connection = await pool.getConnection();
      let query = 'SELECT * FROM articles WHERE status = "published" ORDER BY published_at DESC, created_at DESC';
      const params: any[] = [];

      if (options?.limit) {
        query += ' LIMIT ?';
        params.push(options.limit);
      }

      const [rows] = await connection.execute(query, params);
      connection.release();
      const articles = rows as Article[];
      
      // Parse JSON tags field and handle missing columns
      return articles.map(article => ({
        ...article,
        tags: article.tags ? (typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags) : [],
        category: article.category || '',
        read_time: article.read_time || 5,
        meta_description: article.meta_description || '',
        featured: article.featured || false,
        views_count: article.views_count || 0
      }));
    } catch (error) {
      console.error('Error fetching published articles:', error);
      return [];
    }
  }

  // Media Files CRUD operations
  static async getMediaFiles(): Promise<MediaFile[]> {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM media_files ORDER BY created_at DESC');
      connection.release();
      return rows as MediaFile[];
    } catch (error) {
      console.error('Error fetching media files:', error);
      return [];
    }
  }

  static async createMediaFile(mediaData: Omit<MediaFile, 'id' | 'created_at'>): Promise<MediaFile | null> {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        `INSERT INTO media_files (filename, original_name, file_path, file_size, mime_type, alt_text, uploaded_by)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          mediaData.filename, mediaData.original_name, mediaData.file_path,
          mediaData.file_size, mediaData.mime_type, mediaData.alt_text, mediaData.uploaded_by
        ]
      );
      
      const insertId = (result as any).insertId;
      connection.release();
      
      return await this.getMediaFileById(insertId);
    } catch (error) {
      console.error('Error creating media file:', error);
      return null;
    }
  }

  static async getMediaFileById(id: number): Promise<MediaFile | null> {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM media_files WHERE id = ?', [id]);
      connection.release();
      const mediaFiles = rows as MediaFile[];
      return mediaFiles.length > 0 ? mediaFiles[0] : null;
    } catch (error) {
      console.error('Error fetching media file by ID:', error);
      return null;
    }
  }

  static async updateMediaFile(id: number, updateData: Partial<MediaFile>): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      
      const fields = Object.keys(updateData).filter(key => 
        key !== 'id' && key !== 'created_at' && updateData[key as keyof MediaFile] !== undefined
      );
      
      if (fields.length === 0) {
        connection.release();
        return true;
      }

      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => updateData[field as keyof MediaFile]);

      const [result] = await connection.execute(
        `UPDATE media_files SET ${setClause} WHERE id = ?`,
        [...values, id]
      );
      
      connection.release();
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Error updating media file:', error);
      return false;
    }
  }

  static async deleteMediaFile(id: number): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      await connection.execute('DELETE FROM media_files WHERE id = ?', [id]);
      connection.release();
      return true;
    } catch (error) {
      console.error('Error deleting media file:', error);
      return false;
    }
  }

  // Hero Sections CRUD operations
  static async getHeroSections(): Promise<HeroSection[]> {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM hero_sections ORDER BY id DESC');
      connection.release();
      return rows as HeroSection[];
    } catch (error) {
      console.error('Error fetching hero sections:', error);
      return [];
    }
  }

  static async createHeroSection(heroData: Omit<HeroSection, 'id' | 'updated_at'>): Promise<HeroSection | null> {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        `INSERT INTO hero_sections (page, title, subtitle, description, background_image, cta_text, cta_link, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          heroData.page, heroData.title, heroData.subtitle, heroData.description,
          heroData.background_image, heroData.cta_text, heroData.cta_link, heroData.is_active
        ]
      );
      
      const insertId = (result as any).insertId;
      connection.release();
      
      return await this.getHeroSectionById(insertId);
    } catch (error) {
      console.error('Error creating hero section:', error);
      return null;
    }
  }

  static async getHeroSectionById(id: number): Promise<HeroSection | null> {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM hero_sections WHERE id = ?', [id]);
      connection.release();
      const heroSections = rows as HeroSection[];
      return heroSections.length > 0 ? heroSections[0] : null;
    } catch (error) {
      console.error('Error fetching hero section by ID:', error);
      return null;
    }
  }

  static async updateHeroSection(id: number, updateData: Partial<HeroSection>): Promise<HeroSection | null> {
    try {
      const connection = await pool.getConnection();
      
      const fields = Object.keys(updateData).filter(key => key !== 'id');
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => (updateData as any)[field]);
      
      await connection.execute(
        `UPDATE hero_sections SET ${setClause}, updated_at = NOW() WHERE id = ?`,
        [...values, id]
      );
      
      connection.release();
      return await this.getHeroSectionById(id);
    } catch (error) {
      console.error('Error updating hero section:', error);
      return null;
    }
  }

  static async deleteHeroSection(id: number): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      await connection.execute('DELETE FROM hero_sections WHERE id = ?', [id]);
      connection.release();
      return true;
    } catch (error) {
      console.error('Error deleting hero section:', error);
      return false;
    }
  }

  // Users authentication
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM users WHERE email = ? AND is_active = TRUE', [email]);
      connection.release();
      const users = rows as User[];
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  }

  static async updateUserLastLogin(userId: number): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      await connection.execute('UPDATE users SET last_login = NOW() WHERE id = ?', [userId]);
      connection.release();
      return true;
    } catch (error) {
      console.error('Error updating user last login:', error);
      return false;
    }
  }

  // System logs
  static async createLog(logData: Omit<SystemLog, 'id' | 'timestamp'>): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      await connection.execute(
        `INSERT INTO system_logs (level, category, message, user_id, ip_address, user_agent, details)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          logData.level, logData.category, logData.message, logData.user_id,
          logData.ip_address, logData.user_agent, JSON.stringify(logData.details || {})
        ]
      );
      connection.release();
      return true;
    } catch (error) {
      console.error('Error creating log:', error);
      return false;
    }
  }

  // Get system statistics
  static async getSystemStats(): Promise<{
    totalProjects: number;
    totalDevelopers: number;
    totalUsers: number;
    totalLogs: number;
    lastBackup: Date;
  }> {
    try {
      const connection = await pool.getConnection();
      
      const [projectCount] = await connection.execute('SELECT COUNT(*) as count FROM projects');
      const [developerCount] = await connection.execute('SELECT COUNT(*) as count FROM developers');
      const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
      const [logCount] = await connection.execute('SELECT COUNT(*) as count FROM system_logs');
      
      connection.release();
      
      return {
        totalProjects: (projectCount as any)[0].count,
        totalDevelopers: (developerCount as any)[0].count,
        totalUsers: (userCount as any)[0].count,
        totalLogs: (logCount as any)[0].count,
        lastBackup: new Date()
      };
    } catch (error) {
      console.error('Error fetching system stats:', error);
      return {
        totalProjects: 0,
        totalDevelopers: 0,
        totalUsers: 0,
        totalLogs: 0,
        lastBackup: new Date()
      };
    }
  }

  // Settings management
  static async getSettings(): Promise<any> {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM site_settings ORDER BY id DESC LIMIT 1');
      connection.release();
      
      const settings = rows as any[];
      if (settings.length > 0) {
        const dbSettings = settings[0];
        // Transform database columns to API format
        return {
          site: {
            title: dbSettings.site_title || 'Premium Choice',
            description: dbSettings.site_description || 'Your trusted partner in Dubai real estate',
            logo: dbSettings.site_logo || '/logo.png',
            favicon: dbSettings.site_favicon || '/favicon.ico'
          },
          contact: {
            email: dbSettings.contact_email || 'admin@example.com',
      phone: dbSettings.contact_phone || null,
      address: dbSettings.contact_address || 'Dubai, UAE',
      whatsapp: dbSettings.contact_whatsapp || null
          },
          social: {
            facebook: dbSettings.social_facebook || '',
            instagram: dbSettings.social_instagram || '',
            twitter: dbSettings.social_twitter || '',
            linkedin: dbSettings.social_linkedin || '',
            youtube: dbSettings.social_youtube || '',
            tiktok: dbSettings.social_tiktok || '',
            snapchat: dbSettings.social_snapchat || '',
            telegram: dbSettings.social_telegram || '',
            whatsapp: dbSettings.social_whatsapp || ''
          },
          seo: {
            metaTitle: dbSettings.seo_meta_title || 'Premium Choice - Dubai Real Estate',
            metaDescription: dbSettings.seo_meta_description || 'Discover premium real estate opportunities in Dubai with Premium Choice. Your trusted partner for luxury properties and investment solutions.',
            keywords: dbSettings.seo_keywords || 'Dubai real estate, luxury properties, investment, Premium Choice'
          },
          features: {
            enableBlog: dbSettings.features_enable_blog !== false,
            enableNewsletter: dbSettings.features_enable_newsletter !== false,
            enableWhatsApp: dbSettings.features_enable_whatsapp !== false,
            enableLiveChat: dbSettings.features_enable_live_chat === true
          }
        };
      } else {
        // Return default settings if none exist
        return {
          site: {
            title: 'Premium Choice',
            description: 'Your trusted partner in Dubai real estate',
            logo: '/logo.png',
            favicon: '/favicon.ico'
          },
          contact: {
            email: 'admin@example.com',
      phone: null,
      address: 'Dubai, UAE',
      whatsapp: null
          },
          social: {
            facebook: '',
            instagram: '',
            twitter: '',
            linkedin: '',
            youtube: '',
            tiktok: '',
            snapchat: '',
            telegram: '',
            whatsapp: ''
          },
          seo: {
            metaTitle: 'Premium Choice - Dubai Real Estate',
            metaDescription: 'Discover premium real estate opportunities in Dubai with Premium Choice. Your trusted partner for luxury properties and investment solutions.',
            keywords: 'Dubai real estate, luxury properties, investment, Premium Choice'
          },
          features: {
            enableBlog: true,
            enableNewsletter: true,
            enableWhatsApp: true,
            enableLiveChat: false
          }
        };
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Return default settings on error
      return {
        site: {
          title: 'Premium Choice',
          description: 'Your trusted partner in Dubai real estate',
          logo: '/logo.png',
          favicon: '/favicon.ico'
        },
        contact: {
          email: 'admin@example.com',
      phone: null,
      address: 'Dubai, UAE',
      whatsapp: null
        },
        social: {
          facebook: '',
          instagram: '',
          twitter: '',
          linkedin: '',
          youtube: '',
          tiktok: '',
          snapchat: '',
          telegram: '',
          whatsapp: ''
        },
        seo: {
          metaTitle: 'Premium Choice - Dubai Real Estate',
          metaDescription: 'Discover premium real estate opportunities in Dubai with Premium Choice. Your trusted partner for luxury properties and investment solutions.',
          keywords: 'Dubai real estate, luxury properties, investment, Premium Choice'
        },
        features: {
          enableBlog: true,
          enableNewsletter: true,
          enableWhatsApp: true,
          enableLiveChat: false
        }
      };
    }
  }

  static async updateSettings(settingsData: any): Promise<any> {
    try {
      const connection = await pool.getConnection();
      
      // Transform API format to database columns
      const dbData: any = {};
      
      if (settingsData.site) {
        if (settingsData.site.title) dbData.site_title = settingsData.site.title;
        if (settingsData.site.description) dbData.site_description = settingsData.site.description;
        if (settingsData.site.logo) dbData.site_logo = settingsData.site.logo;
        if (settingsData.site.favicon) dbData.site_favicon = settingsData.site.favicon;
      }
      
      if (settingsData.contact) {
        if (settingsData.contact.email) dbData.contact_email = settingsData.contact.email;
        if (settingsData.contact.phone) dbData.contact_phone = settingsData.contact.phone;
        if (settingsData.contact.address) dbData.contact_address = settingsData.contact.address;
        if (settingsData.contact.whatsapp) dbData.contact_whatsapp = settingsData.contact.whatsapp;
      }
      
      if (settingsData.social) {
        if (settingsData.social.facebook !== undefined) dbData.social_facebook = settingsData.social.facebook;
        if (settingsData.social.instagram !== undefined) dbData.social_instagram = settingsData.social.instagram;
        if (settingsData.social.twitter !== undefined) dbData.social_twitter = settingsData.social.twitter;
        if (settingsData.social.linkedin !== undefined) dbData.social_linkedin = settingsData.social.linkedin;
        if (settingsData.social.youtube !== undefined) dbData.social_youtube = settingsData.social.youtube;
        if (settingsData.social.tiktok !== undefined) dbData.social_tiktok = settingsData.social.tiktok;
        if (settingsData.social.snapchat !== undefined) dbData.social_snapchat = settingsData.social.snapchat;
        if (settingsData.social.telegram !== undefined) dbData.social_telegram = settingsData.social.telegram;
        if (settingsData.social.whatsapp !== undefined) dbData.social_whatsapp = settingsData.social.whatsapp;
      }
      
      if (settingsData.seo) {
        if (settingsData.seo.metaTitle) dbData.seo_meta_title = settingsData.seo.metaTitle;
        if (settingsData.seo.metaDescription) dbData.seo_meta_description = settingsData.seo.metaDescription;
        if (settingsData.seo.keywords) dbData.seo_keywords = settingsData.seo.keywords;
      }
      
      if (settingsData.features) {
        if (settingsData.features.enableBlog !== undefined) dbData.features_enable_blog = settingsData.features.enableBlog;
        if (settingsData.features.enableNewsletter !== undefined) dbData.features_enable_newsletter = settingsData.features.enableNewsletter;
        if (settingsData.features.enableWhatsApp !== undefined) dbData.features_enable_whatsapp = settingsData.features.enableWhatsApp;
        if (settingsData.features.enableLiveChat !== undefined) dbData.features_enable_live_chat = settingsData.features.enableLiveChat;
      }
      
      // Check if settings exist
      const [existingRows] = await connection.execute('SELECT id FROM site_settings LIMIT 1');
      const existing = existingRows as any[];
      
      if (existing.length > 0) {
        // Update existing settings
        const fields = Object.keys(dbData);
        if (fields.length > 0) {
          const setClause = fields.map(field => `${field} = ?`).join(', ');
          const values = fields.map(field => dbData[field]);
          
          await connection.execute(
            `UPDATE site_settings SET ${setClause}, updated_at = NOW() WHERE id = ?`,
            [...values, existing[0].id]
          );
        }
      } else {
        // Insert new settings with defaults
        const defaultData = {
          site_title: 'Premium Choice',
          site_description: 'Your trusted partner in Dubai real estate',
          site_logo: '/logo.png',
          site_favicon: '/favicon.ico',
          contact_email: 'admin@example.com',
      contact_phone: null,
      contact_address: 'Dubai, UAE',
      contact_whatsapp: null,
          social_facebook: '',
          social_instagram: '',
          social_twitter: '',
          social_linkedin: '',
          social_youtube: '',
          seo_meta_title: 'Premium Choice - Dubai Real Estate',
          seo_meta_description: 'Discover premium real estate opportunities in Dubai with Premium Choice. Your trusted partner for luxury properties and investment solutions.',
          seo_keywords: 'Dubai real estate, luxury properties, investment, Premium Choice',
          features_enable_blog: true,
          features_enable_newsletter: true,
          features_enable_whatsapp: true,
          features_enable_live_chat: false,
          ...dbData
        };
        
        const fields = Object.keys(defaultData);
        const placeholders = fields.map(() => '?').join(', ');
        const values = fields.map(field => defaultData[field]);
        
        await connection.execute(
          `INSERT INTO site_settings (${fields.join(', ')}, created_at, updated_at) VALUES (${placeholders}, NOW(), NOW())`,
          values
        );
      }
      
      connection.release();
      return await this.getSettings();
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  // Presentation slides management
  static async getPresentationSlides(projectId: number): Promise<PresentationSlide[]> {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM presentation_slides WHERE project_id = ? ORDER BY slide_number ASC',
        [projectId]
      );
      connection.release();
      return rows as PresentationSlide[];
    } catch (error) {
      console.error('Error fetching presentation slides:', error);
      return [];
    }
  }

  static async createPresentationSlide(slideData: Omit<PresentationSlide, 'id' | 'created_at'>): Promise<number> {
    try {
      const connection = await pool.getConnection();
      
      // Get the next slide number for this project
      const [maxSlideRows] = await connection.execute(
        'SELECT COALESCE(MAX(slide_number), 0) + 1 as next_slide_number FROM presentation_slides WHERE project_id = ?',
        [slideData.project_id]
      );
      const nextSlideNumber = (maxSlideRows as any)[0].next_slide_number;

      const [result] = await connection.execute(
        `INSERT INTO presentation_slides 
         (project_id, slide_number, title, content, description, image_url, background_image, animation_type, duration, voice_over_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          slideData.project_id,
          slideData.slide_number || nextSlideNumber,
          slideData.title,
          slideData.content,
          slideData.description || null,
          slideData.image_url || null,
          slideData.background_image || null,
          slideData.animation_type || 'fadeIn',
          slideData.duration || 5000,
          slideData.voice_over_url || null
        ]
      );
      
      connection.release();
      return (result as any).insertId;
    } catch (error) {
      console.error('Error creating presentation slide:', error);
      throw error;
    }
  }

  static async updatePresentationSlide(slideId: number, slideData: Partial<PresentationSlide>): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      
      const fields = Object.keys(slideData).filter(key => key !== 'id' && key !== 'created_at');
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => slideData[field as keyof PresentationSlide]);

      await connection.execute(
        `UPDATE presentation_slides SET ${setClause} WHERE id = ?`,
        [...values, slideId]
      );
      
      connection.release();
      return true;
    } catch (error) {
      console.error('Error updating presentation slide:', error);
      return false;
    }
  }

  static async deletePresentationSlide(slideId: number): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      await connection.execute('DELETE FROM presentation_slides WHERE id = ?', [slideId]);
      connection.release();
      return true;
    } catch (error) {
      console.error('Error deleting presentation slide:', error);
      return false;
    }
  }

  static async deletePresentationSlidesByProject(projectId: number): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      await connection.execute('DELETE FROM presentation_slides WHERE project_id = ?', [projectId]);
      connection.release();
      return true;
    } catch (error) {
      console.error('Error deleting presentation slides for project:', error);
      return false;
    }
  }

  // Hero Images Management
  static async getHeroImages(): Promise<HeroImage[]> {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM hero_images ORDER BY order_index ASC, created_at DESC'
      );
      connection.release();
      return rows as HeroImage[];
    } catch (error) {
      console.error('Error fetching hero images:', error);
      return [];
    }
  }

  static async createHeroImage(imageData: Omit<HeroImage, 'id' | 'created_at' | 'updated_at'>): Promise<HeroImage> {
    try {
      const connection = await pool.getConnection();
      
      // Get the next order index
      const [maxOrderRows] = await connection.execute(
        'SELECT COALESCE(MAX(order_index), 0) + 1 as next_order FROM hero_images'
      );
      const nextOrder = (maxOrderRows as any)[0].next_order;

      const [result] = await connection.execute(
        `INSERT INTO hero_images 
         (url, title, description, alt_text, is_active, order_index, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          imageData.url,
          imageData.title,
          imageData.description || null,
          imageData.alt_text || imageData.title,
          imageData.is_active !== undefined ? imageData.is_active : true,
          imageData.order_index || nextOrder
        ]
      );
      
      const insertId = (result as any).insertId;
      
      // Fetch and return the created image
      const [newImageRows] = await connection.execute(
        'SELECT * FROM hero_images WHERE id = ?',
        [insertId]
      );
      
      connection.release();
      return (newImageRows as HeroImage[])[0];
    } catch (error) {
      console.error('Error creating hero image:', error);
      throw error;
    }
  }

  static async updateHeroImage(imageId: number, imageData: Partial<HeroImage>): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      
      const fields = Object.keys(imageData).filter(key => 
        key !== 'id' && key !== 'created_at' && key !== 'updated_at'
      );
      
      if (fields.length === 0) {
        connection.release();
        return true;
      }

      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => imageData[field as keyof HeroImage]);

      const [result] = await connection.execute(
        `UPDATE hero_images SET ${setClause}, updated_at = NOW() WHERE id = ?`,
        [...values, imageId]
      );
      
      connection.release();
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Error updating hero image:', error);
      return false;
    }
  }

  static async deleteHeroImage(imageId: number): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.execute('DELETE FROM hero_images WHERE id = ?', [imageId]);
      connection.release();
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Error deleting hero image:', error);
      return false;
    }
  }

  // AI API Settings Management
  static async getAISettings(): Promise<AIApiSettings | null> {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM ai_api_settings ORDER BY created_at DESC LIMIT 1');
      connection.release();
      
      const settings = rows as AIApiSettings[];
      return settings.length > 0 ? settings[0] : null;
    } catch (error) {
      console.error('Error fetching AI settings:', error);
      return null;
    }
  }

  static async saveAISettings(settingsData: Omit<AIApiSettings, 'id' | 'created_at' | 'updated_at'>): Promise<AIApiSettings> {
    try {
      const connection = await pool.getConnection();
      
      // Check if settings exist
      const [existingRows] = await connection.execute('SELECT id FROM ai_api_settings LIMIT 1');
      const existing = existingRows as any[];
      
      if (existing.length > 0) {
        // Update existing settings
        await connection.execute(
          `UPDATE ai_api_settings SET 
           openai_api_key = ?, openai_model = ?, openai_max_tokens = ?, openai_temperature = ?,
           gemini_api_key = ?, gemini_model = ?, claude_api_key = ?, claude_model = ?,
           deepseek_api_key = ?, deepseek_model = ?, deepseek_max_tokens = ?, deepseek_temperature = ?,
           default_provider = ?, ai_enabled = ?, rate_limit_per_minute = ?, rate_limit_per_hour = ?,
           system_prompt = ?, property_suggestions_enabled = ?, property_suggestions_count = ?, contact_info_in_responses = ?,
           updated_at = NOW()
           WHERE id = ?`,
          [
            settingsData.openai_api_key || '',
            settingsData.openai_model || 'gpt-3.5-turbo',
            settingsData.openai_max_tokens || 1000,
            settingsData.openai_temperature || 0.7,
            settingsData.gemini_api_key || '',
            settingsData.gemini_model || 'gemini-pro',
            settingsData.claude_api_key || '',
            settingsData.claude_model || 'claude-3-sonnet-20240229',
            settingsData.deepseek_api_key || '',
            settingsData.deepseek_model || 'deepseek-chat',
            settingsData.deepseek_max_tokens || 1000,
            settingsData.deepseek_temperature || 0.7,
            settingsData.default_provider || 'openai',
            settingsData.ai_enabled !== undefined ? settingsData.ai_enabled : true,
            settingsData.rate_limit_per_minute || 10,
            settingsData.rate_limit_per_hour || 100,
            settingsData.system_prompt || 'You are an expert real estate consultant with deep knowledge of the Dubai and UAE property market.',
            settingsData.property_suggestions_enabled !== undefined ? settingsData.property_suggestions_enabled : true,
            settingsData.property_suggestions_count || 4,
            settingsData.contact_info_in_responses !== undefined ? settingsData.contact_info_in_responses : true,
            existing[0].id
          ]
        );
      } else {
        // Insert new settings
        await connection.execute(
          `INSERT INTO ai_api_settings 
           (openai_api_key, openai_model, openai_max_tokens, openai_temperature,
            gemini_api_key, gemini_model, claude_api_key, claude_model,
            deepseek_api_key, deepseek_model, deepseek_max_tokens, deepseek_temperature,
            default_provider, ai_enabled, rate_limit_per_minute, rate_limit_per_hour,
            system_prompt, property_suggestions_enabled, property_suggestions_count, contact_info_in_responses,
            created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            settingsData.openai_api_key || '',
            settingsData.openai_model || 'gpt-3.5-turbo',
            settingsData.openai_max_tokens || 1000,
            settingsData.openai_temperature || 0.7,
            settingsData.gemini_api_key || '',
            settingsData.gemini_model || 'gemini-pro',
            settingsData.claude_api_key || '',
            settingsData.claude_model || 'claude-3-sonnet-20240229',
            settingsData.deepseek_api_key || '',
            settingsData.deepseek_model || 'deepseek-chat',
            settingsData.deepseek_max_tokens || 1000,
            settingsData.deepseek_temperature || 0.7,
            settingsData.default_provider || 'openai',
            settingsData.ai_enabled !== undefined ? settingsData.ai_enabled : true,
            settingsData.rate_limit_per_minute || 10,
            settingsData.rate_limit_per_hour || 100,
            settingsData.system_prompt || 'You are an expert real estate consultant with deep knowledge of the Dubai and UAE property market.',
            settingsData.property_suggestions_enabled !== undefined ? settingsData.property_suggestions_enabled : true,
            settingsData.property_suggestions_count || 4,
            settingsData.contact_info_in_responses !== undefined ? settingsData.contact_info_in_responses : true
          ]
        );
      }
      
      connection.release();
      return await this.getAISettings() as AIApiSettings;
    } catch (error) {
      console.error('Error saving AI settings:', error);
      throw error;
    }
  }
}

// Standalone query function for backward compatibility
export const query = MySQLDatabase.query.bind(MySQLDatabase);

// Export getDatabase function for backward compatibility
export async function getDatabase() {
  return pool;
}

// Export getConnection function for backward compatibility
export async function getConnection() {
  return await pool.getConnection();
}

// Export Database class alias for compatibility
export const Database = MySQLDatabase;

export default MySQLDatabase;