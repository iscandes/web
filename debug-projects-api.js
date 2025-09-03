const fetch = require('node-fetch');

async function testProjectsAPI() {
  try {
    console.log('🔍 Testing /api/admin/projects endpoint...');
    
    const response = await fetch('http://localhost:3001/api/admin/projects');
    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response OK:', response.ok);
    console.log('📊 Response Data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ API Success: true');
      console.log('📈 Projects Count:', data.data ? data.data.length : 0);
      
      if (data.data && data.data.length > 0) {
        console.log('📋 Projects:');
        data.data.forEach((project, index) => {
          console.log(`  ${index + 1}. ${project.name} (ID: ${project.id})`);
        });
      } else {
        console.log('📭 No projects found in database');
      }
    } else {
      console.log('❌ API Success: false');
      console.log('❌ Error Message:', data.message);
    }
    
  } catch (error) {
    console.error('💥 Error testing API:', error.message);
  }
}

testProjectsAPI();