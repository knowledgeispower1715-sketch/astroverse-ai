import type { AstrologyProvider, ChartCalculationInput, ChartCalculationResult } from '../types';
import { calculatePlanetaryPositions, dateToJulianDay } from '../calculations/planet-positions';
import { calculateHouseCusps } from '../calculations/house-systems';
import { calculateAspects } from '../calculations/aspects';
import { 
  calculateNakshatra, 
  calculateNavamsa, 
  calculatePlanetStrength, 
  calculateVimshottariDasha 
} from '../calculations/vedic-calculations';
import { 
  detectYogas, 
  detectDoshas, 
  prescribeRemedies, 
  recommendGemstones 
} from '../calculations/vedic-yogas-doshas';

export class VedicAstrologyProvider implements AstrologyProvider {
  readonly id = 'vedic' as const;
  readonly name = 'Vedic (Jyotish)';

  async calculateChart(input: ChartCalculationInput): Promise<ChartCalculationResult> {
    const jd = dateToJulianDay(input.birthDate);
    
    // 1. Calculate planetary positions (sidereal mode)
    const positions = await calculatePlanetaryPositions(
      jd,
      input.latitude,
      input.longitude,
      true // Vedic Sidereal (Lahiri ayanamsa)
    );

    // 2. Calculate house cusps
    const houseData = await calculateHouseCusps(
      jd,
      input.latitude,
      input.longitude,
      input.houseSystem
    );

    // 3. Assign correct house number to each planet placement
    const cuspLongitudes = houseData.cusps.map(c => getAbsoluteLongitude(c.sign, c.degree, c.minute));
    for (const pos of positions) {
      const absLong = getAbsoluteLongitude(pos.sign, pos.degree, pos.minute);
      pos.house = getHouseNumber(absLong, cuspLongitudes);
    }

    // 4. Calculate aspects
    const aspects = calculateAspects(positions);

    // 5. Vedic-specific extensions
    const nakshatras: Record<string, unknown> = {};
    const navamsa: Record<string, unknown> = {};
    const strengths: Record<string, number> = {};

    for (const pos of positions) {
      const absLong = getAbsoluteLongitude(pos.sign, pos.degree, pos.minute);
      nakshatras[pos.planet] = calculateNakshatra(absLong);
      navamsa[pos.planet] = calculateNavamsa(absLong);
      strengths[pos.planet] = calculatePlanetStrength(pos.planet, absLong);
    }

    const ascAbsLong = houseData.ascendant;
    nakshatras["Ascendant"] = calculateNakshatra(ascAbsLong);
    navamsa["Ascendant"] = calculateNavamsa(ascAbsLong);

    // 6. Vimshottari Dashas
    const moon = positions.find(p => p.planet === 'Moon');
    const moonAbsLong = moon ? getAbsoluteLongitude(moon.sign, moon.degree, moon.minute) : 0;
    const dashas = calculateVimshottariDasha(moonAbsLong, input.birthDate);

    // 7. Yogas, Doshas, Remedies, Gemstones
    const yogas = detectYogas(positions);
    const doshas = detectDoshas(positions);

    const weakPlanets: string[] = [];
    Object.entries(strengths).forEach(([planet, str]) => {
      if (str < 55) weakPlanets.push(planet);
    });

    const remedies = prescribeRemedies(doshas, weakPlanets);
    
    const signs = [
      'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
      'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
    ];
    const ascSignIdx = Math.floor(houseData.ascendant / 30);
    const mcSignIdx = Math.floor(houseData.mc / 30);
    const ascendantSign = signs[ascSignIdx % 12];

    const gemstones = recommendGemstones(ascendantSign, strengths);

    return {
      positions,
      houses: houseData.cusps,
      aspects,
      ascendant: { 
        sign: ascendantSign, 
        degree: Math.floor(houseData.ascendant % 30) 
      },
      midheaven: { 
        sign: signs[mcSignIdx % 12], 
        degree: Math.floor(houseData.mc % 30) 
      },
      nakshatras,
      navamsa,
      strengths,
      dashas,
      yogas,
      doshas,
      remedies,
      gemstones
    };
  }

  getSunSign(date: Date): string {
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    const AYANAMSA = 23.856;
    const tropicalLongitude = ((dayOfYear - 80) * 360) / 365.25;
    const siderealLongitude = (tropicalLongitude - AYANAMSA + 360) % 360;
    
    const signIndex = Math.floor(siderealLongitude / 30);
    const signs = [
      'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
      'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
    ];
    return signs[signIndex];
  }

  async getMoonSign(date: Date, time: string, latitude: number, longitude: number): Promise<string> {
    const jd = dateToJulianDay(date);
    const positions = await calculatePlanetaryPositions(jd, latitude, longitude, true);
    const moon = positions.find(p => p.planet === 'Moon');
    return moon ? moon.sign : 'Ashwini';
  }
}

// Helpers
function getAbsoluteLongitude(sign: string, degree: number, minute: number): number {
  const signs = [
    'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
    'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena',
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  let signIndex = signs.indexOf(sign);
  if (signIndex >= 12) signIndex -= 12;
  
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
