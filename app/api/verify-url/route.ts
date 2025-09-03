import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch {
      return NextResponse.json(
        { accessible: false, error: 'Invalid URL format' },
        { status: 200 }
      );
    }

    // Only allow HTTP and HTTPS protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return NextResponse.json(
        { accessible: false, error: 'Only HTTP and HTTPS URLs are allowed' },
        { status: 200 }
      );
    }

    try {
      // Use fetch with a timeout to check if URL is accessible
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        method: 'HEAD', // Use HEAD to avoid downloading content
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      clearTimeout(timeoutId);

      // Consider 2xx and 3xx status codes as accessible
      const accessible = response.status >= 200 && response.status < 400;
      
      return NextResponse.json({
        accessible,
        status: response.status,
        statusText: response.statusText
      });

    } catch (error: any) {
      // Handle fetch errors (network issues, timeouts, etc.)
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { accessible: false, error: 'Request timeout' },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { accessible: false, error: 'Network error or URL not accessible' },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('Error verifying URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}