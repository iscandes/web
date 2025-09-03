const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'srv1558.hstgr.io',
  user: 'u485564989_pcrs',
  password: 'Abedyr57..',
  database: 'u485564989_pcrs',
  port: 3306,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkProjects() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT id, name, slug, image, created_at FROM projects ORDER BY id DESC');
    connection.release();
    
    console.log('📋 Current Projects in Database:');
    console.log('ID | Name | Slug | Image | Created');
    console.log('---|------|------|-------|--------');
    rows.forEach(project => {
      const createdAt = project.created_at ? new Date(project.created_at).toLocaleString() : 'N/A';
      console.log(`${project.id} | ${project.name || 'NULL'} | ${project.slug || 'NULL'} | ${project.image || 'NULL'} | ${createdAt}`);
    });
    
    // Check for media files
    const connection2 = await pool.getConnection();
    const [mediaRows] = await connection2.execute('SELECT project_id, file_path, file_type FROM project_media WHERE project_id IN (SELECT id FROM projects) ORDER BY project_id, id DESC');
    connection2.release();
    
    console.log('\n🎬 Media Files:');
    mediaRows.forEach(media => {
      console.log(`Project ${media.project_id}: ${media.file_type} - ${media.file_path}`);
    });
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkProjects();