const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function createTestProject() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('🔗 Creating test project...');
    
    // Create a test project with developer auto-creation
    const timestamp = Date.now();
    const projectData = {
      name: `Test Project ${timestamp}`,
      developer: 'Auto Created Developer',
      type: 'Villa',
      location: 'Test Location Dubai',
      price: '500000',
      status: 'Available',
      description: 'Test project created to verify admin panel refresh functionality',
      bedrooms: 3,
      bathrooms: 2,
      area: '1200',
      image: '/images/projects/default-project.jpg',
      coordinates_lat: 25.2048,
      coordinates_lng: 55.2708,
      features: JSON.stringify(['Test Feature 1', 'Test Feature 2']),
      amenities: JSON.stringify(['Test Amenity 1', 'Test Amenity 2'])
    };

    // First, check if developer exists, if not create it
    const [existingDev] = await connection.execute(
      'SELECT id FROM developers WHERE name = ?',
      [projectData.developer]
    );

    let developerId;
    if (existingDev.length === 0) {
      console.log('📝 Creating new developer:', projectData.developer);
      
      // Generate a unique slug for the developer
      const slug = projectData.developer.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      const [devResult] = await connection.execute(
        'INSERT INTO developers (name, slug, description, experience, company_name, position, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [projectData.developer, slug, 'Auto-created developer for testing', '5+ years', projectData.developer, 'Developer', 'Active']
      );
      developerId = devResult.insertId;
      console.log('✅ Developer created with ID:', developerId);
    } else {
      developerId = existingDev[0].id;
      console.log('✅ Using existing developer ID:', developerId);
    }

    // Generate a unique slug for the project
    const projectSlug = projectData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    // Create the project
    const [result] = await connection.execute(
      `INSERT INTO projects (name, slug, developer, developer_id, type, location, price, status, description, bedrooms, bathrooms, area, image, coordinates_lat, coordinates_lng, features, amenities) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        projectData.name,
        projectSlug,
        projectData.developer,
        developerId,
        projectData.type,
        projectData.location,
        projectData.price,
        projectData.status,
        projectData.description,
        projectData.bedrooms,
        projectData.bathrooms,
        projectData.area,
        projectData.image,
        projectData.coordinates_lat,
        projectData.coordinates_lng,
        projectData.features,
        projectData.amenities
      ]
    );

    console.log('✅ Test project created with ID:', result.insertId);
    
    // Verify the project was created
    const [projects] = await connection.execute(
      'SELECT p.*, d.name as developer_name FROM projects p LEFT JOIN developers d ON p.developer_id = d.id ORDER BY p.id DESC LIMIT 3'
    );
    
    console.log('📊 Latest projects in database:');
    projects.forEach(project => {
      console.log(`  - ID: ${project.id}, Name: ${project.name}, Developer: ${project.developer_name}`);
    });
    
  } catch (error) {
    console.error('❌ Error creating test project:', error);
  } finally {
    await connection.end();
  }
}

createTestProject();