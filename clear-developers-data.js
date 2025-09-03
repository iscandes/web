const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function clearDevelopersData() {
  const connection = await mysql.createConnection({
    host: 'srv1558.hstgr.io',
    user: 'u485564989_pcrs',
    password: 'Abedyr57..',
    database: 'u485564989_pcrs',
    port: 3306,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connected to MySQL database');
    
    // Read the SQL file
    const sqlFile = path.join(__dirname, 'clear-developers-data.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    // Split SQL statements and execute them
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
        console.log('Executed:', statement.trim().substring(0, 50) + '...');
      }
    }
    
    console.log('Successfully cleared all developer and project data!');
    
  } catch (error) {
    console.error('Error clearing data:', error);
  } finally {
    await connection.end();
  }
}

clearDevelopersData();