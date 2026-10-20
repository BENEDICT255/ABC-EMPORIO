/**
 * EVENT CONFIGURATION — the single source of truth for event facts.
 *
 * Every visible date, time, venue, RSVP state and share-preview value is derived from this file.
 * Use `null` for anything that is not yet confirmed: the page will show a public-safe
 * "To be announced" state and will hide directions / calendar actions automatically.
 *
 * Formats
 *   eventDate              'YYYY-MM-DD'                e.g. '2026-11-14'
 *   startTime / endTime    'HH:mm' (24-hour, local)   e.g. '18:30'
 *   timeZone               IANA zone name             e.g. 'Asia/Kolkata'
 *   registrationDeadline   'YYYY-MM-DDTHH:mm' interpreted in `timeZone`
 */

export type AttendanceConfirmation =
  /** Guests submit a request; the organiser confirms attendance separately. */
  | 'request'
  /** Every registration is accepted automatically. */
  | 'confirmed';

export interface OrganiserContact {
  /** Public phone / WhatsApp number in international format, e.g. '+91 …'. */
  phone: string | null;
  email: string | null;
}

export interface EventConfig {
  /** Working copy — requires customer approval (see `launchApproved`). */
  eyebrow: string;
  eventName: string;
  eventSubtitle: string;
  eventDescription: string;

  eventDate: string | null;
  eventEndDate?: string | null;
  eventDates?: string[];
  eventDatesDisplay?: string;
  attendanceOptions?: readonly string[];
  startTime: string | null;
  endTime: string | null;
  timeZone: string | null;

  /** Hosting branch / showroom name exactly as it should appear publicly. */
  venueName: string | null;
  venueAddress: string | null;
  /** Set to true only once the address and map link have been checked against the real showroom. */
  venueVerified: boolean;
  /** Verified Google Maps (or equivalent) URL for the exact showroom. */
  mapsUrl: string | null;

  organiserName: string | null;
  organiserContact: OrganiserContact;

  registrationOpen: boolean;
  registrationDeadline: string | null;
  /** Confirmed maximum number of guests. Shown as information only — never as a countdown. */
  eventCapacity: number | null;
  attendanceConfirmation: AttendanceConfirmation;

  /** Enables the "Connect with the team" highlight. Only set true once team presence is confirmed. */
  teamPresenceConfirmed: boolean;
  /** Confirmed product ranges or brands to be showcased. Leave empty until confirmed. */
  featuredProducts: string[];

  /** Absolute production URL, e.g. 'https://showandtell.abcemporio.com'. On Netlify the build
   *  falls back to the site's own URL automatically when this is null. */
  siteUrl: string | null;

  /** Set to true only after the customer has approved the copy, branding and event facts.
   *  While false, a slim "preview" notice is shown at the top of the page. */
  launchApproved: boolean;
}

export const eventConfig: EventConfig = {
  eyebrow: 'A Special Invitation',
  eventName: 'The Show & Tell Experience',
  eventSubtitle: '',
  eventDescription:
    'Join ABC Emporio for a closer look at the materials and details that bring exceptional spaces to life. Explore selected products, appreciate their textures and finishes, and discover possibilities for your next project.',

  // — Confirmed Event Details —
  eventDate: '2026-11-02',
  eventEndDate: '2026-11-03',
  eventDates: ['2026-11-02', '2026-11-03'],
  eventDatesDisplay: '2 & 3 November 2026 (Monday & Tuesday)',
  attendanceOptions: [
    'Monday, 2 November 2026',
    'Tuesday, 3 November 2026',
    'Both Days (2 & 3 November 2026)',
  ],
  startTime: null,
  endTime: null,
  timeZone: 'Africa/Dar_es_Salaam',

  venueName: 'ABC Emporio — Dar es Salaam',
  venueAddress: 'Next to Vodacom Head Office, Bagamoyo Rd, Dar es Salaam',
  venueVerified: true,
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=ABC+EMPORIO+-+Dar+Es+Salaam,+Next+to+vodacom+head+office,+Bagamoyo+Rd,+Dar+es+Salaam',

  organiserName: 'ABC Emporio',
  organiserContact: { phone: '+255 791 261 881', email: 'info@abctanzania.com' },

  registrationOpen: true,
  registrationDeadline: null,
  eventCapacity: null,
  attendanceConfirmation: 'request',

  teamPresenceConfirmed: true,
  featuredProducts: ['Tiles', 'Sanitary Ware', 'Bathroom Fittings', 'Surfaces'],

  siteUrl: null,
  launchApproved: true,
};

/** Share-preview and document metadata. */
export const metaConfig = {
  title: 'ABC Emporio | Show & Tell Experience',
  description:
    'Join ABC Emporio for a closer look at the materials and details that bring exceptional spaces to life. Explore selected products, appreciate their textures and finishes, and discover possibilities for your next project.',
  ogImage: '/og-image.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'ABC Emporio — The Show & Tell Experience invitation',
  themeColor: '#0b0b0b',
} as const;
