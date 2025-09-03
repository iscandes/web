import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql-database';

interface ChatRequest {
  message: string;
  context?: string;
}

interface LLMSettings {
  provider: 'deepseek';
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

// Enhanced AI response function with database integration
async function getEnhancedAIResponse(message: string, context?: string): Promise<string> {
  try {
    console.log('Enhanced AI Response: Starting database queries...');
    
    // Get real estate data from database with connection error handling
    let projects: any[] = [];
    let developers: any[] = [];
    
    try {
      console.log('Enhanced AI Response: Querying projects...');
      projects = await query('SELECT * FROM projects ORDER BY created_at DESC LIMIT 20') as any[];
      console.log('Enhanced AI Response: Projects found:', projects.length);
      
      console.log('Enhanced AI Response: Querying developers...');
      developers = await query('SELECT * FROM developers WHERE status = "Active"') as any[];
      console.log('Enhanced AI Response: Developers found:', developers.length);
    } catch (dbError) {
      console.warn('Enhanced AI Response: Database query failed, using fallback data:', dbError);
      // Use fallback data when database is unavailable
      projects = [];
      developers = [];
    }
    
    // Contact info will be configured through admin settings
    const contactInfo = {
      phone: null,
      email: null,
      address: 'Dubai, UAE'
    };
    
    // Build comprehensive real estate context
    const realEstateContext = {
      projects: projects.map((p: any) => ({
        name: p.name,
        developer: p.developer,
        location: p.location,
        price: p.price || p.starting_price,
        type: p.type,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        status: p.status,
        project_type: p.project_type,
        features: p.features ? JSON.parse(p.features) : [],
        amenities: p.amenities ? JSON.parse(p.amenities) : [],
        description: p.description,
        image: p.image
      })),
      developers: developers.map((d: any) => ({
        name: d.name,
        description: d.description,
        established: d.established,
        projects_count: d.projects_count,
        location: d.location,
        website: d.website
      })),
      totalProjects: projects.length,
      availableProjects: projects.filter((p: any) => p.status === 'Available').length,
      underConstructionProjects: projects.filter((p: any) => p.status === 'Under Construction').length,
      contactInfo: contactInfo
    };

    // Get LLM settings
    const settings = await getLLMSettings();
    
    // Professional real estate expert prompt
    const expertPrompt = `You are a professional real estate consultant specializing in Dubai properties. You work for Premium Choice Real Estate and have access to the company's exclusive property portfolio.

CRITICAL INSTRUCTIONS:
- ONLY discuss properties from the database provided below
- Be professional, concise, and direct
- Always reference specific project names, developers, and exact details from the database
- If asked about properties not in your database, politely redirect to your available portfolio
- Provide brief, focused responses without excessive details
- Include contact information only when specifically requested

COMPANY PORTFOLIO:
Total Projects: ${realEstateContext.totalProjects}
Available Properties: ${realEstateContext.availableProjects}
Under Construction: ${realEstateContext.underConstructionProjects}

DEVELOPER PARTNERS:
${realEstateContext.developers.map(d => `• ${d.name} - ${d.description}`).join('\n')}

AVAILABLE PROJECTS:
${realEstateContext.projects.slice(0, 10).map(p => 
  `• ${p.name} by ${p.developer}
    📍 ${p.location}
    🏠 ${p.type} | ${p.bedrooms}BR | ${p.bathrooms}BA | ${p.area} sq ft
    💰 ${p.price || 'Price on request'}
    📋 Status: ${p.status}
    🖼️ Image: ${p.image || 'No image available'}
    ${p.description ? `📝 ${p.description.substring(0, 100)}...` : ''}`
).join('\n\n')}

CONTACT: Phone: ${realEstateContext.contactInfo.phone} | Email: ${realEstateContext.contactInfo.email}

USER QUESTION: "${message}"

RESPONSE GUIDELINES:
1. Keep responses concise and professional
2. Reference specific projects from the database only
3. Provide exact project names, developers, and key details
4. Suggest 1-2 relevant properties maximum
5. If no relevant projects in database, redirect to available options
6. No generic market advice - focus on actual portfolio
7. **IMPORTANT: Do NOT include any image URLs or [IMAGE:] tags in your responses**

**EXAMPLE RESPONSE FORMAT:**
"I recommend **Dubai Hills Estate** by Emaar Properties in Dubai Hills. This luxury 3BR villa offers 2,200 sq ft with golf course views for AED 2,500,000.

The property features premium finishes and smart home technology..."

Remember: Only discuss the specific properties listed in the database above. Focus on text-based descriptions without any image references.`;

    console.log('Enhanced AI Response: Getting LLM settings...');
    const llmSettings = await getLLMSettings();
    console.log('Enhanced AI Response: LLM settings retrieved:', { 
      provider: llmSettings.provider, 
      model: llmSettings.model,
      hasApiKey: !!llmSettings.apiKey 
    });

    console.log('Enhanced AI Response: Calling LLM...');
    // Call the LLM
    const response = await callLLM(llmSettings, expertPrompt);
    console.log('Enhanced AI Response: LLM response received, length:', response?.length || 0);
    return response;
  } catch (error) {
    console.error('Enhanced AI Response Error:', error);
    console.log('Enhanced AI Response: Falling back to local response');
    return getLocalRealEstateResponse(message);
  }
}

// Local real estate response with fallback
function getLocalRealEstateResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Real estate specific responses
  if (lowerMessage.includes('project') || lowerMessage.includes('property')) {
    return `Here is the available project in our portfolio:

**LUME Residences by S&S Developer**
📍 **Location:** Jumeirah Village Circle, Dubai
🏠 **Type:** 1BR | 1BA Apartment
💰 **Price:** On Request
📋 **Status:** Available

This modern development offers contemporary living in one of Dubai's most sought-after communities. What specific details would you like to know about this project?`;
  }
  
