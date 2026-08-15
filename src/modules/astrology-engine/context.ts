import {
  dateToJD,
  computeVedicLongitudes,
  getNakshatra,
  longToSignDeg,
  computeVimshottariDasha,
  SIGNS,
  type ZodiacSignName,
  type NakshatraResult,
  type DashaPeriod,
  tropicalSunLongitude,
  tropicalMoonLongitude,
  tropicalMarsLongitude,
  tropicalMercuryLongitude,
  tropicalJupiterLongitude,
  tropicalVenusLongitude,
  tropicalSaturnLongitude,
  tropicalRahuLongitude,
  lahiriAyanamsa,
} from "@/modules/prediction-engine/astro-math";
import { localBirthTimeToUTC } from "@/modules/location-engine/timezone";

export interface BirthProfileInput {
  name: string;
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:MM or HH:MM:SS
  birthPlace: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isApproximateTime?: boolean;
  isUnknownTime?: boolean;
}

export interface CalculatedPlanet {
  name: string;
  siderealLongitude: number;
  tropicalLongitude: number;
  sign: ZodiacSignName;
  degreeInSign: number;
  minuteInSign: number;
  house: number;
  nakshatra: NakshatraResult;
  isRetrograde: boolean;
}

export interface CalculatedHouse {
  houseNumber: number;
  sign: ZodiacSignName;
  degree: number;
  planets: string[];
}

export interface UserAstrologyContext {
  profile: BirthProfileInput;
  utcDate: Date;
  julianDay: number;
  ayanamsa: number;
  ascendant: {
    sign: ZodiacSignName;
    degree: number;
    minute: number;
    longitude: number;
    nakshatra: NakshatraResult;
  };
  moon: {
    sign: ZodiacSignName;
    degree: number;
    nakshatra: NakshatraResult;
    longitude: number;
  };
  sun: {
    sign: ZodiacSignName;
    degree: number;
    longitude: number;
  };
  planets: Record<string, CalculatedPlanet>;
  houses: CalculatedHouse[];
  dashas: DashaPeriod[];
  currentDasha: DashaPeriod | null;
  yogas: { name: string; description: string; isPresent: boolean }[];
  doshas: { name: string; description: string; isPresent: boolean; remedies: string[] }[];
}

/**
 * Calculates accurate Ascendant (Lagna) in degrees [0, 360) given JD, Latitude, and Longitude.
 */
function calculateAscendantLongitude(jd: number, lat: number, lng: number, ayanamsa: number): number {
  // Greenwich Mean Sidereal Time (GMST) in hours
  const T = (jd - 2451545.0) / 36525.0;
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000.0;
  gmst = ((gmst % 360) + 360) % 360;

  // Local Sidereal Time (RAMC) in degrees
  const ramc = ((gmst + lng) % 360 + 360) % 360;
  const ramcRad = (ramc * Math.PI) / 180.0;
  const latRad = (lat * Math.PI) / 180.0;
  const epsRad = (23.4392911 * Math.PI) / 180.0; // Obliquity of ecliptic

  // Tropical Ascendant formula: tan(Asc) = -cos(RAMC) / (sin(RAMC)*cos(eps) + tan(lat)*sin(eps))
  const y = -Math.cos(ramcRad);
  const x = Math.sin(ramcRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad);
  let ascTropicalDeg = (Math.atan2(y, x) * 180.0) / Math.PI;
  ascTropicalDeg = ((ascTropicalDeg % 360) + 360) % 360;

  // Sidereal Ascendant (Vedic Lagna) = Tropical Ascendant - Lahiri Ayanamsa
  return ((ascTropicalDeg - ayanamsa + 360) % 360);
}

/**
 * Canonical builder: Builds the unified astrology context for any given birth profile.
 */
