import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../lib/mysql-database';

export async function POST() {
  try {
    const db = await getDatabase();
    
    // Create video_settings table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS video_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        video_type ENUM('youtube', 'upload') NOT NULL DEFAULT 'youtube',
        video_url VARCHAR(500) NULL,
        youtube_url VARCHAR(500) NULL,
        title VARCHAR(255) NOT NULL DEFAULT 'Welcome to Premium Choice',
        description TEXT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Check if there's already a record
    const [existing] = await db.execute('SELECT COUNT(*) as count FROM video_settings');
    const count = (existing as any[])[0].count;
    
    // Insert default record if table is empty
    if (count === 0) {
      await db.execute(`
        INSERT INTO video_settings (video_type, youtube_url, title, description, is_active)
        VALUES ('youtube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Welcome to Premium Choice Real Estate', 'Discover luxury properties in Dubai with Premium Choice Real Estate', TRUE)
      `);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Video settings table created successfully',
      recordsCount: count
    });
    
  } catch (error) {
    console.error('Error creating video_settings table:', error);
    return NextResponse.json(
      { error: 'Failed to create video_settings table' },
      { status: 500 }
    );
  }
}