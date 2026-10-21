import fs from 'node:fs';
import path from 'node:path';

export interface EmailRecipient {
  name: string;
  email: string;
  attendanceDate: string;
  phone?: string;
}

export interface SendEmailOptions {
  idempotencyKey?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
}

export interface EmailDispatchResult {
  ok: boolean;
  provider: 'easymail' | 'log_fallback';
  statusCode?: number;
  messageId?: string;
  idempotentReplay?: boolean;
  simulated?: boolean;
  error?: string;
}

const VENUE_NAME = 'ABC Emporio — Dar es Salaam Showroom';
const VENUE_ADDRESS = 'Next to Vodacom Head Office, Bagamoyo Rd, Dar es Salaam';
const VENUE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=ABC+EMPORIO+-+Dar+Es+Salaam,+Next+to+vodacom+head+office,+Bagamoyo+Rd,+Dar+es+Salaam';
const CONCIERGE_PHONE = '+255 685 289 679';
const CONCIERGE_EMAIL = 'info@abctanzania.com';

function getEmailBaseStyles(): string {
  return `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #111111;
    background-color: #f7f5f0;
    margin: 0;
    padding: 0;
  `;
}

/** Luxury ABC Emporio HTML Email Wrapper */
function wrapHtmlEmail(title: string, eyebrow: string, contentHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="${getEmailBaseStyles()}">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f7f5f0; padding: 36px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e0d8; text-align: left;">
          
          <!-- Premium Charcoal Header -->
          <tr>
            <td style="background-color: #111111; padding: 36px 36px 32px 36px; text-align: center; border-bottom: 2px solid #242528;">
              <p style="margin: 0 0 10px 0; font-size: 11px; letter-spacing: 3px; color: #b89758; text-transform: uppercase; font-weight: 600;">
                ABC EMPORIO
              </p>
              <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px; color: #ffffff; text-transform: uppercase;">
                The Show &amp; Tell Experience
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 11px; letter-spacing: 2px; color: #a0a4a8; text-transform: uppercase;">
                ${eyebrow}
              </p>
            </td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Showroom & Logistics Information Box -->
          <tr>
            <td style="padding: 0 36px 36px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #faf8f5; border: 1px solid #ebe5dc; padding: 20px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 6px 0; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: #8a6d3b; text-transform: uppercase;">
                      VENUE &amp; SHOWROOM HOURS
                    </p>
                    <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #111111;">
                      ${VENUE_NAME}
                    </p>
                    <p style="margin: 0 0 12px 0; font-size: 13px; color: #555555; line-height: 1.5;">
                      ${VENUE_ADDRESS}
                      <br>
                      <em>Showroom closes at 5:30 pm</em>
                    </p>
                    <a href="${VENUE_MAPS_URL}" target="_blank" style="display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #111111; text-decoration: underline; text-transform: uppercase;">
                      Open in Google Maps &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #17181a; padding: 24px 36px; border-top: 1px solid #2a2c30; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #a0a4a8; line-height: 1.6;">
                Concierge Contact: <strong>${CONCIERGE_PHONE}</strong> &bull; <a href="mailto:${CONCIERGE_EMAIL}" style="color: #b89758; text-decoration: none;">${CONCIERGE_EMAIL}</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #666666;">
                &copy; ${new Date().getFullYear()} ABC Emporio Tanzania. Private showroom invitation.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/** 1. Registration Confirmation Email */
export function buildConfirmationEmail(recipient: EmailRecipient): { subject: string; html: string; text: string } {
  const subject = `Registration Confirmed: ABC Emporio Show & Tell Experience (${recipient.attendanceDate})`;

  const isDay2 = recipient.attendanceDate.includes('3 November') || recipient.attendanceDate.includes('Tuesday');
  const startIso = isDay2 ? '20261103T070000Z' : '20261102T070000Z';
  const endIso = isDay2 ? '20261103T140000Z' : '20261102T140000Z';
  const titleParam = encodeURIComponent('ABC Emporio — The Show & Tell Experience');
  const locationParam = encodeURIComponent('ABC Emporio Showroom, Bagamoyo Rd (Next to Vodacom Head Office), Dar es Salaam, Tanzania');
  const detailsParam = encodeURIComponent(
    `The Show & Tell Experience at ABC Emporio.\n\nDate: ${recipient.attendanceDate}\nHours: 10:00 AM – 5:00 PM\nVenue: ABC Emporio Showroom\nConcierge: +255 685 289 679\nWebsite: https://showandtell.abcemporio.com`
  );
  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleParam}&dates=${startIso}/${endIso}&details=${detailsParam}&location=${locationParam}`;

  const contentHtml = `
    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 400; color: #111111;">
      Dear ${recipient.name},
    </h2>
    <p style="margin: 0 0 16px 0; font-size: 15px; color: #333333; line-height: 1.7;">
      Thank you for registering for <strong>The Show &amp; Tell Experience</strong> at ABC Emporio. We are pleased to confirm your attendance.
    </p>

    <!-- Key Registration Details -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0; border-top: 1px solid #e5e0d8; border-bottom: 1px solid #e5e0d8;">
      <tr>
        <td style="padding: 12px 0; font-size: 13px; color: #777777; width: 40%;">CONFIRMED GUEST</td>
        <td style="padding: 12px 0; font-size: 14px; font-weight: 600; color: #111111;">${recipient.name}</td>
      </tr>
      <tr>
        <td style="padding: 12px 0; font-size: 13px; color: #777777; border-top: 1px solid #f0ede8;">ATTENDANCE DATE</td>
        <td style="padding: 12px 0; font-size: 14px; font-weight: 700; color: #b89758; border-top: 1px solid #f0ede8;">${recipient.attendanceDate}</td>
      </tr>
      <tr>
        <td style="padding: 12px 0; font-size: 13px; color: #777777; border-top: 1px solid #f0ede8;">HOURS</td>
        <td style="padding: 12px 0; font-size: 14px; color: #111111; border-top: 1px solid #f0ede8;">10:00 AM – 5:00 PM EAT</td>
      </tr>
      ${recipient.phone ? `
      <tr>
        <td style="padding: 12px 0; font-size: 13px; color: #777777; border-top: 1px solid #f0ede8;">PHONE / WHATSAPP</td>
        <td style="padding: 12px 0; font-size: 14px; color: #111111; border-top: 1px solid #f0ede8;">${recipient.phone}</td>
      </tr>` : ''}
    </table>

    <!-- 1-Click Add to Google Calendar Button -->
    <div style="margin: 28px 0 20px 0; text-align: center;">
      <a href="${googleCalUrl}" target="_blank" style="display: inline-block; background-color: #111111; color: #ffffff; border: 1px solid #b89758; padding: 13px 26px; text-decoration: none; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600; border-radius: 3px;">
        &#128197; Add to Google Calendar (10:00 AM – 5:00 PM)
      </a>
    </div>

    <p style="margin: 0 0 16px 0; font-size: 14px; color: #444444; line-height: 1.7;">
      Join us for a curated showcase dedicated to architectural surfaces, luxury sanitary ware, bespoke fixtures, and the craftsmanship that defines refined spaces.
    </p>
    <p style="margin: 0 0 8px 0; font-size: 13px; color: #666666; font-style: italic;">
      * You will also receive courtesy reminders 3 days and 1 day prior to the event.
    </p>
  `;

  const text = `
Dear ${recipient.name},

Thank you for registering for The Show & Tell Experience at ABC Emporio. We are pleased to confirm your attendance.

ATTENDANCE DATE: ${recipient.attendanceDate}
HOURS: 10:00 am – 5:00 pm
GUEST: ${recipient.name}
VENUE: ${VENUE_NAME}
ADDRESS: ${VENUE_ADDRESS}
ADD TO CALENDAR: ${googleCalUrl}
MAPS: ${VENUE_MAPS_URL}

We look forward to welcoming you.
Concierge Phone: ${CONCIERGE_PHONE}
  `.trim();

  return {
    subject,
    html: wrapHtmlEmail(subject, 'Registration Confirmation', contentHtml),
    text,
  };
}

/** 2. 3-Day Reminder Email */
export function buildReminder3DaysEmail(recipient: EmailRecipient): { subject: string; html: string; text: string } {
  const subject = `3 Days to Go: ABC Emporio Show & Tell Experience (${recipient.attendanceDate})`;

  const contentHtml = `
    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 400; color: #111111;">
      Dear ${recipient.name},
    </h2>
    <p style="margin: 0 0 16px 0; font-size: 15px; color: #333333; line-height: 1.7;">
      This is a friendly reminder that <strong>The Show &amp; Tell Experience</strong> at ABC Emporio is coming up in just <strong>3 days</strong>.
    </p>
    <div style="background-color: #fbf9f6; border-left: 3px solid #b89758; padding: 16px 20px; margin: 20px 0;">
      <p style="margin: 0 0 4px 0; font-size: 11px; letter-spacing: 1.5px; color: #8a6d3b; text-transform: uppercase; font-weight: 700;">YOUR SELECTED DATE</p>
      <p style="margin: 0; font-size: 16px; font-weight: 700; color: #111111;">${recipient.attendanceDate}</p>
    </div>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #444444; line-height: 1.7;">
      Our architectural team and curated product specialists are preparing selected materials, textures, and bespoke designs for your visit.
    </p>
    <p style="margin: 0; font-size: 13px; color: #666666;">
      We will send you a final reminder with directions the day before your visit.
    </p>
  `;

  const text = `
Dear ${recipient.name},

This is a reminder that The Show & Tell Experience at ABC Emporio is in 3 days.

YOUR SELECTED DATE: ${recipient.attendanceDate}
VENUE: ${VENUE_NAME}
ADDRESS: ${VENUE_ADDRESS}
SHOWROOM HOURS: Closes at 5:30 pm
MAPS: ${VENUE_MAPS_URL}

Concierge Phone: ${CONCIERGE_PHONE}
  `.trim();

  return {
    subject,
    html: wrapHtmlEmail(subject, '3-Day Courtesy Reminder', contentHtml),
    text,
  };
}

/** 3. 1-Day Reminder Email */
export function buildReminder1DayEmail(recipient: EmailRecipient): { subject: string; html: string; text: string } {
  const subject = `Tomorrow: ABC Emporio Show & Tell Experience (${recipient.attendanceDate})`;

  const contentHtml = `
    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 400; color: #111111;">
      Dear ${recipient.name},
    </h2>
    <p style="margin: 0 0 16px 0; font-size: 15px; color: #333333; line-height: 1.7;">
      We are delighted to welcome you <strong>tomorrow</strong> for <strong>The Show &amp; Tell Experience</strong> at ABC Emporio.
    </p>
    <div style="background-color: #fbf9f6; border-left: 3px solid #b89758; padding: 16px 20px; margin: 20px 0;">
      <p style="margin: 0 0 4px 0; font-size: 11px; letter-spacing: 1.5px; color: #8a6d3b; text-transform: uppercase; font-weight: 700;">YOUR ATTENDANCE DATE</p>
      <p style="margin: 0; font-size: 16px; font-weight: 700; color: #111111;">${recipient.attendanceDate}</p>
      <p style="margin: 6px 0 0 0; font-size: 13px; color: #555555;">Showroom closes at 5:30 pm</p>
    </div>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #444444; line-height: 1.7;">
      The showroom is located on Bagamoyo Road, directly next to the Vodacom Head Office. Dedicated visitor parking is available at the front entrance.
    </p>
    <p style="margin: 0 0 20px 0;">
      <a href="${VENUE_MAPS_URL}" target="_blank" style="display: inline-block; background-color: #111111; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">
        Get Directions on Google Maps &rarr;
      </a>
    </p>
  `;

  const text = `
Dear ${recipient.name},

We look forward to welcoming you tomorrow for The Show & Tell Experience at ABC Emporio.

DATE: ${recipient.attendanceDate}
VENUE: ${VENUE_NAME}
ADDRESS: ${VENUE_ADDRESS}
SHOWROOM HOURS: Closes at 5:30 pm
MAPS: ${VENUE_MAPS_URL}
CONCIERGE PHONE: ${CONCIERGE_PHONE}
  `.trim();

  return {
    subject,
    html: wrapHtmlEmail(subject, 'Tomorrow — Event Reminder', contentHtml),
    text,
  };
}

/** 4. Day-Of Event Reminder Email */
export function buildReminderDayOfEmail(recipient: EmailRecipient): { subject: string; html: string; text: string } {
  const subject = `Today: Welcome to ABC Emporio Show & Tell Experience`;

  const contentHtml = `
    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 400; color: #111111;">
      Dear ${recipient.name},
    </h2>
    <p style="margin: 0 0 16px 0; font-size: 15px; color: #333333; line-height: 1.7;">
      Today is the day! Our showroom doors are open, and our team is ready to welcome you to <strong>The Show &amp; Tell Experience</strong>.
    </p>
    <div style="background-color: #fbf9f6; border-left: 3px solid #b89758; padding: 16px 20px; margin: 20px 0;">
      <p style="margin: 0 0 4px 0; font-size: 11px; letter-spacing: 1.5px; color: #8a6d3b; text-transform: uppercase; font-weight: 700;">LOCATION</p>
      <p style="margin: 0; font-size: 15px; font-weight: 700; color: #111111;">${VENUE_ADDRESS}</p>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #666666;">Showroom closes at 5:30 pm</p>
    </div>
    <p style="margin: 0 0 20px 0;">
      <a href="${VENUE_MAPS_URL}" target="_blank" style="display: inline-block; background-color: #111111; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">
        Navigate to Showroom &rarr;
      </a>
    </p>
    <p style="margin: 0; font-size: 13px; color: #555555;">
      If you need any assistance upon arrival, please call our concierge at <strong>${CONCIERGE_PHONE}</strong>.
    </p>
  `;

  const text = `
Dear ${recipient.name},

Today is the day! We look forward to welcoming you to The Show & Tell Experience at ABC Emporio.

LOCATION: ${VENUE_ADDRESS}
SHOWROOM HOURS: 10:00 am – 5:00 pm
MAPS: ${VENUE_MAPS_URL}
CONCIERGE PHONE: ${CONCIERGE_PHONE}
  `.trim();

  return {
    subject,
    html: wrapHtmlEmail(subject, 'Welcome Today', contentHtml),
    text,
  };
}

/** EasyMail REST API Email Dispatcher */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string,
  options?: SendEmailOptions,
): Promise<EmailDispatchResult> {
  const easymailApiKey =
    process.env.EASYMAIL_API_KEY?.trim() ||
    'gms_jWcZHkUbJbrHEdLMqHllrtEbNjRuhIqrWNTqTdxhfBppBPLaCXkDXReCSInyMujz';
  const easymailApiUrl =
    process.env.EASYMAIL_API_URL?.trim() || 'https://easymail-nu.vercel.app/api/v1/emails';

  // 1. Primary: EasyMail REST API Dispatch
  if (easymailApiKey) {
    try {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${easymailApiKey}`,
        'Content-Type': 'application/json',
      };

      if (options?.idempotencyKey) {
        headers['Idempotency-Key'] = options.idempotencyKey;
      }

      // Payload conforms to EasyMail specification:
      // The sending identity is automatically determined by the EasyMail sender (ABC Emporio Events)
      const payload: Record<string, unknown> = {
        to,
        subject,
        html,
        text,
      };

      if (options?.replyTo) {
        payload.replyTo = options.replyTo;
      }
      if (options?.cc && options.cc.length > 0) {
        payload.cc = options.cc;
      }
      if (options?.bcc && options.bcc.length > 0) {
        payload.bcc = options.bcc;
      }

      const res = await fetch(easymailApiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      // 201 Created = new delivery accepted
      // 200 OK = idempotent replay
      if (res.status === 201 || res.status === 200) {
        const isReplay = res.status === 200;
        const messageId = (data?.id || data?.messageId || data?.data?.id || 'accepted') as string;
        console.log(
          `[EASYMAIL SUCCESS] Status: ${res.status} | To: ${to} | Idempotent: ${isReplay} | Message ID: ${messageId}`
        );
        return {
          ok: true,
          provider: 'easymail',
          statusCode: res.status,
          messageId,
          idempotentReplay: isReplay,
        };
      }

      const errMsg =
        data?.error?.message ||
        data?.message ||
        (typeof data?.error === 'string' ? data.error : null) ||
        `EasyMail rejected request with HTTP status ${res.status}`;
      console.warn(`[EASYMAIL REJECTED] Status: ${res.status} | Error: ${errMsg}`);
      return {
        ok: false,
        provider: 'easymail',
        statusCode: res.status,
        error: errMsg,
      };
    } catch (err: unknown) {
      const networkErr = err instanceof Error ? err.message : String(err);
      console.warn('[EASYMAIL NETWORK FAILURE]', networkErr);
      return {
        ok: false,
        provider: 'easymail',
        error: `Network failure connecting to EasyMail: ${networkErr}`,
      };
    }
  }

  // 2. Local fallback logging if EASYMAIL_API_KEY is not configured
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const logFile = path.join(dataDir, 'email_logs.json');
    const existing = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile, 'utf-8')) : [];
    const logEntry = {
      id: `email_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      to,
      subject,
      idempotencyKey: options?.idempotencyKey,
      timestamp: new Date().toISOString(),
      provider: 'easymail_simulated',
      note: 'EASYMAIL_API_KEY environment variable not configured. Email logged to local audit file.',
    };
    existing.push(logEntry);
    fs.writeFileSync(logFile, JSON.stringify(existing, null, 2), 'utf-8');
    console.log(`[EMAIL LOGGED LOCALLY] To: ${to} | Subject: "${subject}" | (Waiting for EASYMAIL_API_KEY)`);
  } catch (err) {
    console.warn('Failed to write email log fallback:', err);
  }

  return { ok: true, provider: 'log_fallback', simulated: true };
}
