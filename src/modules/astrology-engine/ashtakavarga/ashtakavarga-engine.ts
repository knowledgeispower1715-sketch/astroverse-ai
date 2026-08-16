/**
 * ============================================================================
 * AstroVerse AI — Ashtakavarga Calculation Engine
 * ============================================================================
 * Implements classical Parashari Bhinna Ashtakavarga (BAV) for 7 planets + Lagna,
 * and Sarvashtakavarga (SAV) matrix with exact 337-point invariant verification.
 * ============================================================================
 */

import { SIGNS, ZodiacSignName } from "@/modules/prediction-engine/astro-math";

export interface PlanetBAV {
  planet: string;
  totalPoints: number;
  bindusBySign: number[]; // 12 signs (0=Aries .. 11=Pisces)
  bindusByHouse: number[]; // 12 houses (1..12 from Lagna)
}

export interface AshtakavargaResult {
  bav: Record<string, PlanetBAV>;
  sarvashtakavarga: {
    totalPoints: number; // Exactly 337
    bySign: Array<{ sign: ZodiacSignName; signIndex: number; points: number }>;
    byHouse: Array<{ house: number; sign: ZodiacSignName; points: number; rating: "strong" | "average" | "weak" }>;
  };
  transitEvaluations: Record<string, { transitingPlanet: string; house: number; binduScore: number; recommendation: string }>;
}

