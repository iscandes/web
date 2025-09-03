const { Database } = require('./lib/mysql-database.ts');

async function updateArticlesTable() {
  console.log('🔄 Updating articles table...');
  
  try {
    // Initialize database connection
    await Database.initialize();
    
    // Update articles table
    await Database.updateArticlesTable();
    
    console.log('✅ Articles table updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to update articles table:', error);
    process.exit(1);
  }
}

updateArticlesTable();