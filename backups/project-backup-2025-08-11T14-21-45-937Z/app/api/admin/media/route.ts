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

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = join(uploadsDir, filename);
    
    // Write file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);
    
    // Save file info to database
    const mediaData = {
      filename: file.name,
      original_name: file.name,
      file_path: `/uploads/${filename}`,
      file_size: file.size,
      mime_type: file.type,
      alt_text: file.name,
      uploaded_by: 1 // Default admin user
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