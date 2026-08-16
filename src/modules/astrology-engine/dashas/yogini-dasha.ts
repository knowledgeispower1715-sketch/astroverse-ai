/**
 * ============================================================================
 * AstroVerse AI — Yogini Dasha Engine
 * ============================================================================
 * Calculates classical 36-year cycle Yogini Dashas (Mangala through Sankata)
 * derived from exact sidereal Moon Nakshatra position and balance at birth.
 * ============================================================================
 */

export interface YoginiDashaPeriod {
  name: string;
  rulerPlanet: string;
  durationYears: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

const YOGINI_ORDER = [
  { name: "Mangala", ruler: "Moon", years: 1 },
  { name: "Pingala", ruler: "Sun", years: 2 },
  { name: "Dhanya", ruler: "Jupiter", years: 3 },
  { name: "Bhramari", ruler: "Mars", years: 4 },
  { name: "Bhadrika", ruler: "Mercury", years: 5 },
  { name: "Ulka", ruler: "Saturn", years: 6 },
  { name: "Siddha", ruler: "Venus", years: 7 },
  { name: "Sankata", ruler: "Rahu", years: 8 },
];

/**
 * Calculates complete Yogini Dasha sequence for a native.
 */
export function calculateYoginiDasha(
  moonSiderealLong: number,
  birthUtc: Date
): YoginiDashaPeriod[] {
  const norm = ((moonSiderealLong % 360) + 360) % 360;
  const nakLength = 360 / 27;
  const nakIdx = Math.floor(norm / nakLength); // 0..26
  const degInNak = norm % nakLength;

  // Starting Yogini: (Nakshatra Number + 3) mod 8 (where Ashwini = 1)
  const nakNumber = nakIdx + 1;
  const startingYoginiIdx = (nakNumber + 3 - 1) % 8;

  const fractionSpent = degInNak / nakLength;
  const fractionLeft = 1 - fractionSpent;

  const nowMs = Date.now();
  const periods: YoginiDashaPeriod[] = [];
  let curDate = new Date(birthUtc.getTime());

  // Generate 2 full cycles (72 years coverage)
  for (let cycle = 0; cycle < 2; cycle++) {
    for (let i = 0; i < 8; i++) {
      const idx = (startingYoginiIdx + i) % 8;
      const yogini = YOGINI_ORDER[idx];
      const years = (cycle === 0 && i === 0) ? yogini.years * fractionLeft : yogini.years;

      const startDate = new Date(curDate.getTime());
      const endDate = new Date(curDate.getTime() + years * 365.25 * 86400000);
      const isCurrent = nowMs >= startDate.getTime() && nowMs < endDate.getTime();

      periods.push({
        name: yogini.name,
        rulerPlanet: yogini.ruler,
        durationYears: Math.round(years * 100) / 100,
        startDate: startDate.toISOString().slice(0, 10),
        endDate: endDate.toISOString().slice(0, 10),
        isCurrent,
      });

      curDate = endDate;
    }
  }

  return periods;
}
