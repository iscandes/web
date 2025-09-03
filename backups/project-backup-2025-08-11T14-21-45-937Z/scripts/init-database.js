const mysql = require('mysql2/promise');

// Database configuration with your provided credentials
const dbConfig = {
  host: 'srv1558.hstgr.io',
  user: 'u485564989_pcrs',
  password: 'Abedyr57..',
  database: 'u485564989_pcrs',
  port: 3306,
  ssl: {
    rejectUnauthorized: false
  },
  connectionLimit: 10,
  queueLimit: 0
};

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...');
  
  let connection;
  
  try {
    // Test connection
    console.log('📡 Testing database connection...');
    connection = await mysql.createConnection(dbConfig);
    await connection.ping();
    console.log('✅ Database connection successful');

    // Create tables
    console.log('🏗️ Creating database tables...');
    
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
    `;

    // Execute table creation (split by semicolon and execute each statement)
    const statements = createTablesSQL.split(';').filter(stmt => stmt.trim().length > 0);
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }
    
    console.log('✅ Database tables created successfully');

    // Create default admin user
    console.log('👤 Creating default admin user...');
    
    // Check if admin user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ? OR role = "admin"',
      ['admin@premiumchoice.com']
    );

    if (existingUsers.length === 0) {
      await connection.execute(
        `INSERT INTO users (email, password_hash, role, name, is_active) 
         VALUES (?, ?, 'admin', 'Admin', TRUE)`,
        ['admin@premiumchoice.com', 'Abedyr57..'] // In production, hash this password
      );
      console.log('✅ Default admin user created');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Insert sample projects
    console.log('📊 Inserting sample data...');
    
    const sampleProjects = [
      {
        name: "Burj Khalifa Residences",
        slug: "burj-khalifa-residences",
        developer: "Emaar Properties",
        location: "Downtown Dubai",
        price: "AED 2,500,000",
        status: "Available",
        bedrooms: 3,
        bathrooms: 3,
        area: "2,400 sq ft",
        description: "Luxury residences in the world's tallest tower with breathtaking views of Dubai.",
        image: "/images/projects/burj-khalifa.jpg",
        gallery: JSON.stringify(["/images/projects/burj-khalifa-1.jpg", "/images/projects/burj-khalifa-2.jpg"]),
        coordinates_lat: 25.1972,
        coordinates_lng: 55.2744,
        features: JSON.stringify(["Panoramic Views", "Premium Finishes", "Smart Home Technology"]),
        amenities: JSON.stringify(["Swimming Pool", "Gym", "Concierge Service", "Valet Parking"])
      },
      {
        name: "Palm Jumeirah Villa",
        slug: "palm-jumeirah-villa",
        developer: "Nakheel",
        location: "Palm Jumeirah",
        price: "AED 8,500,000",
        status: "Available",
        bedrooms: 5,
        bathrooms: 6,
        area: "6,500 sq ft",
        description: "Exclusive beachfront villa on the iconic Palm Jumeirah with private beach access.",
        image: "/images/projects/palm-villa.jpg",
        gallery: JSON.stringify(["/images/projects/palm-villa-1.jpg", "/images/projects/palm-villa-2.jpg"]),
        coordinates_lat: 25.1124,
        coordinates_lng: 55.1390,
        features: JSON.stringify(["Private Beach", "Garden", "Maid's Room", "Driver's Room"]),
        amenities: JSON.stringify(["Private Pool", "Beach Access", "Security", "Landscaped Garden"])
      },
      {
        name: "Dubai Marina Penthouse",
        slug: "dubai-marina-penthouse",
        developer: "DAMAC Properties",
        location: "Dubai Marina",
        price: "AED 4,200,000",
        status: "Under Construction",
        bedrooms: 4,
        bathrooms: 5,
        area: "3,800 sq ft",
        description: "Stunning penthouse with marina views and premium amenities in the heart of Dubai Marina.",
        image: "/images/projects/marina-penthouse.jpg",
        gallery: JSON.stringify(["/images/projects/marina-penthouse-1.jpg", "/images/projects/marina-penthouse-2.jpg"]),
        coordinates_lat: 25.0657,
        coordinates_lng: 55.1713,
        features: JSON.stringify(["Marina Views", "Terrace", "Premium Kitchen", "Walk-in Closets"]),
        amenities: JSON.stringify(["Infinity Pool", "Spa", "Marina Walk", "Restaurants"])
      }
    ];

    // Check if projects already exist
    const [existingProjects] = await connection.execute('SELECT COUNT(*) as count FROM projects');
    
    if (existingProjects[0].count === 0) {
      for (const project of sampleProjects) {
        await connection.execute(
          `INSERT INTO projects (name, slug, developer, location, price, status, bedrooms, bathrooms, area, 
           description, image, gallery, coordinates_lat, coordinates_lng, features, amenities)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            project.name, project.slug, project.developer, project.location, project.price,
            project.status, project.bedrooms, project.bathrooms, project.area, project.description,
            project.image, project.gallery, project.coordinates_lat, project.coordinates_lng,
            project.features, project.amenities
          ]
        );
      }
      console.log('✅ Sample projects inserted successfully');
    } else {
      console.log('ℹ️ Sample projects already exist');
    }

    // Log the initialization
    await connection.execute(
      `INSERT INTO system_logs (level, category, message, details)
       VALUES (?, ?, ?, ?)`,
      [
        'info', 
        'System', 
        'Database initialized with sample data',
        JSON.stringify({ message: 'Initial setup completed with sample projects and admin user' })
      ]
    );

    console.log('✅ Database initialization completed successfully!');
    console.log('');
    console.log('🔐 Admin Credentials:');
    console.log('   Email: admin@premiumchoice.com');
    console.log('   Password: Abedyr57..');
    console.log('');
    console.log('🌐 Database Details:');
    console.log('   Host: srv1558.hstgr.io');
    console.log('   Database: u485564989_pcrs');
    console.log('   User: u485564989_pcrs');
    console.log('');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the initialization
initializeDatabase();