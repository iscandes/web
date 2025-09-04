import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

// Default settings
const DEFAULT_SETTINGS = {
  siteName: 'Premium Choice',
  siteDescription: 'Your trusted partner in Dubai real estate',
  contact: {
    email: 'admin@example.com',
    phone: null,
    address: 'Dubai, UAE'
  },
  social: {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: ''
  },
  seo: {
    keywords: 'Dubai real estate, luxury properties, investment, Premium Choice',
    description: 'Discover premium real estate opportunities in Dubai with Premium Choice. Your trusted partner for luxury properties and investment solutions.'
  },
  theme: {
    primaryColor: '#00D4AA',
    secondaryColor: '#1A1A1A',
    accentColor: '#00A693'
    }
};

// GET - Fetch all settings
export async function GET() {
  try {
    const settings = await MySQLDatabase.getSettings();
    // If no settings exist, return defaults
    const finalSettings = settings && Object.keys(settings).length > 0 ? settings : DEFAULT_SETTINGS;
    
    return NextResponse.json({
      success: true,
      data: finalSettings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch settings'
    }, { status: 500 });
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  try {
    const updateData = await request.json();
    const currentSettings = await MySQLDatabase.getSettings() || DEFAULT_SETTINGS;
    
    // Deep merge settings
    const newSettings = {
      ...currentSettings,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    // Merge nested objects
    if (updateData.contact) {
      newSettings.contact = { ...currentSettings.contact, ...updateData.contact };
    }
    if (updateData.social) {
      newSettings.social = { ...currentSettings.social, ...updateData.social };
    }
    if (updateData.seo) {
      newSettings.seo = { ...currentSettings.seo, ...updateData.seo };
    }
    if (updateData.theme) {
      newSettings.theme = { ...currentSettings.theme, ...updateData.theme };
    }
    if (updateData.whatsapp) {
      newSettings.whatsapp = { ...currentSettings.whatsapp, ...updateData.whatsapp };
    }
    if (updateData.features) {
      newSettings.features = { ...currentSettings.features, ...updateData.features };
    }
    
    const updatedSettings = await MySQLDatabase.updateSettings(newSettings);
    
    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update settings'
    }, { status: 500 });
  }
}

// POST - Reset settings to default
export async function POST() {
  try {
    const resetSettings = {
      ...DEFAULT_SETTINGS,
      resetAt: new Date().toISOString()
    };
    
    await MySQLDatabase.updateSettings(resetSettings);
    
    return NextResponse.json({
      success: true,
      data: resetSettings,
      message: 'Settings reset to default successfully'
    });
  } catch (error) {
    console.error('Error resetting settings:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to reset settings'
    }, { status: 500 });
  }
}