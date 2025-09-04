// Use built-in fetch for Node.js 18+
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

// Test email functionality
async function testEmailFunctionality() {
  console.log('🎯 Email Functionality Testing Suite\n');
  console.log('==================================================');
  console.log('📧 Testing Email Configuration and Functionality...\n');

  const baseUrl = 'http://localhost:3000';
  const testEmail = 'abedyr7@gmail.com';

  try {
    // Test 1: Send test email
    console.log('📤 Test 1: Sending test email...');
    const testEmailResponse = await fetch(`${baseUrl}/api/test-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testEmail })
    });

    const testEmailResult = await testEmailResponse.json();
    
    if (testEmailResult.success) {
      console.log('✅ Test email sent successfully');
      console.log(`📧 Test email delivered to: ${testEmail}`);
    } else {
      console.log('❌ Test email failed:', testEmailResult.message);
    }
    console.log('');

    // Test 2: Contact form submission
    console.log('📝 Test 2: Testing contact form submission...');
    const contactFormData = {
      name: 'Test User',
      email: testEmail,
      phone: '+971501234567',
      subject: 'Test Contact Form Submission',
      message: 'This is a test message to verify the contact form email functionality is working correctly. The SMTP configuration should send this to both the admin and provide an auto-reply to the customer.'
    };

    const contactResponse = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactFormData)
    });

    const contactResult = await contactResponse.json();
    
    if (contactResult.success) {
      console.log('✅ Contact form submission successful');
      console.log('📧 Admin notification email sent');
      console.log('📧 Customer auto-reply email sent');
      console.log(`📱 Customer email: ${contactFormData.email}`);
    } else {
      console.log('❌ Contact form submission failed:', contactResult.message);
      if (contactResult.errors) {
        console.log('🔍 Validation errors:', contactResult.errors);
      }
    }
    console.log('');

    // Test 3: Invalid email validation
    console.log('🔍 Test 3: Testing email validation...');
    const invalidEmailResponse = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'invalid-email',
        message: 'Test message'
      })
    });

    const invalidEmailResult = await invalidEmailResponse.json();
    
    if (!invalidEmailResult.success && invalidEmailResult.errors) {
      console.log('✅ Email validation working correctly');
      console.log('🔍 Validation caught invalid email format');
    } else {
      console.log('❌ Email validation not working properly');
    }
    console.log('');

    console.log('==================================================');
    console.log('🏁 Email Testing Completed!\n');
    
    console.log('📋 Next Steps:');
    console.log('1. Check your email inbox at abedyr7@gmail.com');
    console.log('2. Verify you received both test email and contact form emails');
    console.log('3. Check admin email (admin@pcrealestate.ae) for contact notifications');
    console.log('4. Test the contact form on the website: http://localhost:3000/contact');
    console.log('5. Visit http://localhost:3000/api/test-email for manual testing');
    
  } catch (error) {
    console.error('❌ Error during email testing:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Ensure the development server is running (npm run dev)');
    console.log('2. Check SMTP configuration in .env.local');
    console.log('3. Verify network connectivity');
    console.log('4. Check server logs for detailed error messages');
  }
}

// Run the test
testEmailFunctionality();