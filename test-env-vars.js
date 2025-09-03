// Test if environment variables are being loaded
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Environment Variables Test:');
console.log('================================');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***HIDDEN***' : 'UNDEFINED');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('================================');

if (!process.env.DB_HOST) {
  console.log('❌ DB_HOST is undefined - .env.local not loaded properly');
} else {
  console.log('✅ Environment variables loaded successfully');
}