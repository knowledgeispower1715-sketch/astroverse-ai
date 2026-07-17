import type { HoroscopeReading } from '@/types/astrology';

export function generateDailyHoroscope(sign: string, date: Date): HoroscopeReading {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const signSeed = sign.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const combined = seed + signSeed;

  return {
    id: `daily-${sign}-${date.toISOString().slice(0, 10)}`,
    sign,
    period: 'daily',
    date,
    content: getDailyContent(sign, combined),
    mood: getMood(combined),
    luckyNumber: (combined % 99) + 1,
    luckyColor: getLuckyColor(combined),
    compatibility: getCompatibilitySign(sign, combined),
    rating: (combined % 5) + 1,
  };
}

function getDailyContent(sign: string, _seed: number): string {
  return `The cosmic energies today align beautifully for ${sign}. Focus on your inner growth and trust the journey the stars have laid out for you.`;
}

function getMood(seed: number): string {
  const moods = ['Inspired', 'Reflective', 'Energetic', 'Peaceful', 'Adventurous', 'Creative', 'Focused'];
  return moods[seed % moods.length];
}

function getLuckyColor(seed: number): string {
  const colors = ['Gold', 'Amethyst', 'Emerald', 'Sapphire', 'Ruby', 'Silver', 'Rose'];
  return colors[seed % colors.length];
}

function getCompatibilitySign(sign: string, seed: number): string {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const filtered = signs.filter((s) => s !== sign);
  return filtered[seed % filtered.length];
}
