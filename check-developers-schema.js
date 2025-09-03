const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkDevelopersSchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('🔍 Checking developers table schema...');
    
    const [columns] = await connection.execute('DESCRIBE developers');
    
    console.log('📊 Developers table schema:');
    columns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'} ${col.Key ? `[${col.Key}]` : ''}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking schema:', error);
  } finally {
    await connection.end();
  }
}

checkDevelopersSchema();