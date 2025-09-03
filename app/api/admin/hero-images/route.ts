import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

// GET - Fetch all hero images
export async function GET() {
  try {
    const heroImages = await MySQLDatabase.getHeroImages();
    return NextResponse.json({
      success: true,
      data: heroImages
    });
  } catch (error) {
    console.error('Error fetching hero images:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch hero images'
    }, { status: 500 });
  }
}

// POST - Create new hero image
export async function POST(request: NextRequest) {
  try {
    const imageData = await request.json();
    
    // Validate required fields
    if (!imageData.url || !imageData.title) {
      return NextResponse.json({
        success: false,
        message: 'URL and title are required'
      }, { status: 400 });
    }

    const newHeroImage = await MySQLDatabase.createHeroImage(imageData);
    
    return NextResponse.json({
      success: true,
      data: newHeroImage,
      message: 'Hero image created successfully'
    });
  } catch (error) {
    console.error('Error creating hero image:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create hero image'
    }, { status: 500 });
  }
}
// PUT - Update hero image
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Hero image ID is required'
      }, { status: 400 });
    }

    const updateData = await request.json();
    const success = await MySQLDatabase.updateHeroImage(parseInt(id), updateData);
    
    if (!success) {
      return NextResponse.json({
        success: false,
        message: 'Hero image not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Hero image updated successfully'
    });
  } catch (error) {
    console.error('Error updating hero image:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update hero image'
    }, { status: 500 });
  }
}

// DELETE - Delete hero image
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Hero image ID is required'
      }, { status: 400 });
    }

    const success = await MySQLDatabase.deleteHeroImage(parseInt(id));
    
    if (!success) {
      return NextResponse.json({
        success: false,
        message: 'Hero image not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Hero image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hero image:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete hero image'
    }, { status: 500 });
  }
}
