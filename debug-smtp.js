const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testSMTPConnection() {
  console.log('🔧 SMTP Configuration Debug\n');
  console.log('==================================================');
  
  // Display configuration
  console.log('📋 SMTP Configuration:');
  console.log(`Host: ${process.env.SMTP_HOST}`);
  console.log(`Port: ${process.env.SMTP_PORT}`);
  console.log(`Secure: ${process.env.SMTP_SECURE}`);
  console.log(`User: ${process.env.SMTP_USER}`);
  console.log(`Password: ${process.env.SMTP_PASS ? '[SET]' : '[NOT SET]'}`);
  console.log(`From: ${process.env.EMAIL_FROM}`);
  console.log(`From Name: ${process.env.EMAIL_FROM_NAME}`);
  console.log('');

  try {
    // Create transporter
    console.log('🔌 Creating SMTP transporter...');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      debug: true, // Enable debug output
      logger: true // Enable logging
    });

    // Verify connection
    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');
    console.log('');

    // Send test email
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: 'abedyr7@gmail.com',
      subject: 'SMTP Test Email - ' + new Date().toLocaleString(),
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #333;">SMTP Test Successful!</h2>
          <p>This email confirms that your SMTP configuration is working correctly.</p>
          <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Configuration:</strong></p>
          <ul>
            <li>Host: ${process.env.SMTP_HOST}</li>
            <li>Port: ${process.env.SMTP_PORT}</li>
            <li>Secure: ${process.env.SMTP_SECURE}</li>
            <li>User: ${process.env.SMTP_USER}</li>
          </ul>
        </div>
      `,
    });

    console.log('✅ Test email sent successfully!');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📬 Email sent to: abedyr7@gmail.com`);
    console.log('');
    console.log('🎉 SMTP configuration is working correctly!');
    
  } catch (error) {
    console.error('❌ SMTP Error:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting suggestions:');
    
    if (error.code === 'EAUTH') {
      console.log('- Authentication failed. Check username and password.');
      console.log('- Verify that the email account exists and credentials are correct.');
    } else if (error.code === 'ECONNECTION') {
      console.log('- Connection failed. Check host and port settings.');
      console.log('- Verify network connectivity and firewall settings.');
    } else if (error.code === 'ESOCKET') {
      console.log('- Socket error. Check if the SMTP server is accessible.');
      console.log('- Try using a different port (587 for STARTTLS, 465 for SSL).');
    } else {
      console.log('- Check all SMTP configuration values in .env.local');
      console.log('- Verify that the email service provider allows SMTP access');
      console.log('- Check if two-factor authentication is enabled (may require app password)');
    }
    
    console.log('');
    console.log('📋 Full error details:');
    console.log(error);
  }
}

// Run the test
testSMTPConnection();