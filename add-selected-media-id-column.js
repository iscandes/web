const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function addSelectedMediaIdColumn() {
  try {
    console.log('🔧 Adding selected_media_id column to video_settings table...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    });
    
    // Check if column already exists
    const checkColumnQuery = `
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'video_settings' 
      AND COLUMN_NAME = 'selected_media_id'
    `;
    
    const [columnExists] = await connection.execute(checkColumnQuery);
    
    if (columnExists.length > 0) {
      console.log('✅ Column selected_media_id already exists');
      return;
    }
    
    // Add the column
    const alterQuery = `
      ALTER TABLE video_settings 
      ADD COLUMN selected_media_id VARCHAR(50) AFTER youtube_url
    `;
    
    await connection.execute(alterQuery);
    console.log('✅ Successfully added selected_media_id column to video_settings table');
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error adding column:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

addSelectedMediaIdColumn();