require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  ssl: {
    rejectUnauthorized: false
  }
};

async function main() {
  console.log('Starting project video verification...');
  
  // Connect to the database
  console.log('Connecting to database...');
  const connection = await mysql.createConnection(dbConfig);
  console.log('Connected to database successfully!');
  
  try {
    // Get all projects
    const [projects] = await connection.query(
      "SELECT id, name, featured_video, media_files FROM projects"
    );
    
    console.log(`Found ${projects.length} projects in total`);
    
    // Check each project
    for (const project of projects) {
      console.log(`\nProject ID: ${project.id}, Name: ${project.name}`);
      console.log(`Featured Video: ${project.featured_video || 'None'}`);
      
      // Check if featured_video exists on disk
      if (project.featured_video) {
        const publicPath = path.join(process.cwd(), 'public');
        const relativePath = project.featured_video.replace(/^\//, '');
        const fullPath = path.join(publicPath, relativePath);
        
        const fileExists = fs.existsSync(fullPath);
        console.log(`Featured video file ${fileExists ? 'exists' : 'does not exist'} on disk at ${fullPath}`);
        
        if (!fileExists) {
          console.log('WARNING: Featured video file does not exist on disk!');
        }
      }
      
      // Check media_files
      let mediaFiles = [];
      try {
        if (project.media_files) {
          mediaFiles = JSON.parse(project.media_files);
        }
      } catch (e) {
        console.error(`Error parsing media_files for project ${project.id}:`, e.message);
        mediaFiles = [];
      }
      
      // Check for video files in media_files
      const videoFiles = mediaFiles.filter(file => 
        file.media_type === 'video' || 
        file.type === 'video' || 
        (file.url && (file.url.endsWith('.mp4') || file.url.endsWith('.webm') || file.url.endsWith('.mov')))
      );
      
      console.log(`Media Files: ${mediaFiles.length} total, ${videoFiles.length} videos`);
      
      // Check each video file
      for (const videoFile of videoFiles) {
        const videoPath = videoFile.url || videoFile.file_path;
        console.log(`Video: ${videoPath}`);
        
        if (videoPath) {
          const publicPath = path.join(process.cwd(), 'public');
          const relativePath = videoPath.replace(/^\//, '');
          const fullPath = path.join(publicPath, relativePath);
          
          const fileExists = fs.existsSync(fullPath);
          console.log(`  - File ${fileExists ? 'exists' : 'does not exist'} on disk at ${fullPath}`);
          
          if (!fileExists) {
            console.log('  - WARNING: Video file does not exist on disk!');
          }
        }
      }
      
      // Check if featured_video is in media_files
      if (project.featured_video && videoFiles.length > 0) {
        const featuredVideoInMediaFiles = videoFiles.some(file => 
          (file.url === project.featured_video) || (file.file_path === project.featured_video)
        );
        
        console.log(`Featured video ${featuredVideoInMediaFiles ? 'exists' : 'does not exist'} in media_files`);
        
        if (!featuredVideoInMediaFiles) {
          console.log('WARNING: Featured video is not in media_files!');
        }
      }
    }
    
    console.log('\nVerification completed successfully!');
    
  } catch (error) {
    console.error('Error during verification:', error);
  } finally {
    await connection.end();
    console.log('\nDatabase connection closed.');
  }
}

main().catch(console.error);