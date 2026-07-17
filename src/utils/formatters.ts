export function formatDate(date: Date, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatTime(date: Date, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatDegree(degree: number, minute: number): string {
  return `${Math.floor(degree)}°${String(minute).padStart(2, '0')}'`;
}

export function formatZodiacPosition(degree: number, sign: string): string {
  const normalizedDegree = degree % 30;
  const minutes = Math.round((normalizedDegree % 1) * 60);
  return `${Math.floor(normalizedDegree)}°${String(minutes).padStart(2, '0')}' ${sign}`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
