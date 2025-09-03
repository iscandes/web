const fetch = require('node-fetch');

async function checkProjects() {
  try {
    const response = await fetch('http://localhost:3001/api/admin/projects');
    const data = await response.json();
    
    console.log('Current Projects:');
    if (data.success && data.data) {
      data.data.forEach((p, i) => {
        console.log(`${i+1}. ${p.name} (ID: ${p.id}) - Developer: ${p.developer}`);
      });
    } else {
      console.log('No projects found or API error');
      console.log('Response:', data);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkProjects();