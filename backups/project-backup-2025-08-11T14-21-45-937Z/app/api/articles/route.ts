import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

// GET - Fetch published articles for public consumption
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    
    const articles = await MySQLDatabase.getPublishedArticles({
      limit: limit ? parseInt(limit) : undefined,
      category: category || undefined,
      featured: featured === 'true'
    });
    
    return NextResponse.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error fetching published articles:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch articles'
    }, { status: 500 });
  }
}