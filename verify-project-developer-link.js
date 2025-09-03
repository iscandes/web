const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function verifyProjectDeveloperLink() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('🔍 Verifying project-developer relationships...');
    
    // Check all projects with their developers
    const [projects] = await connection.execute(`
      SELECT 
        p.id as project_id,
        p.name as project_name,
        p.developer as developer_name_field,
        p.developer_id,
        d.id as dev_id,
        d.name as dev_name,
        d.slug as dev_slug,
        d.status as dev_status
      FROM projects p 
      LEFT JOIN developers d ON p.developer_id = d.id 
      ORDER BY p.id DESC
    `);
    
    console.log('📊 Project-Developer Relationships:');
    projects.forEach(project => {
      console.log(`\n  Project ID: ${project.project_id}`);
      console.log(`  Project Name: ${project.project_name}`);
      console.log(`  Developer Field: ${project.developer_name_field}`);
      console.log(`  Developer ID: ${project.developer_id}`);
      console.log(`  Linked Developer: ${project.dev_name || 'NOT LINKED'}`);
      console.log(`  Developer Status: ${project.dev_status || 'N/A'}`);
      console.log(`  Developer Slug: ${project.dev_slug || 'N/A'}`);
    });
    
    // Check all developers
    console.log('\n👥 All Developers:');
    const [developers] = await connection.execute(`
      SELECT 
        d.id,
        d.name,
        d.slug,
        d.status,
        d.company_name,
        d.position,
        COUNT(p.id) as project_count
      FROM developers d
      LEFT JOIN projects p ON d.id = p.developer_id
      GROUP BY d.id
      ORDER BY d.id DESC
    `);
    
    developers.forEach(dev => {
      console.log(`\n  Developer ID: ${dev.id}`);
      console.log(`  Name: ${dev.name}`);
      console.log(`  Slug: ${dev.slug}`);
      console.log(`  Status: ${dev.status}`);
      console.log(`  Company: ${dev.company_name || 'N/A'}`);
      console.log(`  Position: ${dev.position || 'N/A'}`);
      console.log(`  Projects Count: ${dev.project_count}`);
    });
    
    // Summary
    console.log('\n📈 Summary:');
    console.log(`  Total Projects: ${projects.length}`);
    console.log(`  Total Developers: ${developers.length}`);
    console.log(`  Projects with Developer Links: ${projects.filter(p => p.developer_id).length}`);
    console.log(`  Projects without Developer Links: ${projects.filter(p => !p.developer_id).length}`);
    
  } catch (error) {
    console.error('❌ Error verifying relationships:', error);
  } finally {
    await connection.end();
  }
}

verifyProjectDeveloperLink();