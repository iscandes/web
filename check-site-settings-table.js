const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

// Fallback to hardcoded values if env vars are not loaded
const dbConfig = {
  host: process.env.DB_HOST || 'srv1558.hstgr.io',
  user: process.env.DB_USER || 'u485564989_pcrs',
  password: process.env.DB_PASSWORD || 'Abedyr57..',
  database: process.env.DB_NAME || 'u485564989_pcrs',
  port: process.env.DB_PORT || 3306,
  ssl: { rejectUnauthorized: false }
};

async function checkAndCreateSiteSettingsTable() {
  try {
    console.log('Connecting to database:', dbConfig.host, dbConfig.database);
    const connection = await mysql.createConnection(dbConfig);

    // Check if site_settings table exists
    const [rows] = await connection.execute('SHOW TABLES LIKE "site_settings"');
    console.log('site_settings table exists:', rows.length > 0);

    if (rows.length === 0) {
      console.log('Creating site_settings table...');
      
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS site_settings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          site_title VARCHAR(255) DEFAULT 'Premium Choice',
          site_description TEXT,
          site_logo VARCHAR(255) DEFAULT '/logo.png',
          site_favicon VARCHAR(255) DEFAULT '/favicon.ico',
          contact_email VARCHAR(255) DEFAULT 'admin@example.com',
          contact_phone VARCHAR(50),
          contact_address TEXT DEFAULT 'Dubai, UAE',
          contact_whatsapp VARCHAR(50),
          social_facebook VARCHAR(255) DEFAULT '',
          social_instagram VARCHAR(255) DEFAULT '',
          social_twitter VARCHAR(255) DEFAULT '',
          social_linkedin VARCHAR(255) DEFAULT '',
          social_youtube VARCHAR(255) DEFAULT '',
          social_tiktok VARCHAR(255) DEFAULT '',
          social_snapchat VARCHAR(255) DEFAULT '',
          social_telegram VARCHAR(255) DEFAULT '',
          social_whatsapp VARCHAR(255) DEFAULT '',
          seo_meta_title VARCHAR(255) DEFAULT 'Premium Choice - Dubai Real Estate',
          seo_meta_description TEXT,
          seo_keywords TEXT,
          features_enable_blog BOOLEAN DEFAULT TRUE,
          features_enable_newsletter BOOLEAN DEFAULT TRUE,
          features_enable_whatsapp BOOLEAN DEFAULT TRUE,
          features_enable_live_chat BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      console.log('site_settings table created successfully');
      
      // Insert default settings
      await connection.execute(`
        INSERT INTO site_settings (
          site_title, site_description, contact_email, contact_address,
          social_facebook, social_instagram, social_twitter, social_linkedin,
          seo_meta_title, seo_meta_description, seo_keywords
        ) VALUES (
          'Premium Choice',
          'Your trusted partner in Dubai real estate',
          'admin@example.com',
          'Dubai, UAE',
          '', '', '', '',
          'Premium Choice - Dubai Real Estate',
          'Discover premium real estate opportunities in Dubai with Premium Choice. Your trusted partner for luxury properties and investment solutions.',
          'Dubai real estate, luxury properties, investment, Premium Choice'
        )
      `);
      
      console.log('Default settings inserted successfully');
    } else {
      console.log('site_settings table already exists');
    }

    await connection.end();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Database error:', error.message);
    process.exit(1);
  }
}

checkAndCreateSiteSettingsTable();