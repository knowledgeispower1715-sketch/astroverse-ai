import { getSwissEphemeris } from "./swe-instance";
import type { CelestialPosition } from "@/types/astrology";
import { Planet } from "@swisseph/core";
import { tropicalSunLongitude, tropicalMoonLongitude, lahiriAyanamsa } from "@/modules/prediction-engine/astro-math";

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
  const AYANAMSA = lahiriAyanamsa(julianDay);
  const positions: CelestialPosition[] = [];

  if (swe) {
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
          sign: SIGNS[signIndex] || "Aries",
          degree: Math.floor(degree),
          minute: Math.floor((degree % 1) * 60),
          retrograde: pos.longitudeSpeed < 0,
          house: 1,
        });
      } catch (err) {
        console.error(`Failed to calculate position for ${p.name}:`, err);
      }
    }
  }

  // Fallback if Swiss Ephemeris WASM was not available
  if (positions.length === 0) {
    const T = (julianDay - 2451545.0) / 36525;
    const sunLong = siderealMode ? (tropicalSunLongitude(julianDay) - AYANAMSA + 360) % 360 : tropicalSunLongitude(julianDay);
    const moonLong = siderealMode ? (tropicalMoonLongitude(julianDay) - AYANAMSA + 360) % 360 : tropicalMoonLongitude(julianDay);

    const planetOffsets: Record<string, number> = {
      Sun: sunLong,
      Moon: moonLong,
      Mercury: (sunLong + 18.5 + 2.1 * Math.sin(T)) % 360,
      Venus: (sunLong + 42.3 + 1.8 * Math.cos(T)) % 360,
      Mars: (355.43 + 19140.3 * T) % 360,
      Jupiter: (34.35 + 3034.9 * T) % 360,
      Saturn: (50.08 + 1222.1 * T) % 360,
      Uranus: (314.05 + 428.4 * T) % 360,
      Neptune: (304.35 + 218.4 * T) % 360,
      Pluto: (238.93 + 145.2 * T) % 360,
    };

    if (siderealMode) {
      planetOffsets["Rahu"] = (290.0 - 19.34 * (julianDay - 2451545.0) / 365.25 + 360) % 360;
      planetOffsets["Ketu"] = (planetOffsets["Rahu"] + 180) % 360;
    }

    for (const [name, longVal] of Object.entries(planetOffsets)) {
      const norm = ((longVal % 360) + 360) % 360;
      const signIdx = Math.floor(norm / 30);
      const deg = norm % 30;
      positions.push({
        planet: name,
        sign: SIGNS[signIdx] || "Aries",
        degree: Math.floor(deg),
        minute: Math.floor((deg % 1) * 60),
        retrograde: false,
        house: 1,
      });
    }
  }

  return positions;
}

export function dateToJulianDay(date: Date, timeStr?: string): number {
  let year = date.getUTCFullYear();
  let month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  let hours = date.getUTCHours();
  let minutes = date.getUTCMinutes();

  if (timeStr && typeof timeStr === "string" && timeStr.includes(":")) {
    const parts = timeStr.split(":").map(Number);
    if (!isNaN(parts[0])) hours = parts[0];
    if (!isNaN(parts[1])) minutes = parts[1];
  }

  const decimalDay = day + (hours || 0) / 24 + (minutes || 0) / 1440;

  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);

  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + decimalDay + B - 1524.5;
}