  if (lowerMessage.includes('developer') || lowerMessage.includes('builder')) {
    return `We work with Dubai's most reputable developers including Emaar, DAMAC, Sobha Realty, and other established names. Each developer brings unique expertise and quality standards. Would you like to know about specific developers or their current projects?`;
  }
  
  if (lowerMessage.includes('investment') || lowerMessage.includes('roi')) {
    return `As a real estate investment expert, I can guide you through Dubai's lucrative property market. Our portfolio includes both ready properties for immediate rental income and off-plan projects for capital appreciation.

Key investment highlights:
• Ready Properties: Immediate rental yields of 6-8% annually
• Off-Plan Projects: Potential 15-25% capital appreciation
• Prime Locations: Business Bay, Downtown, Dubai Marina, JVC
• Developer Partnerships: Established relationships with top-tier developers

I recommend focusing on high-yield areas and emerging neighborhoods for optimal returns.

Would you like me to analyze specific investment opportunities?`;
  }
  
  if (lowerMessage.includes('location') || lowerMessage.includes('area')) {
    return `Dubai offers diverse neighborhoods, each with unique advantages:

**Premium Areas**: Downtown Dubai, Dubai Marina, Palm Jumeirah
**Emerging Hotspots**: Dubai South, Dubailand, JVC, Arjan
**Family-Friendly**: Arabian Ranches, The Springs, Dubai Hills
**Business Districts**: Business Bay, DIFC, JLT

Our portfolio spans these prime locations with projects ranging from luxury villas to modern apartments. Which location interests you most?`;
  }
  
  // Default expert response
  return `As your real estate expert, I'm here to help you navigate Dubai's dynamic property market. I have access to our complete portfolio of premium projects from top developers.

I can assist you with:
🏢 **Property Selection** - Find the perfect match for your needs
💰 **Investment Analysis** - ROI calculations and market insights  
🏗️ **Developer Insights** - Track records and project quality
📍 **Location Guidance** - Area analysis and future growth potential
📋 **Market Trends** - Current pricing and demand patterns

What specific aspect of real estate would you like to explore?`;
}

