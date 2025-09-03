const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkSchema() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    });
    
    const [columns] = await connection.execute('DESCRIBE projects');
    console.log('Projects table columns:');
    columns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type})`);
    });
    
    console.log('\nTotal columns:', columns.length);
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkSchema();