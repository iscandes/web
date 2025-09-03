const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: 'srv1558.hstgr.io',
  user: 'u485564989_pcrs',
  password: 'Abedyr57..',
  database: 'u485564989_pcrs',
  port: 3306,
  ssl: {
    rejectUnauthorized: false
  }
};

async function addSocialColumns() {
  console.log('🚀 Adding missing social media columns...');
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Check if columns exist and add them if they don't
    const alterTableSQL = `
      ALTER TABLE site_settings 
      ADD COLUMN IF NOT EXISTS social_tiktok VARCHAR(500),
      ADD COLUMN IF NOT EXISTS social_snapchat VARCHAR(500),
      ADD COLUMN IF NOT EXISTS social_telegram VARCHAR(500),
      ADD COLUMN IF NOT EXISTS social_whatsapp VARCHAR(500);
    `;
    
    await connection.execute(alterTableSQL);
    await connection.end();
    
    console.log('✅ Social media columns added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addSocialColumns();