async function getContactSettings() {
  try {
    const contactInfo = await query('SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ("contact.phone", "contact.email", "contact.address")')  as any[];
    
    return contactInfo.reduce((acc, item) => {
      acc[item.setting_key.replace('contact.', '')] = item.setting_value;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error('Error fetching contact settings:', error);
    return {
      phone: null,
      email: 'admin@pcrealestate.ae',
      address: 'Dubai, UAE'
    };
  }
}

// Get DeepSeek settings from database
async function getLLMSettings(): Promise<LLMSettings> {
  try {
    const settings = await query(`
      SELECT * FROM ai_api_settings ORDER BY created_at DESC LIMIT 1
    `) as any[];

    if (settings.length === 0) {
      console.warn('No AI API settings found in database, using defaults');
      throw new Error('No AI API settings found');
    }

    const setting = settings[0];
    
    return {
      provider: 'deepseek',
      apiKey: setting.deepseek_api_key || process.env.DEEPSEEK_API_KEY || '',
      model: setting.deepseek_model || 'deepseek-chat',
      temperature: parseFloat(setting.deepseek_temperature || '0.7'),
      maxTokens: parseInt(setting.deepseek_max_tokens || '1500')
    };
  } catch (error) {
    console.warn('Error fetching DeepSeek settings from database, using environment defaults:', error instanceof Error ? error.message : String(error));
    // Return default DeepSeek settings from environment
    return {
      provider: 'deepseek',
      apiKey: process.env.DEEPSEEK_API_KEY || '',
      model: 'deepseek-chat',
      temperature: 0.7,
      maxTokens: 1500
    };
  }
}

// Call DeepSeek API
async function callLLM(settings: LLMSettings, prompt: string): Promise<string> {
  try {
    return await callDeepSeek(settings, prompt);
  } catch (error) {
    console.error('Error calling DeepSeek:', error);
    return getFallbackResponse(prompt);
  }
}



async function callDeepSeek(settings: LLMSettings, prompt: string): Promise<string> {
  console.log('DeepSeek API: Starting call with settings:', { 
    model: settings.model, 
    hasApiKey: !!settings.apiKey,
    apiKeyLength: settings.apiKey?.length || 0
  });
  
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${settings.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: settings.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: settings.temperature,
      max_tokens: settings.maxTokens,
    }),
  });

  console.log('DeepSeek API: Response status:', response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('DeepSeek API: Error response:', errorText);
    throw new Error(`DeepSeek API error: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  console.log('DeepSeek API: Success response received, content length:', data.choices[0]?.message?.content?.length || 0);
  return data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response at the moment.';
}



function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Investment queries (check first to avoid conflicts)
  if (lowerMessage.includes('investment') || lowerMessage.includes('roi') || lowerMessage.includes('business bay')) {
    return `Dubai's real estate investment landscape offers exceptional opportunities:

**💰 High-Yield Areas:**
• Business Bay - 7-9% rental yields, prime location
• Dubai Marina - 6-8% yields, luxury waterfront living
• JVC - 8-10% yields, affordable entry point
• Dubai South - 9-12% yields, emerging area near Al Maktoum Airport

**📈 Investment Highlights:**
• No property tax or capital gains tax
• Strong rental demand from expat population
• Government initiatives supporting real estate growth
• Expo 2020 legacy infrastructure improvements

**🏗️ Ready vs Off-Plan:**
• Ready properties: Immediate rental income
• Off-plan: 15-25% potential capital appreciation

Which investment strategy interests you most - immediate rental income or long-term capital growth?`;
  }
  
  // Family and neighborhood queries
  else if (lowerMessage.includes('family') || lowerMessage.includes('neighborhood') || lowerMessage.includes('school') || (lowerMessage.includes('area') && !lowerMessage.includes('investment'))) {
    return `For families looking for the best neighborhoods in Dubai, I highly recommend these areas:

**🏡 Arabian Ranches** - Premium gated community with excellent schools like JESS Arabian Ranches and Ranches Primary School. Family-friendly with parks, golf course, and community center.

**🌟 Dubai Hills Estate** - Modern master-planned community featuring Dubai Hills Mall, parks, and top-rated schools. Great for families with children.

**🏘️ Jumeirah Village Circle (JVC)** - Affordable family option with good schools, parks, and easy access to major highways. Popular with young families.

**🎓 The Springs/The Meadows** - Established communities with mature landscaping, community pools, and proximity to quality schools.

These areas offer excellent amenities, safety, and educational facilities. Would you like specific property recommendations in any of these neighborhoods?`;
  }
  
  // Price and budget queries
  else if (lowerMessage.includes('price') || lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('luxury')) {
    return `Dubai's property market offers options across all budget ranges:

**💎 Luxury Segment (8M+ AED):**
• Downtown Dubai penthouses and high-floor apartments
• Palm Jumeirah villas and luxury apartments
• Dubai Marina premium towers with marina views

**🏠 Mid-Range (2-8M AED):**
• Business Bay modern apartments
• JVC family-friendly communities
• Dubai Hills Estate contemporary homes

**🌟 Affordable (800K-2M AED):**
• International City budget-friendly options
• Dubai South emerging developments
• Dubailand family communities

**💡 Payment Plans Available:**
• 10% down payment options
• 5-year post-handover payment plans
• Developer financing available

What's your budget range? I can show you the best options in that category.`;
  }
  
  // Commercial and office queries
  else if (lowerMessage.includes('commercial') || lowerMessage.includes('office') || lowerMessage.includes('business')) {
    return `Dubai's commercial real estate market is thriving with excellent opportunities:

**🏢 Prime Business Districts:**
• DIFC - Financial hub with premium office spaces (7-12% yields)
• Business Bay - Modern towers with flexible office solutions
• Dubai Internet City - Tech companies and startups
• JLT - Established business community with good connectivity

**📊 Commercial Investment Benefits:**
• Strong tenant demand from multinational companies
• Government support for business setup
• Tax-free environment attracting global businesses
• Strategic location connecting East and West

**🎯 Property Types:**
• Grade A office buildings
• Retail spaces in high-traffic areas
• Mixed-use developments
• Co-working and flexible office solutions

Are you looking for office space for your business or commercial investment opportunities?`;
  }
  
  // Default response with variety
  else {
    const responses = [
      `As your Dubai real estate expert, I'm here to help you navigate this dynamic market! Dubai offers incredible opportunities whether you're buying your dream home or making a smart investment.

🏙️ **Popular Areas:** Downtown Dubai, Marina, Business Bay, JVC
🏡 **Property Types:** Luxury apartments, family villas, commercial spaces
💰 **Investment Benefits:** High rental yields, no property tax, strong capital growth

What specific aspect of Dubai real estate interests you most?`,

      `Welcome to Dubai's exciting property market! I specialize in helping clients find the perfect match for their needs and budget.

🌟 **Why Dubai Real Estate?**
• World-class infrastructure and amenities
• Strong rental market with high occupancy rates
• Government initiatives supporting property growth
• Strategic location for global business

Whether you're looking for a family home, luxury apartment, or investment property, I can guide you to the best options. What are you looking for?`,

      `Dubai's real estate market is full of opportunities! From luxury waterfront properties to family-friendly communities and high-yield investment options.

🎯 **I can help you with:**
• Property selection based on your lifestyle needs
• Investment analysis and ROI calculations
• Market insights and pricing trends
• Developer recommendations and project quality

Tell me more about what you're looking for, and I'll provide personalized recommendations!`
    ];
    
    // Return a random response to add variety
    return responses[Math.floor(Math.random() * responses.length)];
  }
}



