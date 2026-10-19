/**
 * Calendar helpers. Calendar actions are only offered once the date, start time, time zone
 * and a verified venue address are all confirmed — otherwise nothing is generated.
 */
import type { EventConfig } from '../config/event';
import { getSchedule, type Schedule } from './schedule';

export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  schedule: Schedule;
}

export function getCalendarEvent(cfg: EventConfig, pageUrl: string): CalendarEvent | null {
  const schedule = getSchedule(cfg);
  if (!schedule || !cfg.venueVerified || !cfg.venueAddress) return null;
  const location = cfg.venueName ? `${cfg.venueName}, ${cfg.venueAddress}` : cfg.venueAddress;
  return {
    title: `ABC Emporio — ${cfg.eventName}`,
    description: `${cfg.eventDescription}\n\nEvent details: ${pageUrl}`,
    location,
    schedule,
  };
}

/** UTC timestamp in iCalendar basic format, e.g. 20261114T130000Z */
function icsStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** RFC 5545 text escaping + 75-octet line folding (approximated by characters). */
function icsText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

function fold(line: string): string {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    out.push(rest.slice(0, 74));
    rest = ' ' + rest.slice(74);
  }
  out.push(rest);
  return out.join('\r\n');
}

export function buildIcs(ev: CalendarEvent, uidHost: string): string {
  const { start, end } = ev.schedule;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ABC Emporio//Show and Tell Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:show-and-tell-${icsStamp(start)}@${uidHost}`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(start)}`,
    ...(end ? [`DTEND:${icsStamp(end)}`] : []),
    `SUMMARY:${icsText(ev.title)}`,
    `DESCRIPTION:${icsText(ev.description)}`,
    `LOCATION:${icsText(ev.location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}

export function googleCalendarUrl(ev: CalendarEvent): string {
  const { start, end } = ev.schedule;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: ev.title,
    dates: `${icsStamp(start)}/${icsStamp(end ?? start)}`,
    details: ev.description,
    location: ev.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcs(ev: CalendarEvent, uidHost: string): void {
  const blob = new Blob([buildIcs(ev, uidHost)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'abc-emporio-show-and-tell.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
