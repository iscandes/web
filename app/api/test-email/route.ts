import { NextRequest, NextResponse } from 'next/server';
import { sendTestEmail } from '@/lib/email';

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    
    // Validate email
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Valid email address is required' 
        },
        { status: 400 }
      );
    }
    
    // Send test email
    const emailSent = await sendTestEmail(email.trim().toLowerCase());
    
    if (!emailSent) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send test email. Please check SMTP configuration.' 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${email}`
    });
    
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An unexpected error occurred while sending test email.',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}

// Handle GET request to show test email form
export async function GET(request: NextRequest) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Test - PC Real Estate</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 50px auto;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 {
                color: #333;
                border-bottom: 2px solid #d4af37;
                padding-bottom: 10px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #555;
            }
            input[type="email"] {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 16px;
            }
            button {
                background-color: #d4af37;
                color: white;
                padding: 12px 30px;
                border: none;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            button:hover {
                background-color: #b8941f;
            }
            button:disabled {
                background-color: #ccc;
                cursor: not-allowed;
            }
            .result {
                margin-top: 20px;
                padding: 15px;
                border-radius: 5px;
                display: none;
            }
            .success {
                background-color: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            .error {
                background-color: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📧 Email Configuration Test</h1>
            <p>Test the SMTP email configuration by sending a test email.</p>
            
            <form id="testForm">
                <div class="form-group">
                    <label for="email">Email Address:</label>
                    <input type="email" id="email" name="email" value="abedyr7@gmail.com" required>
                </div>
                
                <button type="submit" id="submitBtn">Send Test Email</button>
            </form>
            
            <div id="result" class="result"></div>
        </div>
        
        <script>
            document.getElementById('testForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitBtn = document.getElementById('submitBtn');
                const result = document.getElementById('result');
                const email = document.getElementById('email').value;
                
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                result.style.display = 'none';
                
                try {
                    const response = await fetch('/api/test-email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email })
                    });
                    
                    const data = await response.json();
                    
                    result.className = 'result ' + (data.success ? 'success' : 'error');
                    result.textContent = data.message;
                    result.style.display = 'block';
                    
                } catch (error) {
                    result.className = 'result error';
                    result.textContent = 'Network error: ' + error.message;
                    result.style.display = 'block';
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Test Email';
                }
            });
        </script>
    </body>
    </html>
  `;
  
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}