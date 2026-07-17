import { getSwissEphemeris } from "./swe-instance";
import type { HouseCusp, HouseSystemId } from "@/types/astrology";
import { HouseSystem } from "@swisseph/core";

export async function calculateHouseCusps(
  julianDay: number,
  latitude: number,
  longitude: number,
  system: HouseSystemId
): Promise<{ cusps: HouseCusp[]; ascendant: number; mc: number }> {
  const swe = await getSwissEphemeris();

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
  const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

  const cusps: HouseCusp[] = [];
  for (let i = 1; i <= 12; i++) {
    const deg = data.cusps[i];
    const signIndex = Math.floor(deg / 30);
    const degree = deg % 30;

    cusps.push({
      house: i,
      sign: signs[signIndex],
      degree: Math.floor(degree),
      minute: Math.floor((degree % 1) * 60),
    });
  }

  return {
    cusps,
    ascendant: data.ascendant,
    mc: data.mc,
  };
}
