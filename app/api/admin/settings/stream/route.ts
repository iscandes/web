import { NextRequest, NextResponse } from 'next/server';

// SSE stream endpoint disabled - now returns 410 Gone
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: false,
    message: 'SSE stream disabled - using polling only',
    timestamp: new Date().toISOString()
  }, { status: 410 }); // 410 Gone - resource no longer available
}