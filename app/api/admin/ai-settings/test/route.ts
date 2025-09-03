import { NextRequest, NextResponse } from 'next/server';

// POST - Test AI API connection
export async function POST(request: NextRequest) {
  try {
    const { provider, settings } = await request.json();
    
    let testResult = false;
    let message = '';

    if (provider !== 'deepseek') {
      message = 'Only DeepSeek provider is supported';
    } else if (!settings.deepseek_api_key) {
      message = 'DeepSeek API key is required';
    } else {
      try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.deepseek_api_key}`,
          },
          body: JSON.stringify({
            model: settings.deepseek_model || 'deepseek-chat',
            messages: [
              { role: 'user', content: 'Hello' }
            ],
            max_tokens: 10
          })
        });
        
        if (response.ok) {
          testResult = true;
          message = 'DeepSeek connection successful';
        } else {
          message = 'Invalid DeepSeek API key or connection failed';
        }
      } catch (error) {
        message = 'DeepSeek connection failed';
      }
    }

    return NextResponse.json({
      success: testResult,
      message
    });
  } catch (error) {
    console.error('Error testing AI connection:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to test AI connection'
    }, { status: 500 });
  }
}