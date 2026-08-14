/**
 * Pure deterministic astronomical math utilities.
 * No fake data. No Math.random(). All calculations are reproducible.
 */

export const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
] as const;

export type ZodiacSignName = typeof SIGNS[number];

/** Convert a Date + optional time string to Julian Day Number (UT) */
export function dateToJD(date: Date, timeStr?: string): number {
  let utcDate = date;
  if (timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    utcDate = new Date(Date.UTC(
      date.getFullYear(), date.getMonth(), date.getDate(), h || 0, m || 0
    ));
  }
  const y = utcDate.getUTCFullYear();
  const mo = utcDate.getUTCMonth() + 1;
  const d = utcDate.getUTCDate() + (utcDate.getUTCHours() + utcDate.getUTCMinutes() / 60) / 24;
  let Y = y;
  let M = mo;
  if (M <= 2) { Y -= 1; M += 12; }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + B - 1524.5;
}

/** Mean Sun longitude in degrees (tropical) from Julian Day */
export function tropicalSunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * Math.PI / 180;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * M)
          + 0.000289 * Math.sin(3 * M);
  L0 += C;
  return ((L0 % 360) + 360) % 360;
}

/** Approximate mean Moon longitude (tropical) from Julian Day */
export function tropicalMoonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  let L = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841;
  const D = (297.8501921 + 445267.1114034 * T) * Math.PI / 180;
  const M = (357.5291092 + 35999.0502909 * T) * Math.PI / 180;
  const Mprime = (134.9633964 + 477198.8675055 * T) * Math.PI / 180;
  const F = (93.2720950 + 483202.0175233 * T) * Math.PI / 180;
  // Major terms
  L += 6.288774 * Math.sin(Mprime)
     + 1.274027 * Math.sin(2 * D - Mprime)
     + 0.658314 * Math.sin(2 * D)
     + 0.213618 * Math.sin(2 * Mprime)
     - 0.185116 * Math.sin(M)
     - 0.114332 * Math.sin(2 * F)
     + 0.058793 * Math.sin(2 * D - 2 * Mprime)
     + 0.057066 * Math.sin(2 * D - M - Mprime)
     + 0.053322 * Math.sin(2 * D + Mprime)
     + 0.045758 * Math.sin(2 * D - M)
     - 0.040923 * Math.sin(M - Mprime)
     - 0.034720 * Math.sin(D)
     - 0.030383 * Math.sin(M + Mprime);
  return ((L % 360) + 360) % 360;
}

/** Approximate Mars longitude (tropical) */
export function tropicalMarsLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const M = ((19.3730 + 0.5240207766 * (jd - 2451545)) * Math.PI / 180) % (2 * Math.PI);
  let L = 355.433 + 19374.4758 * T;
  L += 10.691 * Math.sin(M) + 0.623 * Math.sin(2 * M);
  return ((L % 360) + 360) % 360;
}

/** Approximate Mercury longitude (tropical) */
export function tropicalMercuryLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  let L = 252.250906 + 149474.0722491 * T;
  const M = (174.7948 + 149474.0722491 * T) * Math.PI / 180;
  L += 23.4405 * Math.sin(M) + 2.9818 * Math.sin(2 * M) + 0.5255 * Math.sin(3 * M);
  return ((L % 360) + 360) % 360;
}

/** Approximate Venus longitude (tropical) */
export function tropicalVenusLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  let L = 181.979801 + 58519.2130302 * T;
  const M = (50.4161 + 58519.2130302 * T) * Math.PI / 180;
  L += 0.7758 * Math.sin(M) + 0.0033 * Math.sin(2 * M);
  return ((L % 360) + 360) % 360;
}

/** Approximate Jupiter longitude (tropical) */
export function tropicalJupiterLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  let L = 34.351519 + 3036.3027748 * T;
  const M = (20.9 + 3036.3 * T) * Math.PI / 180;
  L += 5.55 * Math.sin(M) + 0.168 * Math.sin(2 * M);
  return ((L % 360) + 360) % 360;
}

/** Approximate Saturn longitude (tropical) */
export function tropicalSaturnLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  let L = 50.077444 + 1223.5110686 * T;
  const M = (317.0 + 1222.11 * T) * Math.PI / 180;
  L += 6.37 * Math.sin(M) + 0.21 * Math.sin(2 * M);
  return ((L % 360) + 360) % 360;
}

/** Rahu (mean North Node) longitude - retrograde */
export function tropicalRahuLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const N = 125.04452 - 1934.136261 * T + 0.0020708 * T * T;
  return ((N % 360) + 360) % 360;
}

/** Lahiri ayanamsa (degrees) for a given JD */
export function lahiriAyanamsa(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return 23.85 + 0.01396 * T;
}

/** Convert tropical longitude to Vedic sidereal (Lahiri) */
export function toSidereal(tropicalLong: number, jd: number): number {
  return ((tropicalLong - lahiriAyanamsa(jd) + 360) % 360);
}

/** Get sign index (0-11) and degree from absolute ecliptic longitude */
export function longToSignDeg(long: number): { signIndex: number; sign: ZodiacSignName; degree: number; minute: number } {
  const norm = ((long % 360) + 360) % 360;
  const signIndex = Math.floor(norm / 30);
  const deg = norm % 30;
  return {
    signIndex,
    sign: SIGNS[signIndex],
    degree: Math.floor(deg),
    minute: Math.floor((deg % 1) * 60),
  };
}

/** Compute all 10 Vedic planet longitudes for a given JD (sidereal) */
export interface PlanetLongitudes {
  Sun: number;
  Moon: number;
  Mars: number;
  Mercury: number;
  Jupiter: number;
  Venus: number;
  Saturn: number;
  Rahu: number;
  Ketu: number;
}

