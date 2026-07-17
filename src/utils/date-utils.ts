export function getCurrentZodiacSeason(): string {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
}

export function getMoonPhase(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let c = 0;
  let y = year;
  let m = month;

  if (m < 3) { y--; m += 12; }
  ++m;
  c = Math.floor(365.25 * y);
  const e = Math.floor(30.6 * m);
  const jd = c + e + day - 694039.09;
  const phase = jd / 29.5305882;
  const dayOfCycle = (phase - Math.floor(phase)) * 29.5305882;

  if (dayOfCycle < 1.84566) return 'New Moon';
  if (dayOfCycle < 5.53699) return 'Waxing Crescent';
  if (dayOfCycle < 9.22831) return 'First Quarter';
  if (dayOfCycle < 12.91963) return 'Waxing Gibbous';
  if (dayOfCycle < 16.61096) return 'Full Moon';
  if (dayOfCycle < 20.30228) return 'Waning Gibbous';
  if (dayOfCycle < 23.99361) return 'Last Quarter';
  if (dayOfCycle < 27.68493) return 'Waning Crescent';
  return 'New Moon';
}

export function getNextNewMoon(from: Date = new Date()): Date {
  const lunarCycle = 29.5305882;
  const knownNewMoon = new Date('2024-01-11T11:57:00Z');
  const diff = from.getTime() - knownNewMoon.getTime();
  const daysDiff = diff / (1000 * 60 * 60 * 24);
  const cyclesPassed = Math.ceil(daysDiff / lunarCycle);
  const nextNew = new Date(knownNewMoon.getTime() + cyclesPassed * lunarCycle * 24 * 60 * 60 * 1000);
  return nextNew;
}
