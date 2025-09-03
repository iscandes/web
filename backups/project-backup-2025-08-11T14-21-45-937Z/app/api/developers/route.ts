import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

export async function GET() {
  try {
    const developers = await MySQLDatabase.getDevelopers();
    return NextResponse.json(developers);
  } catch (error) {
    console.error('Error fetching developers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch developers' },
      { status: 500 }
    );
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
    return NextResponse.json(developer, { status: 201 });
  } catch (error) {
    console.error('Error creating developer:', error);
    return NextResponse.json(
      { error: 'Failed to create developer' },
      { status: 500 }
    );
  }
}