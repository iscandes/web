import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '../../../../lib/mysql-database';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching recent activities...');
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const frontendOnly = searchParams.get('frontend') === 'true';
    
    const activities = await MySQLDatabase.getRecentActivities(limit, frontendOnly);
    
    console.log(`✅ Retrieved ${activities.length} activities (frontend only: ${frontendOnly})`);
    
    return NextResponse.json({
      success: true,
      data: activities,
      frontendOnly
    });
  } catch (error) {
    console.error('❌ Error fetching activities:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch activities',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { level, category, message, details } = body;
    
    if (!level || !category || !message) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields: level, category, message' 
        },
        { status: 400 }
      );
    }
    
    console.log('📝 Creating new activity log:', { level, category, message });
    
    const activity = await MySQLDatabase.createActivity({
      level,
      category,
      message,
      details: details ? JSON.stringify(details) : null
    });
    
    console.log('✅ Activity logged successfully:', activity.id);
    
    return NextResponse.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('❌ Error creating activity:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create activity',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}