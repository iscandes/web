import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../../../../lib/mysql-database';
import { RowDataPacket } from 'mysql2';

interface ProjectRow extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  location: string;
  price: number;
  type: string;
  status: string;
  images: string;
  completionDate: string;
  createdAt: string;
  updatedAt: string;
  developer_id: number;
  totalUnits?: number;
  soldUnits?: number;
  availableUnits?: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const developerId = parseInt(params.id);
    
    if (isNaN(developerId)) {
      return NextResponse.json(
        { error: 'Invalid developer ID' },
        { status: 400 }
      );
    }

    const connection = await getConnection();
    
    try {
      // First, verify the developer exists
      const [developerRows] = await connection.execute<RowDataPacket[]>(
        'SELECT id, name FROM developers WHERE id = ?',
        [developerId]
      );
      
      if (developerRows.length === 0) {
        return NextResponse.json(
          { error: 'Developer not found' },
          { status: 404 }
        );
      }
      
      // Fetch all projects for this developer
      const [projectRows] = await connection.execute<ProjectRow[]>(
        `SELECT 
          id,
          name,
          description,
          location,
          price,
          type,
          status,
          images,
          completionDate,
          createdAt,
          updatedAt,
          developer_id
        FROM projects 
        WHERE developer_id = ?
        ORDER BY createdAt DESC`,
        [developerId]
      );
      
      // Process the projects data
      const projects = projectRows.map(project => ({
        ...project,
        images: project.images ? JSON.parse(project.images) : [],
        price: Number(project.price) || 0,
        completionDate: project.completionDate ? new Date(project.completionDate).toISOString() : null,
        createdAt: new Date(project.createdAt).toISOString(),
        updatedAt: new Date(project.updatedAt).toISOString()
      }));
      
      // Calculate summary statistics
      const stats = {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'active').length,
        completedProjects: projects.filter(p => p.status === 'completed').length,
        upcomingProjects: projects.filter(p => p.status === 'upcoming').length,
        onHoldProjects: projects.filter(p => p.status === 'on-hold').length,
        totalValue: projects.reduce((sum, p) => sum + (p.price || 0), 0),
        averagePrice: projects.length > 0 ? projects.reduce((sum, p) => sum + (p.price || 0), 0) / projects.length : 0
      };
      
      return NextResponse.json({
        success: true,
        developer: developerRows[0],
        projects,
        stats,
        message: `Found ${projects.length} projects for developer ${developerRows[0].name}`
      });
      
    } finally {
      connection.release();
    }
    
  } catch (error) {
    console.error('Error fetching developer projects:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch developer projects',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: Add endpoint to get project statistics only
export async function HEAD(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const developerId = parseInt(params.id);
    
    if (isNaN(developerId)) {
      return new NextResponse(null, { status: 400 });
    }

    const connection = await getConnection();
    
    try {
      // Get project count for this developer
      const [countRows] = await connection.execute<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM projects WHERE developer_id = ?',
        [developerId]
      );
      
      const projectCount = countRows[0]?.count || 0;
      
      return new NextResponse(null, {
        status: 200,
        headers: {
          'X-Project-Count': projectCount.toString(),
          'Content-Type': 'application/json'
        }
      });
      
    } finally {
      connection.release();
    }
    
  } catch (error) {
    console.error('Error getting developer project count:', error);
    return new NextResponse(null, { status: 500 });
  }
}