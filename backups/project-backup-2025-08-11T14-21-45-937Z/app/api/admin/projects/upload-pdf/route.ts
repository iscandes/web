import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, access, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { MySQLDatabase } from '@/lib/mysql-database';
import { Vibrant } from 'node-vibrant/node';
import sharp from 'sharp';
import pdf2pic from 'pdf2pic';
import path from 'path';

// Function to extract colors from PDF
async function extractColorsFromPDF(pdfPath: string) {
  try {
    // Convert first page of PDF to image
    const convert = pdf2pic.fromPath(pdfPath, {
      density: 100,           // Output resolution
      saveFilename: "temp",   // Temporary filename
      savePath: path.join(process.cwd(), 'temp'),
      format: "png",
      width: 800,
      height: 600
    });

    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'temp');
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    // Convert first page to image
    const result = await convert(1, { responseType: "image" });
    
    if (!result || !result.path) {
      throw new Error('Failed to convert PDF to image');
    }

    // Extract colors using Vibrant
    const palette = await Vibrant.from(result.path).getPalette();
    
    // Clean up temporary image
    try {
      await unlink(result.path);
    } catch (cleanupError) {
      console.warn('Failed to cleanup temp image:', cleanupError);
    }

    // Extract color values and create a comprehensive palette
    const colorPalette = {
      primary: palette.Vibrant?.hex || '#3B82F6',
      secondary: palette.LightVibrant?.hex || '#60A5FA',
      accent: palette.DarkVibrant?.hex || '#1E40AF',
      muted: palette.Muted?.hex || '#6B7280',
      lightMuted: palette.LightMuted?.hex || '#D1D5DB',
      darkMuted: palette.DarkMuted?.hex || '#374151',
      // Additional derived colors for theming
      background: palette.LightMuted?.hex || '#F9FAFB',
      surface: palette.Muted?.hex || '#F3F4F6',
      text: palette.DarkMuted?.hex || '#111827',
      textSecondary: palette.Muted?.hex || '#6B7280'
    };

    return colorPalette;
  } catch (error) {
    console.error('Error extracting colors from PDF:', error);
    // Return default color palette if extraction fails
    return {
      primary: '#3B82F6',
      secondary: '#60A5FA',
      accent: '#1E40AF',
      muted: '#6B7280',
      lightMuted: '#D1D5DB',
      darkMuted: '#374151',
      background: '#F9FAFB',
      surface: '#F3F4F6',
      text: '#111827',
      textSecondary: '#6B7280'
    };
  }
}

// POST - Upload PDF file for a project and extract colors
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

    // Validate file type - PDF only
    const allowedTypes = ['application/pdf'];
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const isValidExtension = fileExtension === 'pdf';
    
    if (!allowedTypes.includes(file.type) && !isValidExtension) {
      return NextResponse.json({
        success: false,
        message: 'Only PDF files are allowed'
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

    // Create brochures directory if it doesn't exist
    const brochuresDir = join(process.cwd(), 'public', 'brochures');
    try {
      await access(brochuresDir);
    } catch {
      try {
        await mkdir(brochuresDir, { recursive: true });
        console.log('Created brochures directory:', brochuresDir);
      } catch (mkdirError) {
        console.error('Error creating brochures directory:', mkdirError);
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
    const filepath = join(brochuresDir, filename);
    
    // Write file to disk
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);
      console.log('PDF file written successfully:', filepath);
    } catch (writeError) {
      console.error('Error writing file:', writeError);
      return NextResponse.json({
        success: false,
        message: 'Failed to save file to disk'
      }, { status: 500 });
    }

    // Extract colors from PDF (convert first page to image and analyze)
    let colorPalette = null;
    try {
      colorPalette = await extractColorsFromPDF(filepath);
    } catch (colorError) {
      console.error('Error extracting colors:', colorError);
      // Use default colors if extraction fails
      colorPalette = {
        primary: '#3B82F6',
        secondary: '#60A5FA',
        accent: '#1E40AF',
        muted: '#6B7280',
        lightMuted: '#D1D5DB',
        darkMuted: '#374151',
        background: '#F9FAFB',
        surface: '#F3F4F6',
        text: '#111827',
        textSecondary: '#6B7280'
      };
    }
    
    // Update project with PDF file path and color palette
    const brochurePath = `/brochures/${filename}`;
    try {
      const updatedProject = await MySQLDatabase.updateProject(parseInt(projectId), {
        presentation_file: brochurePath,
        color_palette: JSON.stringify(colorPalette)
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
          path: brochurePath,
          size: file.size,
          projectId: parseInt(projectId),
          colorPalette: colorPalette
        },
        message: 'PDF brochure uploaded successfully and colors extracted'
      }, { status: 201 });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({
        success: false,
        message: 'Failed to update project in database'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error uploading PDF file:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error during file upload'
    }, { status: 500 });
  }
}

// DELETE - Remove PDF file from project
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

    // Update project to remove presentation file and color palette
    const updatedProject = await MySQLDatabase.updateProject(parseInt(projectId), {
      presentation_file: null,
      color_palette: null
    });
    
    if (!updatedProject) {
      return NextResponse.json({
        success: false,
        message: 'Project not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'PDF brochure removed from project successfully'
    });
  } catch (error) {
    console.error('Error removing PDF file:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to remove PDF file'
    }, { status: 500 });
  }
}