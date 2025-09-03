const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'srv1558.hstgr.io',
  user: 'u485564989_pcrs',
  password: 'Abedyr57..',
  database: 'u485564989_pcrs',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function createSiteSettingsTable() {
  try {
    console.log('🔄 Creating site_settings table...');
    const connection = await pool.getConnection();
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        site_title VARCHAR(255) DEFAULT 'Premium Choice',
        site_description TEXT DEFAULT 'Your trusted partner in Dubai real estate',
        site_logo VARCHAR(500) DEFAULT '/logo.png',
        site_favicon VARCHAR(500) DEFAULT '/favicon.ico',
        contact_email VARCHAR(255) DEFAULT NULL,
    contact_phone VARCHAR(50) DEFAULT NULL,
    contact_address TEXT DEFAULT NULL,
    contact_whatsapp VARCHAR(50) DEFAULT NULL,
        social_facebook VARCHAR(500),
        social_instagram VARCHAR(500),
        social_twitter VARCHAR(500),
        social_linkedin VARCHAR(500),
        social_youtube VARCHAR(500),
        seo_meta_title VARCHAR(255) DEFAULT 'Premium Choice - Dubai Real Estate',
        seo_meta_description TEXT DEFAULT 'Discover premium real estate opportunities in Dubai with Premium Choice. Your trusted partner for luxury properties and investment solutions.',
        seo_keywords TEXT DEFAULT 'Dubai real estate, luxury properties, investment, Premium Choice',
        features_enable_blog BOOLEAN DEFAULT TRUE,
        features_enable_newsletter BOOLEAN DEFAULT TRUE,
        features_enable_whatsapp BOOLEAN DEFAULT TRUE,
        features_enable_live_chat BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Insert default settings if table is empty
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM site_settings');
    if (rows[0].count === 0) {
      await connection.execute(`
        INSERT INTO site_settings (id) VALUES (1)
      `);
      console.log('✅ Default settings inserted');
    }
    
    connection.release();
    console.log('✅ site_settings table created successfully');
    
  } catch (error) {
    console.error('❌ Error creating site_settings table:', error);
  } finally {
    await pool.end();
  }
}

createSiteSettingsTable();