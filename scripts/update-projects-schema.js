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
  queueLimit: 0,
  reconnect: true
};

async function updateProjectsSchema() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    console.log('🔄 Updating projects schema...');

    // Read and execute the SQL file
    const fs = require('fs');
    const path = require('path');
    const sqlFile = path.join(__dirname, 'update-projects-schema.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
        console.log('✅ Executed:', statement.substring(0, 50) + '...');
      }
    }

    console.log('✅ Projects schema updated successfully!');
    console.log('📊 New fields added:');
    console.log('   - type (Villa, Apartment, Town House, Commercial)');
    console.log('   - property_types (JSON array)');
    console.log('   - sub_projects (JSON array)');
    console.log('   - brochure_url (PDF/image URL)');
    console.log('   - theme_color (HEX color)');
    console.log('   - voice_over_url (MP3 URL)');
    console.log('🎬 Presentation slides enhanced with:');
    console.log('   - description field');
    console.log('   - background_image field');
    console.log('   - voice_over_url per slide');
    console.log('📝 Sample data inserted for existing projects');

  } catch (error) {
    console.error('❌ Error updating schema:', error.message);
  } finally {
    await connection.end();
  }
}

updateProjectsSchema();