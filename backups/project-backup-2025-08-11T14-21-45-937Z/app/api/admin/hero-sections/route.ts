import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

// GET - Fetch all hero sections
export async function GET() {
  try {
    const heroSections = await MySQLDatabase.getHeroSections();
    return NextResponse.json({
      success: true,
      data: heroSections
    });
  } catch (error) {
    console.error('Error fetching hero sections:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch hero sections'
    }, { status: 500 });
  }
}

// POST - Create new hero section
export async function POST(request: NextRequest) {
  try {
    const heroData = await request.json();
    
    // Validate required fields
    if (!heroData.title || !heroData.subtitle) {
      return NextResponse.json({
        success: false,
        message: 'Title and subtitle are required'
      }, { status: 400 });
    }

    const newHeroSection = await MySQLDatabase.createHeroSection(heroData);
    
    return NextResponse.json({
      success: true,
      data: newHeroSection,
      message: 'Hero section created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating hero section:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create hero section'
    }, { status: 500 });
  }
}

// PUT - Update hero section
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Hero section ID is required'
      }, { status: 400 });
    }

    const updateData = await request.json();
    const updatedHeroSection = await MySQLDatabase.updateHeroSection(parseInt(id), updateData);
    
    if (!updatedHeroSection) {
      return NextResponse.json({
        success: false,
        message: 'Hero section not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedHeroSection,
      message: 'Hero section updated successfully'
    });
  } catch (error) {
    console.error('Error updating hero section:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update hero section'
    }, { status: 500 });
  }
}

// DELETE - Delete hero section
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Hero section ID is required'
      }, { status: 400 });
    }

    const success = await MySQLDatabase.deleteHeroSection(parseInt(id));
    
    if (!success) {
      return NextResponse.json({
        success: false,
        message: 'Hero section not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Hero section deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hero section:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete hero section'
    }, { status: 500 });
  }
}