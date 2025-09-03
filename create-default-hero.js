const mysql = require('mysql2/promise');

async function createDefaultHeroSection() {
  const connection = await mysql.createConnection({
    host: 'srv1558.hstgr.io',
    user: 'u485564989_pcrs',
    password: 'Abedyr57..',
    database: 'u485564989_pcrs',
    port: 3306,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connected to MySQL database');
    
    // First, clear existing hero sections
    await connection.execute('DELETE FROM hero_sections');
    console.log('Cleared existing hero sections');
    
    // Create a default hero section for the homepage
    const [result] = await connection.execute(`
      INSERT INTO hero_sections (
        page, title, subtitle, description, background_image, 
        cta_text, cta_link, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'home',
      'Premium Choice Real Estate',
      'Discover Your Dream Property in Dubai',
      'Experience luxury living with our exclusive collection of premium properties in Dubai\'s most prestigious locations. From stunning waterfront apartments to magnificent villas, find your perfect home with Premium Choice.',
      '/uploads/photo_1_2025-07-24_19-59-29.jpg',
      'Explore Properties',
      '/projects',
      true
    ]);

    console.log('Default hero section created with ID:', result.insertId);
    
    // Create a second hero section
    await connection.execute(`
      INSERT INTO hero_sections (
        page, title, subtitle, description, background_image, 
        cta_text, cta_link, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'home',
      'Luxury Developments',
      'Invest in Dubai\'s Future',
      'Partner with leading developers to secure your investment in Dubai\'s most promising real estate projects. Premium locations, exceptional returns, and world-class amenities await.',
      '/uploads/photo_5_2025-07-24_19-59-29.jpg',
      'View Developers',
      '/developers',
      true
    ]);

    console.log('Successfully created default hero sections!');
    
  } catch (error) {
    console.error('Error creating hero sections:', error);
  } finally {
    await connection.end();
  }
}

createDefaultHeroSection();