export function buildUserAstrologyContext(input: BirthProfileInput): UserAstrologyContext {
  // 1. Resolve UTC date & time
  const utcDate = localBirthTimeToUTC(input.dateOfBirth, input.timeOfBirth || "12:00:00", input.timezone || "UTC");
  const jd = dateToJD(utcDate);
  const ayan = lahiriAyanamsa(jd);

  // 2. Compute Sidereal Lagna (Ascendant)
  const lagnaLong = calculateAscendantLongitude(jd, input.latitude, input.longitude, ayan);
  const lagnaPos = longToSignDeg(lagnaLong);
  const lagnaNak = getNakshatra(lagnaLong);

  // 3. Compute Sidereal Longitudes for all Grahas
  const siderealLongitudes = computeVedicLongitudes(jd);

  // Tropical equivalents
  const tropicalLongitudes: Record<string, number> = {
    Sun: tropicalSunLongitude(jd),
    Moon: tropicalMoonLongitude(jd),
    Mars: tropicalMarsLongitude(jd),
    Mercury: tropicalMercuryLongitude(jd),
    Jupiter: tropicalJupiterLongitude(jd),
    Venus: tropicalVenusLongitude(jd),
    Saturn: tropicalSaturnLongitude(jd),
    Rahu: tropicalRahuLongitude(jd),
    Ketu: (tropicalRahuLongitude(jd) + 180) % 360,
  };

  const ascSignIdx = SIGNS.indexOf(lagnaPos.sign);

  // 4. Build Planets mapping
  const planets: Record<string, CalculatedPlanet> = {};
  const planetNames = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"] as const;

  for (const name of planetNames) {
    const sidLong = siderealLongitudes[name];
    const tropLong = tropicalLongitudes[name];
    const pos = longToSignDeg(sidLong);
    const nak = getNakshatra(sidLong);
    const signIdx = SIGNS.indexOf(pos.sign);
    const house = ((signIdx - ascSignIdx + 12) % 12) + 1;

    planets[name] = {
      name,
      siderealLongitude: sidLong,
      tropicalLongitude: tropLong,
      sign: pos.sign,
      degreeInSign: pos.degree,
      minuteInSign: pos.minute,
      house,
      nakshatra: nak,
      isRetrograde: name === "Rahu" || name === "Ketu", // Mean lunar nodes are retrograde
    };
  }

  // 5. Build 12 Houses
  const houses: CalculatedHouse[] = [];
  for (let i = 0; i < 12; i++) {
    const houseSignIdx = (ascSignIdx + i) % 12;
    const houseSign = SIGNS[houseSignIdx];
    const occupants = Object.values(planets)
      .filter((p) => p.house === i + 1)
      .map((p) => p.name);

    houses.push({
      houseNumber: i + 1,
      sign: houseSign,
      degree: lagnaPos.degree,
      planets: occupants,
    });
  }

  // 6. Vimshottari Dasha
  const dashas = computeVimshottariDasha(siderealLongitudes.Moon, utcDate);
  const currentDasha = dashas.find((d) => d.isCurrent) || dashas[0] || null;

  // 7. Core Vedic Yogas
  const sunSign = planets.Sun.sign;
  const mercSign = planets.Mercury.sign;
  const jupHouse = planets.Jupiter.house;
  const marsHouse = planets.Mars.house;

  // Budhaditya Yoga: Sun and Mercury together
  const budhaditya = sunSign === mercSign;

  // Gajakesari Yoga: Jupiter in Kendra (1, 4, 7, 10) from Moon
  const jupFromMoon = ((planets.Jupiter.house - planets.Moon.house + 12) % 12) + 1;
  const gajakesari = [1, 4, 7, 10].includes(jupFromMoon);

  // Raja Yoga: 9th & 10th lords connection or Kendra/Trikona auspicious alignment
  const rajaYoga = [1, 5, 9].includes(jupHouse) || [1, 5, 9].includes(planets.Venus.house);

  const yogas = [
    {
      name: "Budhaditya Yoga",
      description: "Sun and Mercury conjunction enhances intellect, communication, and administrative acumen.",
      isPresent: budhaditya,
    },
    {
      name: "Gajakesari Yoga",
      description: "Jupiter in kendra from Moon brings wisdom, reputation, enduring prosperity, and moral courage.",
      isPresent: gajakesari,
    },
    {
      name: "Raja Yoga",
      description: "Benefic alignment across kendra and trikona houses conferring authority and leadership.",
      isPresent: rajaYoga,
    },
  ];

  // 8. Doshas
  // Mangal Dosha: Mars in 1, 4, 7, 8, or 12 from Lagna or Moon
  const mangalDoshaLagna = [1, 4, 7, 8, 12].includes(marsHouse);
  const doshas = [
    {
      name: "Mangal Dosha (Kuja Dosha)",
      description: mangalDoshaLagna
        ? "Mars occupies an intense placement influencing temperament, vitality, and partnership dynamics."
        : "No significant Mangal dosha affliction detected in primary natal chart.",
      isPresent: mangalDoshaLagna,
      remedies: mangalDoshaLagna
        ? ["Chant Hanuman Chalisa on Tuesdays", "Wear red coral or perform charitable deeds on Tuesdays", "Meditate for emotional grounding"]
        : [],
    },
  ];

  return {
    profile: input,
    utcDate,
    julianDay: jd,
    ayanamsa: ayan,
    ascendant: {
      sign: lagnaPos.sign,
      degree: lagnaPos.degree,
      minute: lagnaPos.minute,
      longitude: lagnaLong,
      nakshatra: lagnaNak,
    },
    moon: {
      sign: planets.Moon.sign,
      degree: planets.Moon.degreeInSign,
      nakshatra: planets.Moon.nakshatra,
      longitude: planets.Moon.siderealLongitude,
    },
    sun: {
      sign: planets.Sun.sign,
      degree: planets.Sun.degreeInSign,
      longitude: planets.Sun.siderealLongitude,
    },
    planets,
    houses,
    dashas,
    currentDasha,
    yogas,
    doshas,
  };
}
