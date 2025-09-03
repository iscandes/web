import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

// GET - Fetch article by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const article = await MySQLDatabase.getArticleBySlug(slug);
    
    if (!article) {
      return NextResponse.json({
        success: false,
        message: 'Article not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch article'
    }, { status: 500 });
  }
}