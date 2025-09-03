import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/mysql-database';

interface LLMSettings {
  deepseek_api_key: string;
  deepseek_model: string;
  deepseek_max_tokens: number;
  deepseek_temperature: number;
  system_prompt: string;
  property_suggestions_enabled: boolean;
  property_suggestions_count: number;
  contact_info_in_responses: boolean;
}

// Get DeepSeek settings from database
async function getLLMSettings(): Promise<LLMSettings> {
  try {
    const db = await getDatabase();
    const [rows] = await db.execute(`
      SELECT * FROM ai_api_settings ORDER BY created_at DESC LIMIT 1
    `);
    
    const settings = (rows as any[])[0];
    
    if (!settings) {
      throw new Error('No AI API settings found');
    }

    return {
      deepseek_api_key: settings.deepseek_api_key,
      deepseek_model: settings.deepseek_model || 'deepseek-chat',
      deepseek_max_tokens: settings.deepseek_max_tokens || 1000,
      deepseek_temperature: settings.deepseek_temperature || 0.7,
      system_prompt: settings.system_prompt || 'You are a helpful real estate assistant.',
      property_suggestions_enabled: Boolean(settings.property_suggestions_enabled),
      property_suggestions_count: settings.property_suggestions_count || 3,
      contact_info_in_responses: Boolean(settings.contact_info_in_responses)
    };
  } catch (error) {
    console.error('Error getting LLM settings:', error);
    throw error;
  }
}

// Call DeepSeek API
async function callDeepSeek(settings: LLMSettings, prompt: string): Promise<string> {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.deepseek_api_key}`,
      },
      body: JSON.stringify({
        model: settings.deepseek_model,
        messages: [
          {
            role: 'system',
            content: settings.system_prompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: settings.deepseek_max_tokens,
        temperature: settings.deepseek_temperature,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('DeepSeek API error:', response.status, errorData);
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from DeepSeek API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    throw error;
  }
}

// Get property suggestions
async function getPropertySuggestions(count: number = 3): Promise<any[]> {
  try {
    const db = await getDatabase();
    const [rows] = await db.execute(`
      SELECT name, location, price, bedrooms, bathrooms, area, description, image
      FROM projects 
      WHERE status = 'Available' 
      ORDER BY RAND() 
      LIMIT ?
    `, [count]);
    
    return rows as any[];
  } catch (error) {
    console.error('Error getting property suggestions:', error);
    return [];
  }
}

// Store chat message
async function storeChatMessage(message: string, response: string, responseTime: number, userIp?: string): Promise<void> {
  try {
    const db = await getDatabase();
    const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await db.execute(`
      INSERT INTO chat_messages (session_id, message, response, response_time, user_ip)
      VALUES (?, ?, ?, ?, ?)
    `, [sessionId, message, response, responseTime, userIp || 'unknown']);
  } catch (error) {
    console.error('Error storing chat message:', error);
    // Don't throw error here as it's not critical for the chat functionality
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { message } = await request.json();
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get AI settings
    const settings = await getLLMSettings();
    
    if (!settings.deepseek_api_key) {
      return NextResponse.json(
        { error: 'DeepSeek API key not configured' },
        { status: 500 }
      );
    }

    // Enhance prompt with property suggestions if enabled
    let enhancedPrompt = message;
    let propertySuggestions: any[] = [];
    
    if (settings.property_suggestions_enabled) {
      propertySuggestions = await getPropertySuggestions(settings.property_suggestions_count);
      
      if (propertySuggestions.length > 0) {
        const propertyContext = propertySuggestions.map(p => 
          `${p.name} in ${p.location} - ${p.price} (${p.bedrooms}BR/${p.bathrooms}BA, ${p.area})`
        ).join('\n');
        
        enhancedPrompt = `${message}\n\nAvailable Properties:\n${propertyContext}`;
      }
    }

    // Add contact information context if enabled
    if (settings.contact_info_in_responses) {
      enhancedPrompt += `\n\nContact Information:
      - Email: admin@premiumchoice.ae
      - Phone: +971 5064986660
      - Location: Dubai, UAE`;
    }

    // Call DeepSeek API
    const aiResponse = await callDeepSeek(settings, enhancedPrompt);
    
    const responseTime = Date.now() - startTime;
    
    // Store chat message (async, don't wait)
    const userIp = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
    
    storeChatMessage(message, aiResponse, responseTime, userIp);
    
    return NextResponse.json({
      response: aiResponse,
      responseTime,
      suggestions: settings.property_suggestions_enabled ? propertySuggestions : []
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    
    const responseTime = Date.now() - startTime;
    
    // Return a fallback response
    const fallbackResponse = "I apologize, but I'm experiencing technical difficulties at the moment. Please try again later or contact us directly at admin@premiumchoice.ae or +971 5064986660 for immediate assistance with your real estate needs.";
    
    return NextResponse.json({
      response: fallbackResponse,
      responseTime,
      error: 'AI service temporarily unavailable'
    });
  }
}

export async function GET() {
  try {
    // Health check endpoint
    const settings = await getLLMSettings();
    
    return NextResponse.json({
      status: 'ok',
      configured: Boolean(settings.deepseek_api_key),
      model: settings.deepseek_model,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat API health check error:', error);
    return NextResponse.json(
      { status: 'error', error: 'Service unavailable' },
      { status: 500 }
    );
  }
}