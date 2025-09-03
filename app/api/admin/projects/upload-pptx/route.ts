import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, access } from 'fs/promises';
import { join } from 'path';
import { MySQLDatabase } from '@/lib/mysql-database';

// POST - Upload PPTX file for a project
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    
    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'No file provided'
      }, { status: 400 });
    }

    if (!projectId) {
      return NextResponse.json({
        success: false,
        message: 'Project ID is required'
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const isValidExtension = ['ppt', 'pptx'].includes(fileExtension || '');
    
    if (!allowedTypes.includes(file.type) && !isValidExtension) {
      return NextResponse.json({
        success: false,
        message: 'Only PowerPoint files (.ppt, .pptx) are allowed'
      }, { status: 400 });
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        message: 'File size too large. Maximum size is 50MB'
      }, { status: 400 });
    }

    // Create presentations directory if it doesn't exist
    const presentationsDir = join(process.cwd(), 'public', 'presentations');
    try {
      await access(presentationsDir);
    } catch {
      // Directory doesn't exist, create it
      try {
        await mkdir(presentationsDir, { recursive: true });
        console.log('Created presentations directory:', presentationsDir);
      } catch (mkdirError) {
        console.error('Error creating presentations directory:', mkdirError);
        return NextResponse.json({
          success: false,
          message: 'Failed to create upload directory'
        }, { status: 500 });
      }
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `project-${projectId}-${timestamp}-${sanitizedFileName}`;
    const filepath = join(presentationsDir, filename);
    
    // Write file to disk
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);
      console.log('File written successfully:', filepath);
    } catch (writeError) {
      console.error('Error writing file:', writeError);
      return NextResponse.json({
        success: false,
        message: 'Failed to save file to disk'
      }, { status: 500 });
    }
    
    // Update project with presentation file path
    const presentationPath = `/presentations/${filename}`;
    try {
      const updatedProject = await MySQLDatabase.updateProject(parseInt(projectId), {
        presentation_file: presentationPath
      });
      
      if (!updatedProject) {
        return NextResponse.json({
          success: false,
          message: 'Project not found or failed to update'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: {
          filename: filename,
          originalName: file.name,
          path: presentationPath,
          size: file.size,
          projectId: parseInt(projectId)
        },
        message: 'PPTX file uploaded successfully'
      }, { status: 201 });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({
        success: false,
        message: 'Failed to update project in database'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error uploading PPTX file:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error during file upload'
    }, { status: 500 });
  }
}

// DELETE - Remove PPTX file from project
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    
    if (!projectId) {
      return NextResponse.json({
        success: false,
        message: 'Project ID is required'
      }, { status: 400 });
    }

    // Update project to remove presentation file
    const updatedProject = await MySQLDatabase.updateProject(parseInt(projectId), {
      presentation_file: null
    });
    
    if (!updatedProject) {
      return NextResponse.json({
        success: false,
        message: 'Project not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'PPTX file removed from project successfully'
    });
  } catch (error) {
    console.error('Error removing PPTX file:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to remove PPTX file'
    }, { status: 500 });
  }
}