import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    let project = null;
    
    // Check if the slug is a numeric ID
    const numericId = parseInt(slug);
    if (!isNaN(numericId) && numericId.toString() === slug) {
      // It's a numeric ID, fetch by ID
      try {
        project = await MySQLDatabase.getProjectById(numericId);
      } catch (dbError) {
        console.error('Database error for project ID:', numericId, dbError);
        // Continue to try by slug instead of failing immediately
      }
    }
    
    if (!project) {
      // It's a slug, fetch by slug
      try {
        project = await MySQLDatabase.getProjectBySlug(slug);
      } catch (dbError) {
        console.error('Database error for project slug:', slug, dbError);
        return NextResponse.json({ error: 'Database connection error' }, { status: 503 });
      }
    }
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Return the project data directly
    return NextResponse.json(project);

  } catch (error) {
    console.error('Error fetching project:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}