export interface NakshatraDetails {
  name: string;
  ruler: string;
  degreeInNakshatra: number;
  padha: number;
}

export interface VimshottariDashaPeriod {
  planet: string;
  durationYears: number;
  startDate: Date;
  endDate: Date;
}

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
  "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const RULERS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

const DASHA_PERIODS: Record<string, number> = {
  "Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10, "Mars": 7, "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17
};

export function calculateNakshatra(longitude: number): NakshatraDetails {
  const normalizedLong = ((longitude % 360) + 360) % 360;
  const nakshatraLength = 360 / 27; // 13.3333 degrees
  const index = Math.floor(normalizedLong / nakshatraLength);
  const degreeInNak = normalizedLong % nakshatraLength;
  const padha = Math.floor(degreeInNak / (nakshatraLength / 4)) + 1;

  return {
    name: NAKSHATRAS[index],
    ruler: RULERS[index % 9],
    degreeInNakshatra: degreeInNak,
    padha
  };
}

export function calculateVimshottariDasha(
  moonLongitude: number,
  birthDate: Date
): VimshottariDashaPeriod[] {
  const normalizedLong = ((moonLongitude % 360) + 360) % 360;
  const nakshatraLength = 360 / 27;
  const index = Math.floor(normalizedLong / nakshatraLength);
  const degreeInNak = normalizedLong % nakshatraLength;
  
  const startingRulerIndex = index % 9;
  const fractionSpent = degreeInNak / nakshatraLength;
  const fractionLeft = 1 - fractionSpent;

  const timeline: VimshottariDashaPeriod[] = [];
  let currentDate = new Date(birthDate.getTime());

  for (let i = 0; i < 9; i++) {
    const planetIdx = (startingRulerIndex + i) % 9;
    const planetName = RULERS[planetIdx];
    const totalYears = DASHA_PERIODS[planetName];
    
    // The first dasha starts at birth and lasts for the fraction left of its period
    const yearsForThisPeriod = i === 0 ? totalYears * fractionLeft : totalYears;
    
    const startDate = new Date(currentDate.getTime());
    const endDate = new Date(currentDate.getTime());
    endDate.setFullYear(endDate.getFullYear() + Math.floor(yearsForThisPeriod));
    endDate.setMonth(endDate.getMonth() + Math.floor((yearsForThisPeriod % 1) * 12));

    timeline.push({
      planet: planetName,
      durationYears: yearsForThisPeriod,
      startDate,
      endDate
    });

    currentDate = new Date(endDate.getTime());
  }

  return timeline;
}

export function calculateNavamsa(planetLongitude: number): { sign: string; degree: number } {
  const normalizedLong = ((planetLongitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLong / 30);
  const degreeInSign = normalizedLong % 30;
  const padhaIndex = Math.floor(degreeInSign / 3.3333); // 3°20' per padha

  let navamsaSignIdx = 0;
  const element = signIndex % 4; // 0: Fire, 1: Earth, 2: Air, 3: Water

  if (element === 0) { // Aries, Leo, Sagittarius starts from Aries
    navamsaSignIdx = padhaIndex;
  } else if (element === 1) { // Taurus, Virgo, Capricorn starts from Capricorn (index 9)
    navamsaSignIdx = (9 + padhaIndex) % 12;
  } else if (element === 2) { // Gemini, Libra, Aquarius starts from Libra (index 6)
    navamsaSignIdx = (6 + padhaIndex) % 12;
  } else { // Cancer, Scorpio, Pisces starts from Cancer (index 3)
    navamsaSignIdx = (3 + padhaIndex) % 12;
  }

  const signs = [
    "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
    "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"
  ];

  return {
    sign: signs[navamsaSignIdx],
    degree: (padhaIndex * 3.3333) % 30
  };
}

export function calculatePlanetStrength(planetName: string, longitude: number): number {
  const normalizedLong = ((longitude % 360) + 360) % 360;
  
  // Exaltation longitudes in Vedic system (Mesha=0, Vrishabha=30, Mithuna=60, etc.)
  const EXALTATIONS: Record<string, { signIndex: number; degree: number }> = {
    "Sun": { signIndex: 0, degree: 10 },       // Aries 10°
    "Moon": { signIndex: 1, degree: 3 },       // Taurus 3°
    "Mars": { signIndex: 9, degree: 28 },      // Capricorn 28°
    "Mercury": { signIndex: 5, degree: 15 },   // Virgo 15°
    "Jupiter": { signIndex: 3, degree: 5 },     // Cancer 5°
    "Venus": { signIndex: 11, degree: 27 },    // Pisces 27°
    "Saturn": { signIndex: 6, degree: 20 }      // Libra 20°
  };

  const exData = EXALTATIONS[planetName];
  if (!exData) return 50; // default average strength for outer planets / nodes

  const exaltationLong = exData.signIndex * 30 + exData.degree;
  const debilitationLong = (exaltationLong + 180) % 360;

  // Calculate distance to debilitation point. The closer to debilitation, the weaker.
  // The distance ranges from 0 to 180.
  const distanceToDebilitation = Math.min(
    Math.abs(normalizedLong - debilitationLong),
    360 - Math.abs(normalizedLong - debilitationLong)
  );

  // Map to a percentage from 20% (debilitated) to 100% (exalted)
  const strength = 20 + (distanceToDebilitation / 180) * 80;
  return Math.round(strength);
}
