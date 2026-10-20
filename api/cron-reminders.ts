import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import fs from 'node:fs';
import path from 'node:path';
import {
  buildReminder3DaysEmail,
  buildReminder1DayEmail,
  buildReminderDayOfEmail,
  sendEmail,
} from './email';

interface RegistrationRecord {
  id: string;
  fullName?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  attendanceDate?: string;
  attendance_date?: string;
  reminder_3days_sent?: boolean;
  reminder_1day_sent?: boolean;
  reminder_dayof_sent?: boolean;
  [key: string]: unknown;
}

const LOCAL_DATA_FILE = path.join(process.cwd(), 'data', 'registrations.json');

/**
 * Calculates days difference between target 'YYYY-MM-DD' and today in Africa/Dar_es_Salaam (UTC+3)
 */
function getDaysUntil(dateStr: string): number {
  const target = new Date(`${dateStr}T00:00:00+03:00`).getTime();
  const now = new Date();
  // Format current UTC time in Africa/Dar_es_Salaam
  const darNowStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Dar_es_Salaam',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  const today = new Date(`${darNowStr}T00:00:00+03:00`).getTime();
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = req.query.token as string;
  const isVercelCron = Boolean(req.headers['x-vercel-cron']);
  const expectedToken = process.env.ORGANISER_EXPORT_TOKEN || 'ABC_SHOWTELL_2026';

  // Authorization: must either be triggered by Vercel Cron or possess the organizer token
  if (!isVercelCron && (!token || token !== expectedToken)) {
    return res.status(401).json({
      ok: false,
      error: 'Unauthorized. Protected cron/reminder endpoint.',
    });
  }

  const dryRun = req.query.dryRun === 'true' || req.query.dry_run === 'true';
  const force = req.query.force === 'true';
  const targetEmail = (req.query.email as string)?.trim().toLowerCase();

  const results = {
    threeDaysSent: 0,
    oneDaySent: 0,
    dayOfSent: 0,
    processed: 0,
    dryRun,
  };

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  try {
    let records: RegistrationRecord[] = [];

    if (dbUrl) {
      const sql = neon(dbUrl);
      const rows = await sql`
        SELECT * FROM registrations;
      `;
      records = rows as RegistrationRecord[];
    } else {
      if (fs.existsSync(LOCAL_DATA_FILE)) {
        records = JSON.parse(fs.readFileSync(LOCAL_DATA_FILE, 'utf-8'));
      }
    }

    results.processed = records.length;

    for (const record of records) {
      const email = (record.email || '').trim();
      const name = record.fullName || record.full_name || 'Valued Guest';
      const dateSelected = record.attendanceDate || record.attendance_date || 'Monday, 2 November 2026';

      if (!email) continue;
      if (targetEmail && email.toLowerCase() !== targetEmail) continue;

      // Determine date targets:
      // Day 1: 2026-11-02
      // Day 2: 2026-11-03
      let primaryDate = '2026-11-02';
      if (dateSelected.includes('Tuesday') || dateSelected.includes('3 November')) {
        primaryDate = '2026-11-03';
      }

      const daysUntil = getDaysUntil(primaryDate);

      // 1. 3-Day Reminder (fires when daysUntil is 3, or if forced)
      if ((daysUntil === 3 || force) && !record.reminder_3days_sent) {
        if (!dryRun) {
          const emailData = buildReminder3DaysEmail({
            name,
            email,
            attendanceDate: dateSelected,
          });
          await sendEmail(email, emailData.subject, emailData.html, emailData.text);
          record.reminder_3days_sent = true;

          if (dbUrl) {
            const sql = neon(dbUrl);
            await sql`
              UPDATE registrations SET reminder_3days_sent = TRUE WHERE id = ${record.id};
            `;
          }
        }
        results.threeDaysSent++;
      }

      // 2. 1-Day Reminder (fires when daysUntil is 1, or if forced)
      if ((daysUntil === 1 || force) && !record.reminder_1day_sent) {
        if (!dryRun) {
          const emailData = buildReminder1DayEmail({
            name,
            email,
            attendanceDate: dateSelected,
          });
          await sendEmail(email, emailData.subject, emailData.html, emailData.text);
          record.reminder_1day_sent = true;

          if (dbUrl) {
            const sql = neon(dbUrl);
            await sql`
              UPDATE registrations SET reminder_1day_sent = TRUE WHERE id = ${record.id};
            `;
          }
        }
        results.oneDaySent++;
      }

      // 3. Day-Of Event Reminder (fires when daysUntil is 0, or if forced)
      if ((daysUntil === 0 || force) && !record.reminder_dayof_sent) {
        if (!dryRun) {
          const emailData = buildReminderDayOfEmail({
            name,
            email,
            attendanceDate: dateSelected,
          });
          await sendEmail(email, emailData.subject, emailData.html, emailData.text);
          record.reminder_dayof_sent = true;

          if (dbUrl) {
            const sql = neon(dbUrl);
            await sql`
              UPDATE registrations SET reminder_dayof_sent = TRUE WHERE id = ${record.id};
            `;
          }
        }
        results.dayOfSent++;
      }
    }

    // Save updated state back to local file if not using database
    if (!dbUrl && !dryRun && fs.existsSync(LOCAL_DATA_FILE)) {
      fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');
    }

    return res.status(200).json({
      ok: true,
      timestamp: new Date().toISOString(),
      summary: results,
    });
  } catch (err: unknown) {
    console.error('Reminder cron error:', err);
    return res.status(500).json({
      ok: false,
      error: 'Failed to process reminders',
    });
  }
}
