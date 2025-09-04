const mysql = require('mysql2/promise');

require('dotenv').config({ path: '.env.local' });

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'premium_choice_db',
  port: process.env.DB_PORT || 3306
};

async function checkProjectIntegrity() {
  let connection;
  
  try {
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to database');
    
    // Get recent projects with their video data
    const [rows] = await connection.execute(`
      SELECT id, name, slug, featured_video, media_files 
      FROM projects 
      ORDER BY id DESC 
      LIMIT 10
    `);
    
    console.log('\n📊 Recent Projects Analysis:');
    console.log('=' .repeat(50));
    
    rows.forEach(row => {
      console.log(`\n🏢 Project ID: ${row.id}`);
      console.log(`   Name: ${row.name}`);
      console.log(`   Slug: ${row.slug}`);
      console.log(`   Featured Video: ${row.featured_video || 'None'}`);
      
      if (row.media_files) {
        try {
          const mediaFiles = JSON.parse(row.media_files);
          const videos = mediaFiles.filter(f => 
            f.media_type === 'video' || 
            f.type === 'video' || 
            (f.url && f.url.toLowerCase().includes('.mp4'))
          );
          
          if (videos.length > 0) {
            console.log(`   Video Files (${videos.length}):`);
            videos.forEach((video, index) => {
              console.log(`     ${index + 1}. ${video.url || video.file_path}`);
            });
          } else {
            console.log(`   Video Files: None`);
          }
        } catch (e) {
          console.log(`   Media Files: ❌ Invalid JSON`);
        }
      } else {
        console.log(`   Media Files: None`);
      }
    });
    
    // Check for potential cross-references
    console.log('\n🔍 Checking for Cross-References:');
    console.log('=' .repeat(50));
    
    const [crossCheck] = await connection.execute(`
      SELECT 
        p1.id as project_id,
        p1.name as project_name,
        p1.featured_video,
        p2.id as other_project_id,
        p2.name as other_project_name
      FROM projects p1
      JOIN projects p2 ON p1.featured_video = p2.featured_video
      WHERE p1.id != p2.id AND p1.featured_video IS NOT NULL
    `);
    
    if (crossCheck.length > 0) {
      console.log('⚠️  Found projects sharing the same featured video:');
      crossCheck.forEach(row => {
        console.log(`   Project ${row.project_id} (${row.project_name}) and Project ${row.other_project_id} (${row.other_project_name})`);
        console.log(`   Shared video: ${row.featured_video}`);
      });
    } else {
      console.log('✅ No cross-references found in featured videos');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔓 Database connection closed');
    }
  }
}

checkProjectIntegrity();