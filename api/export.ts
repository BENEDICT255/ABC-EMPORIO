import type { IncomingMessage, ServerResponse } from 'node:http';
import { neon } from '@neondatabase/serverless';
import fs from 'node:fs';
import path from 'node:path';

interface ExtendedRequest extends IncomingMessage {
  query?: Record<string, string>;
  url?: string;
}

interface ExtendedResponse extends ServerResponse {
  status: (code: number) => ExtendedResponse;
  json: (data: unknown) => void;
  send: (body: string) => void;
}

const LOCAL_DATA_FILE = path.join(process.cwd(), 'data', 'registrations.json');

export default async function handler(req: ExtendedRequest, res: ExtendedResponse) {
  const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const token = url.searchParams.get('token') || (req.headers['x-organiser-token'] as string);
  const format = url.searchParams.get('format') || 'json';

  const expectedToken = process.env.ORGANISER_EXPORT_TOKEN || 'ABC_SHOWTELL_2026';

  // Secure token requirement (Section 11.6: No guest list should be available through an unauthenticated public API)
  if (!token || token !== expectedToken) {
    return res.status(401).json({
      ok: false,
      error: 'Unauthorized. Please provide valid organiser access credentials.',
    });
  }

  try {
    let records: Array<Record<string, unknown>> = [];
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

    if (dbUrl) {
      const sql = neon(dbUrl);
      const rows = await sql`
        SELECT id, full_name, attendance_date, profession, profession_other, company, phone, email, event_key, created_at
        FROM registrations
        ORDER BY created_at DESC;
      `;
      records = rows as Array<Record<string, unknown>>;
    } else {
      if (fs.existsSync(LOCAL_DATA_FILE)) {
        records = JSON.parse(fs.readFileSync(LOCAL_DATA_FILE, 'utf-8'));
      }
    }

    if (format === 'csv') {
      const header = 'ID,Full Name,Attendance Date,Profession,Discipline,Company,Phone,Email,Created At\n';
      const rows = records.map((r) => {
        const clean = (val: unknown) => `"${String(val || '').replace(/"/g, '""')}"`;
        return [
          clean(r.id),
          clean(r.full_name || r.fullName),
          clean(r.attendance_date || r.attendanceDate),
          clean(r.profession),
          clean(r.profession_other || r.professionOther),
          clean(r.company),
          clean(r.phone),
          clean(r.email),
          clean(r.created_at || r.createdAt),
        ].join(',');
      }).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="abc-showtell-registrations.csv"');
      return res.status(200).send(header + rows);
    }

    return res.status(200).json({
      ok: true,
      total: records.length,
      registrations: records,
    });
  } catch (err: unknown) {
    console.error('Export error:', err);
    return res.status(500).json({ ok: false, error: 'Failed to retrieve registrations' });
  }
}
