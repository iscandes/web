import { MySQLDatabase } from '../lib/mysql-database';

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...');
  
  try {
    // Test connection
    console.log('📡 Testing database connection...');
    const connectionTest = await MySQLDatabase.testConnection();
    
    if (!connectionTest) {
      console.error('❌ Database connection failed. Please check your credentials.');
      process.exit(1);
    }

    // Initialize tables
    console.log('🏗️ Creating database tables...');
    const tablesCreated = await MySQLDatabase.initializeTables();
    
    if (!tablesCreated) {
      console.error('❌ Failed to create database tables.');
      process.exit(1);
    }

    // Create default admin user
    console.log('👤 Creating default admin user...');
    const adminCreated = await MySQLDatabase.createDefaultAdmin();
    
    if (!adminCreated) {
      console.error('❌ Failed to create admin user.');
      process.exit(1);
    }

    // Insert sample data
    console.log('📊 Inserting sample data...');
    await insertSampleData();

    console.log('✅ Database initialization completed successfully!');
    console.log('');
    console.log('🔐 Admin Credentials:');
    console.log('   Email: admin@example.com');
    console.log('   Password: Abedyr57..');
    console.log('');
    console.log('🌐 Database Details:');
    console.log('   Host: srv1558.hstgr.io');
    console.log('   Database: u485564989_pcrs');
    console.log('   User: u485564989_pcrs');
    console.log('');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

async function insertSampleData() {
  try {
    // Sample projects
    const sampleProjects = [
      {
        name: "Burj Khalifa Residences",
        slug: "burj-khalifa-residences",
        developer: "Emaar Properties",
        location: "Downtown Dubai",
        price: "AED 2,500,000",
        status: "Available" as const,
        bedrooms: 3,
        bathrooms: 3,
        studios: 0,
        area: "2,400 sq ft",
        description: "Luxury residences in the world's tallest tower with breathtaking views of Dubai.",
        image: "/images/projects/burj-khalifa.jpg",
        gallery: ["/images/projects/burj-khalifa-1.jpg", "/images/projects/burj-khalifa-2.jpg"],
        coordinates_lat: 25.1972,
        coordinates_lng: 55.2744,
        features: ["Panoramic Views", "Premium Finishes", "Smart Home Technology"],
        amenities: ["Swimming Pool", "Gym", "Concierge Service", "Valet Parking"]
      },
      {
        name: "Palm Jumeirah Villa",
        slug: "palm-jumeirah-villa",
        developer: "Nakheel",
        location: "Palm Jumeirah",
        price: "AED 8,500,000",
        status: "Available" as const,
        bedrooms: 5,
        bathrooms: 6,
        studios: 0,
        area: "6,500 sq ft",
        description: "Exclusive beachfront villa on the iconic Palm Jumeirah with private beach access.",
        image: "/images/projects/palm-villa.jpg",
        gallery: ["/images/projects/palm-villa-1.jpg", "/images/projects/palm-villa-2.jpg"],
        coordinates_lat: 25.1124,
        coordinates_lng: 55.1390,
        features: ["Private Beach", "Garden", "Maid's Room", "Driver's Room"],
        amenities: ["Private Pool", "Beach Access", "Security", "Landscaped Garden"]
      },
      {
        name: "Dubai Marina Penthouse",
        slug: "dubai-marina-penthouse",
        developer: "DAMAC Properties",
        location: "Dubai Marina",
        price: "AED 4,200,000",
        status: "Under Construction" as const,
        bedrooms: 4,
        bathrooms: 5,
        studios: 0,
        area: "3,800 sq ft",
        description: "Stunning penthouse with marina views and premium amenities in the heart of Dubai Marina.",
        image: "/images/projects/marina-penthouse.jpg",
        gallery: ["/images/projects/marina-penthouse-1.jpg", "/images/projects/marina-penthouse-2.jpg"],
        coordinates_lat: 25.0657,
        coordinates_lng: 55.1713,
        features: ["Marina Views", "Terrace", "Premium Kitchen", "Walk-in Closets"],
        amenities: ["Infinity Pool", "Spa", "Marina Walk", "Restaurants"]
      }
    ];

    // Insert sample projects
    for (const project of sampleProjects) {
      await MySQLDatabase.createProject(project);
    }

    console.log('✅ Sample projects inserted successfully');

    // Log the initialization
    await MySQLDatabase.createLog({
      level: 'info',
      category: 'System',
      message: 'Database initialized with sample data',
      details: 'Initial setup completed with sample projects and admin user'
    });

  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
}

// Run the initialization
if (require.main === module) {
  initializeDatabase();
}

export { initializeDatabase };