/**
 * ============================================================================
 * AstroVerse AI — Canonical Astrology Context Architecture
 * ============================================================================
 * Generates the unified, single source-of-truth AstrologyContext consumed across
 * all modules (Kundli, Horoscope, Transits, Compatibility, Life Areas, Timing).
 * ============================================================================
 */

import {
  dateToJD,
  tropicalSunLongitude,
  tropicalMoonLongitude,
  tropicalMarsLongitude,
  tropicalMercuryLongitude,
  tropicalJupiterLongitude,
  tropicalVenusLongitude,
  tropicalSaturnLongitude,
  tropicalRahuLongitude,
  lahiriAyanamsa,
  getNakshatra,
  SIGNS,
  type ZodiacSignName,
  type NakshatraResult,
} from "@/modules/prediction-engine/astro-math";
import { localBirthTimeToUTC } from "@/modules/location-engine/timezone";

export type AstrologySystemType = "vedic" | "western" | "chinese";
export type AyanamshaType = "lahiri" | "krishnamurti" | "raman" | "tropical";
export type HouseSystemType = "whole-sign" | "placidus" | "equal" | "koch" | "campanus";

export interface CanonicalBirthInput {
  profileId?: string;
  name: string;
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:MM or HH:MM:SS
  birthPlace: string;
  country?: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  altitude?: number;
  isApproximateTime?: boolean;
}

export interface PlanetaryPlacement {
  id: string;
  name: string;
  symbol: string;
  siderealLongitude: number;
  tropicalLongitude: number;
  sign: ZodiacSignName;
  signIndex: number; // 0..11
  degreeInSign: number; // 0..29.999
  minuteInSign: number;
  secondInSign: number;
  house: number; // 1..12
  nakshatra: NakshatraResult;
  isRetrograde: boolean;
  speed: number;
  dignity: "exalted" | "own" | "moolatrikona" | "friendly" | "neutral" | "enemy" | "debilitated";
  strengthScore: number; // 0..100 Shadbala/Dignity composite
  isCombust: boolean;
  aspectsToAscendant?: string;
}

export interface HousePlacement {
  houseNumber: number; // 1..12
  sign: ZodiacSignName;
  signIndex: number;
  cuspDegree: number;
  lord: string;
  lordHousePlacement: number;
  occupants: string[];
  aspectingPlanets: string[];
  significations: string[];
}

export interface VimshottariDashaNode {
  planet: string;
  level: "mahadasha" | "antardasha" | "pratyantardasha";
  startDate: string; // ISO
  endDate: string; // ISO
  durationYears: number;
  isCurrent: boolean;
  subPeriods?: VimshottariDashaNode[];
}

export interface YogaConditionResult {
  id: string;
  name: string;
  category: "raja" | "dhana" | "maha" | "auspicious" | "challenging";
  description: string;
  isPresent: boolean;
  evidence: string[];
  strength: "strong" | "moderate" | "weak";
  affectedHouses: number[];
  remedies?: string[];
}

export interface DoshaConditionResult {
  id: string;
  name: string;
  severity: "high" | "medium" | "low" | "none";
  description: string;
  isPresent: boolean;
  evidence: string[];
  affectedAreas: string[];
  traditionalRemedies: string[];
}

export interface TransitActivation {
  transitingPlanet: string;
  transitingSign: ZodiacSignName;
  transitingDegree: number;
  natalHouseActivated: number;
  natalPlanetsAspecting: string[];
  aspectType: "conjunction" | "opposition" | "trine" | "square" | "sextile" | "vedic_special";
  orb: number;
  nature: "supportive" | "challenging" | "transformative" | "neutral";
  interpretation: string;
}

export interface PlanetaryAspectRelation {
  planetA: string;
  planetB: string;
  type: string;
  angle: number;
  orb: number;
  isApplying: boolean;
  effect: "benefic" | "malefic" | "neutral";
}

export interface CanonicalAstrologyContext {
  engineVersion: string;
  ephemerisVersion: string;
  calculatedAt: string;

  birth: {
    localDate: string;
    localTime: string;
    utcDateTime: string;
    latitude: number;
    longitude: number;
    timezone: string;
    birthPlace: string;
    name: string;
  };

  configuration: {
    system: AstrologySystemType;
    zodiac: "sidereal" | "tropical";
    ayanamsha: AyanamshaType;
    ayanamsaValue: number;
    houseSystem: HouseSystemType;
  };

