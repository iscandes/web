import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/mysql-database';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Updating articles table...');
    
    // Initialize database connection
    await Database.initialize();
    
    // Update articles table
    const success = await Database.updateArticlesTable();
    
    if (success) {
      console.log('✅ Articles table updated successfully!');
      return NextResponse.json({ 
        success: true, 
        message: 'Articles table updated successfully!' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to update articles table' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('❌ Failed to update articles table:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update articles table',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}