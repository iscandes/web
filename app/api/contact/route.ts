import { NextRequest, NextResponse } from 'next/server';
import { sendContactFormEmail } from '@/lib/email';
import { saveContactSubmission, initializeContactSubmissionsTable } from '@/lib/database/contact-submissions';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate and sanitize input
function validateContactForm(data: any): { isValid: boolean; errors: string[]; sanitizedData?: ContactFormData } {
  const errors: string[] = [];
  
  // Required fields validation
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters long');
  }
  
  if (!data.email || typeof data.email !== 'string' || !isValidEmail(data.email)) {
    errors.push('Valid email address is required');
  }
  
  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 10) {
    errors.push('Message is required and must be at least 10 characters long');
  }
  
  // Optional phone validation
  if (data.phone && typeof data.phone === 'string' && data.phone.trim().length > 0) {
    const phoneRegex = /^[+]?[0-9\s\-\(\)]{7,20}$/;
    if (!phoneRegex.test(data.phone.trim())) {
      errors.push('Invalid phone number format');
    }
  }
  
  if (errors.length > 0) {
    return { isValid: false, errors };
  }
  
  // Sanitize data
  const sanitizedData: ContactFormData = {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    message: data.message.trim(),
  };
  
  if (data.phone && typeof data.phone === 'string' && data.phone.trim().length > 0) {
    sanitizedData.phone = data.phone.trim();
  }
  
  if (data.subject && typeof data.subject === 'string' && data.subject.trim().length > 0) {
    sanitizedData.subject = data.subject.trim();
  }
  
  return { isValid: true, errors: [], sanitizedData };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateContactForm(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed', 
          errors: validation.errors 
        },
        { status: 400 }
      );
    }
    
    const formData = validation.sanitizedData!;
    
    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

    let emailSent = false;
    let submissionSaved = false;

    // Try to send email first
    try {
      emailSent = await sendContactFormEmail(formData);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      emailSent = false;
    }

    // Always save to database as backup
    try {
      // Initialize table if needed
      await initializeContactSubmissionsTable();
      
      // Save submission
      await saveContactSubmission({
        ...formData,
        ip_address: ip
      });
      submissionSaved = true;
    } catch (dbError) {
      console.error('Database save failed:', dbError);
      submissionSaved = false;
    }

    // Determine response based on what succeeded
    if (emailSent && submissionSaved) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Thank you for your message! We will get back to you soon.',
          emailSent: true
        },
        { status: 200 }
      );
    } else if (submissionSaved) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Thank you for your message! We have received your inquiry and will get back to you soon.',
          emailSent: false,
          note: 'Your message has been saved and our team will review it shortly.'
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to process your message. Please try again later.' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An unexpected error occurred. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}