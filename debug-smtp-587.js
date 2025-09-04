const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testSMTPPort587() {
  console.log('🔧 Testing SMTP with Port 587 (STARTTLS)\n');
  console.log('==================================================');
  
  console.log('📋 Alternative SMTP Configuration:');
  console.log(`Host: ${process.env.SMTP_HOST}`);
  console.log('Port: 587 (STARTTLS)');
  console.log('Secure: false (STARTTLS)');
  console.log(`User: ${process.env.SMTP_USER}`);
  console.log('');

  try {
    // Create transporter with port 587
    console.log('🔌 Creating SMTP transporter (Port 587)...');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false, // false for STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      debug: true,
      logger: true
    });

    // Verify connection
    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully with port 587!');
    console.log('');

    // Send test email
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: 'abedyr7@gmail.com',
      subject: 'SMTP Test (Port 587) - ' + new Date().toLocaleString(),
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #333;">SMTP Test Successful (Port 587)!</h2>
          <p>This email confirms that your SMTP configuration is working with port 587.</p>
          <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Configuration:</strong></p>
          <ul>
            <li>Host: ${process.env.SMTP_HOST}</li>
            <li>Port: 587 (STARTTLS)</li>
            <li>Secure: false</li>
            <li>User: ${process.env.SMTP_USER}</li>
          </ul>
        </div>
      `,
    });

    console.log('✅ Test email sent successfully with port 587!');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📬 Email sent to: abedyr7@gmail.com`);
    console.log('');
    console.log('🎉 Port 587 configuration is working!');
    console.log('💡 Update your .env.local to use port 587:');
    console.log('   SMTP_PORT=587');
    console.log('   SMTP_SECURE=false');
    
  } catch (error) {
    console.error('❌ Port 587 also failed:', error.message);
    console.log('');
    
    // Try port 25 as last resort
    console.log('🔄 Trying port 25 as fallback...');
    try {
      const transporter25 = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 25,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter25.verify();
      console.log('✅ Port 25 connection successful!');
      
      const info = await transporter25.sendMail({
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: 'abedyr7@gmail.com',
        subject: 'SMTP Test (Port 25) - ' + new Date().toLocaleString(),
        text: 'Test email sent successfully using port 25!',
      });
      
      console.log('✅ Test email sent with port 25!');
      console.log('💡 Update your .env.local to use port 25');
      
    } catch (port25Error) {
      console.error('❌ Port 25 also failed:', port25Error.message);
      console.log('');
      console.log('🚨 All SMTP ports failed. Possible issues:');
      console.log('1. Email account credentials are incorrect');
      console.log('2. Email account does not exist');
      console.log('3. SMTP access is disabled in Hostinger');
      console.log('4. Domain verification required');
      console.log('5. Two-factor authentication enabled (need app password)');
      console.log('');
      console.log('📞 Contact Hostinger support or check email settings in control panel');
    }
  }
}

// Run the test
testSMTPPort587();