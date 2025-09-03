const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'premium_choice_db',
  charset: 'utf8mb4'
};

async function testProjectCountUpdate() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully');

    // Test 1: Check current project counts
    console.log('\n📊 Current developer project counts:');
    const [developers] = await connection.execute('SELECT name, projects_count FROM developers ORDER BY name');
    developers.forEach(dev => {
      console.log(`  ${dev.name}: ${dev.projects_count} projects`);
    });

    // Test 2: Count actual projects for each developer
    console.log('\n🔍 Actual project counts in database:');
    for (const dev of developers) {
      const [projectCount] = await connection.execute(
        'SELECT COUNT(*) as count FROM projects WHERE developer = ?',
        [dev.name]
      );
      console.log(`  ${dev.name}: ${projectCount[0].count} actual projects`);
    }

    // Test 3: Update project counts manually to verify the function works
    console.log('\n🔄 Testing automatic project count update...');
    
    // Function to update developer project count (same as in MySQLDatabase class)
    async function updateDeveloperProjectCount(developerName) {
      // Count projects for this developer
      const [countRows] = await connection.execute(
        'SELECT COUNT(*) as project_count FROM projects WHERE developer = ?',
        [developerName]
      );
      
      const projectCount = countRows[0].project_count;
      
      // Update the developer's project count
      await connection.execute(
        'UPDATE developers SET projects_count = ?, updated_at = NOW() WHERE name = ?',
        [projectCount, developerName]
      );
      
      console.log(`  ✅ Updated ${developerName}: ${projectCount} projects`);
    }

    // Update all developer project counts
    for (const dev of developers) {
      await updateDeveloperProjectCount(dev.name);
    }

    // Test 4: Verify updated counts
    console.log('\n📊 Updated developer project counts:');
    const [updatedDevelopers] = await connection.execute('SELECT name, projects_count FROM developers ORDER BY name');
    updatedDevelopers.forEach(dev => {
      console.log(`  ${dev.name}: ${dev.projects_count} projects`);
    });

    console.log('\n✅ Project count update test completed successfully!');

  } catch (error) {
    console.error('❌ Error during test:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the test
testProjectCountUpdate();