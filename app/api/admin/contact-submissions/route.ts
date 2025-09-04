import { NextRequest, NextResponse } from 'next/server';
import { getAllContactSubmissions, getContactSubmissionsStats, updateContactSubmissionStatus } from '@/lib/database/contact-submissions';

// GET - Fetch all contact submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const statsOnly = searchParams.get('stats') === 'true';

    if (statsOnly) {
      const stats = await getContactSubmissionsStats();
      return NextResponse.json({ success: true, stats });
    }

    const submissions = await getAllContactSubmissions(limit, offset);
    const stats = await getContactSubmissionsStats();

    return NextResponse.json({
      success: true,
      submissions,
      stats,
      pagination: {
        limit,
        offset,
        total: stats.total
      }
    });

  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch contact submissions' },
      { status: 500 }
    );
  }
}

// PUT - Update contact submission status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: 'ID and status are required' },
        { status: 400 }
      );
    }

    if (!['new', 'read', 'replied'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status. Must be: new, read, or replied' },
        { status: 400 }
      );
    }

    await updateContactSubmissionStatus(id, status);

    return NextResponse.json({
      success: true,
      message: 'Contact submission status updated successfully'
    });

  } catch (error) {
    console.error('Error updating contact submission:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update contact submission' },
      { status: 500 }
    );
  }
}