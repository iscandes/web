import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { MySQLDatabase } from '../../../../../lib/mysql-database';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    const mediaType = formData.get('mediaType') as string || 'auto'; // auto, video, animation, image

    if (!file || !projectId) {
      return NextResponse.json(
        { error: 'File and project ID are required' },
        { status: 400 }
      );
    }

    // Enhanced file validation
    const allowedExtensions = ['.mp4', '.webm', '.mov', '.avi', '.png', '.jpg', '.jpeg', '.gif', '.webp'];
    const fileExtension = path.extname(file.name).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: `File type ${fileExtension} not supported. Allowed types: ${allowedExtensions.join(', ')}` },
        { status: 400 }
      );
    }

    // Enhanced file size validation (increased for animations)
    const maxSize = 100 * 1024 * 1024; // 100MB for videos and animation sequences
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 100MB' },
        { status: 400 }
      );
    }

    // Determine media type automatically if not specified
    let detectedMediaType = mediaType;
    if (mediaType === 'auto') {
      if (['.mp4', '.webm', '.mov', '.avi'].includes(fileExtension)) {
        detectedMediaType = 'video';
      } else if (file.name.toLowerCase().includes('animation') || 
                 file.name.toLowerCase().includes('sequence') ||
                 file.name.toLowerCase().includes('frame')) {
        detectedMediaType = 'animation';
      } else if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(fileExtension)) {
        detectedMediaType = 'image';
      } else {
        detectedMediaType = 'video'; // Default fallback
      }
    }

    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'projects', projectId);
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating upload directory:', error);
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${sanitizedFileName}`;
    const filePath = path.join(uploadDir, fileName);
    const publicUrl = `/uploads/projects/${projectId}/${fileName}`;

    // Write file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Update database with enhanced media information
    const updateQuery = `
      INSERT INTO project_media (project_id, file_name, file_path, file_size, media_type, file_extension, upload_date)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    
    await MySQLDatabase.executeQuery(updateQuery, [
      projectId,
      fileName,
      publicUrl,
      file.size,
      detectedMediaType,
      fileExtension
    ]);

    // Also update the main projects table for backward compatibility
    const existingProject = await MySQLDatabase.executeQuery(
      'SELECT media_files FROM projects WHERE id = ?',
      [projectId]
    );

    let mediaFiles = [];
    if (existingProject.length > 0 && existingProject[0].media_files) {
      try {
        mediaFiles = JSON.parse(existingProject[0].media_files);
      } catch (e) {
        console.error('Error parsing existing media_files:', e);
        mediaFiles = [];
      }
    }

    // Add new media to the array
    mediaFiles.push({
      id: Date.now(),
      name: file.name,
      url: publicUrl,
      type: detectedMediaType,
      media_type: detectedMediaType,
      file_size: file.size,
      file_extension: fileExtension,
      upload_date: new Date().toISOString()
    });

    // Update the projects table
    await MySQLDatabase.executeQuery(
      'UPDATE projects SET media_files = ? WHERE id = ?',
      [JSON.stringify(mediaFiles), projectId]
    );

    return NextResponse.json({
      success: true,
      message: `${detectedMediaType.charAt(0).toUpperCase() + detectedMediaType.slice(1)} uploaded successfully`,
      data: {
        fileName,
        filePath: publicUrl,
        fileSize: file.size,
        mediaType: detectedMediaType,
        fileExtension,
        uploadDate: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const fileName = searchParams.get('fileName');

    if (!projectId || !fileName) {
      return NextResponse.json(
        { error: 'Project ID and file name are required' },
        { status: 400 }
      );
    }

    // Remove from project_media table
    await MySQLDatabase.executeQuery(
      'DELETE FROM project_media WHERE project_id = ? AND file_name = ?',
      [projectId, fileName]
    );

    // Update the main projects table
    const existingProject = await MySQLDatabase.executeQuery(
      'SELECT media_files FROM projects WHERE id = ?',
      [projectId]
    );

    if (existingProject.length > 0 && existingProject[0].media_files) {
      try {
        let mediaFiles = JSON.parse(existingProject[0].media_files);
        mediaFiles = mediaFiles.filter((file: any) => !file.url.includes(fileName));
        
        await MySQLDatabase.executeQuery(
          'UPDATE projects SET media_files = ? WHERE id = ?',
          [JSON.stringify(mediaFiles), projectId]
        );
      } catch (e) {
        console.error('Error updating media_files:', e);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Media file removed successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to remove file' },
      { status: 500 }
    );
  }
}