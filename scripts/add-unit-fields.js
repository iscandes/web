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
  },
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

async function addUnitFields() {
  let connection;
  
  try {
    console.log('🔄 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Connected to database');
    
    // Check if columns already exist
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'projects' 
      AND COLUMN_NAME IN ('units_1bedroom', 'units_2bedroom', 'units_3bedroom', 'units_4bedroom', 'units_5bedroom', 'units_office')
    `, [dbConfig.database]);
    
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    console.log('📋 Existing unit columns:', existingColumns);
    
    // Add missing columns
    const columnsToAdd = [
      { name: 'units_1bedroom', sql: 'ADD COLUMN units_1bedroom INT DEFAULT 0' },
      { name: 'units_2bedroom', sql: 'ADD COLUMN units_2bedroom INT DEFAULT 0' },
      { name: 'units_3bedroom', sql: 'ADD COLUMN units_3bedroom INT DEFAULT 0' },
      { name: 'units_4bedroom', sql: 'ADD COLUMN units_4bedroom INT DEFAULT 0' },
      { name: 'units_5bedroom', sql: 'ADD COLUMN units_5bedroom INT DEFAULT 0' },
      { name: 'units_office', sql: 'ADD COLUMN units_office INT DEFAULT 0' }
    ];
    
    for (const column of columnsToAdd) {
      if (!existingColumns.includes(column.name)) {
        console.log(`🔄 Adding column: ${column.name}`);
        await connection.execute(`ALTER TABLE projects ${column.sql}`);
        console.log(`✅ Added column: ${column.name}`);
      } else {
        console.log(`ℹ️ Column ${column.name} already exists`);
      }
    }
    
    console.log('✅ Unit fields migration completed successfully');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the migration
addUnitFields();