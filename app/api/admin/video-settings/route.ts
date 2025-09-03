import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

interface VideoSettings {
  id?: string;
  videoType: 'upload' | 'youtube';
  videoUrl: string;
  youtubeUrl: string;
  selectedMediaId?: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// In-memory fallback storage for when database is not available
let fallbackVideoSettings: any[] = [
  {
    id: 1,
    video_type: 'youtube',
    video_url: null,
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Welcome to Premium Choice Real Estate',
    description: 'Discover luxury properties in Dubai with our expert team.',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Helper function to check database connectivity
async function isDatabaseAvailable(): Promise<boolean> {
  try {
    await MySQLDatabase.executeQuery('SELECT 1');
    return true;
  } catch (error) {
    console.warn('Database not available, using fallback storage:', error);
    return false;
  }
}

// Helper function to create video_settings table if it doesn't exist
async function createVideoSettingsTable() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS video_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        video_type ENUM('youtube', 'upload') NOT NULL,
        video_url VARCHAR(500),
        youtube_url VARCHAR(500),
        selected_media_id VARCHAR(50),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await MySQLDatabase.executeQuery(createTableQuery);
    
    // Check if table is empty and add default entry
    const countQuery = 'SELECT COUNT(*) as count FROM video_settings';
    const countResult = await MySQLDatabase.executeQuery(countQuery);
    
    if (countResult[0].count === 0) {
      const insertDefaultQuery = `
        INSERT INTO video_settings (video_type, youtube_url, title, description, is_active)
        VALUES ('youtube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Welcome to Premium Choice Real Estate', 'Discover luxury properties in Dubai with our expert team.', true)
      `;
      await MySQLDatabase.executeQuery(insertDefaultQuery);
    }
  } catch (error) {
    console.error('Error creating video_settings table:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const dbAvailable = await isDatabaseAvailable();
    
    if (dbAvailable) {
      // Create table if it doesn't exist
      await createVideoSettingsTable();
      
      // Get current video settings
      const rows = await MySQLDatabase.executeQuery(
        'SELECT * FROM video_settings WHERE is_active = 1 ORDER BY updated_at DESC LIMIT 1'
      );
      
      const settings = rows[0] || null;
      
      return NextResponse.json({ 
        success: true, 
        settings: settings ? {
          id: settings.id,
          videoType: settings.video_type,
          videoUrl: settings.video_url,
          youtubeUrl: settings.youtube_url,
          selectedMediaId: settings.selected_media_id,
          title: settings.title,
          description: settings.description,
          isActive: Boolean(settings.is_active),
          createdAt: settings.created_at,
          updatedAt: settings.updated_at
        } : null
      });
    } else {
      // Use fallback storage
      const activeSettings = fallbackVideoSettings.find(s => s.is_active);
      
      return NextResponse.json({ 
        success: true, 
        settings: activeSettings ? {
          id: activeSettings.id,
          videoType: activeSettings.video_type,
          videoUrl: activeSettings.video_url,
          youtubeUrl: activeSettings.youtube_url,
          selectedMediaId: activeSettings.selected_media_id,
          title: activeSettings.title,
          description: activeSettings.description,
          isActive: Boolean(activeSettings.is_active),
          createdAt: activeSettings.created_at,
          updatedAt: activeSettings.updated_at
        } : null
      });
    }
  } catch (error) {
    console.error('Error fetching video settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch video settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoType, videoUrl, youtubeUrl, selectedMediaId, title, description, isActive }: VideoSettings = body;
    
    const dbAvailable = await isDatabaseAvailable();
    
    if (dbAvailable) {
      // Create table if it doesn't exist
      await createVideoSettingsTable();
      
      // First, deactivate all existing settings
      await MySQLDatabase.executeQuery('UPDATE video_settings SET is_active = 0');
      
      // Insert new settings
      const result = await MySQLDatabase.executeQuery(
        `INSERT INTO video_settings 
         (video_type, video_url, youtube_url, selected_media_id, title, description, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [videoType, videoUrl || null, youtubeUrl || null, selectedMediaId || null, title, description || null, isActive ? 1 : 0]
      );
      
      return NextResponse.json({ 
        success: true, 
        message: 'Video settings saved successfully',
        id: result.insertId
      });
    } else {
      // Use fallback storage
      // Deactivate all existing settings
      fallbackVideoSettings.forEach(s => s.is_active = false);
      
      // Add new settings
      const newId = Math.max(...fallbackVideoSettings.map(s => s.id), 0) + 1;
      const newSettings = {
        id: newId,
        video_type: videoType,
        video_url: videoUrl || null,
        youtube_url: youtubeUrl || null,
        selected_media_id: selectedMediaId || null,
        title,
        description: description || null,
        is_active: isActive,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      fallbackVideoSettings.push(newSettings);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Video settings saved successfully (fallback)',
        id: newId
      });
    }
  } catch (error) {
    console.error('Error saving video settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save video settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, videoType, videoUrl, youtubeUrl, selectedMediaId, title, description, isActive }: VideoSettings = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Video settings ID is required' },
        { status: 400 }
      );
    }
    
    const dbAvailable = await isDatabaseAvailable();
    
    if (dbAvailable) {
      // Create table if it doesn't exist
      await createVideoSettingsTable();
      
      // If setting this as active, deactivate all others first
      if (isActive) {
        await MySQLDatabase.executeQuery('UPDATE video_settings SET is_active = 0 WHERE id != ?', [id]);
      }
      
      // Update the settings
      await MySQLDatabase.executeQuery(
        `UPDATE video_settings 
         SET video_type = ?, video_url = ?, youtube_url = ?, selected_media_id = ?, title = ?, description = ?, is_active = ?
         WHERE id = ?`,
        [videoType, videoUrl || null, youtubeUrl || null, selectedMediaId || null, title, description || null, isActive ? 1 : 0, id]
      );
      
      return NextResponse.json({ 
        success: true, 
        message: 'Video settings updated successfully'
      });
    } else {
      // Use fallback storage
      const settingsIndex = fallbackVideoSettings.findIndex(s => s.id === parseInt(id));
      
      if (settingsIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Video settings not found' },
          { status: 404 }
        );
      }
      
      // If setting this as active, deactivate all others first
      if (isActive) {
        fallbackVideoSettings.forEach(s => {
          if (s.id !== parseInt(id)) s.is_active = false;
        });
      }
      
      // Update the settings
      fallbackVideoSettings[settingsIndex] = {
        ...fallbackVideoSettings[settingsIndex],
        video_type: videoType,
        video_url: videoUrl || null,
        youtube_url: youtubeUrl || null,
        title,
        description: description || null,
        is_active: isActive,
        updated_at: new Date().toISOString()
      };
      
      return NextResponse.json({ 
        success: true, 
        message: 'Video settings updated successfully (fallback)'
      });
    }
  } catch (error) {
    console.error('Error updating video settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update video settings' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Video settings ID is required' },
        { status: 400 }
      );
    }
    
    const dbAvailable = await isDatabaseAvailable();
    
    if (dbAvailable) {
      // Create table if it doesn't exist
      await createVideoSettingsTable();
      
      await MySQLDatabase.executeQuery('DELETE FROM video_settings WHERE id = ?', [id]);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Video settings deleted successfully'
      });
    } else {
      // Use fallback storage
      const settingsIndex = fallbackVideoSettings.findIndex(s => s.id === parseInt(id));
      
      if (settingsIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Video settings not found' },
          { status: 404 }
        );
      }
      
      fallbackVideoSettings.splice(settingsIndex, 1);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Video settings deleted successfully (fallback)'
      });
    }
  } catch (error) {
    console.error('Error deleting video settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete video settings' },
      { status: 500 }
    );
  }
}