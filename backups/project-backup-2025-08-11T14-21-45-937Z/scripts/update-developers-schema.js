const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Database configuration with your provided credentials
const dbConfig = {
  host: 'srv1558.hstgr.io',
  user: 'u485564989_pcrs',
  password: 'Abedyr57..',
  database: 'u485564989_pcrs',
  port: 3306,
  ssl: {
    rejectUnauthorized: false
  },
  connectionLimit: 10,
  queueLimit: 0,
  reconnect: true
};

async function updateDevelopersSchema() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log('🔄 Connecting to database...');
    
    // Read the SQL file
    const sqlFile = path.join(__dirname, 'update-developers-schema.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split SQL statements by semicolon and execute each one
    const statements = sqlContent.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('📝 Executing:', statement.trim().substring(0, 50) + '...');
        await connection.execute(statement.trim());
      }
    }
    
    console.log('✅ Developers table schema updated successfully!');
    console.log('📋 Added fields: company_name, position, experience');
    console.log('🔄 Updated sample data with person-based information');
    
  } catch (error) {
    console.error('❌ Error updating developers schema:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the update
updateDevelopersSchema()
  .then(() => {
    console.log('🎉 Database update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database update failed:', error);
    process.exit(1);
  });