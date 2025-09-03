# Video Upload System Documentation

## Overview

This document provides a comprehensive overview of the video upload system implemented in the SSSQ application. The system allows administrators to upload video files for projects, which are then displayed on the project pages.

## Architecture

The video upload system consists of the following components:

1. **Frontend Components**:
   - `ProjectsContent.tsx`: Handles the UI for uploading videos in the admin panel
   - `CinematicProjectPage.tsx`: Displays videos on the project pages

2. **Backend API**:
   - `app/api/admin/projects/upload-video/route.ts`: Handles file uploads, validation, and database updates

3. **Database**:
   - `projects` table: Stores project information including `featured_video` and `media_files` JSON array
   - `project_media` table: Stores media file information linked to projects

4. **File Storage**:
   - Videos are stored in the `/public/uploads/projects/{projectId}/` directory

## Upload Flow

1. User selects a video file in the admin panel
2. Frontend validates the file type (MP4, WebM, MOV) and size (max 250MB)
3. If valid, the file is sent to the `/api/admin/projects/upload-video` endpoint
4. Backend validates the file again, creates necessary directories, and saves the file
5. The file information is added to the `project_media` table
6. The file information is also added to the `media_files` JSON array in the `projects` table
7. If the file is a video, it is set as the `featured_video` for the project

## Video Display Flow

1. When a project page loads, the `CinematicProjectPage` component attempts to load the video
2. The `getVideoSource` function determines the best video source in this order:
   - `project.featured_video`
   - Videos in `project.media_files` with `media_type` or `type` as 'video'
   - Files in `project.media_files` with video extensions (.mp4, .webm, .mov)
   - Fallback to a default video if none found
3. The `verifyVideoSource` function checks if the video file is accessible
4. The `handleVideoPlay` function attempts to play the video, with fallback mechanisms

## Validation and Error Handling

- **File Type Validation**: Both frontend and backend validate that only MP4, WebM, MOV (and other supported formats) are accepted
- **File Size Validation**: Files must be under 250MB
- **Source Verification**: The system verifies that video sources exist before attempting to play them
- **Fallback Mechanism**: If a video source is not accessible, the system falls back to alternative sources

## Database Schema

### projects Table

Relevant fields for video handling:

```sql
featured_video VARCHAR(255) -- Stores the URL path to the featured video
media_files JSON -- Stores an array of media file objects
```

### project_media Table

```sql
id INT PRIMARY KEY AUTO_INCREMENT
project_id INT -- Foreign key to projects table
name VARCHAR(255) -- Original filename
url VARCHAR(255) -- URL path to the file
file_path VARCHAR(255) -- Server file path
type VARCHAR(50) -- File type (e.g., 'image', 'video')
media_type VARCHAR(50) -- Media type (e.g., 'image', 'video')
file_size INT -- File size in bytes
file_extension VARCHAR(10) -- File extension
upload_date DATETIME -- Upload timestamp
```

## media_files JSON Structure

Each entry in the `media_files` JSON array has the following structure:

```json
{
  "id": "unique-id",
  "name": "filename.mp4",
  "url": "/uploads/projects/5/filename.mp4",
  "file_path": "/uploads/projects/5/filename.mp4",
  "type": "file",
  "media_type": "video",
  "file_size": 1234567,
  "file_extension": ".mp4",
  "upload_date": "2023-01-01T12:00:00Z"
}
```

## Troubleshooting

### Common Issues

1. **Video Not Playing**:
   - Check if the video file exists on disk
   - Verify that the video URL is correctly stored in the database
   - Check browser console for errors
   - Ensure the video format is supported by the browser

2. **Upload Failures**:
   - Check file size and type
   - Verify server permissions for the upload directory
   - Check for database connection issues

### Diagnostic Tools

1. **verify-project-videos.js**: Script to verify that all project videos are properly linked in the database and accessible in the file system
2. **fix-video-upload.js**: Script to fix inconsistencies between `featured_video` and `media_files`

## Maintenance Tasks

1. **Regular Verification**: Run the verification script periodically to ensure all videos are properly linked and accessible
2. **Cleanup**: Remove unused video files from the server to free up disk space
3. **Backup**: Regularly backup the video files and database

## Future Improvements

1. **Video Transcoding**: Implement video transcoding to optimize videos for web playback
2. **Multiple Resolutions**: Generate multiple resolutions for adaptive streaming
3. **Cloud Storage**: Move video storage to a cloud provider for better scalability
4. **Video Analytics**: Add analytics to track video views and engagement