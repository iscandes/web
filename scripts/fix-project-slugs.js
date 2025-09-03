const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Function to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
}

async function fixProjectSlugs() {
  let connection;
  
  try {
    console.log('🔍 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    // Get all projects
    console.log('📊 Checking projects...');
    const [projects] = await connection.execute('SELECT id, name, slug FROM projects');
    
    console.log(`Found ${projects.length} projects:`);
    projects.forEach(project => {
      console.log(`  - ID: ${project.id}, Name: "${project.name}", Slug: "${project.slug || 'NULL'}"`);
    });
    
    // Find projects with null or empty slugs
    const projectsNeedingFix = projects.filter(project => !project.slug || project.slug.trim() === '');
    
    if (projectsNeedingFix.length === 0) {
      console.log('✅ All projects have valid slugs!');
      return;
    }
    
    console.log(`\n🔧 Found ${projectsNeedingFix.length} projects needing slug fixes:`);
    
    for (const project of projectsNeedingFix) {
      const newSlug = generateSlug(project.name);
      console.log(`  - Updating "${project.name}" (ID: ${project.id}) with slug: "${newSlug}"`);
      
      // Check if slug already exists
      const [existingSlug] = await connection.execute('SELECT id FROM projects WHERE slug = ? AND id != ?', [newSlug, project.id]);
      
      let finalSlug = newSlug;
      if (existingSlug.length > 0) {
        finalSlug = `${newSlug}-${project.id}`;
        console.log(`    - Slug "${newSlug}" already exists, using "${finalSlug}" instead`);
      }
      
      // Update the project
      await connection.execute('UPDATE projects SET slug = ? WHERE id = ?', [finalSlug, project.id]);
      console.log(`    ✅ Updated successfully`);
    }
    
    console.log('\n🎉 All project slugs have been fixed!');
    
    // Show final results
    console.log('\n📋 Final project list:');
    const [updatedProjects] = await connection.execute('SELECT id, name, slug FROM projects ORDER BY id');
    updatedProjects.forEach(project => {
      console.log(`  - ID: ${project.id}, Name: "${project.name}", Slug: "${project.slug}"`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing project slugs:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the fix
fixProjectSlugs();