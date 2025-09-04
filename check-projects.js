const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  ssl: {
    rejectUnauthorized: false
  }
};

async function checkProjects() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected successfully!');
    
    const [rows] = await connection.execute(
      'SELECT id, name, slug, featured_video FROM projects ORDER BY id DESC LIMIT 10'
    );
    
    console.log('\nRecent projects:');
    rows.forEach(p => {
      console.log(`ID: ${p.id}, Name: ${p.name}, Slug: ${p.slug}`);
      console.log(`  Video: ${p.featured_video || 'None'}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkProjects();