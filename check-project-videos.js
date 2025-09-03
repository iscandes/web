require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function checkProjectVideos() {
  try {
    console.log('Connecting to database with these credentials:');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    const [projects] = await connection.execute('SELECT id, name, featured_video, media_files FROM projects');
    console.log('Projects with videos:');
    
    for (const project of projects) {
      console.log(`Project ID: ${project.id}, Name: ${project.name}`);
      console.log(`Featured Video: ${project.featured_video || 'None'}`);
      
      const mediaFiles = project.media_files ? JSON.parse(project.media_files) : [];
      const videoFiles = mediaFiles.filter(file => 
        file.media_type === 'video' || 
        file.type === 'video' || 
        (file.file_path && file.file_path.match(/\.(mp4|webm|mov)$/i)));
      
      console.log(`Media Files (videos): ${videoFiles.length}`);
      if (videoFiles.length > 0) {
        videoFiles.forEach(video => console.log(` - ${video.file_path || video.url}`));
      }
      console.log('---');
    }
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkProjectVideos();