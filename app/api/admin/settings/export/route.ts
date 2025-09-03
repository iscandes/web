import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

// GET - Export all settings as JSON
export async function GET(request: NextRequest) {
  try {
    const settings = await MySQLDatabase.getSettings();
    
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      settings: settings || {},
      metadata: {
        totalSettings: Object.keys(settings || {}).length,
        categories: Object.keys(settings || {}).filter(key => typeof settings[key] === 'object'),
        exportedBy: 'Settings Management System'
      }
    };
    
    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': `attachment; filename="settings-export-${new Date().toISOString().split('T')[0]}.json"`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error exporting settings:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to export settings'
    }, { status: 500 });
  }
}

// POST - Import settings from JSON
export async function POST(request: NextRequest) {
  try {
    const importData = await request.json();
    
    // Validate import data structure
    if (!importData.settings) {
      return NextResponse.json({
        success: false,
        message: 'Invalid import data: missing settings object'
      }, { status: 400 });
    }
    
    // Backup current settings before import
    const currentSettings = await MySQLDatabase.getSettings();
    
    // Import new settings
    await MySQLDatabase.updateSettings(importData.settings);
    
    return NextResponse.json({
      success: true,
      message: 'Settings imported successfully',
      imported: Object.keys(importData.settings).length,
      backup: currentSettings
    });
  } catch (error) {
    console.error('Error importing settings:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to import settings'
    }, { status: 500 });
  }
}