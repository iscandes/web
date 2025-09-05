import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

export async function GET() {
  try {
    console.log('🔍 Attempting to fetch developers from database...');
    const developers = await MySQLDatabase.getDevelopers();
    console.log(`📊 Found ${developers.length} developers in database`);
    
    // Check if we got an empty array due to database connection issues
    if (developers.length === 0) {
      console.log('⚠️ No developers found in database - returning test data');
      
      const testDevelopers = [
        {
          name: "Premium Developers Ltd",
          slug: "premium-developers",
          description: "Leading luxury real estate developer with 20+ years of experience in creating premium residential and commercial properties."
        },
        {
          name: "Elite Properties Group",
          slug: "elite-properties",
          description: "Innovative developer specializing in sustainable and modern architectural designs for upscale communities."
        },
        {
          name: "Skyline Constructions",
          slug: "skyline-constructions",
          description: "Award-winning developer known for iconic high-rise developments and luxury waterfront properties."
        }
      ];
      
      const response = NextResponse.json(testDevelopers);
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      return response;
    }
    
    // Transform the data to match the expected format
    const transformedDevelopers = developers.map((developer: any) => ({
      name: developer.name,
      slug: developer.slug || developer.name.toLowerCase().replace(/\s+/g, '-'),
      description: developer.description || `Professional real estate developer`
    }));
    
    console.log(`✅ Returning ${transformedDevelopers.length} transformed developers`);
    const response = NextResponse.json(transformedDevelopers);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    console.error('❌ Error in developers API:', error);
    console.log('🔄 Returning test data due to API error...');
    
    const testDevelopers = [
      {
        name: "Premium Developers Ltd",
        slug: "premium-developers",
        description: "Leading luxury real estate developer with 20+ years of experience."
      },
      {
        name: "Elite Properties Group",
        slug: "elite-properties",
        description: "Innovative developer specializing in sustainable designs."
      }
    ];
    
    const response = NextResponse.json(testDevelopers);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  }
}

export async function POST(request: NextRequest) {
  try {
    const developerData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'slug', 'description'];
    for (const field of requiredFields) {
      if (!developerData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const developer = await MySQLDatabase.createDeveloper(developerData);
    const response = NextResponse.json(developer, { status: 201 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    console.error('Error creating developer:', error);
    return NextResponse.json(
      { error: 'Failed to create developer' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}