export async function POST(request: NextRequest) {
  try {
    console.log('Expert API: Received POST request');
    
    const body: ChatRequest = await request.json();
    const { message, context } = body;

    console.log('Expert API: Request body:', { message: message?.substring(0, 100) });

    if (!message || message.trim().length === 0) {
      console.log('Expert API: Empty message received');
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log('Expert API: Getting LLM settings...');
    const settings = await getLLMSettings();
    console.log('Expert API: LLM settings retrieved:', { 
      provider: settings.provider, 
      model: settings.model,
      hasApiKey: !!settings.apiKey 
    });

    console.log('Expert API: Getting enhanced AI response...');
    const response = await getEnhancedAIResponse(message, context);
    console.log('Expert API: Response generated:', response?.substring(0, 100));

    const apiResponse = NextResponse.json({
      success: true,
      response: response,
      provider: settings.provider,
      model: settings.model,
      timestamp: new Date().toISOString()
    });

    // Add no-cache headers to prevent browser caching
    apiResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    apiResponse.headers.set('Pragma', 'no-cache');
    apiResponse.headers.set('Expires', '0');
    apiResponse.headers.set('Surrogate-Control', 'no-store');

    return apiResponse;

  } catch (error) {
    console.error('Expert API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Expert API error details:', errorMessage);
    
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: errorMessage,
        response: getLocalRealEstateResponse(errorMessage)
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const settings = await getLLMSettings();
    
    // Test database connection with error handling
    let databaseConnected = true;
    let projectsCount = 0;
    let developersCount = 0;
    
    try {
      const projects = await query('SELECT COUNT(*) as count FROM projects') as any[];
      const developers = await query('SELECT COUNT(*) as count FROM developers') as any[];
      projectsCount = projects[0]?.count || 0;
      developersCount = developers[0]?.count || 0;
    } catch (dbError) {
      console.warn('Database connection test failed:', dbError);
      databaseConnected = false;
    }
    
    return NextResponse.json({
      status: databaseConnected ? 'Expert AI service is running with DeepSeek' : 'Expert AI service running (database offline)',
      provider: settings.provider,
      model: settings.model,
      available_providers: ['deepseek'],
      database_connected: databaseConnected,
      projects_count: projectsCount,
      developers_count: developersCount,
      api_key_configured: !!settings.apiKey,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Expert API status error:', error);
    return NextResponse.json(
      { 
        status: 'Expert AI service running (limited functionality)',
        provider: 'deepseek',
        database_connected: false,
        api_key_configured: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 200 } // Changed to 200 to avoid client errors
    );
  }
}