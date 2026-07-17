export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidBirthDate(date: Date): boolean {
  const now = new Date();
  const minDate = new Date('1900-01-01');
  return date >= minDate && date <= now;
}

export function isValidBirthTime(time: string): boolean {
  const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
  return timeRegex.test(time);
}

export function isValidCoordinate(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}
