/**
 * Date / time helpers. All event times are interpreted in the configured IANA time zone,
 * independent of the visitor's device time zone. No third-party date library is required.
 */
import type { EventConfig } from '../config/event';

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

interface Parts { y: number; mo: number; d: number; h: number; mi: number }

function parse(date: string, time: string): Parts | null {
  const dm = DATE_RE.exec(date);
  const tm = TIME_RE.exec(time);
  if (!dm || !tm) return null;
  return { y: Number(dm[1]), mo: Number(dm[2]), d: Number(dm[3]), h: Number(tm[1]), mi: Number(tm[2]) };
}

export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat('en-GB', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** Offset (ms) between UTC and the wall-clock time in `tz` at the given UTC instant. */
function tzOffset(utcMs: number, tz: string): number {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const p: Record<string, number> = {};
  for (const part of fmt.formatToParts(new Date(utcMs))) {
    if (part.type !== 'literal') p[part.type] = Number(part.value);
  }
  const asUtc = Date.UTC(p.year ?? 0, (p.month ?? 1) - 1, p.day ?? 1, p.hour ?? 0, p.minute ?? 0, p.second ?? 0);
  return asUtc - utcMs;
}

/** Converts a wall-clock date + time in `tz` to an absolute Date. */
export function zonedTimeToUtc(date: string, time: string, tz: string): Date | null {
  const p = parse(date, time);
  if (!p || !isValidTimeZone(tz)) return null;
  const guess = Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi);
  const first = tzOffset(guess, tz);
  let utc = guess - first;
  const second = tzOffset(utc, tz);
  if (second !== first) utc = guess - second;
  return new Date(utc);
}

export interface Schedule {
  start: Date;
  /** Null when no end time has been confirmed. */
  end: Date | null;
  timeZone: string;
}

/** Returns a schedule only when date, start time and a valid time zone are all confirmed. */
export function getSchedule(cfg: EventConfig): Schedule | null {
  if (!cfg.eventDate || !cfg.startTime || !cfg.timeZone) return null;
  const start = zonedTimeToUtc(cfg.eventDate, cfg.startTime, cfg.timeZone);
  if (!start) return null;
  let end: Date | null = null;
  const endDate = cfg.eventEndDate || cfg.eventDate;
  if (cfg.endTime) {
    end = zonedTimeToUtc(endDate, cfg.endTime, cfg.timeZone);
    // An end time earlier than the start is treated as finishing after midnight.
    if (end && end <= start) end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
  }
  return { start, end, timeZone: cfg.timeZone };
}

/** Formats the date in the event's own time zone, e.g. "Monday, 2 & Tuesday, 3 November 2026". */
export function formatEventDate(cfg: EventConfig): string | null {
  if (cfg.eventDatesDisplay) return cfg.eventDatesDisplay;
  if (!cfg.eventDate) return null;
  const tz = cfg.timeZone && isValidTimeZone(cfg.timeZone) ? cfg.timeZone : 'UTC';
  const noon = cfg.timeZone ? zonedTimeToUtc(cfg.eventDate, '12:00', tz) : null;
  const p = parse(cfg.eventDate, '12:00');
  if (!p) return null;
  const instant = noon ?? new Date(Date.UTC(p.y, p.mo - 1, p.d, 12));
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: tz,
  }).format(instant);
}

/** e.g. "6:30 pm – 9:00 pm IST". Requires a confirmed schedule. */
export function formatEventTime(schedule: Schedule): string {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric', minute: '2-digit', hour12: true, timeZone: schedule.timeZone,
  });
  const zone = new Intl.DateTimeFormat('en-GB', { timeZone: schedule.timeZone, timeZoneName: 'short' })
    .formatToParts(schedule.start)
    .find((p) => p.type === 'timeZoneName')?.value ?? schedule.timeZone;
  const range = schedule.end ? `${fmt.format(schedule.start)} – ${fmt.format(schedule.end)}` : `From ${fmt.format(schedule.start)}`;
  return `${range} ${zone}`;
}

/** Registration deadline as an absolute Date, interpreted in the event time zone. */
export function getDeadline(cfg: EventConfig): Date | null {
  if (!cfg.registrationDeadline || !cfg.timeZone) return null;
  const [date, time] = cfg.registrationDeadline.split('T');
  if (!date || !time) return null;
  return zonedTimeToUtc(date, time, cfg.timeZone);
}

export function formatDeadline(cfg: EventConfig): string | null {
  const deadline = getDeadline(cfg);
  if (!deadline || !cfg.timeZone) return null;
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: cfg.timeZone,
  }).format(deadline);
}

export type RegistrationState = 'open' | 'closed';

export function getRegistrationState(cfg: EventConfig, now: Date = new Date()): RegistrationState {
  if (!cfg.registrationOpen) return 'closed';
  const deadline = getDeadline(cfg);
  if (deadline && now > deadline) return 'closed';
  const schedule = getSchedule(cfg);
  if (schedule && now > (schedule.end ?? schedule.start)) return 'closed';
  return 'open';
}
