import { getSwissEphemeris } from "./swe-instance";
import type { HouseCusp, HouseSystemId } from "@/types/astrology";
import { HouseSystem } from "@swisseph/core";

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

export async function calculateHouseCusps(
  julianDay: number,
  latitude: number,
  longitude: number,
  system: HouseSystemId
): Promise<{ cusps: HouseCusp[]; ascendant: number; mc: number }> {
  const swe = await getSwissEphemeris();

  if (swe) {
    try {
      let hSys = HouseSystem.Placidus;
      if (system === "whole-sign") {
        hSys = HouseSystem.WholeSign;
      } else if (system === "equal") {
        hSys = HouseSystem.Equal;
      } else if (system === "koch") {
        hSys = HouseSystem.Koch;
      } else if (system === "campanus") {
        hSys = HouseSystem.Campanus;
      } else if (system === "regiomontanus") {
        hSys = HouseSystem.Regiomontanus;
      }

      const data = swe.calculateHouses(julianDay, latitude, longitude, hSys);
      const cusps: HouseCusp[] = [];
      for (let i = 1; i <= 12; i++) {
        const deg = ((data.cusps[i] % 360) + 360) % 360;
        const signIndex = Math.floor(deg / 30);
        const degree = deg % 30;

        cusps.push({
          house: i,
          sign: SIGNS[signIndex] || "Aries",
          degree: Math.floor(degree),
          minute: Math.floor((degree % 1) * 60),
        });
      }

      return {
        cusps,
        ascendant: ((data.ascendant % 360) + 360) % 360,
        mc: ((data.mc % 360) + 360) % 360,
      };
    } catch (err) {
      console.error("[calculateHouseCusps] Swiss Ephemeris failed, using analytical engine:", err);
    }
  }

  // Analytical Ephemeris fallback for Ascendant / MC / House Cusps
  const T = (julianDay - 2451545.0) / 36525;
  // Greenwich Mean Sidereal Time (GMST in degrees)
  const gmst = (280.46061837 + 360.98564736629 * (julianDay - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000) % 360;
  // Local Sidereal Time (RAMC in degrees)
  const ramc = ((gmst + longitude % 360) + 360) % 360;
  const ramcRad = (ramc * Math.PI) / 180;
  const eps = (23.43929111 - 0.013004167 * T) * (Math.PI / 180); // Obliquity of ecliptic
  const latRad = (latitude * Math.PI) / 180;

  // Midheaven (MC)
  const mc = (Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(eps)) * 180) / Math.PI;
  const normMC = ((mc % 360) + 360) % 360;

  // Ascendant (Lagna)
  const ascRad = Math.atan2(
    Math.cos(ramcRad),
    -Math.sin(ramcRad) * Math.cos(eps) - Math.tan(latRad) * Math.sin(eps)
  );
  const asc = ((ascRad * 180) / Math.PI + 360) % 360;

  const cusps: HouseCusp[] = [];
  const baseAsc = Math.floor(asc / 30) * 30; // whole sign base

  for (let i = 1; i <= 12; i++) {
    const cuspDeg = system === "whole-sign" ? (baseAsc + (i - 1) * 30) % 360 : (asc + (i - 1) * 30) % 360;
    const signIdx = Math.floor(cuspDeg / 30);
    const deg = cuspDeg % 30;

    cusps.push({
      house: i,
      sign: SIGNS[signIdx] || "Aries",
      degree: Math.floor(deg),
      minute: Math.floor((deg % 1) * 60),
    });
  }

  return {
    cusps,
    ascendant: asc,
    mc: normMC,
  };
}
