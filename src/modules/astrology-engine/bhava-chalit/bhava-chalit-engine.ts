/**
 * ============================================================================
 * AstroVerse AI — Bhava Chalit (Cusp Midpoint) Engine
 * ============================================================================
 * Calculates exact Bhava Madhyas (Cusps) and Bhava Sandhis (Boundaries)
 * and determines true Bhava planetary occupants and house shifts.
 * ============================================================================
 */

import { SIGNS, ZodiacSignName } from "@/modules/prediction-engine/astro-math";

export interface BhavaCuspDetail {
  house: number;
  sign: ZodiacSignName;
  midpointLongitude: number; // Bhava Madhya
  startLongitude: number; // Bhava Sandhi Start
  endLongitude: number; // Bhava Sandhi End
  formattedMadhya: string;
  occupants: string[];
}

export interface BhavaPlanetShift {
  planet: string;
  rashiHouse: number;
  bhavaHouse: number;
  isShifted: boolean;
  shiftDirection: "forward" | "backward" | "same";
  explanation: string;
}

export interface BhavaChalitResult {
  cusps: BhavaCuspDetail[];
  shifts: BhavaPlanetShift[];
}

/**
 * Calculates genuine Sripati / Midpoint Bhava Chalit chart and planetary house shifts.
 */
export function calculateBhavaChalit(
  ascendantSidereal: number,
  planetLongitudes: Record<string, number>,
  rashiHouses: Record<string, number>
): BhavaChalitResult {
  const normAsc = ((ascendantSidereal % 360) + 360) % 360;
  const cusps: BhavaCuspDetail[] = [];

  // Generate 12 Bhava Madhyas starting from Ascendant
  const madhyas: number[] = [];
  for (let h = 0; h < 12; h++) {
    madhyas.push(((normAsc + h * 30) % 360 + 360) % 360);
  }

  // Generate Sandhis (midpoints between adjacent Madhyas: 15° before and 15° after each Madhya)
  for (let h = 0; h < 12; h++) {
    const curMadhya = madhyas[h];
    const startLong = ((curMadhya - 15) % 360 + 360) % 360;
    const endLong = ((curMadhya + 15) % 360 + 360) % 360;

    const signIdx = Math.floor(curMadhya / 30);
    const deg = curMadhya % 30;
    const degFloor = Math.floor(deg);
    const minFloor = Math.floor((deg % 1) * 60);

    cusps.push({
      house: h + 1,
      sign: SIGNS[signIdx],
      midpointLongitude: curMadhya,
      startLongitude: startLong,
      endLongitude: endLong,
      formattedMadhya: `${degFloor}° ${minFloor}' ${SIGNS[signIdx]}`,
      occupants: [],
    });
  }

  // Assign planets to Bhavas based on Sandhi boundaries
  const shifts: BhavaPlanetShift[] = [];

  for (const [pName, longVal] of Object.entries(planetLongitudes)) {
    const normP = ((longVal % 360) + 360) % 360;
    let bhavaHouse = 1;

    // Check which Bhava Sandhi interval contains this longitude
    for (let h = 0; h < 12; h++) {
      const start = cusps[h].startLongitude;
      const span = ((normP - start + 360) % 360);
      if (span < 30.0) {
        bhavaHouse = h + 1;
        cusps[h].occupants.push(pName);
        break;
      }
    }

    const rHouse = rashiHouses[pName] || bhavaHouse;
    const isShifted = rHouse !== bhavaHouse;
    let shiftDirection: BhavaPlanetShift["shiftDirection"] = "same";
    let explanation = `${pName} occupies House ${bhavaHouse} consistently across Rashi and Bhava Chalit.`;

    if (isShifted) {
      if (bhavaHouse > rHouse || (rHouse === 12 && bhavaHouse === 1)) {
        shiftDirection = "forward";
        explanation = `${pName} is located in the later degrees of its Rashi sign, shifting forward into Bhava ${bhavaHouse} in the Chalit chart.`;
      } else {
        shiftDirection = "backward";
        explanation = `${pName} is located in the initial degrees before the cusp midpoint, shifting back into Bhava ${bhavaHouse} in the Chalit chart.`;
      }
    }

    shifts.push({
      planet: pName,
      rashiHouse: rHouse,
      bhavaHouse,
      isShifted,
      shiftDirection,
      explanation,
    });
  }

  return {
    cusps,
    shifts,
  };
}
