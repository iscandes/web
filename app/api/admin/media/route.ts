import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { MySQLDatabase } from '@/lib/mysql-database';

// GET - Fetch all media files
export async function GET() {
  try {
    const media = await MySQLDatabase.getMediaFiles();
    
    return NextResponse.json({
      success: true,
      data: media
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch media'
    }, { status: 500 });
  }
}

// POST - Upload new media file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'No file provided'
      }, { status: 400 });
    }

    // Create centralized media directory if it doesn't exist
    const mediaDir = join(process.cwd(), 'public', 'media');
    try {
      await mkdir(mediaDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Enhanced file validation
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.mp4', '.webm', '.mov', '.avi', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.zip', '.rar'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json({
        success: false,
        message: `File type ${fileExtension} not supported. Allowed types: ${allowedExtensions.join(', ')}`
      }, { status: 400 });
    }

    // Enhanced file size validation (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        message: 'File size too large. Maximum size is 50MB'
      }, { status: 400 });
    }

    // Generate unique filename with sanitization
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedName}`;
    const filepath = join(mediaDir, filename);
    
    // Write file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);
    
    // Get additional form data
    const altText = formData.get('alt_text') as string || file.name;
    const uploadedBy = parseInt(formData.get('uploaded_by') as string) || 1;

    // Save file info to database
    const mediaData = {
      filename: sanitizedName,
      original_name: file.name,
      file_path: `/media/${filename}`,
      file_size: file.size,
      mime_type: file.type,
      alt_text: altText,
      uploaded_by: uploadedBy
    };

    const newMedia = await MySQLDatabase.createMediaFile(mediaData);
    
    return NextResponse.json({
      success: true,
      data: newMedia,
      message: 'File uploaded successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to upload file'
    }, { status: 500 });
  }
}

// DELETE - Delete media file
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Media ID is required'
      }, { status: 400 });
    }

    const success = await MySQLDatabase.deleteMediaFile(parseInt(id));
    
    if (!success) {
      return NextResponse.json({
        success: false,
        message: 'Media file not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Media file deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete media file'
    }, { status: 500 });
  }
}