export function computeVedicLongitudes(jd: number): PlanetLongitudes {
  const ayan = lahiriAyanamsa(jd);
  const sid = (l: number) => ((l - ayan + 360) % 360);
  const rahu = sid(tropicalRahuLongitude(jd));
  return {
    Sun: sid(tropicalSunLongitude(jd)),
    Moon: sid(tropicalMoonLongitude(jd)),
    Mars: sid(tropicalMarsLongitude(jd)),
    Mercury: sid(tropicalMercuryLongitude(jd)),
    Jupiter: sid(tropicalJupiterLongitude(jd)),
    Venus: sid(tropicalVenusLongitude(jd)),
    Saturn: sid(tropicalSaturnLongitude(jd)),
    Rahu: rahu,
    Ketu: (rahu + 180) % 360,
  };
}

/** 27 Vedic Nakshatras */
export const NAKSHATRAS = [
  { name: "Ashwini", ruler: "Ketu", deity: "Ashwini Kumaras" },
  { name: "Bharani", ruler: "Venus", deity: "Yama" },
  { name: "Krittika", ruler: "Sun", deity: "Agni" },
  { name: "Rohini", ruler: "Moon", deity: "Brahma" },
  { name: "Mrigashira", ruler: "Mars", deity: "Chandra" },
  { name: "Ardra", ruler: "Rahu", deity: "Rudra" },
  { name: "Punarvasu", ruler: "Jupiter", deity: "Aditi" },
  { name: "Pushya", ruler: "Saturn", deity: "Brihaspati" },
  { name: "Ashlesha", ruler: "Mercury", deity: "Nagas" },
  { name: "Magha", ruler: "Ketu", deity: "Pitris" },
  { name: "Purva Phalguni", ruler: "Venus", deity: "Bhaga" },
  { name: "Uttara Phalguni", ruler: "Sun", deity: "Aryaman" },
  { name: "Hasta", ruler: "Moon", deity: "Savita" },
  { name: "Chitra", ruler: "Mars", deity: "Vishwakarma" },
  { name: "Swati", ruler: "Rahu", deity: "Vayu" },
  { name: "Vishakha", ruler: "Jupiter", deity: "Indragni" },
  { name: "Anuradha", ruler: "Saturn", deity: "Mitra" },
  { name: "Jyeshtha", ruler: "Mercury", deity: "Indra" },
  { name: "Mula", ruler: "Ketu", deity: "Nirriti" },
  { name: "Purva Ashadha", ruler: "Venus", deity: "Apas" },
  { name: "Uttara Ashadha", ruler: "Sun", deity: "Vishvedevas" },
  { name: "Shravana", ruler: "Moon", deity: "Vishnu" },
  { name: "Dhanishta", ruler: "Mars", deity: "Ashta Vasus" },
  { name: "Shatabhisha", ruler: "Rahu", deity: "Varuna" },
  { name: "Purva Bhadrapada", ruler: "Jupiter", deity: "Aja Ekapad" },
  { name: "Uttara Bhadrapada", ruler: "Saturn", deity: "Ahirbudhyana" },
  { name: "Revati", ruler: "Mercury", deity: "Pushan" },
] as const;

export interface NakshatraResult {
  name: string;
  ruler: string;
  deity: string;
  index: number;
  pada: number;
  degree: number;
}

export function getNakshatra(longitude: number): NakshatraResult {
  const norm = ((longitude % 360) + 360) % 360;
  const nakLen = 360 / 27; // ~13.333°
  const index = Math.floor(norm / nakLen);
  const deg = norm % nakLen;
  const pada = Math.floor(deg / (nakLen / 4)) + 1;
  const nak = NAKSHATRAS[index];
  return { name: nak.name, ruler: nak.ruler, deity: nak.deity, index, pada, degree: deg };
}

/** Vimshottari Dasha order and periods */
export const DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"] as const;
export const DASHA_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

export interface DashaPeriod {
  planet: string;
  startDate: Date;
  endDate: Date;
  durationYears: number;
  isCurrent: boolean;
}

export function computeVimshottariDasha(moonLong: number, birthDate: Date): DashaPeriod[] {
  const norm = ((moonLong % 360) + 360) % 360;
  const nakLen = 360 / 27;
  const nakIndex = Math.floor(norm / nakLen);
  const degInNak = norm % nakLen;
  const fractionSpent = degInNak / nakLen;

  const startRulerIdx = nakIndex % 9;
  const now = new Date();
  const periods: DashaPeriod[] = [];
  let current = new Date(birthDate.getTime());

  for (let i = 0; i < 9; i++) {
    const planetIdx = (startRulerIdx + i) % 9;
    const planet = DASHA_ORDER[planetIdx];
    const totalYears = DASHA_YEARS[planet];
    const yearsForThis = i === 0 ? totalYears * (1 - fractionSpent) : totalYears;

    const start = new Date(current.getTime());
    const ms = yearsForThis * 365.25 * 24 * 60 * 60 * 1000;
    const end = new Date(current.getTime() + ms);

    periods.push({
      planet,
      startDate: start,
      endDate: end,
      durationYears: yearsForThis,
      isCurrent: now >= start && now < end,
    });

    current = end;
  }
  return periods;
}

/** Simple deterministic hash (no Math.random) */
export function deterministicHash(seed: number): number {
  // xorshift-based integer hash
  let x = seed >>> 0;
  x ^= x << 13;
  x ^= x >> 17;
  x ^= x << 5;
  return (x >>> 0) / 0xFFFFFFFF;
}

/** Map a float 0..1 into an integer score bounded by min/max */
export function scoreFromHash(h: number, min: number, max: number): number {
  return Math.round(min + h * (max - min));
}