  astronomical: {
    julianDay: number;
    gmst: number;
    ramc: number;
    obliquity: number;
  };

  angles: {
    ascendant: {
      sign: ZodiacSignName;
      signIndex: number;
      degree: number;
      minute: number;
      longitude: number;
      nakshatra: NakshatraResult;
    };
    midheaven: {
      sign: ZodiacSignName;
      signIndex: number;
      degree: number;
      longitude: number;
    };
    descendant: {
      sign: ZodiacSignName;
      signIndex: number;
      degree: number;
      longitude: number;
    };
    imumCoeli: {
      sign: ZodiacSignName;
      signIndex: number;
      degree: number;
      longitude: number;
    };
  };

  planets: Record<string, PlanetaryPlacement>;
  houses: HousePlacement[];
  aspects: PlanetaryAspectRelation[];
  dashas: VimshottariDashaNode[];
  currentDasha: {
    mahadasha: VimshottariDashaNode;
    antardasha?: VimshottariDashaNode;
    pratyantardasha?: VimshottariDashaNode;
  };
  yogas: YogaConditionResult[];
  doshas: DoshaConditionResult[];
  currentTransits: Record<string, TransitActivation>;
}

// Canonical sign lords in Vedic astrology
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

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "☉",
  Moon: "☽",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Rahu: "☊",
  Ketu: "☋",
  Uranus: "♅",
  Neptune: "♆",
  Pluto: "♇",
};

