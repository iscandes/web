import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

export async function POST(request: NextRequest) {
  try {
    const { developer, unitTypes, projectName, location } = await request.json();

    if (!developer || !unitTypes || unitTypes.length === 0) {
      return NextResponse.json(
        { error: 'Developer and unit types are required' },
        { status: 400 }
      );
    }

    // Get AI API key from settings
    const apiKeyResult = await MySQLDatabase.executeQuery(
      'SELECT value FROM settings WHERE name = ? AND category = ?',
      ['deepseek_api_key', 'Real Estate AI Engine']
    );

    if (!apiKeyResult || apiKeyResult.length === 0) {
      return NextResponse.json(
        { error: 'AI API key not configured. Please add it in Expert Settings.' },
        { status: 400 }
      );
    }

    const apiKey = apiKeyResult[0].value;

    // Generate AI description using DeepSeek API
    const prompt = `Generate a professional and engaging real estate project description for:

Project: ${projectName || 'Luxury Development'}
Developer: ${developer}
Location: ${location || 'Prime Location'}
Available Unit Types: ${unitTypes.join(', ')}

The description should be:
- Professional and luxurious in tone
- Highlight the developer's reputation
- Mention the variety of unit types available
- Include location benefits
- Be around 150-200 words
- Focus on lifestyle and investment potential
- Use premium real estate language

Please write a compelling description that would attract potential buyers and investors.`;

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      const description = data.choices[0]?.message?.content || '';

      return NextResponse.json({ description });
    } catch (aiError) {
      console.error('AI API Error:', aiError);
      
      // Fallback to template-based description
      const fallbackDescription = `Discover ${projectName || 'this exceptional development'} by ${developer}, a prestigious real estate project located in ${location || 'a prime location'}. This luxury development offers a diverse range of living spaces including ${unitTypes.join(', ').toLowerCase()} units, each designed with meticulous attention to detail and modern amenities.

${developer} brings years of expertise in creating world-class residential communities that combine luxury, comfort, and investment potential. The project features contemporary architecture, premium finishes, and state-of-the-art facilities designed to enhance your lifestyle.

With its strategic location and comprehensive amenities, this development represents an excellent opportunity for both end-users seeking a luxury home and investors looking for strong returns in the dynamic real estate market.`;

      return NextResponse.json({ 
        description: fallbackDescription,
        note: 'Generated using fallback template due to AI service unavailability'
      });
    }

  } catch (error) {
    console.error('Error generating AI description:', error);
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 500 }
    );
  }
}