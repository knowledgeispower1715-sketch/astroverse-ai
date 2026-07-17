import { getSwissEphemeris } from "./swe-instance";
import type { CelestialPosition } from "@/types/astrology";
import { Planet } from "@swisseph/core";

const PLANETS_CONFIG = [
  { name: "Sun", id: Planet.Sun },
  { name: "Moon", id: Planet.Moon },
  { name: "Mercury", id: Planet.Mercury },
  { name: "Venus", id: Planet.Venus },
  { name: "Mars", id: Planet.Mars },
  { name: "Jupiter", id: Planet.Jupiter },
  { name: "Saturn", id: Planet.Saturn },
  { name: "Uranus", id: Planet.Uranus },
  { name: "Neptune", id: Planet.Neptune },
  { name: "Pluto", id: Planet.Pluto },
];

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

export async function calculatePlanetaryPositions(
  julianDay: number,
  _latitude: number,
  _longitude: number,
  siderealMode: boolean = false
): Promise<CelestialPosition[]> {
  const swe = await getSwissEphemeris();

  // Lahiri Ayanamsa offset approximation if sidereal mode is enabled
  const AYANAMSA = 23.856; 

  const positions: CelestialPosition[] = [];

  for (let i = 0; i < PLANETS_CONFIG.length; i++) {
    const p = PLANETS_CONFIG[i];
    try {
      const pos = swe.calculatePosition(julianDay, p.id);
      let planetLong = pos.longitude;

      if (siderealMode) {
        planetLong = (planetLong - AYANAMSA + 360) % 360;
      }

      const signIndex = Math.floor(planetLong / 30);
      const degree = planetLong % 30;

      positions.push({
        planet: p.name,
        sign: SIGNS[signIndex],
        degree: Math.floor(degree),
        minute: Math.floor((degree % 1) * 60),
        retrograde: pos.longitudeSpeed < 0,
        house: 1, // Will be computed accurately in house systems calculations
      });
    } catch (err) {
      console.error(`Failed to calculate position for ${p.name}:`, err);
      positions.push({
        planet: p.name,
        sign: "Aries",
        degree: 0,
        minute: 0,
        retrograde: false,
        house: 1,
      });
    }
  }

  return positions;
}

export function dateToJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate() + (date.getUTCHours() + date.getUTCMinutes() / 60) / 24;

  let y = year;
  let m = month;
  if (m <= 2) { y -= 1; m += 12; }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5;
}
