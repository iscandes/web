const mysql = require('mysql2/promise');
const fetch = require('node-fetch');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'srv1558.hstgr.io',
  user: process.env.DB_USER || 'u485564989_pcrs',
  password: process.env.DB_PASSWORD || 'Abedyr57..',
  database: process.env.DB_NAME || 'u485564989_pcrs',
  port: process.env.DB_PORT || 3306,
  ssl: { rejectUnauthorized: false },
  acquireTimeout: 60000,
  timeout: 60000
};

const API_BASE = 'http://localhost:3001';

async function liveTest() {
  console.log('🚀 Starting Live Project-Developer Test\n');
  
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected successfully');
    
    // Test 1: Create a project via API with new developer
    console.log('\n📝 Test 1: Creating project via API with new developer...');
    
    const projectData = {
      name: 'Live Test Project',
      description: 'Testing project creation via API',
      location: 'Dubai Marina',
      price: '3500000',
      bedrooms: '4',
      bathrooms: '5',
      area: '2800',
      developer: 'Live Test Developer Company',
      project_type: 'Residential',
      status: 'Under Construction'
    };
    
    const response = await fetch(`${API_BASE}/api/admin/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Project created successfully via API');
      console.log('   Project ID:', result.id);
      console.log('   Developer:', projectData.developer);
      
      // Test 2: Check if developer was auto-created
      console.log('\n🔍 Test 2: Checking if developer was auto-created...');
      
      const [developers] = await connection.execute(
        'SELECT * FROM developers WHERE name = ?',
        [projectData.developer]
      );
      
      if (developers.length > 0) {
        console.log('✅ Developer auto-created successfully');
        console.log('   Developer ID:', developers[0].id);
        console.log('   Developer Name:', developers[0].name);
        console.log('   Developer Slug:', developers[0].slug);
        
        const developerId = developers[0].id;
        
        // Test 3: Verify project-developer relationship
        console.log('\n🔗 Test 3: Verifying project-developer relationship...');
        
        const [projects] = await connection.execute(
          'SELECT * FROM projects WHERE developer_id = ? AND name = ?',
          [developerId, projectData.name]
        );
        
        if (projects.length > 0) {
          console.log('✅ Project-developer relationship verified');
          console.log('   Project ID:', projects[0].id);
          console.log('   Developer ID:', projects[0].developer_id);
          
          const projectId = projects[0].id;
          
          // Test 4: Check admin panel data via API
          console.log('\n📊 Test 4: Checking admin panel data via API...');
          
          const developersResponse = await fetch(`${API_BASE}/api/admin/developers`);
          const projectsResponse = await fetch(`${API_BASE}/api/admin/projects`);
          
          if (developersResponse.ok && projectsResponse.ok) {
            const developersData = await developersResponse.json();
            const projectsData = await projectsResponse.json();
            
            console.log('✅ Admin APIs responding correctly');
            console.log('   Total Developers:', developersData.length);
            console.log('   Total Projects:', projectsData.length);
            
            // Find our test data
            const testDev = developersData.find(d => d.name === projectData.developer);
            const testProj = projectsData.find(p => p.name === projectData.name);
            
            if (testDev && testProj) {
              console.log('✅ Test data visible in admin panel');
              console.log('   Developer in admin:', testDev.name);
              console.log('   Project in admin:', testProj.name);
              
              // Test 5: Test cascading deletion
              console.log('\n🗑️  Test 5: Testing cascading deletion...');
              
              // Count projects before deletion
              const [beforeProjects] = await connection.execute(
                'SELECT COUNT(*) as count FROM projects WHERE developer_id = ?',
                [developerId]
              );
              
              console.log('   Projects before deletion:', beforeProjects[0].count);
              
              // Delete developer (should cascade to projects)
              await connection.execute(
                'DELETE FROM developers WHERE id = ?',
                [developerId]
              );
              
              // Count projects after deletion
              const [afterProjects] = await connection.execute(
                'SELECT COUNT(*) as count FROM projects WHERE developer_id = ?',
                [developerId]
              );
              
              console.log('   Projects after deletion:', afterProjects[0].count);
              
              if (afterProjects[0].count === 0) {
                console.log('✅ Cascading deletion working correctly');
              } else {
                console.log('❌ Cascading deletion failed');
              }
              
            } else {
              console.log('❌ Test data not found in admin panel');
            }
          } else {
            console.log('❌ Admin APIs not responding correctly');
          }
          
        } else {
          console.log('❌ Project-developer relationship not found');
        }
        
      } else {
        console.log('❌ Developer was not auto-created');
      }
      
    } else {
      console.log('❌ Failed to create project via API');
      console.log('   Status:', response.status);
      console.log('   Error:', await response.text());
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
  
  console.log('\n🏁 Live test completed');
}

liveTest();