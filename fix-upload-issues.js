const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

const pool = mysql.createPool({
  host: 'srv1558.hstgr.io',
  user: 'u485564989_pcrs',
  password: 'Abedyr57..',
  database: 'u485564989_pcrs',
  port: 3306,
  ssl: { rejectUnauthorized: false }
});

async function fixUploadIssues() {
  try {
    console.log('🔍 Step 1: Checking for database issues...');
    
    const connection = await pool.getConnection();
    
    // Check for any projects with null/empty slugs or names
    const [projects] = await connection.execute(`
      SELECT id, name, slug, created_at 
      FROM projects 
      WHERE name IS NULL OR slug IS NULL OR name = '' OR slug = ''
    `);
    
    console.log('📋 Projects with missing data:');
    if (projects.length === 0) {
      console.log('✅ No projects with missing data found');
    } else {
      projects.forEach(project => {
        console.log(`- ID: ${project.id}, Name: ${project.name || 'NULL'}, Slug: ${project.slug || 'NULL'}`);
      });
    }
    
    // Check for any orphaned media files
    const [orphanedMedia] = await connection.execute(`
      SELECT * FROM project_media 
      WHERE project_id NOT IN (SELECT id FROM projects)
    `);
    
    console.log('\n🗂️ Orphaned media files:');
    if (orphanedMedia.length === 0) {
      console.log('✅ No orphaned media files found');
    } else {
      orphanedMedia.forEach(media => {
        console.log(`- Project ID: ${media.project_id}, File: ${media.file_path}`);
      });
    }
    
    connection.release();
    
    console.log('\n🧹 Step 2: Cleaning up undefined folder...');
    
    // Check if undefined folder exists
    const undefinedPath = path.join(process.cwd(), 'public', 'uploads', 'projects', 'undefined');
    
    try {
      const stats = await fs.stat(undefinedPath);
      if (stats.isDirectory()) {
        console.log('📁 Found undefined folder, listing contents...');
        
        const files = await fs.readdir(undefinedPath);
        console.log(`Found ${files.length} files in undefined folder:`);
        files.forEach(file => console.log(`- ${file}`));
        
        // Move files to a proper project or delete them
        if (files.length > 0) {
          console.log('\n🔄 Moving files to project 1...');
          
          const project1Path = path.join(process.cwd(), 'public', 'uploads', 'projects', '1');
          
          // Ensure project 1 directory exists
          try {
            await fs.mkdir(project1Path, { recursive: true });
          } catch (e) {
            // Directory might already exist
          }
          
          // Move each file
          for (const file of files) {
            const sourcePath = path.join(undefinedPath, file);
            const destPath = path.join(project1Path, file);
            
            try {
              await fs.rename(sourcePath, destPath);
              console.log(`✅ Moved ${file} to project 1`);
              
              // Update database if it's a video file
              if (file.toLowerCase().includes('.mp4') || file.toLowerCase().includes('.webm')) {
                const newFilePath = `/uploads/projects/1/${file}`;
                
                // Add to project_media table
                await connection.execute(`
                  INSERT INTO project_media (project_id, file_name, file_path, file_size, media_type, file_extension, upload_date)
                  VALUES (?, ?, ?, ?, ?, ?, NOW())
                  ON DUPLICATE KEY UPDATE file_path = VALUES(file_path)
                `, [1, file, newFilePath, 0, 'video', path.extname(file)]);
                
                console.log(`📝 Updated database for ${file}`);
              }
            } catch (moveError) {
              console.error(`❌ Failed to move ${file}:`, moveError.message);
            }
          }
          
          // Remove empty undefined folder
          try {
            await fs.rmdir(undefinedPath);
            console.log('🗑️ Removed empty undefined folder');
          } catch (e) {
            console.log('⚠️ Could not remove undefined folder (might not be empty)');
          }
        }
      }
    } catch (e) {
      console.log('✅ No undefined folder found');
    }
    
    console.log('\n✅ Step 3: Verification...');
    
    // Verify current state
    const connection2 = await pool.getConnection();
    const [finalProjects] = await connection2.execute('SELECT id, name, slug FROM projects ORDER BY id');
    const [finalMedia] = await connection2.execute('SELECT project_id, file_path FROM project_media ORDER BY project_id');
    
    console.log('\n📋 Final project state:');
    finalProjects.forEach(project => {
      console.log(`- ${project.id}: ${project.name} (${project.slug})`);
    });
    
    console.log('\n🎬 Final media state:');
    finalMedia.forEach(media => {
      console.log(`- Project ${media.project_id}: ${media.file_path}`);
    });
    
    connection2.release();
    await pool.end();
    
    console.log('\n🎉 Upload issues fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixUploadIssues();