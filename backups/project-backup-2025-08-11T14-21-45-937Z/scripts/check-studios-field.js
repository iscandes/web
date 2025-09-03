const mysql = require('mysql2/promise');

async function checkTableStructure() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'real_estate_db'
    });
    
    const [rows] = await connection.execute('DESCRIBE projects');
    console.log('Projects table structure:');
    rows.forEach(row => {
      console.log(`- ${row.Field}: ${row.Type} ${row.Null === 'YES' ? '(nullable)' : '(not null)'} ${row.Default ? 'default: ' + row.Default : ''}`);
    });
    
    // Check if studios field exists
    const studiosField = rows.find(row => row.Field === 'studios');
    if (studiosField) {
      console.log('\n✅ Studios field exists in the table');
    } else {
      console.log('\n❌ Studios field does NOT exist in the table');
      
      // Add the studios field
      console.log('Adding studios field...');
      await connection.execute('ALTER TABLE projects ADD COLUMN studios INT DEFAULT 0 AFTER bathrooms');
      console.log('✅ Studios field added successfully');
    }
    
    await connection.end();
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('✅ Studios field already exists');
    } else {
      console.error('Error:', error.message);
    }
  }
}

checkTableStructure();