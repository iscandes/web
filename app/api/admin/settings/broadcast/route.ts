import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, settings } = body;

    if (type === 'social_media_update' && settings) {
      // SSE broadcasting is disabled - using polling only
      console.log('Social media update received (SSE disabled):', settings);
      
      return NextResponse.json({
        success: true,
        message: 'Update received (SSE disabled - using polling)'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid broadcast data'
    }, { status: 400 });
  } catch (error) {
    console.error('Error processing broadcast request:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process broadcast request'
    }, { status: 500 });
  }
}