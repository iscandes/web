import { NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

// GET - Fetch public settings (non-sensitive data only)
export async function GET() {
  try {
    const allSettings = await MySQLDatabase.getSettings();
    
    if (!allSettings) {
      return NextResponse.json({
        success: false,
        message: 'Settings not found'
      }, { status: 404 });
    }
    
    // Filter out sensitive settings and return only public data
    const publicSettings = {
      site: {
        name: allSettings.siteName || 'Premium Choice',
        description: allSettings.siteDescription || 'Your trusted partner in Dubai real estate'
      },
      contact: {
        email: allSettings.contact?.email || null,
        phone: allSettings.contact?.phone || null,
        address: allSettings.contact?.address || null
      },
      social: {
        facebook: allSettings.social?.facebook || '',
        instagram: allSettings.social?.instagram || '',
        twitter: allSettings.social?.twitter || '',
        linkedin: allSettings.social?.linkedin || '',
        youtube: allSettings.social?.youtube || ''
      },
      whatsapp: {
        phone: allSettings.whatsapp?.phone || null,
        enabled: allSettings.whatsapp?.enabled || false,
        defaultMessage: allSettings.whatsapp?.defaultMessage || 'Hello! I\'m interested in your services.',
        businessHours: allSettings.whatsapp?.businessHours || {
          enabled: false,
          timezone: 'Asia/Dubai',
          schedule: {}
        },
        showOnPages: allSettings.whatsapp?.showOnPages || ['home', 'contact']
      },
      features: {
        enableBlog: allSettings.features?.enableBlog || false,
        enableNewsletter: allSettings.features?.enableNewsletter || false,
        enableWhatsApp: allSettings.features?.enableWhatsApp || false,
        enableLiveChat: allSettings.features?.enableLiveChat || false
      },
      theme: {
        primaryColor: allSettings.theme?.primaryColor || '#00D4AA',
        secondaryColor: allSettings.theme?.secondaryColor || '#1A1A1A',
        accentColor: allSettings.theme?.accentColor || '#00A693'
      }
    };
    
    return NextResponse.json({
      success: true,
      data: publicSettings
    });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch settings'
    }, { status: 500 });
  }
}