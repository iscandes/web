import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

// PUT - Update article by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
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

// DELETE - Delete article by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
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

// GET - Get single article by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Article ID is required'
      }, { status: 400 });
    }

    const article = await MySQLDatabase.getArticleById(parseInt(id));
    
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
    console.error('Error fetching article:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch article'
    }, { status: 500 });
  }
}