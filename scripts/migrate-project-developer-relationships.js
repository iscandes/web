const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function runMigration() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('Connected successfully!');
    
    // Check if developer_id column already exists
    console.log('Checking if developer_id column exists...');
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'projects' AND COLUMN_NAME = 'developer_id'
    `, [process.env.DB_NAME]);
    
    if (columns.length > 0) {
      console.log('developer_id column already exists. Skipping migration.');
      return;
    }
    
    console.log('Adding developer_id column to projects table...');
    
    // Add developer_id column to projects table
    await connection.execute(`
      ALTER TABLE projects 
      ADD COLUMN developer_id INT(11) NULL AFTER developer
    `);
    
    console.log('developer_id column added successfully!');
    
    // Create foreign key constraint
    console.log('Creating foreign key constraint...');
    
    await connection.execute(`
      ALTER TABLE projects 
      ADD CONSTRAINT fk_projects_developer_id 
      FOREIGN KEY (developer_id) REFERENCES developers(id) 
      ON DELETE CASCADE ON UPDATE CASCADE
    `);
    
    console.log('Foreign key constraint created successfully!');
    
    // Update existing projects to link with developers based on developer name
    console.log('Updating existing projects to link with developers...');
    
    await connection.execute(`
      UPDATE projects p 
      INNER JOIN developers d ON p.developer = d.name 
      SET p.developer_id = d.id
    `);
    
    console.log('Existing projects updated successfully!');
    
    // Check how many projects were updated
    const [updatedCount] = await connection.execute(`
      SELECT COUNT(*) as count FROM projects WHERE developer_id IS NOT NULL
    `);
    
    console.log(`Migration completed successfully! ${updatedCount[0].count} projects linked to developers.`);
    
  } catch (error) {
    console.error('Migration failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the migration
runMigration().then(() => {
  console.log('Migration script completed.');
  process.exit(0);
}).catch((error) => {
  console.error('Migration script failed:', error);
  process.exit(1);
});