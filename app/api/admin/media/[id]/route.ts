import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';
import { unlink } from 'fs/promises';
import { join } from 'path';

// GET - Fetch specific media file
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid media ID'
      }, { status: 400 });
    }

    const media = await MySQLDatabase.getMediaFileById(id);
    
    if (!media) {
      return NextResponse.json({
        success: false,
        message: 'Media file not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: media
    });
  } catch (error) {
    console.error('Error fetching media file:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch media file'
    }, { status: 500 });
  }
}

// PUT - Update media file metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid media ID'
      }, { status: 400 });
    }

    const updateData = await request.json();
    
    // Validate that the media file exists
    const existingMedia = await MySQLDatabase.getMediaFileById(id);
    if (!existingMedia) {
      return NextResponse.json({
        success: false,
        message: 'Media file not found'
      }, { status: 404 });
    }

    // Update media file metadata
    const success = await MySQLDatabase.updateMediaFile(id, updateData);
    
    if (!success) {
      return NextResponse.json({
        success: false,
        message: 'Failed to update media file'
      }, { status: 500 });
    }

    // Fetch updated media file
    const updatedMedia = await MySQLDatabase.getMediaFileById(id);
    
    return NextResponse.json({
      success: true,
      data: updatedMedia,
      message: 'Media file updated successfully'
    });
  } catch (error) {
    console.error('Error updating media file:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update media file'
    }, { status: 500 });
  }
}

// DELETE - Delete media file
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid media ID'
      }, { status: 400 });
    }

    // Get media file info before deletion
    const media = await MySQLDatabase.getMediaFileById(id);
    if (!media) {
      return NextResponse.json({
        success: false,
        message: 'Media file not found'
      }, { status: 404 });
    }

    // Delete from database first
    const success = await MySQLDatabase.deleteMediaFile(id);
    
    if (!success) {
      return NextResponse.json({
        success: false,
        message: 'Failed to delete media file from database'
      }, { status: 500 });
    }

    // Try to delete physical file (don't fail if file doesn't exist)
    try {
      const filePath = join(process.cwd(), 'public', media.file_path);
      await unlink(filePath);
    } catch (fileError) {
      console.warn('Could not delete physical file:', fileError);
      // Continue - database deletion was successful
    }

    return NextResponse.json({
      success: true,
      message: 'Media file deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting media file:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete media file'
    }, { status: 500 });
  }
}