import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

// GET - Fetch all articles
export async function GET() {
  try {
    const articles = await MySQLDatabase.getArticles();
    return NextResponse.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch articles'
    }, { status: 500 });
  }
}

// POST - Create new article
export async function POST(request: NextRequest) {
  try {
    const articleData = await request.json();
    
    // Validate required fields
    if (!articleData.title || !articleData.content) {
      return NextResponse.json({
        success: false,
        message: 'Title and content are required'
      }, { status: 400 });
    }

    const newArticle = await MySQLDatabase.createArticle(articleData);
    
    return NextResponse.json({
      success: true,
      data: newArticle,
      message: 'Article created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create article'
    }, { status: 500 });
  }
}

// PUT - Update article
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Article ID is required'
      }, { status: 400 });
    }

    const updateData = await request.json();
    const updatedArticle = await MySQLDatabase.updateArticle(parseInt(id), updateData);
    
    if (!updatedArticle) {
      return NextResponse.json({
        success: false,
        message: 'Article not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedArticle,
      message: 'Article updated successfully'
    });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update article'
    }, { status: 500 });
  }
}

// DELETE - Delete article
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Article ID is required'
      }, { status: 400 });
    }

    const success = await MySQLDatabase.deleteArticle(parseInt(id));
    
    if (!success) {
      return NextResponse.json({
        success: false,
        message: 'Article not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete article'
    }, { status: 500 });
  }
}