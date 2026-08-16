/**
 * ============================================================================
 * AstroVerse AI — Krishnamurti Padhdhati (KP) Engine
 * ============================================================================
 * Calculates exact Sign Lord, Star Lord, and Sub Lord (249 Sub-Divisions)
 * for all 12 House Cusps and Planets, plus 4-level Significator Matrix.
 * ============================================================================
 */

import { SIGNS, ZodiacSignName } from "@/modules/prediction-engine/astro-math";

export interface KPLordDetails {
  sign: ZodiacSignName;
  signLord: string;
  starLord: string;
  subLord: string;
  nakshatraName: string;
  degreeInSign: number;
}

export interface KPCuspInfo {
  house: number;
  longitude: number;
  sign: ZodiacSignName;
  signLord: string;
  starLord: string;
  subLord: string;
  formattedDegree: string;
}

export interface KPPlanetInfo {
  planet: string;
  longitude: number;
  sign: ZodiacSignName;
  signLord: string;
  starLord: string;
  subLord: string;
  houseOccupied: number;
  formattedDegree: string;
}

export interface KPSignificators {
  house: number;
  level1: string[]; // Planets in star of occupants
  level2: string[]; // House occupants
  level3: string[]; // Planets in star of house lord
  level4: string[]; // House lord
}

export interface KPAnalysisResult {
  cusps: KPCuspInfo[];
  planets: KPPlanetInfo[];
  significators: KPSignificators[];
  rulingPlanets: {
    ascendantSignLord: string;
    ascendantStarLord: string;
    ascendantSubLord: string;
    moonSignLord: string;
    moonStarLord: string;
    moonSubLord: string;
    dayLord: string;
  };
}

const SIGN_LORDS: Record<ZodiacSignName, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
  "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const NAKSHATRA_LORDS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
const DASHA_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

const DAY_LORDS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

/**
 * Calculates exact Sign Lord, Star Lord, and Sub Lord for any sidereal longitude.
 */
export function calculateKPLords(siderealLongitude: number): KPLordDetails {
  const norm = ((siderealLongitude % 360) + 360) % 360;
  const signIdx = Math.floor(norm / 30);
  const sign = SIGNS[signIdx];
  const signLord = SIGN_LORDS[sign];
  const degInSign = norm % 30;

  // Nakshatra (13°20' = 13.333333° per nakshatra)
  const nakLength = 360 / 27;
  const nakIdx = Math.floor(norm / nakLength);
  const nakName = NAKSHATRAS[nakIdx] || "Ashwini";
  const starLord = NAKSHATRA_LORDS[nakIdx % 9];

  // Degree within this nakshatra [0, 13.333333)
  const degInNak = norm % nakLength;

  // Sub-Lord calculation: Sub-divisions are proportional to Vimshottari Dasha years
  const startSubLordIdx = nakIdx % 9;
  let accumulatedDeg = 0;
  let subLord = starLord;

  for (let i = 0; i < 9; i++) {
    const sIdx = (startSubLordIdx + i) % 9;
    const pName = NAKSHATRA_LORDS[sIdx];
    const subSpan = (nakLength * DASHA_YEARS[pName]) / 120.0;

    if (degInNak >= accumulatedDeg && degInNak < accumulatedDeg + subSpan + 0.000001) {
      subLord = pName;
      break;
    }
    accumulatedDeg += subSpan;
  }

  return {
    sign,
    signLord,
    starLord,
    subLord,
    nakshatraName: nakName,
    degreeInSign: degInSign,
  };
}

/**
 * Executes a complete KP Analysis for natal cusps and planetary placements.
 */
export function analyzeKP(
  cuspLongitudes: number[], // 12 house cusp longitudes (Placidus / Equal)
  planetLongitudes: Record<string, number>,
  calculationDate: Date = new Date()
): KPAnalysisResult {
  // 1. Process 12 Cusps
  const cusps: KPCuspInfo[] = cuspLongitudes.slice(0, 12).map((longVal, idx) => {
    const kp = calculateKPLords(longVal);
    const deg = Math.floor(kp.degreeInSign);
    const min = Math.floor((kp.degreeInSign % 1) * 60);
    return {
      house: idx + 1,
      longitude: longVal,
      sign: kp.sign,
      signLord: kp.signLord,
      starLord: kp.starLord,
      subLord: kp.subLord,
      formattedDegree: `${deg}° ${min}' ${kp.sign}`,
    };
  });

  // 2. Process Planets
  const planets: KPPlanetInfo[] = [];
  for (const [pName, longVal] of Object.entries(planetLongitudes)) {
    const kp = calculateKPLords(longVal);
    const deg = Math.floor(kp.degreeInSign);
    const min = Math.floor((kp.degreeInSign % 1) * 60);

    // Determine occupied house from cusp boundaries
    let houseOccupied = 1;
    for (let h = 0; h < 12; h++) {
      const curCusp = cuspLongitudes[h];
      const nextCusp = cuspLongitudes[(h + 1) % 12];
      const normLong = ((longVal - curCusp + 360) % 360);
      const cuspSpan = ((nextCusp - curCusp + 360) % 360) || 30;
      if (normLong < cuspSpan) {
        houseOccupied = h + 1;
        break;
      }
    }

    planets.push({
      planet: pName,
      longitude: longVal,
      sign: kp.sign,
      signLord: kp.signLord,
      starLord: kp.starLord,
      subLord: kp.subLord,
      houseOccupied,
      formattedDegree: `${deg}° ${min}' ${kp.sign}`,
    });
  }

  // 3. Compute 4-Level Significators Matrix
  const significators: KPSignificators[] = [];

  for (let h = 1; h <= 12; h++) {
    const cusp = cusps[h - 1];
    const occupants = planets.filter((p) => p.houseOccupied === h).map((p) => p.planet);
    const houseLord = cusp?.signLord || "Mars";

    // Level 1: Planets in the star of occupants of house h
    const level1: string[] = [];
    for (const occ of occupants) {
      for (const p of planets) {
        if (p.starLord === occ && !level1.includes(p.planet)) {
          level1.push(p.planet);
        }
      }
    }

    // Level 2: Occupants of house h
    const level2 = occupants;

    // Level 3: Planets in the star of the lord of house h
    const level3: string[] = [];
    for (const p of planets) {
      if (p.starLord === houseLord && !level3.includes(p.planet)) {
        level3.push(p.planet);
      }
    }

    // Level 4: Lord of house h
    const level4 = [houseLord];

    significators.push({
      house: h,
      level1,
      level2,
      level3,
      level4,
    });
  }

  // 4. Ruling Planets
  const ascCusp = cusps[0] || calculateKPLords(0);
  const moonKp = planets.find((p) => p.planet === "Moon") || calculateKPLords(0);
  const dayLord = DAY_LORDS[calculationDate.getDay()] || "Sun";

  return {
    cusps,
    planets,
    significators,
    rulingPlanets: {
      ascendantSignLord: ascCusp.signLord,
      ascendantStarLord: ascCusp.starLord,
      ascendantSubLord: ascCusp.subLord,
      moonSignLord: moonKp.signLord,
      moonStarLord: moonKp.starLord,
      moonSubLord: moonKp.subLord,
      dayLord,
    },
  };
}
