const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function fixDatabaseColumns() {
  let pool;
  try {
    console.log('🔄 Reading SQL script...');
    const sqlScript = fs.readFileSync(path.join(__dirname, 'fix-missing-columns.sql'), 'utf8');
    
    console.log('🔄 Connecting to database...');
    
    // Create database connection pool with same config as the app
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'premium_choice_db',
      connectionLimit: 10,
      queueLimit: 20,
      acquireTimeout: 60000,
      timeout: 60000,
      enableKeepAlive: false,
      idleTimeout: 30000,
      maxIdle: 0
    });
    
    // Split the SQL script into individual statements
    // Remove comments first, then split by semicolons
    const cleanedScript = sqlScript
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && line.trim().length > 0)
      .join('\n');
    
    const statements = cleanedScript
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`📋 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        let connection;
        try {
          console.log(`🔄 Executing statement ${i + 1}/${statements.length}...`);
          connection = await pool.getConnection();
          await connection.execute(statement);
          console.log(`✅ Statement ${i + 1} executed successfully`);
        } catch (error) {
          if (error.message.includes('Duplicate column name') || error.code === 'ER_DUP_FIELDNAME') {
            console.log(`⚠️  Column already exists, skipping statement ${i + 1}`);
          } else {
            console.error(`❌ Error executing statement ${i + 1}:`, error.message);
            throw error;
          }
        } finally {
          if (connection) connection.release();
        }
      }
    }
    
    console.log('✅ Database schema updated successfully!');
    console.log('🎉 Missing columns have been added. Video upload should now work.');
    
  } catch (error) {
    console.error('❌ Failed to update database schema:', error);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

fixDatabaseColumns();