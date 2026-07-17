import type { Aspect, CelestialPosition } from '@/types/astrology';

const ASPECT_DEFINITIONS = [
  { type: 'conjunction' as const, angle: 0, orb: 8 },
  { type: 'opposition' as const, angle: 180, orb: 8 },
  { type: 'trine' as const, angle: 120, orb: 8 },
  { type: 'square' as const, angle: 90, orb: 7 },
  { type: 'sextile' as const, angle: 60, orb: 6 },
];

export function calculateAspects(positions: CelestialPosition[]): Aspect[] {
  const aspects: Aspect[] = [];

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const pos1 = positions[i];
      const pos2 = positions[j];
      const long1 = getAbsoluteLongitude(pos1);
      const long2 = getAbsoluteLongitude(pos2);
      let diff = Math.abs(long1 - long2);
      if (diff > 180) diff = 360 - diff;

      for (const aspectDef of ASPECT_DEFINITIONS) {
        const orb = Math.abs(diff - aspectDef.angle);
        if (orb <= aspectDef.orb) {
          aspects.push({
            planet1: pos1.planet,
            planet2: pos2.planet,
            type: aspectDef.type,
            orb: parseFloat(orb.toFixed(2)),
            applying: long1 < long2,
          });
          break;
        }
      }
    }
  }

  return aspects;
}

function getAbsoluteLongitude(position: CelestialPosition): number {
  const signOrder = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const signIndex = signOrder.indexOf(position.sign);
  return signIndex * 30 + position.degree + position.minute / 60;
}
