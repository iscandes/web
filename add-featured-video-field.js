require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function addFeaturedVideoField() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to database');

    // Check if featured_video column already exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'projects' AND COLUMN_NAME = 'featured_video'
    `, [process.env.DB_NAME]);

    if (columns.length > 0) {
      console.log('featured_video column already exists');
      return;
    }

    // Add the featured_video column
    await connection.execute(`
      ALTER TABLE projects 
      ADD COLUMN featured_video VARCHAR(500) NULL 
      AFTER media_files
    `);

    console.log('✅ Successfully added featured_video column to projects table');

  } catch (error) {
    console.error('❌ Error adding featured_video field:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addFeaturedVideoField();