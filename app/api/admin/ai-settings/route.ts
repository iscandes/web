import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

// GET - Fetch AI API settings
export async function GET() {
  try {
    const aiSettings = await MySQLDatabase.getAISettings();
    return NextResponse.json({
      success: true,
      data: aiSettings
    });
  } catch (error) {
    console.error('Error fetching AI settings:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch AI settings'
    }, { status: 500 });
  }
}

// POST - Create or update AI API settings
export async function POST(request: NextRequest) {
  try {
    const settingsData = await request.json();
    
    // Validate required fields
    if (!settingsData.default_provider) {
      return NextResponse.json({
        success: false,
        message: 'Default AI provider is required'
      }, { status: 400 });
    }

    const result = await MySQLDatabase.saveAISettings(settingsData);
    
    return NextResponse.json({
      success: true,
      data: result,
      message: 'AI settings saved successfully'
    });
  } catch (error) {
    console.error('Error saving AI settings:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to save AI settings'
    }, { status: 500 });
  }
}