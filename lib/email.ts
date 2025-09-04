import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
}

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send email function
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Send contact form email
export async function sendContactFormEmail(formData: ContactFormData): Promise<boolean> {
  try {
    const { name, email, phone, message, subject } = formData;
    
    // Email to admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">New Contact Form Submission</h2>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 5px;">Contact Details:</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            ${phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>` : ''}
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 5px;">Message:</h3>
            <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; border-left: 4px solid #d4af37;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>This email was sent from the PC Real Estate contact form.</p>
            <p>Received on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    `;

    // Auto-reply email to customer
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Thank You for Contacting PC Real Estate</h2>
          
          <p style="color: #555; line-height: 1.6;">Dear ${name},</p>
          
          <p style="color: #555; line-height: 1.6;">
            Thank you for reaching out to us. We have received your message and will get back to you within 24 hours.
          </p>
          
          <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; border-left: 4px solid #d4af37; margin: 20px 0;">
            <h4 style="color: #333; margin-top: 0;">Your Message:</h4>
            <p style="color: #555; margin-bottom: 0;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p style="color: #555; line-height: 1.6;">
            In the meantime, feel free to explore our latest projects and services on our website.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #333; font-weight: bold; margin-bottom: 5px;">PC Real Estate</p>
            <p style="color: #666; margin: 2px 0;">Email: admin@pcrealestate.ae</p>
            <p style="color: #666; margin: 2px 0;">Website: www.pcrealestate.ae</p>
          </div>
        </div>
      </div>
    `;

    // Send email to admin
    const adminEmailSent = await sendEmail({
      to: 'admin@pcrealestate.ae',
      subject: subject || `New Contact Form Submission from ${name}`,
      html: adminEmailHtml,
    });

    // Send auto-reply to customer
    const customerEmailSent = await sendEmail({
      to: email,
      subject: 'Thank you for contacting PC Real Estate',
      html: customerEmailHtml,
    });

    return adminEmailSent && customerEmailSent;
  } catch (error) {
    console.error('Error sending contact form email:', error);
    return false;
  }
}

// Test email function
export async function sendTestEmail(to: string): Promise<boolean> {
  return await sendEmail({
    to,
    subject: 'Test Email from PC Real Estate',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Email Configuration Test</h2>
        <p>This is a test email to verify that the SMTP configuration is working correctly.</p>
        <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>From:</strong> PC Real Estate Email System</p>
      </div>
    `,
  });
}