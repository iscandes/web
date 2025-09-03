const mysql = require('mysql2/promise');

async function addStudiosField() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'real_estate_db'
    });
    
    // Check if studios column exists
    const [columns] = await connection.execute('SHOW COLUMNS FROM projects LIKE "studios"');
    
    if (columns.length === 0) {
      console.log('Studios column does not exist. Adding it...');
      await connection.execute('ALTER TABLE projects ADD COLUMN studios INT DEFAULT 0 AFTER bathrooms');
      console.log('✅ Studios column added successfully');
    } else {
      console.log('✅ Studios column already exists');
    }
    
    // Verify the column was added
    const [newColumns] = await connection.execute('SHOW COLUMNS FROM projects LIKE "studios"');
    if (newColumns.length > 0) {
      console.log('Studios column info:', newColumns[0]);
    }
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

addStudiosField();