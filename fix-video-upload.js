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
  console.log('Starting video upload diagnostics and fix...');
  
  // Connect to the database
  console.log('Connecting to database...');
  const connection = await mysql.createConnection(dbConfig);
  console.log('Connected to database successfully!');
  
  try {
    // 1. Check project_media table structure
    console.log('\nChecking project_media table structure...');
    const [tableInfo] = await connection.query(
      "SHOW CREATE TABLE project_media"
    );
    console.log('Table structure:', tableInfo[0]['Create Table']);
    
    // 2. Check for video entries in project_media
    console.log('\nChecking for video entries in project_media table...');
    const [mediaEntries] = await connection.query(
      "SELECT * FROM project_media WHERE media_type = 'video'"
    );
    console.log(`Found ${mediaEntries.length} video entries in project_media table`);
    
    // 3. Check projects table for featured_video and media_files
    console.log('\nChecking projects table for video references...');
    const [projects] = await connection.query(
      "SELECT id, name, featured_video, media_files FROM projects"
    );
    
    console.log(`Found ${projects.length} projects in total`);
    
    // 4. Analyze and fix each project
    console.log('\nAnalyzing and fixing projects...');
    
    for (const project of projects) {
      console.log(`\nProject ID: ${project.id}, Name: ${project.name}`);
      console.log(`Featured Video: ${project.featured_video || 'None'}`);
      
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
      
      // Check if featured_video exists in media_files
      if (project.featured_video) {
        const featuredVideoInMediaFiles = mediaFiles.some(file => 
          file.url === project.featured_video || file.file_path === project.featured_video
        );
        
        console.log(`Featured video ${featuredVideoInMediaFiles ? 'exists' : 'does not exist'} in media_files`);
        
        // Check if the file exists on disk
        const publicPath = path.join(process.cwd(), 'public');
        const relativePath = project.featured_video.replace(/^\//, '');
        const fullPath = path.join(publicPath, relativePath);
        
        const fileExists = fs.existsSync(fullPath);
        console.log(`Featured video file ${fileExists ? 'exists' : 'does not exist'} on disk at ${fullPath}`);
        
        // Fix: If featured video is not in media_files, add it
        if (!featuredVideoInMediaFiles && fileExists) {
          console.log('Fixing: Adding featured video to media_files...');
          
          const fileName = path.basename(project.featured_video);
          const fileExtension = path.extname(fileName).toLowerCase();
          
          const newMediaEntry = {
            id: Date.now(),
            name: fileName,
            url: project.featured_video,
            file_path: project.featured_video,
            type: 'video',
            media_type: 'video',
            file_extension: fileExtension,
            upload_date: new Date().toISOString()
          };
          
          mediaFiles.push(newMediaEntry);
          
          // Update the project
          await connection.query(
            'UPDATE projects SET media_files = ? WHERE id = ?',
            [JSON.stringify(mediaFiles), project.id]
          );
          
          console.log('Fixed: Added featured video to media_files');
        }
      } else if (videoFiles.length > 0) {
        // Fix: If no featured_video but videos exist in media_files, set the first one as featured
        console.log('Fixing: Setting first video from media_files as featured_video...');
        
        const firstVideo = videoFiles[0];
        const videoUrl = firstVideo.url || firstVideo.file_path;
        
        await connection.query(
          'UPDATE projects SET featured_video = ? WHERE id = ?',
          [videoUrl, project.id]
        );
        
        console.log(`Fixed: Set ${videoUrl} as featured_video`);
      }
      
      // Check project_media entries for this project
      const [projectMediaEntries] = await connection.query(
        "SELECT * FROM project_media WHERE project_id = ?",
        [project.id]
      );
      
      console.log(`Found ${projectMediaEntries.length} entries in project_media for this project`);
      
      // Ensure all media_files have corresponding project_media entries
      for (const mediaFile of mediaFiles) {
        const fileUrl = mediaFile.url || mediaFile.file_path;
        if (!fileUrl) continue;
        
        const fileName = path.basename(fileUrl);
        const mediaType = mediaFile.media_type || mediaFile.type || 'unknown';
        
        const existingEntry = projectMediaEntries.find(entry => 
          entry.file_name === fileName || entry.file_path === fileUrl
        );
        
        if (!existingEntry) {
          console.log(`Fixing: Adding missing entry to project_media for ${fileName}...`);
          
          // Add to project_media
          await connection.query(
            `INSERT INTO project_media 
            (project_id, file_name, file_path, media_type, upload_date) 
            VALUES (?, ?, ?, ?, NOW())`,
            [project.id, fileName, fileUrl, mediaType]
          );
          
          console.log('Fixed: Added missing entry to project_media');
        }
      }
    }
    
    console.log('\nDiagnostics and fixes completed successfully!');
    
  } catch (error) {
    console.error('Error during diagnostics:', error);
  } finally {
    await connection.end();
    console.log('\nDatabase connection closed.');
  }
}

main().catch(console.error);