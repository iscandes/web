const mysql = require('mysql2/promise');
const fetch = require('node-fetch');

// Test the admin API directly
async function testAdminAPI() {
  console.log('🔍 Testing Admin API directly...');
  
  try {
    const response = await fetch('http://localhost:3001/api/admin/projects');
    const data = await response.json();
    
    console.log('📊 API Response Status:', response.status);
    console.log('📊 API Response Data:', JSON.stringify(data, null, 2));
    
    if (data.success && data.data) {
      console.log(`✅ API returned ${data.data.length} projects`);
      if (data.data.length > 0) {
        console.log('📋 First project:', data.data[0]);
      }
    } else {
      console.log('❌ API did not return successful data');
    }
    
  } catch (error) {
    console.error('❌ Error calling admin API:', error.message);
  }
}

// Test direct database connection
async function testDirectDB() {
  console.log('\n🔍 Testing Direct Database Connection...');
  
  const pool = mysql.createPool({
    host: 'srv1558.hstgr.io',
    user: 'u485564989_pcrs',
    password: 'Abedyr57..',
    database: 'u485564989_pcrs',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connection established');
    
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM projects');
    console.log('📊 Total projects in database:', rows[0].count);
    
    const [projectRows] = await connection.execute('SELECT id, name, slug, developer FROM projects LIMIT 5');
    console.log('📋 Sample projects:', projectRows);
    
    connection.release();
    await pool.end();
    
  } catch (error) {
    console.error('❌ Database error:', error);
    console.error('❌ Full error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
  }
}

async function main() {
  await testAdminAPI();
  await testDirectDB();
}

main().catch(console.error);