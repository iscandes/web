import { NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

export async function GET() {
  try {
    // Test database connection
    const projects = await MySQLDatabase.getProjects();
    const developers = await MySQLDatabase.getDevelopers();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        projectsCount: projects.length,
        developersCount: developers.length
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}