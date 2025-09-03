const mysql = require('mysql2/promise');

async function checkProjectImages() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'premium_choice_real_estate'
    });
    
    const [rows] = await connection.execute('SELECT name, image FROM projects LIMIT 5');
    console.log('Project images in database:');
    rows.forEach(row => {
      console.log(`- ${row.name}: ${row.image}`);
    });
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkProjectImages();