const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/projects',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Projects API Response:');
      console.log('Success:', response.success);
      
      if (response.success && response.data) {
        const projects = response.data;
        console.log('Number of projects:', projects.length);
        
        if (projects.length > 0) {
          console.log('\nFirst project structure:');
          console.log(JSON.stringify(projects[0], null, 2));
          
          if ('studios' in projects[0]) {
            console.log('\n✅ Studios field is present in API response');
          } else {
            console.log('\n❌ Studios field is missing from API response');
          }
        }
      } else {
        console.log('API returned error or no data');
      }
    } catch (error) {
      console.error('Error parsing response:', error.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error.message);
});

req.end();