/**
 * Real transit calculator — computes current planetary positions from JD.
 */

import {
  dateToJD,
  computeVedicLongitudes,
  longToSignDeg,
  tropicalSunLongitude,
  tropicalMoonLongitude,
  tropicalMarsLongitude,
  tropicalMercuryLongitude,
  tropicalJupiterLongitude,
  tropicalVenusLongitude,
  tropicalSaturnLongitude,
  tropicalRahuLongitude,
  lahiriAyanamsa,
  SIGNS,
  type ZodiacSignName,
} from "./astro-math";

export interface TransitPlanet {
  planet: string;
  sign: ZodiacSignName;
  degree: number;
  minute: number;
  speedCategory: "fast" | "normal" | "slow" | "stationary";
  retrograde: boolean;
  natalRelationship?: string;
  aspect?: string;
}

/** Daily speed thresholds (deg/day) */
const SPEED_THRESHOLDS: Record<string, { normal: number; fast: number }> = {
  Sun: { normal: 0.9, fast: 1.05 },
  Moon: { normal: 13, fast: 14.5 },
  Mars: { normal: 0.4, fast: 0.7 },
  Mercury: { normal: 1.0, fast: 1.5 },
  Jupiter: { normal: 0.05, fast: 0.15 },
  Venus: { normal: 0.8, fast: 1.1 },
  Saturn: { normal: 0.03, fast: 0.08 },
  Rahu: { normal: 0.03, fast: 0.05 },
  Ketu: { normal: 0.03, fast: 0.05 },
};

function getSpeed(planet: string, long1: number, long2: number): { category: "fast" | "normal" | "slow" | "stationary"; retrograde: boolean } {
  let diff = long2 - long1;
  // Handle wrap-around
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  const retrograde = diff < 0;
  const absDiff = Math.abs(diff);
  const t = SPEED_THRESHOLDS[planet] ?? { normal: 0.5, fast: 1.0 };
  let category: "fast" | "normal" | "slow" | "stationary";
  if (absDiff < 0.005) category = "stationary";
  else if (absDiff >= t.fast) category = "fast";
  else if (absDiff >= t.normal) category = "normal";
  else category = "slow";
  return { category, retrograde };
}

export function getCurrentTransits(date: Date = new Date()): TransitPlanet[] {
  const jd = dateToJD(date);
  const jd1 = jd - 1; // yesterday for speed calculation
  const ayan = lahiriAyanamsa(jd);
  const ayan1 = lahiriAyanamsa(jd1);
  const sid = (l: number, a: number) => ((l - a + 360) % 360);

  const planets = [
    { name: "Sun", long: sid(tropicalSunLongitude(jd), ayan), prev: sid(tropicalSunLongitude(jd1), ayan1) },
    { name: "Moon", long: sid(tropicalMoonLongitude(jd), ayan), prev: sid(tropicalMoonLongitude(jd1), ayan1) },
    { name: "Mars", long: sid(tropicalMarsLongitude(jd), ayan), prev: sid(tropicalMarsLongitude(jd1), ayan1) },
    { name: "Mercury", long: sid(tropicalMercuryLongitude(jd), ayan), prev: sid(tropicalMercuryLongitude(jd1), ayan1) },
    { name: "Jupiter", long: sid(tropicalJupiterLongitude(jd), ayan), prev: sid(tropicalJupiterLongitude(jd1), ayan1) },
    { name: "Venus", long: sid(tropicalVenusLongitude(jd), ayan), prev: sid(tropicalVenusLongitude(jd1), ayan1) },
    { name: "Saturn", long: sid(tropicalSaturnLongitude(jd), ayan), prev: sid(tropicalSaturnLongitude(jd1), ayan1) },
  ];

  // Rahu always retrograde
  const rahuLong = sid(tropicalRahuLongitude(jd), ayan);
  const rahuInfo = longToSignDeg(rahuLong);
  const ketuLong = (rahuLong + 180) % 360;
  const ketuInfo = longToSignDeg(ketuLong);

  const results: TransitPlanet[] = planets.map(p => {
    const info = longToSignDeg(p.long);
    const { category, retrograde } = getSpeed(p.name, p.prev, p.long);
    return {
      planet: p.name,
      sign: info.sign,
      degree: info.degree,
      minute: info.minute,
      speedCategory: category,
      retrograde,
    };
  });

  results.push({
    planet: "Rahu",
    sign: rahuInfo.sign,
    degree: rahuInfo.degree,
    minute: rahuInfo.minute,
    speedCategory: "slow",
    retrograde: true,
  });

  results.push({
    planet: "Ketu",
    sign: ketuInfo.sign,
    degree: ketuInfo.degree,
    minute: ketuInfo.minute,
    speedCategory: "slow",
    retrograde: true,
  });

  return results;
}

/** Compute aspect between natal sign (string) and transit sign */
export function transitAspect(transitSignIdx: number, natalSignIdx: number): string {
  const diff = ((transitSignIdx - natalSignIdx + 12) % 12);
  if (diff === 0) return "Conjunction";
  if (diff === 4 || diff === 8) return "Trine";
  if (diff === 2 || diff === 10) return "Sextile";
  if (diff === 3 || diff === 9) return "Square";
  if (diff === 6) return "Opposition";
  return "—";
}
