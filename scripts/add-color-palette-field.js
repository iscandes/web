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
  reconnect: true
};

async function addColorPaletteField() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Connected to database successfully');
    
    // Check if color_palette column already exists
    console.log('🔍 Checking if color_palette column exists...');
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'u485564989_pcrs' 
      AND TABLE_NAME = 'projects' 
      AND COLUMN_NAME = 'color_palette'
    `);
    
    if (columns.length > 0) {
      console.log('ℹ️ color_palette column already exists, skipping...');
      return;
    }
    
    // Add color_palette column
    console.log('🏗️ Adding color_palette column to projects table...');
    await connection.execute(`
      ALTER TABLE \`projects\` 
      ADD COLUMN \`color_palette\` JSON DEFAULT NULL AFTER \`presentation_file\`
    `);
    
    console.log('✅ Successfully added color_palette column');
    
    // Update table comment
    console.log('📝 Updating table comment...');
    await connection.execute(`
      ALTER TABLE \`projects\` COMMENT = 'Projects table with dynamic color theming support'
    `);
    
    console.log('✅ Schema update completed successfully!');
    
  } catch (error) {
    console.error('❌ Error updating schema:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the schema update
addColorPaletteField()
  .then(() => {
    console.log('🎉 Color palette field added successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Failed to add color palette field:', error);
    process.exit(1);
  });