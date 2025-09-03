import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

// PUT - Update individual setting
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { key, value, type } = await request.json();
    const resolvedParams = await params;
    const settingId = resolvedParams.id;
    
    // Get current settings
    const currentSettings = await MySQLDatabase.getSettings() || {};
    
    // Update the specific setting based on key path
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
      message: 'Setting updated successfully'
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update setting'
    }, { status: 500 });
  }
}

// DELETE - Delete individual setting (reset to default)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const settingId = resolvedParams.id;
    
    // Define default values for each setting
    const defaults: Record<string, any> = {
      'site_name': 'Premium Choice',
      'site_description': 'Your trusted partner in Dubai real estate',
      'contact_email': 'admin@pcrealestate.ae',
        'contact_phone': '056 498 6660',
      'contact_address': 'Dubai, UAE',
      'social_facebook': '',
      'social_instagram': '',
      'social_twitter': '',
      'social_linkedin': '',
      'seo_keywords': 'Dubai real estate, luxury properties, investment, Premium Choice',
      'seo_description': 'Discover premium real estate opportunities in Dubai with Premium Choice. Your trusted partner for luxury properties and investment solutions.',
      'theme_primary': '#00D4AA',
      'theme_secondary': '#1A1A1A',
      'theme_accent': '#00A693'
    };
    
    // Get current settings
    const currentSettings = await MySQLDatabase.getSettings() || {};
    
    // Reset specific setting to default
    const updatedSettings = { ...currentSettings };
    const defaultValue = defaults[settingId];
    
    if (defaultValue !== undefined) {
      // Handle nested keys
      const keyMap: Record<string, string> = {
        'site_name': 'siteName',
        'site_description': 'siteDescription',
        'contact_email': 'contact.email',
        'contact_phone': 'contact.phone',
        'contact_address': 'contact.address',
        'social_facebook': 'social.facebook',
        'social_instagram': 'social.instagram',
        'social_twitter': 'social.twitter',
        'social_linkedin': 'social.linkedin',
        'seo_keywords': 'seo.keywords',
        'seo_description': 'seo.description',
        'theme_primary': 'theme.primaryColor',
        'theme_secondary': 'theme.secondaryColor',
        'theme_accent': 'theme.accentColor'
      };
      
      const key = keyMap[settingId];
      if (key && key.includes('.')) {
        const [parentKey, childKey] = key.split('.');
        if (!updatedSettings[parentKey]) {
          updatedSettings[parentKey] = {};
        }
        updatedSettings[parentKey][childKey] = defaultValue;
      } else if (key) {
        updatedSettings[key] = defaultValue;
      }
      
      // Save updated settings
      await MySQLDatabase.updateSettings(updatedSettings);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Setting reset to default successfully'
    });
  } catch (error) {
    console.error('Error resetting setting:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to reset setting'
    }, { status: 500 });
  }
}