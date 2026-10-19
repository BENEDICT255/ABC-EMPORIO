/**
 * RSVP REGISTRATION — Client validation, normalization, and Vercel API submission.
 */

export const RSVP_FORM_NAME = 'show-and-tell-rsvp';
export const HONEYPOT_FIELD = 'botcheck';
export const WEB3FORMS_ACCESS_KEY = '00edc9f4-11cf-4ae3-aa71-c2b7919eb85c';
export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export const PROFESSIONS = ['Architect', 'Engineer', 'Other'] as const;
export type Profession = (typeof PROFESSIONS)[number] | 'Architects' | 'Engineers' | 'Others';

export interface RsvpInput {
  fullName: string;
  profession: Profession | '';
  professionOther: string;
  company: string;
  phone: string;
  email: string;
}

export type EditableField = keyof RsvpInput;
export type FieldErrors = Partial<Record<EditableField, string>>;

export const LIMITS = {
  fullName: 100,
  professionOther: 80,
  company: 120,
  phone: 24,
  email: 254,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS_RE = /^\+?[0-9 ()\-.]+$/;

/** Normalises a phone number: trims, converts local Tanzanian (07/06) to +255, collapses whitespace. */
export function normalisePhone(raw: string): string {
  let v = raw.trim().replace(/\s+/g, ' ');
  if (v.startsWith('00')) {
    v = '+' + v.slice(2).trimStart();
  } else if (/^0[67]\d/.test(v.replace(/\s+/g, ''))) {
    const digits = v.replace(/\D/g, '');
    if (digits.length === 10) {
      v = '+255 ' + digits.slice(1, 4) + ' ' + digits.slice(4, 7) + ' ' + digits.slice(7);
    }
  }
  return v;
}

export function validateRsvp(input: RsvpInput): FieldErrors {
  const errors: FieldErrors = {};
  const name = input.fullName.trim();
  if (!name) {
    errors.fullName = 'Please enter your full name.';
  } else if (name.length < 2 || !/\p{L}/u.test(name)) {
    errors.fullName = 'Please enter a valid name.';
  } else if (name.length > LIMITS.fullName) {
    errors.fullName = `Please keep your name under ${LIMITS.fullName} characters.`;
  }

  if (!input.profession) {
    errors.profession = 'Please select your profession.';
  }
  if (input.professionOther.trim().length > LIMITS.professionOther) {
    errors.professionOther = `Please keep this under ${LIMITS.professionOther} characters.`;
  }

  if (input.company.trim().length > LIMITS.company) {
    errors.company = `Please keep this under ${LIMITS.company} characters.`;
  }

  const phone = normalisePhone(input.phone);
  const digits = phone.replace(/\D/g, '');
  if (!phone) {
    errors.phone = 'Please enter your phone or WhatsApp number.';
  } else if (!PHONE_CHARS_RE.test(phone)) {
    errors.phone = 'Please include your country code, starting with + (for example +255 791 261 881).';
  } else if (digits.length < 8 || digits.length > 16) {
    errors.phone = 'Please check the number — it should include the country code and be 8–15 digits long.';
  }

  const email = input.email.trim();
  if (email && (email.length > LIMITS.email || !EMAIL_RE.test(email))) {
    errors.email = 'Please enter a valid email address, or leave this field empty.';
  }

  return errors;
}

function safeText(value: string): string {
  const v = value.trim();
  return /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
}

export function createSubmissionId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export type SubmitResult =
  | { ok: true }
  | { ok: false; reason: 'network' | 'provider'; message?: string };

export async function submitRsvp(
  input: RsvpInput,
  meta: { eventName: string; submissionId: string; honeypot: string },
): Promise<SubmitResult> {
  const isOther = input.profession === 'Other' || input.profession === 'Others';
  const professionDisplay = isOther && input.professionOther.trim()
    ? `Other (${safeText(input.professionOther)})`
    : input.profession;

  const payload: Record<string, string> = {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: 'New RSVP - ABC Emporio Show & Tell Experience',
    from_name: 'ABC Emporio RSVP',
    name: safeText(input.fullName),
    profession: professionDisplay,
    phone: normalisePhone(input.phone),
    event: meta.eventName || 'ABC Emporio Show & Tell Experience',
  };

  if (input.company.trim()) {
    payload.company = safeText(input.company);
  }

  if (input.email.trim()) {
    payload.email = input.email.trim();
  }

  if (meta.honeypot) {
    payload.botcheck = meta.honeypot;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => null);

    if (res.ok && data && data.success === true) {
      return { ok: true };
    }

    return {
      ok: false,
      reason: 'provider',
      message: data?.message || "We couldn't complete your registration. Please check your connection and try again.",
    };
  } catch (err: unknown) {
    console.warn('Web3Forms submission failed:', err);
    return {
      ok: false,
      reason: 'network',
      message: "We couldn't complete your registration. Please check your connection and try again.",
    };
  } finally {
    clearTimeout(timeout);
  }
}

/* — Same-device duplicate guard (session only) — */
const SESSION_KEY = 'abc-showtell-submitted';

function fingerprint(input: RsvpInput): string {
  return `${input.fullName.trim().toLowerCase().replace(/\s+/g, ' ')}|${normalisePhone(input.phone).replace(/\D/g, '')}`;
}

function readSession(): string[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function wasSubmittedThisSession(input: RsvpInput): boolean {
  return readSession().includes(fingerprint(input));
}

export function rememberSubmission(input: RsvpInput): void {
  try {
    const list = readSession();
    list.push(fingerprint(input));
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(list.slice(-20)));
  } catch {
    // sessionStorage unavailable
  }
}
