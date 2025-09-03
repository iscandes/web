const fetch = require('node-fetch');

async function debugAPIStructure() {
  try {
    console.log('🔍 Testing /api/admin/projects structure...');
    
    const response = await fetch('http://localhost:3001/api/admin/projects');
    const data = await response.json();
    
    console.log('📡 Response status:', response.status);
    console.log('📊 Response data structure:');
    console.log('- success:', data.success);
    console.log('- data type:', typeof data.data);
    console.log('- data is array:', Array.isArray(data.data));
    console.log('- data length:', data.data ? data.data.length : 'N/A');
    
    if (data.data && data.data.length > 0) {
      console.log('📋 First project structure:');
      const firstProject = data.data[0];
      console.log('- id:', firstProject.id);
      console.log('- name:', firstProject.name);
      console.log('- description length:', firstProject.description ? firstProject.description.length : 'N/A');
      console.log('- image:', firstProject.image);
      console.log('- developer:', firstProject.developer);
      console.log('- location:', firstProject.location);
    }
    
    console.log('\n🔧 Full response:');
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

debugAPIStructure();