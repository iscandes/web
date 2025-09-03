import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

// GET - Fetch all developers
export async function GET() {
  try {
    const developers = await MySQLDatabase.getDevelopers();
    return NextResponse.json({
      success: true,
      data: developers
    });
  } catch (error) {
    console.error('Error fetching developers:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch developers'
    }, { status: 500 });
  }
}

// POST - Create new developer
export async function POST(request: NextRequest) {
  try {
    const developerData = await request.json();
    
    // Validate required fields
    if (!developerData.name || !developerData.description) {
      return NextResponse.json({
        success: false,
        message: 'Name and description are required'
      }, { status: 400 });
    }

    const newDeveloper = await MySQLDatabase.createDeveloper(developerData);
    
    return NextResponse.json({
      success: true,
      data: newDeveloper,
      message: 'Developer created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating developer:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create developer'
    }, { status: 500 });
  }
}

// PUT - Update developer
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Developer ID is required'
      }, { status: 400 });
    }

    const updateData = await request.json();
    const updatedDeveloper = await MySQLDatabase.updateDeveloper(parseInt(id), updateData);
    
    if (!updatedDeveloper) {
      return NextResponse.json({
        success: false,
        message: 'Developer not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedDeveloper,
      message: 'Developer updated successfully'
    });
  } catch (error) {
    console.error('Error updating developer:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update developer'
    }, { status: 500 });
  }
}

// DELETE - Delete developer
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Developer ID is required'
      }, { status: 400 });
    }

    const success = await MySQLDatabase.deleteDeveloper(parseInt(id));
    
    if (!success) {
      return NextResponse.json({
        success: false,
        message: 'Developer not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Developer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting developer:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete developer'
    }, { status: 500 });
  }
}