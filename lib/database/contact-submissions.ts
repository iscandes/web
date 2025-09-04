import { getConnection } from '../mysql-database';

export interface ContactSubmission {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  created_at?: Date;
  status?: 'new' | 'read' | 'replied';
  ip_address?: string;
}

// Create contact submissions table if it doesn't exist
export async function initializeContactSubmissionsTable() {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(500),
        message TEXT NOT NULL,
        status ENUM('new', 'read', 'replied') DEFAULT 'new',
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('Contact submissions table initialized successfully');
  } catch (error) {
    console.error('Error initializing contact submissions table:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

// Save contact submission to database
export async function saveContactSubmission(submission: ContactSubmission): Promise<number> {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `INSERT INTO contact_submissions (name, email, phone, subject, message, ip_address) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        submission.name,
        submission.email,
        submission.phone || null,
        submission.subject || null,
        submission.message,
        submission.ip_address || null
      ]
    );
    
    return (result as any).insertId;
  } catch (error) {
    console.error('Error saving contact submission:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

// Get all contact submissions (for admin)
export async function getAllContactSubmissions(limit = 50, offset = 0) {
  let connection;
  try {
    connection = await getConnection();
    const [submissions] = await connection.execute(
      `SELECT id, name, email, phone, subject, message, status, created_at 
       FROM contact_submissions 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    
    return submissions;
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

// Get contact submission by ID
export async function getContactSubmissionById(id: number) {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute(
      `SELECT * FROM contact_submissions WHERE id = ?`,
      [id]
    );
    
    return (result as any[])[0] || null;
  } catch (error) {
    console.error('Error fetching contact submission:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

// Update contact submission status
export async function updateContactSubmissionStatus(id: number, status: 'new' | 'read' | 'replied') {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      `UPDATE contact_submissions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, id]
    );
    
    return true;
  } catch (error) {
    console.error('Error updating contact submission status:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

// Get contact submissions count by status
export async function getContactSubmissionsStats() {
  let connection;
  try {
    connection = await getConnection();
    const [stats] = await connection.execute(`
      SELECT 
        status,
        COUNT(*) as count
      FROM contact_submissions 
      GROUP BY status
    `);
    
    const result = {
      new: 0,
      read: 0,
      replied: 0,
      total: 0
    };
    
    (stats as any[]).forEach(stat => {
      result[stat.status as keyof typeof result] = stat.count;
      result.total += stat.count;
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching contact submissions stats:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

// Delete old contact submissions (cleanup)
export async function deleteOldContactSubmissions(daysOld = 365) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `DELETE FROM contact_submissions WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)`,
      [daysOld]
    );
    
    return (result as any).affectedRows;
  } catch (error) {
    console.error('Error deleting old contact submissions:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}