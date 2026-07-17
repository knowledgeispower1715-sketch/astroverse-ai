export function getZodiacElement(sign: string): string {
  const elements: Record<string, string> = {
    Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
    Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
    Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
    Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water',
  };
  return elements[sign] || 'Unknown';
}

export function getZodiacModality(sign: string): string {
  const modalities: Record<string, string> = {
    Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
    Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
    Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable',
  };
  return modalities[sign] || 'Unknown';
}

export function getZodiacRuler(sign: string): string {
  const rulers: Record<string, string> = {
    Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
    Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Pluto',
    Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Uranus', Pisces: 'Neptune',
  };
  return rulers[sign] || 'Unknown';
}

export function getZodiacSymbol(sign: string): string {
  const symbols: Record<string, string> = {
    Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
    Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
    Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
  };
  return symbols[sign] || '?';
}

export function getZodiacCompatibility(sign1: string, sign2: string): number {
  const element1 = getZodiacElement(sign1);
  const element2 = getZodiacElement(sign2);

  if (element1 === element2) return 90;

  const compatible: Record<string, string[]> = {
    Fire: ['Air'], Air: ['Fire'], Earth: ['Water'], Water: ['Earth'],
  };

  if (compatible[element1]?.includes(element2)) return 75;
  return 50;
}
