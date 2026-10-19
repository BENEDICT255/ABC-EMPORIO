import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import fs from 'node:fs';
import path from 'node:path';

interface RsvpPayload {
  fullName: string;
  profession: string;
  professionOther?: string;
  company?: string;
  phone: string;
  email?: string;
  eventKey?: string;
  submissionId?: string;
  honeypot?: string;
}

const LOCAL_DATA_FILE = path.join(process.cwd(), 'data', 'registrations.json');

// Ensure local fallback directory exists
function saveLocalRegistration(record: Record<string, unknown>): void {
  try {
    const dir = path.dirname(LOCAL_DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const current: unknown[] = fs.existsSync(LOCAL_DATA_FILE)
      ? JSON.parse(fs.readFileSync(LOCAL_DATA_FILE, 'utf-8'))
      : [];
    current.push(record);
    fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(current, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Local file fallback save error:', err);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const body: RsvpPayload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    // 1. Anti-spam honeypot
    if (body.honeypot && body.honeypot.trim().length > 0) {
      // Reject bot submission silently or with generic success to confuse bots
      return res.status(200).json({ ok: true, message: 'Received' });
    }

    // 2. Input validation
    const fullName = (body.fullName || '').trim();
    const profession = (body.profession || '').trim();
    const professionOther = (body.professionOther || '').trim();
    const company = (body.company || '').trim();
    const phone = (body.phone || '').trim();
    const email = (body.email || '').trim();
    const eventKey = (body.eventKey || 'show-and-tell-dar-es-salaam-2026').trim();
    const submissionId = (body.submissionId || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`).trim();

    if (!fullName || fullName.length < 2 || fullName.length > 100) {
      return res.status(400).json({ ok: false, error: 'Please enter a valid full name (2–100 characters).' });
    }

    if (!profession) {
      return res.status(400).json({ ok: false, error: 'Please select your profession.' });
    }

    const cleanPhone = phone.replace(/\s+/g, ' ');
    const phoneDigits = cleanPhone.replace(/\D/g, '');
    if (!cleanPhone || phoneDigits.length < 8 || phoneDigits.length > 16) {
      return res.status(400).json({ ok: false, error: 'Please enter a valid phone number including country code.' });
    }

    if (email && (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254)) {
      return res.status(400).json({ ok: false, error: 'Please enter a valid email address or leave it empty.' });
    }

    const recordId = `reg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const createdAt = new Date().toISOString();

    const registrationRecord = {
      id: recordId,
      fullName,
      profession,
      professionOther,
      company,
      phone: cleanPhone,
      email,
      eventKey,
      submissionId,
      createdAt,
    };

    // 3. Neon Postgres Database Persistence
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

    if (dbUrl) {
      const sql = neon(dbUrl);

      // Initialize table if it doesn't already exist
      await sql`
        CREATE TABLE IF NOT EXISTS registrations (
          id VARCHAR(64) PRIMARY KEY,
          full_name VARCHAR(120) NOT NULL,
          profession VARCHAR(80) NOT NULL,
          profession_other VARCHAR(100),
          company VARCHAR(150),
          phone VARCHAR(30) NOT NULL,
          email VARCHAR(255),
          event_key VARCHAR(100) NOT NULL,
          submission_id VARCHAR(64) UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // Insert record using parameterized query
      await sql`
        INSERT INTO registrations (
          id, full_name, profession, profession_other, company, phone, email, event_key, submission_id
        ) VALUES (
          ${recordId}, ${fullName}, ${profession}, ${professionOther}, ${company}, ${cleanPhone}, ${email}, ${eventKey}, ${submissionId}
        )
        ON CONFLICT (submission_id) DO NOTHING;
      `;
    } else {
      // Local development or pre-Neon configuration fallback
      saveLocalRegistration(registrationRecord);
    }

    return res.status(200).json({
      ok: true,
      id: recordId,
      message: 'Registration confirmed successfully.',
    });
  } catch (error: unknown) {
    console.error('Registration processing error:', error);
    return res.status(500).json({
      ok: false,
      error: 'Unable to save registration at this moment. Please try again shortly.',
    });
  }
}
