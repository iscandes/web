import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

// GET - Fetch single project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Project ID is required'
      }, { status: 400 });
    }

    const project = await MySQLDatabase.getProjectById(parseInt(id));
    
    if (!project) {
      return NextResponse.json({
        success: false,
        message: 'Project not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch project'
    }, { status: 500 });
  }
}

// PUT - Update project by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Project ID is required'
      }, { status: 400 });
    }

    const updateData = await request.json();
    const updatedProject = await MySQLDatabase.updateProject(parseInt(id), updateData);
    
    if (!updatedProject) {
      return NextResponse.json({
        success: false,
        message: 'Project not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update project'
    }, { status: 500 });
  }
}

// DELETE - Delete project by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Project ID is required'
      }, { status: 400 });
    }

    const success = await MySQLDatabase.deleteProject(parseInt(id));
    
    if (!success) {
      return NextResponse.json({
        success: false,
        message: 'Project not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete project'
    }, { status: 500 });
  }
}