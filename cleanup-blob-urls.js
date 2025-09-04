require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

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

async function cleanupBlobUrls() {
  let connection;
  
  try {
    console.log('🔍 Starting blob URL cleanup...');
    
    // Create connection
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Find projects with blob URLs in featured_video
    const [projectsWithBlobUrls] = await connection.execute(`
      SELECT id, name, slug, featured_video, media_files 
      FROM projects 
      WHERE featured_video LIKE 'blob:%'
    `);

    console.log(`\n📊 Found ${projectsWithBlobUrls.length} projects with blob URLs`);

    if (projectsWithBlobUrls.length === 0) {
      console.log('✅ No blob URLs found in database. All clean!');
      return;
    }

    // Process each project with blob URLs
    for (const project of projectsWithBlobUrls) {
      console.log(`\n🔧 Processing project: ${project.name} (ID: ${project.id})`);
      console.log(`   Current featured_video: ${project.featured_video}`);
      
      let newFeaturedVideo = null;
      
      // Try to find a valid video in media_files
      if (project.media_files) {
        try {
          const mediaFiles = JSON.parse(project.media_files);
          const videoFiles = mediaFiles.filter(file => {
            const mediaType = file.media_type || file.type || '';
            const fileName = file.name || file.file_name || '';
            const fileExtension = fileName.toLowerCase();
            
            return mediaType === 'video' || 
                   fileExtension.endsWith('.mp4') || 
                   fileExtension.endsWith('.webm') || 
                   fileExtension.endsWith('.mov');
          });
          
          if (videoFiles.length > 0) {
            const firstVideo = videoFiles[0];
            newFeaturedVideo = firstVideo.url || firstVideo.file_path || null;
            console.log(`   Found replacement video in media_files: ${newFeaturedVideo}`);
          }
        } catch (parseError) {
          console.log('   ⚠️ Could not parse media_files JSON');
        }
      }
      
      // Update the project
      if (newFeaturedVideo) {
        await connection.execute(
          'UPDATE projects SET featured_video = ? WHERE id = ?',
          [newFeaturedVideo, project.id]
        );
        console.log(`   ✅ Updated featured_video to: ${newFeaturedVideo}`);
      } else {
        // Clear the blob URL if no replacement found
        await connection.execute(
          'UPDATE projects SET featured_video = NULL WHERE id = ?',
          [project.id]
        );
        console.log('   🗑️ Cleared blob URL (no replacement video found)');
      }
    }

    // Also check and clean up any blob URLs in media_files JSON
    console.log('\n🔍 Checking for blob URLs in media_files JSON...');
    
    const [allProjects] = await connection.execute(`
      SELECT id, name, media_files 
      FROM projects 
      WHERE media_files IS NOT NULL AND media_files != '[]'
    `);

    let mediaFilesUpdated = 0;
    
    for (const project of allProjects) {
      if (!project.media_files) continue;
      
      try {
        const mediaFiles = JSON.parse(project.media_files);
        let hasChanges = false;
        
        const cleanedMediaFiles = mediaFiles.filter(file => {
          const url = file.url || file.file_path || '';
          if (url.startsWith('blob:')) {
            console.log(`   🗑️ Removing blob URL from project ${project.name}: ${url}`);
            hasChanges = true;
            return false; // Remove this file
          }
          return true; // Keep this file
        });
        
        if (hasChanges) {
          await connection.execute(
            'UPDATE projects SET media_files = ? WHERE id = ?',
            [JSON.stringify(cleanedMediaFiles), project.id]
          );
          mediaFilesUpdated++;
          console.log(`   ✅ Cleaned media_files for project: ${project.name}`);
        }
      } catch (parseError) {
        console.log(`   ⚠️ Could not parse media_files for project ${project.name}`);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   - Projects with blob URLs in featured_video: ${projectsWithBlobUrls.length}`);
    console.log(`   - Projects with cleaned media_files: ${mediaFilesUpdated}`);
    console.log('\n🎉 Blob URL cleanup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the cleanup
cleanupBlobUrls().catch(console.error);