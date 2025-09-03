import mysql from 'mysql2/promise';

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

// Create connection pool
const pool = mysql.createPool(dbConfig);

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

async function getProjects() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM projects ORDER BY created_at DESC');
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

async function getDevelopers() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM developers ORDER BY name ASC');
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error fetching developers:', error);
    return [];
  }
}

async function createDeveloper(developer) {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `INSERT INTO developers (name, slug, description, logo, established, projects_count, location, website, phone, email, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        developer.name,
        developer.slug,
        developer.description,
        developer.logo,
        developer.established,
        developer.projects_count,
        developer.location,
        developer.website,
        developer.phone,
        developer.email,
        developer.status
      ]
    );
    connection.release();
    return { id: result.insertId, ...developer };
  } catch (error) {
    console.error('Error creating developer:', error);
    throw error;
  }
}

async function createProject(project) {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `INSERT INTO projects (name, slug, developer, location, price, status, type, bedrooms, bathrooms, area, description, image, coordinates_lat, coordinates_lng, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        project.name,
        project.slug,
        project.developer,
        project.location,
        project.price,
        project.status,
        project.type,
        project.bedrooms,
        project.bathrooms,
        project.area,
        project.description,
        project.image,
        project.coordinates_lat,
        project.coordinates_lng
      ]
    );
    connection.release();
    return { id: result.insertId, ...project };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  try {
    // Test connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Database connection failed');
      return;
    }

    console.log('✅ Database connection successful');

    // Test fetching existing projects
    console.log('\n📋 Fetching existing projects...');
    const existingProjects = await getProjects();
    console.log(`Found ${existingProjects.length} existing projects:`);
    existingProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.name} - ${project.location} - ${project.price}`);
    });

    // Test fetching developers
    console.log('\n👥 Fetching existing developers...');
    const existingDevelopers = await getDevelopers();
    console.log(`Found ${existingDevelopers.length} existing developers:`);
    existingDevelopers.forEach((dev, index) => {
      console.log(`${index + 1}. ${dev.name} - ${dev.status}`);
    });

    // Add test developers if none exist
    if (existingDevelopers.length === 0) {
      console.log('\n👷 Adding test developers...');
      await addTestDevelopers();
    }

    // Add test projects if none exist
    if (existingProjects.length === 0) {
      console.log('\n🏗️ Adding test projects...');
      await addTestProjects();
    }

    console.log('\n✅ Database test completed successfully!');
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await pool.end();
  }
}

async function addTestDevelopers() {
  const testDevelopers = [
    {
      name: 'Emaar Properties',
      slug: 'emaar-properties',
      description: 'Leading real estate developer in Dubai, known for iconic projects like Burj Khalifa and Dubai Mall.',
      logo: '/images/developers/emaar-logo.png',
      established: '1997',
      projects_count: 0,
      location: 'Dubai, UAE',
      website: 'https://www.emaar.com',
      phone: '+971-4-367-3333',
      email: 'info@emaar.ae',
      status: 'Active'
    },
    {
      name: 'DAMAC Properties',
      slug: 'damac-properties',
      description: 'Luxury real estate developer specializing in high-end residential and commercial properties.',
      logo: '/images/developers/damac-logo.png',
      established: '2002',
      projects_count: 0,
      location: 'Dubai, UAE',
      website: 'https://www.damacproperties.com',
      phone: '+971-4-420-0000',
      email: 'info@damac.com',
      status: 'Active'
    },
    {
      name: 'Dubai Properties',
      slug: 'dubai-properties',
      description: 'Government-backed developer creating master-planned communities and commercial developments.',
      logo: '/images/developers/dp-logo.png',
      established: '2004',
      projects_count: 0,
      location: 'Dubai, UAE',
      website: 'https://www.dubaiproperties.ae',
      phone: '+971-4-367-6666',
      email: 'info@dubaiproperties.ae',
      status: 'Active'
    }
  ];

  for (const developer of testDevelopers) {
    try {
      await createDeveloper(developer);
      console.log(`✅ Added developer: ${developer.name}`);
    } catch (error) {
      console.error(`❌ Failed to add developer ${developer.name}:`, error.message);
    }
  }
}

async function addTestProjects() {
  const testProjects = [
    {
      name: 'Burj Vista Downtown',
      slug: 'burj-vista-downtown',
      developer: 'Emaar Properties',
      location: 'Downtown Dubai',
      price: 'AED 2,500,000',
      status: 'Available',
      type: 'Apartment',
      bedrooms: 2,
      bathrooms: 3,
      area: '1,200 sq ft',
      description: 'Luxury apartments with stunning views of Burj Khalifa and Dubai Fountain. Premium finishes and world-class amenities.',
      image: '/images/projects/burj-vista.jpg',
      coordinates_lat: 25.1972,
      coordinates_lng: 55.2744
    },
    {
      name: 'DAMAC Hills Luxury Villas',
      slug: 'damac-hills-luxury-villas',
      developer: 'DAMAC Properties',
      location: 'DAMAC Hills',
      price: 'AED 4,200,000',
      status: 'Under Construction',
      type: 'Villa',
      bedrooms: 5,
      bathrooms: 6,
      area: '4,500 sq ft',
      description: 'Exclusive luxury villas in a gated community with golf course views and premium amenities.',
      image: '/images/projects/damac-hills.jpg',
      coordinates_lat: 25.0657,
      coordinates_lng: 55.2044
    },
    {
      name: 'Business Bay Tower',
      slug: 'business-bay-tower',
      developer: 'Dubai Properties',
      location: 'Business Bay',
      price: 'AED 1,800,000',
      status: 'Available',
      type: 'Apartment',
      bedrooms: 1,
      bathrooms: 2,
      area: '850 sq ft',
      description: 'Modern apartments in the heart of Business Bay with canal views and easy access to metro.',
      image: '/images/projects/business-bay.jpg',
      coordinates_lat: 25.1877,
      coordinates_lng: 55.2633
    },
    {
      name: 'Palm Jumeirah Penthouse',
      slug: 'palm-jumeirah-penthouse',
      developer: 'Emaar Properties',
      location: 'Palm Jumeirah',
      price: 'AED 8,500,000',
      status: 'Available',
      type: 'Apartment',
      bedrooms: 4,
      bathrooms: 5,
      area: '3,200 sq ft',
      description: 'Ultra-luxury penthouse with panoramic sea views, private terrace, and exclusive beach access.',
      image: '/images/projects/palm-penthouse.jpg',
      coordinates_lat: 25.1124,
      coordinates_lng: 55.1390
    }
  ];

  for (const project of testProjects) {
    try {
      await createProject(project);
      console.log(`✅ Added project: ${project.name}`);
    } catch (error) {
      console.error(`❌ Failed to add project ${project.name}:`, error.message);
    }
  }
}

// Run the test
testDatabaseConnection();