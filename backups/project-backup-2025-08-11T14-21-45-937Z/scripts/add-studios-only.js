const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: 'srv1558.hstgr.io',
  user: 'u485564989_pcrs',
  password: 'Abedyr57..',
  database: 'u485564989_pcrs',
  port: 3306,
  ssl: {
    rejectUnauthorized: false
  }
};

async function addStudiosField() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    console.log('🔄 Adding studios field to projects table...');

    // Check if studios column already exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'u485564989_pcrs' 
      AND TABLE_NAME = 'projects' 
      AND COLUMN_NAME = 'studios'
    `);

    if (columns.length > 0) {
      console.log('✅ Studios field already exists!');
    } else {
      // Add studios column
      await connection.execute(`
        ALTER TABLE projects 
        ADD COLUMN studios INT DEFAULT 0 AFTER bathrooms
      `);
      console.log('✅ Studios field added successfully!');
    }

    // Update existing projects with default studios value
    await connection.execute(`
      UPDATE projects 
      SET studios = 0 
      WHERE studios IS NULL
    `);
    console.log('✅ Updated existing projects with default studios value');

    // Verify the field was added
    const [result] = await connection.execute(`
      SELECT studios FROM projects LIMIT 1
    `);
    console.log('✅ Verification: Studios field is accessible');

  } catch (error) {
    console.error('❌ Error adding studios field:', error.message);
  } finally {
    await connection.end();
  }
}

addStudiosField();