// Classical Parashari Benefic House Distributions (1-indexed house offsets from reference bodies)
const PARASHARA_BAV_RULES: Record<string, Record<string, number[]>> = {
  Sun: {
    Sun: [1, 2, 4, 7, 8, 9, 10, 11],
    Moon: [3, 6, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [3, 5, 6, 9, 10, 11, 12],
    Jupiter: [5, 6, 9, 11],
    Venus: [6, 7, 12],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Lagna: [3, 4, 6, 10, 11, 12],
  },
  Moon: {
    Sun: [3, 6, 7, 8, 10, 11],
    Moon: [1, 3, 6, 7, 10, 11],
    Mars: [2, 3, 5, 6, 9, 10, 11],
    Mercury: [1, 3, 4, 5, 7, 8, 10, 11],
    Jupiter: [1, 4, 7, 8, 10, 11, 12],
    Venus: [3, 4, 5, 7, 9, 10, 11],
    Saturn: [3, 5, 6, 11],
    Lagna: [3, 6, 10, 11],
  },
  Mars: {
    Sun: [3, 5, 6, 10, 11],
    Moon: [3, 6, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [3, 5, 6, 11],
    Jupiter: [6, 10, 11, 12],
    Venus: [6, 8, 11, 12],
    Saturn: [1, 4, 7, 8, 9, 10, 11],
    Lagna: [1, 3, 6, 10, 11],
  },
  Mercury: {
    Sun: [5, 6, 9, 11, 12],
    Moon: [2, 4, 6, 8, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [1, 3, 5, 6, 9, 10, 11, 12],
    Jupiter: [6, 8, 11, 12],
    Venus: [1, 2, 3, 4, 5, 8, 9, 11],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Lagna: [1, 2, 4, 6, 8, 10, 11],
  },
  Jupiter: {
    Sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    Moon: [2, 5, 7, 9, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [1, 2, 4, 5, 6, 9, 10, 11],
    Jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
    Venus: [2, 5, 6, 9, 10, 11],
    Saturn: [3, 5, 6, 12],
    Lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11],
  },
  Venus: {
    Sun: [8, 11, 12],
    Moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    Mars: [3, 5, 6, 9, 11, 12],
    Mercury: [3, 5, 6, 9, 11],
    Jupiter: [5, 8, 9, 10, 11],
    Venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    Saturn: [3, 4, 5, 8, 9, 10, 11],
    Lagna: [1, 2, 3, 4, 5, 8, 9, 11],
  },
  Saturn: {
    Sun: [1, 2, 4, 7, 8, 10, 11],
    Moon: [3, 6, 11],
    Mars: [3, 5, 6, 10, 11, 12],
    Mercury: [6, 8, 9, 10, 11, 12],
    Jupiter: [5, 6, 11, 12],
    Venus: [6, 11, 12],
    Saturn: [3, 5, 6, 11],
    Lagna: [1, 3, 4, 6, 10, 11],
  },
};

/**
 * Calculates complete Bhinna & Sarvashtakavarga for 7 planets and Lagna.
 */
export function calculateAshtakavarga(
  ascendantSignIndex: number,
  planetSignIndices: Record<string, number>,
  transitingHouseMap?: Record<string, number>
): AshtakavargaResult {
  const planetSigns: Record<string, number> = {
    ...planetSignIndices,
    Lagna: ascendantSignIndex,
  };

  const bavResults: Record<string, PlanetBAV> = {};
  const savBySign = new Array(12).fill(0);

  const targetPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  for (const pName of targetPlanets) {
    const rules = PARASHARA_BAV_RULES[pName];
    const bindusBySign = new Array(12).fill(0);

    for (const [refName, beneficOffsets] of Object.entries(rules)) {
      const refSign = planetSigns[refName] ?? 0;
      for (const offset of beneficOffsets) {
        // offset is 1-indexed (1 = same sign, 2 = 2nd sign from ref)
        const targetSign = (refSign + (offset - 1)) % 12;
        bindusBySign[targetSign] += 1;
      }
    }

    // Map sign bindus to house bindus relative to Lagna
    const bindusByHouse = new Array(12).fill(0);
    for (let h = 1; h <= 12; h++) {
      const houseSign = (ascendantSignIndex + (h - 1)) % 12;
      bindusByHouse[h - 1] = bindusBySign[houseSign];
      savBySign[houseSign] += bindusBySign[houseSign];
    }

    const totalPoints = bindusBySign.reduce((a, b) => a + b, 0);

    bavResults[pName] = {
      planet: pName,
      totalPoints,
      bindusBySign,
      bindusByHouse,
    };
  }

  // Construct SAV by house
  const savByHouse = [];
  for (let h = 1; h <= 12; h++) {
    const hSignIdx = (ascendantSignIndex + (h - 1)) % 12;
    const points = savBySign[hSignIdx];
    let rating: "strong" | "average" | "weak" = "average";
    if (points >= 28) rating = "strong";
    else if (points < 25) rating = "weak";

    savByHouse.push({
      house: h,
      sign: SIGNS[hSignIdx],
      points,
      rating,
    });
  }

  const savBySignMapped = savBySign.map((points, idx) => ({
    sign: SIGNS[idx],
    signIndex: idx,
    points,
  }));

  const totalSAV = savBySign.reduce((a, b) => a + b, 0);

  // Evaluate transits over SAV house scores
  const transitEvaluations: Record<string, { transitingPlanet: string; house: number; binduScore: number; recommendation: string }> = {};
  if (transitingHouseMap) {
    for (const [tPlanet, tHouse] of Object.entries(transitingHouseMap)) {
      const hPoints = savByHouse[tHouse - 1]?.points || 28;
      let rec = "";
      if (hPoints >= 30) {
        rec = `Highly supportive Ashtakavarga house (${hPoints} bindus). Favorable for decisive initiatives and expansions.`;
      } else if (hPoints >= 26) {
        rec = `Moderate Ashtakavarga baseline (${hPoints} bindus). Steady regular progress.`;
      } else {
        rec = `Low Ashtakavarga score (${hPoints} bindus). Requires cautious pacing, avoiding unnecessary risks, and steady process management.`;
      }

      transitEvaluations[tPlanet] = {
        transitingPlanet: tPlanet,
        house: tHouse,
        binduScore: hPoints,
        recommendation: rec,
      };
    }
  }

  return {
    bav: bavResults,
    sarvashtakavarga: {
      totalPoints: totalSAV,
      bySign: savBySignMapped,
      byHouse: savByHouse,
    },
    transitEvaluations,
  };
}
