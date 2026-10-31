/**
 * Calendar Reminder Utilities for ABC Emporio — The Show & Tell Experience
 * Event Hours: From 1:00 PM – 5:30 PM EAT (UTC+3)
 */

export interface CalendarEventDetails {
  title: string;
  startDateIso: string;
  endDateIso: string;
  startIsoOutlook: string;
  endIsoOutlook: string;
  location: string;
  details: string;
  isDay2: boolean;
  dateFormatted: string;
}

export type PlatformType = 'apple' | 'android' | 'windows' | 'other';

export function detectUserPlatform(): PlatformType {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'other';
  }

  const ua = navigator.userAgent || navigator.vendor || '';

  // Apple ecosystem (iPhone, iPad, iPod, Mac)
  if (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
    /Macintosh|Mac OS X/i.test(ua)
  ) {
    return 'apple';
  }

  // Android
  if (/android/i.test(ua)) {
    return 'android';
  }

  // Windows
  if (/Windows/i.test(ua)) {
    return 'windows';
  }

  return 'other';
}

export function getCalendarEventDetails(attendanceDate: string): CalendarEventDetails {
  const isDay2 = attendanceDate.includes('19 November') || attendanceDate.includes('Thursday');
  
  // 1:00 PM EAT is 10:00 UTC | 5:30 PM EAT is 14:30 UTC
  const startDateIso = isDay2 ? '20261119T100000Z' : '20261118T100000Z';
  const endDateIso = isDay2 ? '20261119T143000Z' : '20261118T143000Z';

  // Outlook format: YYYY-MM-DDTHH:mm:ss+03:00
  const startIsoOutlook = isDay2 ? '2026-11-19T13:00:00+03:00' : '2026-11-18T13:00:00+03:00';
  const endIsoOutlook = isDay2 ? '2026-11-19T17:30:00+03:00' : '2026-11-18T17:30:00+03:00';

  const dateFormatted = isDay2 ? 'Thursday, 19 November 2026' : 'Wednesday, 18 November 2026';

  const title = 'ABC Emporio — The Show & Tell Experience';
  const location = 'ABC Emporio Showroom, Bagamoyo Rd (Next to Vodacom Head Office), Dar es Salaam, Tanzania';
  const details = [
    'You are registered for The Show & Tell Experience at ABC Emporio.',
    '',
    `Date: ${dateFormatted}`,
    'Time: From 1:00 PM (Showroom closes 5:30 PM)',
    'Venue: ABC Emporio Showroom',
    'Address: Bagamoyo Rd (Next to Vodacom Head Office), Dar es Salaam',
    'Concierge Desk: +255 685 289 679 / info@abctanzania.com',
    'Google Maps: https://www.google.com/maps/search/?api=1&query=ABC+EMPORIO+-+Dar+Es+Salaam,+Next+to+vodacom+head+office,+Bagamoyo+Rd,+Dar+es+Salaam',
    'Website: https://showandtell.abcemporio.com'
  ].join('\n');

  return {
    title,
    startDateIso,
    endDateIso,
    startIsoOutlook,
    endIsoOutlook,
    location,
    details,
    isDay2,
    dateFormatted,
  };
}

/** Generate 1-Click Google Calendar URL */
export function generateGoogleCalendarUrl(attendanceDate: string): string {
  const event = getCalendarEventDetails(attendanceDate);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${event.startDateIso}/${event.endDateIso}`,
    details: event.details,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Generate 1-Click Outlook Web / Office 365 Calendar URL */
export function generateOutlookCalendarUrl(attendanceDate: string): string {
  const event = getCalendarEventDetails(attendanceDate);
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: event.startIsoOutlook,
    enddt: event.endIsoOutlook,
    body: event.details,
    location: event.location,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/** Generate standard iCalendar (.ics) content (Apple Calendar, Outlook desktop, Android) */
export function generateIcsContent(attendanceDate: string): string {
  const event = getCalendarEventDetails(attendanceDate);
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const cleanDescription = event.details.replace(/\n/g, '\\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ABC Emporio//Show and Tell Experience//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:abc-showtell-${event.isDay2 ? '20261119' : '20261118'}-${Date.now()}@abcemporio.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${event.startDateIso}`,
    `DTEND:${event.endDateIso}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${cleanDescription}`,
    `LOCATION:${event.location}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: ABC Emporio Show & Tell Experience tomorrow',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:ABC Emporio Show & Tell Experience starts in 2 hours',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/** Triggers download of .ics calendar file for Apple Calendar & native devices */
export function downloadIcsFile(attendanceDate: string): void {
  const event = getCalendarEventDetails(attendanceDate);
  const ics = generateIcsContent(attendanceDate);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const filename = event.isDay2 ? 'abc-emporio-showtell-19nov.ics' : 'abc-emporio-showtell-18nov.ics';

  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
}
