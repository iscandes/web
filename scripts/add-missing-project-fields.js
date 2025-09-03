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

async function addMissingFields() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    // Check if columns exist and add them if they don't
    const columnsToAdd = [
      {
        name: 'living_rooms',
        definition: 'INT DEFAULT 0 AFTER studios'
      },
      {
        name: 'type',
        definition: "ENUM('Villa', 'Apartment', 'Town House', 'Commercial') DEFAULT 'Apartment' AFTER status"
      },
      {
        name: 'property_types',
        definition: 'JSON AFTER type'
      }
    ];
    
    for (const column of columnsToAdd) {
      try {
        // Check if column exists
        const [rows] = await connection.execute(`
          SELECT COLUMN_NAME 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = 'u485564989_pcrs' 
          AND TABLE_NAME = 'projects' 
          AND COLUMN_NAME = ?
        `, [column.name]);
        
        if (rows.length === 0) {
          console.log(`➕ Adding column: ${column.name}`);
          await connection.execute(`ALTER TABLE projects ADD COLUMN ${column.name} ${column.definition}`);
          console.log(`✅ Successfully added column: ${column.name}`);
        } else {
          console.log(`⚠️  Column ${column.name} already exists, skipping...`);
        }
      } catch (error) {
        console.error(`❌ Error adding column ${column.name}:`, error.message);
      }
    }
    
    // Update existing projects with default values
    console.log('🔄 Updating existing projects with default values...');
    await connection.execute(`
      UPDATE projects 
      SET living_rooms = COALESCE(living_rooms, 1),
          type = COALESCE(type, 'Apartment'),
          property_types = COALESCE(property_types, JSON_ARRAY())
      WHERE living_rooms IS NULL OR type IS NULL OR property_types IS NULL
    `);
    
    // Verify the changes
    console.log('🔍 Verifying table structure...');
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'u485564989_pcrs' 
      AND TABLE_NAME = 'projects' 
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('📋 Current projects table structure:');
    columns.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'}) ${col.COLUMN_DEFAULT ? `DEFAULT ${col.COLUMN_DEFAULT}` : ''}`);
    });
    
    console.log('✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the migration
addMissingFields().catch(console.error);