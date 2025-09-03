import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No video file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type
    if (!file.type.startsWith('video/')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload a video file.' },
        { status: 400 }
      );
    }
    
    // Validate file size (max 250MB)
    const maxSize = 250 * 1024 * 1024; // 250MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size too large. Maximum size is 250MB.' },
        { status: 400 }
      );
    }
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'videos');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${originalName}`;
    const filepath = join(uploadsDir, filename);
    
    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);
    
    // Return the public URL
    const videoUrl = `/uploads/videos/${filename}`;
    
    return NextResponse.json({
      success: true,
      message: 'Video uploaded successfully',
      videoUrl,
      filename,
      size: file.size,
      type: file.type
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}