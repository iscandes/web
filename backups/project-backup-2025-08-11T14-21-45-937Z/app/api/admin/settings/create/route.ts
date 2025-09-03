import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

// POST - Create new setting
export async function POST(request: NextRequest) {
  try {
    const { key, value, type, category, label, description, isPublic } = await request.json();
    
    // Get current settings
    const currentSettings = await MySQLDatabase.getSettings() || {};
    
    // Add the new setting
    const updatedSettings = { ...currentSettings };
    
    // Handle nested keys (e.g., "contact.email", "social.facebook")
    if (key.includes('.')) {
      const [parentKey, childKey] = key.split('.');
      if (!updatedSettings[parentKey]) {
        updatedSettings[parentKey] = {};
      }
      updatedSettings[parentKey][childKey] = value;
    } else {
      updatedSettings[key] = value;
    }
    
    // Save updated settings
    await MySQLDatabase.updateSettings(updatedSettings);
    
    return NextResponse.json({
      success: true,
      message: 'Setting created successfully'
    });
  } catch (error) {
    console.error('Error creating setting:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create setting'
    }, { status: 500 });
  }
}