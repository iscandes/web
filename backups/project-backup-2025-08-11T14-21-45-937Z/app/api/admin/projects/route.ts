import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

// GET - Fetch all projects
export async function GET() {
  try {
    const projects = await MySQLDatabase.getProjects();
    return NextResponse.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch projects'
    }, { status: 500 });
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    const projectData = await request.json();
    
    // Validate required fields
    if (!projectData.name || !projectData.description) {
      return NextResponse.json({
        success: false,
        message: 'Name and description are required'
      }, { status: 400 });
    }

    const newProject = await MySQLDatabase.createProject(projectData);
    
    if (newProject) {
      return NextResponse.json({
        success: true,
        data: newProject,
        message: 'Project created successfully'
      }, { status: 201 });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to create project. Please check if the project name is unique.'
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error creating project:', error);
    
    // Return the specific error message from the database
    return NextResponse.json({
      success: false,
      message: error.message || 'Internal server error while creating project'
    }, { status: 500 });
  }
}

// PUT - Update project
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
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

// DELETE - Delete project
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
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