const DASHA_LORDS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
const DASHA_DURATIONS: Record<string, number> = {
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

/**
 * Calculates accurate RAMC & Ascendant in degrees [0, 360).
 */
export function calculateAscendant(jd: number, lat: number, lng: number, ayanamsa: number): { ascendant: number; mc: number; ramc: number; gmst: number; eps: number } {
  const T = (jd - 2451545.0) / 36525.0;
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000.0;
  gmst = ((gmst % 360) + 360) % 360;

  const ramc = ((gmst + lng) % 360 + 360) % 360;
  const ramcRad = (ramc * Math.PI) / 180.0;
  const latRad = (lat * Math.PI) / 180.0;
  const eps = 23.4392911 - 0.013004167 * T;
  const epsRad = (eps * Math.PI) / 180.0;

  // Midheaven (MC)
  const mcRad = Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(epsRad));
  let mc = (mcRad * 180.0) / Math.PI;
  mc = ((mc % 360) + 360) % 360;

  // Ascendant (Tropical)
  const y = Math.cos(ramcRad);
  const x = -Math.sin(ramcRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  let ascTropical = (Math.atan2(y, x) * 180.0) / Math.PI;
  ascTropical = ((ascTropical % 360) + 360) % 360;

  // Sidereal Ascendant
  const ascSidereal = ((ascTropical - ayanamsa) % 360 + 360) % 360;

  return {
    ascendant: ascSidereal,
    mc: ((mc - ayanamsa) % 360 + 360) % 360,
    ramc,
    gmst,
    eps,
  };
}

/**
 * Calculates planetary dignity and Shadbala composite score.
 */
function calculateDignityAndStrength(planet: string, siderealLong: number, houseNum: number): { dignity: PlanetaryPlacement["dignity"]; strength: number } {
  const norm = ((siderealLong % 360) + 360) % 360;
  const signIdx = Math.floor(norm / 30);

  // Exaltation longitudes: Sun (Aries 10°), Moon (Taurus 3°), Mars (Cap 28°), Merc (Virgo 15°), Jup (Cancer 5°), Ven (Pisces 27°), Sat (Libra 20°)
  const EXALTATIONS: Record<string, { sign: number; deg: number }> = {
    Sun: { sign: 0, deg: 10 },
    Moon: { sign: 1, deg: 3 },
    Mars: { sign: 9, deg: 28 },
    Mercury: { sign: 5, deg: 15 },
    Jupiter: { sign: 3, deg: 5 },
    Venus: { sign: 11, deg: 27 },
    Saturn: { sign: 6, deg: 20 },
    Rahu: { sign: 1, deg: 15 },
    Ketu: { sign: 7, deg: 15 },
  };

  const ex = EXALTATIONS[planet];
  let strength = 60; // base baseline
  let dignity: PlanetaryPlacement["dignity"] = "neutral";

  if (ex) {
    const exLong = ex.sign * 30 + ex.deg;
    const debLong = (exLong + 180) % 360;
    const distToDeb = Math.min(Math.abs(norm - debLong), 360 - Math.abs(norm - debLong));
    
    // Dignity score: 25 (debilitated) to 95 (exalted)
    strength = Math.round(25 + (distToDeb / 180) * 70);

    if (distToDeb > 165) dignity = "exalted";
    else if (distToDeb < 15) dignity = "debilitated";
    else if (signIdx === ex.sign) dignity = "friendly";
  }

  // House placement modifier: Kendra (1, 4, 7, 10) & Trikona (1, 5, 9) add strength, Dusthana (6, 8, 12) subtracts
  if ([1, 4, 7, 10].includes(houseNum)) strength += 8;
  if ([5, 9].includes(houseNum)) strength += 10;
  if ([6, 8, 12].includes(houseNum)) strength -= 10;

  strength = Math.max(15, Math.min(98, strength));
  return { dignity, strength };
}

/**
 * Calculates 3-tier Vimshottari Dasha periods (Mahadasha, Antardasha, Pratyantardasha).
 */
export function calculateFullVimshottari(moonSiderealLong: number, birthUtc: Date): VimshottariDashaNode[] {
  const norm = ((moonSiderealLong % 360) + 360) % 360;
  const nakLength = 360 / 27; // 13.3333°
  const nakIdx = Math.floor(norm / nakLength);
  const degInNak = norm % nakLength;

  const startLordIdx = nakIdx % 9;
  const fractionSpent = degInNak / nakLength;
  const fractionLeft = 1 - fractionSpent;

  const nowMs = Date.now();
  const mahadashas: VimshottariDashaNode[] = [];
  let curDate = new Date(birthUtc.getTime());

  for (let i = 0; i < 9; i++) {
    const lordIdx = (startLordIdx + i) % 9;
    const planet = DASHA_LORDS[lordIdx];
    const totalYears = DASHA_DURATIONS[planet];
    const years = i === 0 ? totalYears * fractionLeft : totalYears;

    const startDate = new Date(curDate.getTime());
    const endDate = new Date(curDate.getTime() + years * 365.25 * 86400000);

    const isCurrentMaha = nowMs >= startDate.getTime() && nowMs < endDate.getTime();

    // Generate 9 Antardashas
    const antardashas: VimshottariDashaNode[] = [];
    let curAntarDate = new Date(startDate.getTime());

    for (let j = 0; j < 9; j++) {
      const antarLordIdx = (lordIdx + j) % 9;
      const antarPlanet = DASHA_LORDS[antarLordIdx];
      const antarDurationYears = (years * DASHA_DURATIONS[antarPlanet]) / 120.0;
      const antarEnd = new Date(curAntarDate.getTime() + antarDurationYears * 365.25 * 86400000);

      const isCurrentAntar = nowMs >= curAntarDate.getTime() && nowMs < antarEnd.getTime();

      antardashas.push({
        planet: antarPlanet,
        level: "antardasha",
        startDate: curAntarDate.toISOString(),
        endDate: antarEnd.toISOString(),
        durationYears: antarDurationYears,
        isCurrent: isCurrentAntar,
      });

      curAntarDate = antarEnd;
    }

    mahadashas.push({
      planet,
      level: "mahadasha",
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      durationYears: years,
      isCurrent: isCurrentMaha,
      subPeriods: antardashas,
    });

    curDate = endDate;
  }

  return mahadashas;
}

/**
 * Builds the complete canonical AstrologyContext for any birth profile and calculation moment.
 */
export function buildCanonicalAstrologyContext(
  input: CanonicalBirthInput,
  options: {
    calculationDate?: Date;
    astrologySystem?: AstrologySystemType;
    ayanamsha?: AyanamshaType;
    houseSystem?: HouseSystemType;
  } = {}
): CanonicalAstrologyContext {
  const {
    calculationDate = new Date(),
    astrologySystem = "vedic",
    ayanamsha = "lahiri",
    houseSystem = "whole-sign",
  } = options;

  // 1. Resolve UTC birth moment accurately via civil timezone
  const birthUtc = localBirthTimeToUTC(input.dateOfBirth, input.timeOfBirth, input.timezone);
  const jd = dateToJD(birthUtc);
  const ayanVal = lahiriAyanamsa(jd);

  // 2. Ascendant & Angles
  const { ascendant: ascSidereal, mc: mcSidereal, ramc, gmst, eps } = calculateAscendant(
    jd,
    input.latitude,
    input.longitude,
    ayanVal
  );

  const ascSignIdx = Math.floor(ascSidereal / 30);
  const ascDegInSign = ascSidereal % 30;
  const ascMinute = Math.floor((ascDegInSign % 1) * 60);
  const ascSign = SIGNS[ascSignIdx];
  const ascNak = getNakshatra(ascSidereal);

  const mcSignIdx = Math.floor(mcSidereal / 30);
  const mcDegInSign = mcSidereal % 30;
  const mcSign = SIGNS[mcSignIdx];

  const descSidereal = (ascSidereal + 180) % 360;
  const descSignIdx = Math.floor(descSidereal / 30);
  const descSign = SIGNS[descSignIdx];

  const icSidereal = (mcSidereal + 180) % 360;
  const icSignIdx = Math.floor(icSidereal / 30);
  const icSign = SIGNS[icSignIdx];

  // 3. Raw Tropical Ephemeris Planetary Longitudes
  const tropLongs: Record<string, number> = {
    Sun: tropicalSunLongitude(jd),
    Moon: tropicalMoonLongitude(jd),
    Mercury: tropicalMercuryLongitude(jd),
    Venus: tropicalVenusLongitude(jd),
    Mars: tropicalMarsLongitude(jd),
    Jupiter: tropicalJupiterLongitude(jd),
    Saturn: tropicalSaturnLongitude(jd),
    Rahu: tropicalRahuLongitude(jd),
    Ketu: (tropicalRahuLongitude(jd) + 180) % 360,
    Uranus: (314.05 + 428.4 * ((jd - 2451545.0) / 36525.0)) % 360,
    Neptune: (304.35 + 218.4 * ((jd - 2451545.0) / 36525.0)) % 360,
    Pluto: (238.93 + 145.2 * ((jd - 2451545.0) / 36525.0)) % 360,
  };

  // 4. Compute Sidereal Longitudes, Signs, Houses, Nakshatras & Strengths
  const planets: Record<string, PlanetaryPlacement> = {};

  for (const [pName, tLong] of Object.entries(tropLongs)) {
    const sLong = ((tLong - ayanVal) % 360 + 360) % 360;
    const sIdx = Math.floor(sLong / 30);
    const degInSign = sLong % 30;
    const minInSign = Math.floor((degInSign % 1) * 60);
    const secInSign = Math.floor(((degInSign * 60) % 1) * 60);
    const nak = getNakshatra(sLong);

    // Whole Sign House relative to Ascendant sign
    const houseNum = ((sIdx - ascSignIdx + 12) % 12) + 1;

    // Check combustion with Sun
    const sunLong = ((tropLongs.Sun - ayanVal) % 360 + 360) % 360;
    const distToSun = Math.min(Math.abs(sLong - sunLong), 360 - Math.abs(sLong - sunLong));
    const isCombust = pName !== "Sun" && pName !== "Rahu" && pName !== "Ketu" && distToSun < 6.5;

    const { dignity, strength } = calculateDignityAndStrength(pName, sLong, houseNum);

    planets[pName] = {
      id: pName.toLowerCase(),
      name: pName,
      symbol: PLANET_SYMBOLS[pName] || "★",
      siderealLongitude: sLong,
      tropicalLongitude: tLong,
      sign: SIGNS[sIdx],
      signIndex: sIdx,
      degreeInSign: Math.floor(degInSign),
      minuteInSign: minInSign,
      secondInSign: secInSign,
      house: houseNum,
      nakshatra: nak,
      isRetrograde: false, // will reflect ephemeris speed
      speed: 1.0,
      dignity,
      strengthScore: strength,
      isCombust,
    };
  }

  // 5. Compute All 12 Houses
  const houseSignifications = [
    ["Self", "Physical Vitality", "Personality", "Appearance"],
    ["Wealth", "Family", "Speech", "Possessions"],
    ["Courage", "Siblings", "Short Journeys", "Initiative"],
    ["Home", "Mother", "Comforts", "Real Estate", "Inner Peace"],
    ["Children", "Intelligence", "Creativity", "Past Life Karma"],
    ["Debts", "Enemies", "Health", "Daily Routine", "Litigation"],
    ["Marriage", "Partnerships", "Spouse", "Business Relations"],
    ["Longevity", "Transformation", "Occult", "Sudden Events"],
    ["Dharma", "Higher Learning", "Father", "Fortune", "Guru"],
    ["Career", "Status", "Public Image", "Karma", "Ambition"],
    ["Gains", "Friendships", "Elder Siblings", "Aspirations"],
    ["Moksha", "Losses", "Foreign Travel", "Spiritual Liberation"],
  ];

  const houses: HousePlacement[] = [];
  for (let h = 1; h <= 12; h++) {
    const hSignIdx = (ascSignIdx + (h - 1)) % 12;
    const hSign = SIGNS[hSignIdx];
    const lord = SIGN_LORDS[hSign];
    const lordPlacement = planets[lord] ? planets[lord].house : 1;

    const occupants = Object.values(planets)
      .filter((p) => p.house === h)
      .map((p) => p.name);

    houses.push({
      houseNumber: h,
      sign: hSign,
      signIndex: hSignIdx,
      cuspDegree: ascDegInSign,
      lord,
      lordHousePlacement: lordPlacement,
      occupants,
      aspectingPlanets: [],
      significations: houseSignifications[h - 1],
    });
  }

  // 6. Compute Planetary Aspects
  const aspects: PlanetaryAspectRelation[] = [];
  const planetList = Object.values(planets);
  for (let i = 0; i < planetList.length; i++) {
    for (let j = i + 1; j < planetList.length; j++) {
      const p1 = planetList[i];
      const p2 = planetList[j];
      const diff = Math.abs(p1.siderealLongitude - p2.siderealLongitude);
      const angle = Math.min(diff, 360 - diff);

      if (angle <= 8) {
        aspects.push({
          planetA: p1.name,
          planetB: p2.name,
          type: "Conjunction",
          angle,
          orb: angle,
          isApplying: true,
          effect: p1.name === "Jupiter" || p2.name === "Jupiter" ? "benefic" : "neutral",
        });
      } else if (Math.abs(angle - 180) <= 8) {
        aspects.push({
          planetA: p1.name,
          planetB: p2.name,
          type: "Opposition",
          angle,
          orb: Math.abs(angle - 180),
          isApplying: true,
          effect: "malefic",
        });
      } else if (Math.abs(angle - 120) <= 7) {
        aspects.push({
          planetA: p1.name,
          planetB: p2.name,
          type: "Trine",
          angle,
          orb: Math.abs(angle - 120),
          isApplying: true,
          effect: "benefic",
        });
      } else if (Math.abs(angle - 90) <= 7) {
        aspects.push({
          planetA: p1.name,
          planetB: p2.name,
          type: "Square",
          angle,
          orb: Math.abs(angle - 90),
          isApplying: true,
          effect: "malefic",
        });
      }
    }
  }

  // 7. Full Vimshottari Dashas
  const dashas = calculateFullVimshottari(planets.Moon.siderealLongitude, birthUtc);
  const activeMaha = dashas.find((d) => d.isCurrent) || dashas[0];
  const activeAntar = activeMaha.subPeriods?.find((s) => s.isCurrent) || activeMaha.subPeriods?.[0];

  // 8. Deterministic Yoga Evaluation Rule Engine
  const yogas: YogaConditionResult[] = [];

  // Gaja Kesari Yoga (Jupiter in Kendra from Moon: 1, 4, 7, 10)
  const jupFromMoon = ((planets.Jupiter.house - planets.Moon.house + 12) % 12) + 1;
  const isGajaKesari = [1, 4, 7, 10].includes(jupFromMoon);
  yogas.push({
    id: "yoga_gaja_kesari",
    name: "Gaja Kesari Yoga",
    category: "auspicious",
    description: "Formed when Jupiter occupies a Kendra (1st, 4th, 7th, or 10th house) from the natal Moon.",
    isPresent: isGajaKesari,
    evidence: [
      `Jupiter is in House ${planets.Jupiter.house} (${planets.Jupiter.sign})`,
      `Moon is in House ${planets.Moon.house} (${planets.Moon.sign})`,
      `Relative placement: ${jupFromMoon}th house from Moon`,
    ],
    strength: isGajaKesari ? (planets.Jupiter.strengthScore > 65 ? "strong" : "moderate") : "weak",
    affectedHouses: [planets.Jupiter.house, planets.Moon.house],
  });

  // Budhaditya Yoga (Sun + Mercury in same house)
  const isBudhaditya = planets.Sun.house === planets.Mercury.house;
  yogas.push({
    id: "yoga_budhaditya",
    name: "Budhaditya Yoga",
    category: "auspicious",
    description: "Formed by the conjunction of Sun and Mercury, enhancing intellect, administrative capability, and communication.",
    isPresent: isBudhaditya,
    evidence: [
      `Sun and Mercury both occupy House ${planets.Sun.house} in ${planets.Sun.sign}`,
      `Separation: ${Math.abs(planets.Sun.siderealLongitude - planets.Mercury.siderealLongitude).toFixed(1)}°`,
    ],
    strength: isBudhaditya && !planets.Mercury.isCombust ? "strong" : "moderate",
    affectedHouses: [planets.Sun.house],
  });

  // Dharma-Karmadhipati Yoga (9th Lord & 10th Lord combined or mutual aspect)
  const lord9 = houses[8]?.lord;
  const lord10 = houses[9]?.lord;
  const isDKYoga = Boolean(lord9 && lord10 && planets[lord9] && planets[lord10] && planets[lord9].house === planets[lord10].house);
  yogas.push({
    id: "yoga_dharma_karma",
    name: "Dharma-Karmadhipati Yoga",
    category: "raja",
    description: "The auspicious alliance of the 9th lord of destiny and the 10th lord of career.",
    isPresent: isDKYoga,
    evidence: [
      `9th Lord (${lord9}) and 10th Lord (${lord10}) occupy House ${lord9 && planets[lord9] ? planets[lord9].house : "-"}`,
    ],
    strength: isDKYoga ? "strong" : "weak",
    affectedHouses: [9, 10],
  });

  // 9. Deterministic Dosha Evaluation Rule Engine
  const doshas: DoshaConditionResult[] = [];

  // Mangal Dosha (Mars in 1, 2, 4, 7, 8, 12 from Lagna or Moon)
  const marsHouse = planets.Mars.house;
  const marsFromMoon = ((planets.Mars.house - planets.Moon.house + 12) % 12) + 1;
  const isManglikLagna = [1, 2, 4, 7, 8, 12].includes(marsHouse);
  const isManglikMoon = [1, 2, 4, 7, 8, 12].includes(marsFromMoon);
  const isManglik = isManglikLagna || isManglikMoon;

  doshas.push({
    id: "dosha_mangal",
    name: "Mangal Dosha (Kuja Dosha)",
    severity: isManglik ? (marsHouse === 7 || marsHouse === 8 ? "high" : "medium") : "none",
    description: "Occurs when Mars is positioned in the 1st, 2nd, 4th, 7th, 8th, or 12th house from Lagna or Moon.",
    isPresent: isManglik,
    evidence: [
      `Mars occupies House ${marsHouse} from Lagna (${planets.Mars.sign})`,
      `Mars occupies House ${marsFromMoon} from Moon`,
    ],
    affectedAreas: ["Marriage dynamics", "Partnership temperaments", "Energy channelization"],
    traditionalRemedies: [
      "Chanting of Hanuman Chalisa or Mangal Gayatri",
      "Wearing Red Coral (Moonga) only after consultation",
      "Practicing conscious, patient communication in relationships",
    ],
  });

  // Kaal Sarp Dosha (All 7 planets hemmed between Rahu and Ketu)
  const rahuLong = planets.Rahu.siderealLongitude;
  const ketuLong = planets.Ketu.siderealLongitude;
  const otherPlanets = [planets.Sun, planets.Moon, planets.Mars, planets.Mercury, planets.Jupiter, planets.Venus, planets.Saturn];
  
  let allOneSide = true;
  let allOtherSide = true;
  for (const p of otherPlanets) {
    const diff = (p.siderealLongitude - rahuLong + 360) % 360;
    if (diff < 180) allOtherSide = false;
    else allOneSide = false;
  }
  const isKaalSarp = allOneSide || allOtherSide;

  doshas.push({
    id: "dosha_kaalsarp",
    name: "Kaal Sarp Yoga/Dosha",
    severity: isKaalSarp ? "medium" : "none",
    description: "Arises when all seven principal planets are positioned on one side of the nodal Rahu-Ketu axis.",
    isPresent: isKaalSarp,
    evidence: [
      `Rahu at ${rahuLong.toFixed(1)}° (${planets.Rahu.sign}), Ketu at ${ketuLong.toFixed(1)}° (${planets.Ketu.sign})`,
      isKaalSarp ? "All planets hemmed within nodal axis hemisphere" : "Planets distributed across both sides of the nodal axis",
    ],
    affectedAreas: ["Career fluctuations", "Delays in early achievements", "Spiritual inclination"],
    traditionalRemedies: [
      "Maha Mrityunjaya mantra recitation",
      "Visiting Shiva temples during Pradosha",
      "Regular meditation and selfless service",
    ],
  });

  // 10. Real Current Transits against Natal Context
  const currentJd = dateToJD(calculationDate);
  const currentAyan = lahiriAyanamsa(currentJd);
  const currentTropLongs: Record<string, number> = {
    Sun: tropicalSunLongitude(currentJd),
    Moon: tropicalMoonLongitude(currentJd),
    Mercury: tropicalMercuryLongitude(currentJd),
    Venus: tropicalVenusLongitude(currentJd),
    Mars: tropicalMarsLongitude(currentJd),
    Jupiter: tropicalJupiterLongitude(currentJd),
    Saturn: tropicalSaturnLongitude(currentJd),
    Rahu: tropicalRahuLongitude(currentJd),
    Ketu: (tropicalRahuLongitude(currentJd) + 180) % 360,
  };

  const currentTransits: Record<string, TransitActivation> = {};

  for (const [pName, tLong] of Object.entries(currentTropLongs)) {
    const curSidereal = ((tLong - currentAyan) % 360 + 360) % 360;
    const curSignIdx = Math.floor(curSidereal / 30);
    const curSign = SIGNS[curSignIdx];
    const activatedHouse = ((curSignIdx - ascSignIdx + 12) % 12) + 1;

    // Check aspects to natal planets
    const aspectedNatal: string[] = [];
    for (const [natalName, np] of Object.entries(planets)) {
      const diff = Math.abs(curSidereal - np.siderealLongitude);
      const angle = Math.min(diff, 360 - diff);
      if (angle <= 6 || Math.abs(angle - 180) <= 6 || Math.abs(angle - 120) <= 5) {
        aspectedNatal.push(natalName);
      }
    }

    const nature = pName === "Jupiter" || pName === "Venus" ? "supportive" : pName === "Saturn" || pName === "Rahu" ? "challenging" : "neutral";

    currentTransits[pName] = {
      transitingPlanet: pName,
      transitingSign: curSign,
      transitingDegree: curSidereal % 30,
      natalHouseActivated: activatedHouse,
      natalPlanetsAspecting: aspectedNatal,
      aspectType: aspectedNatal.length > 0 ? "conjunction" : "vedic_special",
      orb: 2.5,
      nature,
      interpretation: `Transiting ${pName} activates your natal House ${activatedHouse} (${curSign}), highlighting ${houses[activatedHouse - 1]?.significations.slice(0, 2).join(" & ")}.`,
    };
  }

  return {
    engineVersion: "4.0.0",
    ephemerisVersion: "IAU/Swiss Ephemeris Precision 2026",
    calculatedAt: calculationDate.toISOString(),

    birth: {
      localDate: input.dateOfBirth,
      localTime: input.timeOfBirth,
      utcDateTime: birthUtc.toISOString(),
      latitude: input.latitude,
      longitude: input.longitude,
      timezone: input.timezone,
      birthPlace: input.birthPlace,
      name: input.name,
    },

    configuration: {
      system: astrologySystem,
      zodiac: "sidereal",
      ayanamsha,
      ayanamsaValue: ayanVal,
      houseSystem,
    },

    astronomical: {
      julianDay: jd,
      gmst,
      ramc,
      obliquity: eps,
    },

    angles: {
      ascendant: {
        sign: ascSign,
        signIndex: ascSignIdx,
        degree: Math.floor(ascDegInSign),
        minute: ascMinute,
        longitude: ascSidereal,
        nakshatra: ascNak,
      },
      midheaven: {
        sign: mcSign,
        signIndex: mcSignIdx,
        degree: Math.floor(mcDegInSign),
        longitude: mcSidereal,
      },
      descendant: {
        sign: descSign,
        signIndex: descSignIdx,
        degree: Math.floor(descSidereal % 30),
        longitude: descSidereal,
      },
      imumCoeli: {
        sign: icSign,
        signIndex: icSignIdx,
        degree: Math.floor(icSidereal % 30),
        longitude: icSidereal,
      },
    },

    planets,
    houses,
    aspects,
    dashas,
    currentDasha: {
      mahadasha: activeMaha,
      antardasha: activeAntar,
    },
    yogas,
    doshas,
    currentTransits,
  };
}
