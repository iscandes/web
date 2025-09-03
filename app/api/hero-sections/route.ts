import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'srv1558.hstgr.io',
  user: 'u485564989_pcrs',
  password: 'Abedyr57..',
  database: 'u485564989_pcrs',
  port: 3306,
  ssl: {
    rejectUnauthorized: false
  },
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

export async function GET() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(`
      SELECT 
        id,
        page,
        title,
        subtitle,
        description,
        background_image as backgroundImage,
        cta_text as ctaText,
        cta_link as ctaLink,
        is_active as isActive,
        updated_at as updatedAt
      FROM hero_sections 
      WHERE page = 'home' AND is_active = 1
      ORDER BY id ASC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero sections' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function POST(request: NextRequest) {
  let connection;
  
  try {
    const body = await request.json();
    const {
      page = 'home',
      title,
      subtitle,
      description,
      backgroundImage,
      ctaText,
      ctaLink,
      isActive = true
    } = body;

    if (!title || !subtitle || !description) {
      return NextResponse.json(
        { error: 'Title, subtitle, and description are required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(`
      INSERT INTO hero_sections (
        page, title, subtitle, description, background_image, 
        cta_text, cta_link, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [page, title, subtitle, description, backgroundImage, ctaText, ctaLink, isActive]);

    const insertId = (result as any).insertId;

    // Fetch the created hero section
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(` SELECT 
        id,
        page,
        title,
        subtitle,
        description,
        background_image as backgroundImage,
        cta_text as ctaText,
        cta_link as ctaLink,
        is_active as isActive,
        updated_at as updatedAt
      FROM hero_sections 
      WHERE id = ?
    `, [insertId]);

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create hero section' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function PUT(request: NextRequest) {
  let connection;
  
  try {
    const body = await request.json();
    const {
      id,
      page,
      title,
      subtitle,
      description,
      backgroundImage,
      ctaText,
      ctaLink,
      isActive
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Hero section ID is required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);
    
    await connection.execute(`
      UPDATE hero_sections SET
        page = ?,
        title = ?,
        subtitle = ?,
        description = ?,
        background_image = ?,
        cta_text = ?,
        cta_link = ?,
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [page, title, subtitle, description, backgroundImage, ctaText, ctaLink, isActive, id]);

    // Fetch the updated hero section
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(` SELECT 
        id,
        page,
        title,
        subtitle,
        description,
        background_image as backgroundImage,
        cta_text as ctaText,
        cta_link as ctaLink,
        is_active as isActive,
        updated_at as updatedAt
      FROM hero_sections 
      WHERE id = ?
    `, [id]);

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update hero section' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function DELETE(request: NextRequest) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Hero section ID is required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);
    
    await connection.execute('DELETE FROM hero_sections WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Hero section deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete hero section' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}