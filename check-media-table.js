const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'srv1558.hstgr.io',
  user: 'u485564989_pcrs',
  password: 'Abedyr57..',
  database: 'u485564989_pcrs',
  port: 3306,
  ssl: { rejectUnauthorized: false }
});

async function checkDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Check media table structure
    const [columns] = await connection.execute('DESCRIBE project_media');
    console.log('📋 project_media table structure:');
    columns.forEach(col => console.log(`- ${col.Field}: ${col.Type}`));
    
    // Check media files
    const [mediaRows] = await connection.execute('SELECT * FROM project_media ORDER BY project_id, id DESC');
    console.log('\n🎬 Media Files:');
    mediaRows.forEach(media => {
      console.log(`Project ${media.project_id}: ${media.file_path}`);
    });
    
    connection.release();
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDatabase();