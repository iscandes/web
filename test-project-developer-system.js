const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Database configuration using environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'srv1558.hstgr.io',
  user: process.env.DB_USER || 'u485564989_pcrs',
  password: process.env.DB_PASSWORD || 'Abedyr57..',
  database: process.env.DB_NAME || 'u485564989_pcrs',
  port: process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

class ProjectDeveloperTester {
  constructor() {
    this.connection = null;
    this.testResults = [];
    this.createdTestData = {
      developers: [],
      projects: []
    };
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection(dbConfig);
      console.log('✅ Database connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      console.log('🔌 Database connection closed');
    }
  }

  logTest(testName, success, message, data = null) {
    const result = {
      test: testName,
      success,
      message,
      data,
      timestamp: new Date().toISOString()
    };
    this.testResults.push(result);
    
    const icon = success ? '✅' : '❌';
    console.log(`${icon} ${testName}: ${message}`);
    if (data) {
      console.log('   Data:', JSON.stringify(data, null, 2));
    }
  }

  // Test 1: Create a test developer via API
  async testCreateDeveloper() {
    try {
      const testDeveloper = {
        name: 'Test Developer Auto',
        slug: 'test-developer-auto-' + Date.now(),
        description: 'Auto-created test developer for system testing',
        location: 'Dubai, UAE',
        established: '2024',
        website: 'https://testdev.com',
        email: 'test@testdev.com',
        phone: '+971-50-123-4567'
      };

      // Simulate API call by direct database insertion
      const [result] = await this.connection.execute(
        `INSERT INTO developers (name, slug, description, location, established, website, email, phone, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [testDeveloper.name, testDeveloper.slug, testDeveloper.description, testDeveloper.location, 
         testDeveloper.established, testDeveloper.website, testDeveloper.email, testDeveloper.phone]
      );

      const developerId = result.insertId;
      this.createdTestData.developers.push(developerId);

      this.logTest('Create Developer', true, `Developer created with ID: ${developerId}`, testDeveloper);
      return developerId;
    } catch (error) {
      this.logTest('Create Developer', false, `Failed to create developer: ${error.message}`);
      return null;
    }
  }

  // Test 2: Create a test project with developer assignment
  async testCreateProjectWithDeveloper(developerId) {
    try {
      const testProject = {
        name: 'Test Project with Developer',
        description: 'Test project to verify developer assignment',
        location: 'Dubai Marina',
        price: '2500000',
        bedrooms: 3,
        bathrooms: 4,
        area: '2200',
        developer_id: developerId,
        slug: 'test-project-with-developer-' + Date.now(),
        developer: 'Test Developer Auto'
      };

      const [result] = await this.connection.execute(
        `INSERT INTO projects (name, description, location, price, bedrooms, bathrooms, area, developer_id, developer, slug, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [testProject.name, testProject.description, testProject.location, testProject.price,
         testProject.bedrooms, testProject.bathrooms, testProject.area, testProject.developer_id, testProject.developer, testProject.slug]
      );

      const projectId = result.insertId;
      this.createdTestData.projects.push(projectId);

      this.logTest('Create Project with Developer', true, `Project created with ID: ${projectId}`, testProject);
      return projectId;
    } catch (error) {
      this.logTest('Create Project with Developer', false, `Failed to create project: ${error.message}`);
      return null;
    }
  }

  // Test 3: Test auto-creation of developer from project
  async testAutoCreateDeveloper() {
    try {
      const newDeveloperName = 'Auto Created Developer ' + Date.now();
      
      // First check if developer exists
      const [existing] = await this.connection.execute(
        'SELECT id FROM developers WHERE name = ?',
        [newDeveloperName]
      );

      if (existing.length === 0) {
        // Create new developer with default values (simulating auto-creation)
        const [result] = await this.connection.execute(
          `INSERT INTO developers (name, slug, description, location, established, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
          [newDeveloperName, 'auto-created-developer-' + Date.now(), 'Auto-created developer', 'Dubai, UAE', '2024']
        );

        const developerId = result.insertId;
        this.createdTestData.developers.push(developerId);

        // Now create a project with this auto-created developer
        const testProject = {
          name: 'Test Project with Auto-Created Developer',
          description: 'Project created with auto-generated developer',
          location: 'Dubai Hills',
          price: '1800000',
          bedrooms: 2,
          bathrooms: 3,
          area: '1500',
          developer_id: developerId,
          developer: newDeveloperName,
          slug: 'test-project-auto-dev-' + Date.now()
        };

        const [projectResult] = await this.connection.execute(
          `INSERT INTO projects (name, description, location, price, bedrooms, bathrooms, area, developer_id, developer, slug, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [testProject.name, testProject.description, testProject.location, testProject.price,
           testProject.bedrooms, testProject.bathrooms, testProject.area, testProject.developer_id, testProject.developer, testProject.slug]
        );

        const projectId = projectResult.insertId;
        this.createdTestData.projects.push(projectId);

        this.logTest('Auto-Create Developer', true, 
          `Developer auto-created (ID: ${developerId}) and project created (ID: ${projectId})`, 
          { developer: newDeveloperName, project: testProject.title });
        
        return { developerId, projectId };
      } else {
        this.logTest('Auto-Create Developer', false, 'Developer already exists, cannot test auto-creation');
        return null;
      }
    } catch (error) {
      this.logTest('Auto-Create Developer', false, `Failed to auto-create developer: ${error.message}`);
      return null;
    }
  }

  // Test 4: Verify foreign key relationships
  async testForeignKeyRelationships() {
    try {
      // Test 1: Try to create project with non-existent developer (should fail)
      try {
        await this.connection.execute(
          `INSERT INTO projects (name, description, location, price, bedrooms, bathrooms, area, developer_id, developer, slug, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          ['Invalid Project', 'Should fail', 'Nowhere', '0', 1, 1, '100', 99999, 'Invalid Developer', 'invalid-project-' + Date.now()]
        );
        this.logTest('Foreign Key Constraint', false, 'Project created with invalid developer_id (constraint not working)');
      } catch (fkError) {
        this.logTest('Foreign Key Constraint', true, 'Foreign key constraint working - prevented invalid developer_id');
      }

      // Test 2: Verify existing relationships
      const [relationships] = await this.connection.execute(`
        SELECT p.id as project_id, p.name, p.developer_id, d.name as developer_name
        FROM projects p
        LEFT JOIN developers d ON p.developer_id = d.id
        WHERE p.id IN (${this.createdTestData.projects.map(() => '?').join(',')})
      `, this.createdTestData.projects);

      const validRelationships = relationships.filter(r => r.developer_name !== null);
      const invalidRelationships = relationships.filter(r => r.developer_name === null);

      this.logTest('Relationship Integrity', 
        invalidRelationships.length === 0,
        `Found ${validRelationships.length} valid relationships, ${invalidRelationships.length} broken relationships`,
        { valid: validRelationships.length, broken: invalidRelationships.length }
      );

    } catch (error) {
      this.logTest('Foreign Key Relationships', false, `Failed to test relationships: ${error.message}`);
    }
  }

  // Test 5: Test cascading deletion
  async testCascadingDeletion() {
    try {
      if (this.createdTestData.developers.length === 0) {
        this.logTest('Cascading Deletion', false, 'No test developers available for deletion test');
        return;
      }

      const testDeveloperId = this.createdTestData.developers[0];
      
      // Count projects before deletion
      const [beforeCount] = await this.connection.execute(
        'SELECT COUNT(*) as count FROM projects WHERE developer_id = ?',
        [testDeveloperId]
      );

      const projectsBeforeDeletion = beforeCount[0].count;

      // Delete the developer
      await this.connection.execute(
        'DELETE FROM developers WHERE id = ?',
        [testDeveloperId]
      );

      // Count projects after deletion
      const [afterCount] = await this.connection.execute(
        'SELECT COUNT(*) as count FROM projects WHERE developer_id = ?',
        [testDeveloperId]
      );

      const projectsAfterDeletion = afterCount[0].count;

      // Remove from our tracking
      this.createdTestData.developers = this.createdTestData.developers.filter(id => id !== testDeveloperId);
      
      // Check if cascading worked
      if (projectsAfterDeletion === 0 && projectsBeforeDeletion > 0) {
        this.logTest('Cascading Deletion', true, 
          `Cascading deletion working - ${projectsBeforeDeletion} projects deleted with developer`,
          { before: projectsBeforeDeletion, after: projectsAfterDeletion }
        );
        
        // Update our project tracking since they were cascaded
        this.createdTestData.projects = this.createdTestData.projects.filter(id => {
          // Remove projects that belonged to the deleted developer
          return true; // We'll let the cleanup handle remaining projects
        });
      } else if (projectsBeforeDeletion === 0) {
        this.logTest('Cascading Deletion', true, 'No projects to cascade delete (expected)');
      } else {
        this.logTest('Cascading Deletion', false, 
          `Cascading deletion not working - ${projectsAfterDeletion} projects remain after developer deletion`,
          { before: projectsBeforeDeletion, after: projectsAfterDeletion }
        );
      }

    } catch (error) {
      this.logTest('Cascading Deletion', false, `Failed to test cascading deletion: ${error.message}`);
    }
  }

  // Test 6: Verify data integrity across all operations
  async testDataIntegrity() {
    try {
      // Check for orphaned projects
      const [orphanedProjects] = await this.connection.execute(`
        SELECT p.id, p.title, p.developer_id 
        FROM projects p 
        LEFT JOIN developers d ON p.developer_id = d.id 
        WHERE d.id IS NULL AND p.developer_id IS NOT NULL
      `);

      // Check for duplicate slugs
      const [duplicateSlugs] = await this.connection.execute(`
        SELECT slug, COUNT(*) as count 
        FROM projects 
        WHERE slug IS NOT NULL 
        GROUP BY slug 
        HAVING COUNT(*) > 1
      `);

      // Check for invalid data types
      const [invalidData] = await this.connection.execute(`
        SELECT id, name, price, bedrooms, bathrooms, area 
        FROM projects 
        WHERE bedrooms < 0 OR bathrooms < 0
      `);

      const integrityIssues = {
        orphanedProjects: orphanedProjects.length,
        duplicateSlugs: duplicateSlugs.length,
        invalidData: invalidData.length
      };

      const totalIssues = Object.values(integrityIssues).reduce((sum, count) => sum + count, 0);

      this.logTest('Data Integrity', 
        totalIssues === 0,
        totalIssues === 0 ? 'All data integrity checks passed' : `Found ${totalIssues} integrity issues`,
        integrityIssues
      );

    } catch (error) {
      this.logTest('Data Integrity', false, `Failed to check data integrity: ${error.message}`);
    }
  }

  // Test 7: Test admin panel API endpoints
  async testAdminAPIs() {
    try {
      const fetch = (await import('node-fetch')).default;
      const baseUrl = 'http://localhost:3001';

      // Test developers API
      const developersResponse = await fetch(`${baseUrl}/api/admin/developers`);
      const developersData = await developersResponse.json();
      
      this.logTest('Admin Developers API', 
        developersResponse.ok && developersData.success,
        `Developers API returned ${developersResponse.status}`,
        { status: developersResponse.status, count: developersData.developers?.length || 0 }
      );

      // Test projects API
      const projectsResponse = await fetch(`${baseUrl}/api/admin/projects`);
      const projectsData = await projectsResponse.json();
      
      this.logTest('Admin Projects API', 
        projectsResponse.ok && projectsData.success,
        `Projects API returned ${projectsResponse.status}`,
        { status: projectsResponse.status, count: projectsData.projects?.length || 0 }
      );

    } catch (error) {
      this.logTest('Admin APIs', false, `Failed to test admin APIs: ${error.message}`);
    }
  }

  // Cleanup test data
  async cleanup() {
    try {
      console.log('\n🧹 Cleaning up test data...');
      
      // Delete test projects
      if (this.createdTestData.projects.length > 0) {
        await this.connection.execute(
          `DELETE FROM projects WHERE id IN (${this.createdTestData.projects.map(() => '?').join(',')})`,
          this.createdTestData.projects
        );
        console.log(`   Deleted ${this.createdTestData.projects.length} test projects`);
      }

      // Delete test developers
      if (this.createdTestData.developers.length > 0) {
        await this.connection.execute(
          `DELETE FROM developers WHERE id IN (${this.createdTestData.developers.map(() => '?').join(',')})`,
          this.createdTestData.developers
        );
        console.log(`   Deleted ${this.createdTestData.developers.length} test developers`);
      }

      console.log('✅ Cleanup completed');
    } catch (error) {
      console.error('❌ Cleanup failed:', error.message);
    }
  }

  // Generate test report
  generateReport() {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;

    const report = {
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        successRate: totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) + '%' : '0%'
      },
      tests: this.testResults,
      timestamp: new Date().toISOString()
    };

    // Save report to file
    const reportPath = path.join(__dirname, 'test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('\n📊 TEST SUMMARY');
    console.log('================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${report.summary.successRate}`);
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);

    return report;
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting Project-Developer Management System Tests\n');

    if (!(await this.connect())) {
      return;
    }

    try {
      // Run tests in sequence
      const developerId = await this.testCreateDeveloper();
      
      if (developerId) {
        await this.testCreateProjectWithDeveloper(developerId);
      }

      await this.testAutoCreateDeveloper();
      await this.testForeignKeyRelationships();
      await this.testCascadingDeletion();
      await this.testDataIntegrity();
      await this.testAdminAPIs();

    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
    } finally {
      await this.cleanup();
      await this.disconnect();
      this.generateReport();
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new ProjectDeveloperTester();
  tester.runAllTests().catch(console.error);
}

module.exports = ProjectDeveloperTester;