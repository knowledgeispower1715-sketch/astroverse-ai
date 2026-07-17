import type { AstrologyProvider, ChartCalculationInput, ChartCalculationResult } from '../types';
import { calculatePlanetaryPositions, dateToJulianDay } from '../calculations/planet-positions';
import { calculateHouseCusps } from '../calculations/house-systems';
import { calculateAspects } from '../calculations/aspects';

export class WesternAstrologyProvider implements AstrologyProvider {
  readonly id = 'western' as const;
  readonly name = 'Western Tropical';

  async calculateChart(input: ChartCalculationInput): Promise<ChartCalculationResult> {
    const jd = dateToJulianDay(input.birthDate);
    
    // 1. Calculate high precision planetary positions (tropical)
    const positions = await calculatePlanetaryPositions(
      jd,
      input.latitude,
      input.longitude,
      false // Western Tropical (no ayanamsa)
    );

    // 2. Calculate house cusps
    const houseData = await calculateHouseCusps(
      jd,
      input.latitude,
      input.longitude,
      input.houseSystem
    );

    // 3. Assign correct house number to each planet placement based on house cusps boundaries
    const cuspLongitudes = houseData.cusps.map(c => getAbsoluteLongitude(c.sign, c.degree, c.minute));
    for (const pos of positions) {
      const absLong = getAbsoluteLongitude(pos.sign, pos.degree, pos.minute);
      pos.house = getHouseNumber(absLong, cuspLongitudes);
    }

    // 4. Calculate aspects
    const aspects = calculateAspects(positions);

    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const ascSignIdx = Math.floor(houseData.ascendant / 30);
    const mcSignIdx = Math.floor(houseData.mc / 30);

    return {
      positions,
      houses: houseData.cusps,
      aspects,
      ascendant: { 
        sign: signs[ascSignIdx % 12], 
        degree: Math.floor(houseData.ascendant % 30) 
      },
      midheaven: { 
        sign: signs[mcSignIdx % 12], 
        degree: Math.floor(houseData.mc % 30) 
      },
    };
  }

  getSunSign(date: Date): string {
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const signs: [number, number, string][] = [
      [3, 21, 'Aries'], [4, 20, 'Taurus'], [5, 21, 'Gemini'],
      [6, 21, 'Cancer'], [7, 23, 'Leo'], [8, 23, 'Virgo'],
      [9, 23, 'Libra'], [10, 23, 'Scorpio'], [11, 22, 'Sagittarius'],
      [12, 22, 'Capricorn'], [1, 20, 'Aquarius'], [2, 19, 'Pisces'],
    ];

    for (let i = 0; i < signs.length; i++) {
      const [m, d, sign] = signs[i];
      const nextSign = signs[(i + 1) % signs.length];
      if (month === m && day >= d) return sign;
      if (month === nextSign[0] && day < nextSign[1]) return sign;
    }
    return 'Capricorn';
  }

  async getMoonSign(date: Date, time: string, latitude: number, longitude: number): Promise<string> {
    const jd = dateToJulianDay(date);
    const positions = await calculatePlanetaryPositions(jd, latitude, longitude, false);
    const moon = positions.find(p => p.planet === 'Moon');
    return moon ? moon.sign : 'Aries';
  }
}

// Helpers
function getAbsoluteLongitude(sign: string, degree: number, minute: number): number {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const signIndex = signs.indexOf(sign);
  return (signIndex * 30 + degree + minute / 60) % 360;
}

function getHouseNumber(planetLong: number, cuspLongs: number[]): number {
  for (let i = 0; i < 11; i++) {
    const cuspStart = cuspLongs[i];
    const cuspEnd = cuspLongs[i + 1];

    if (cuspStart <= cuspEnd) {
      if (planetLong >= cuspStart && planetLong < cuspEnd) return i + 1;
    } else {
      if (planetLong >= cuspStart || planetLong < cuspEnd) return i + 1;
    }
  }
  return 12;
}
