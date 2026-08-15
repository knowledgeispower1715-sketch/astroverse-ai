import { TimezoneInfo } from "./types";

/**
 * Derives exact timezone offset (in decimal hours) for a given IANA timezone ID on a specific date.
 * Uses native Intl.DateTimeFormat with historical offset awareness.
 */
export function getTimezoneOffsetHours(ianaTimezone: string, date: Date = new Date()): number {
  try {
    const utcDate = new Date(date.toISOString());
    const invDate = new Date(
      utcDate.toLocaleString("en-US", { timeZone: ianaTimezone })
    );
    const diffMs = invDate.getTime() - utcDate.getTime();
    return diffMs / (1000 * 60 * 60);
  } catch {
    // Fallback if timezone ID is unknown or invalid:
    return 0;
  }
}

/**
 * Returns detailed timezone information including DST status and formatted offset string.
 */
export function getDetailedTimezoneInfo(ianaTimezone: string, date: Date = new Date()): TimezoneInfo {
  const totalOffsetHours = getTimezoneOffsetHours(ianaTimezone, date);
  
  // Test winter vs summer date to determine if location observes DST
  const janOffset = getTimezoneOffsetHours(ianaTimezone, new Date(date.getFullYear(), 0, 1));
  const julOffset = getTimezoneOffsetHours(ianaTimezone, new Date(date.getFullYear(), 6, 1));
  const rawOffsetHours = Math.min(janOffset, julOffset);
  const isDST = totalOffsetHours !== rawOffsetHours;
  const dstOffsetHours = isDST ? totalOffsetHours - rawOffsetHours : 0;

  // Format abbreviation (e.g. "GMT+5:30", "EST", "EDT")
  const sign = totalOffsetHours >= 0 ? "+" : "-";
  const absHours = Math.floor(Math.abs(totalOffsetHours));
  const minutes = Math.round((Math.abs(totalOffsetHours) - absHours) * 60);
  const abbreviation = `UTC${sign}${String(absHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

  return {
    timezoneId: ianaTimezone,
    rawOffsetHours,
    dstOffsetHours,
    totalOffsetHours,
    abbreviation,
    isDST,
  };
}

/**
 * Converts local birth date and time into UTC Date using the resolved IANA timezone.
 */
export function localBirthTimeToUTC(
  dateStr: string, // YYYY-MM-DD
  timeStr: string, // HH:MM or HH:MM:SS
  ianaTimezone: string
): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes, seconds = 0] = timeStr.split(":").map(Number);

  // Approximate baseline
  const localTarget = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
  const offsetHours = getTimezoneOffsetHours(ianaTimezone, localTarget);

  // UTC = Local time - Offset
  return new Date(localTarget.getTime() - offsetHours * 3600 * 1000);
}
