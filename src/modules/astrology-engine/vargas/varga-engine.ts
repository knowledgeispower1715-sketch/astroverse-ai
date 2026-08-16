/**
 * ============================================================================
 * AstroVerse AI — Shodashvarga Divisional Charts Engine
 * ============================================================================
 * Implements genuine mathematical algorithms for all 16 traditional Vargas:
 * D1, D2, D3, D4, D7, D9, D10, D12, D16, D20, D24, D27, D30, D40, D45, D60
 * ============================================================================
 */

import { SIGNS, ZodiacSignName } from "@/modules/prediction-engine/astro-math";

export interface VargaPlanetPlacement {
  planet: string;
  sign: ZodiacSignName;
  signIndex: number; // 0..11
  degree: number;
  houseFromLagna: number;
}

export interface VargaChartResult {
  vargaCode: string; // e.g. "D9"
  name: string;
  divisionNumber: number;
  signification: string;
  sensitivityWarning?: string;
  ascendant: {
    sign: ZodiacSignName;
    signIndex: number;
    degree: number;
  };
  planets: Record<string, VargaPlanetPlacement>;
}

/**
 * Generic Varga computation engine according to classical Parashari principles.
 */
export function calculateVargaPosition(
  siderealLongitude: number,
  divisionNumber: number
): { sign: ZodiacSignName; signIndex: number; degree: number } {
  const norm = ((siderealLongitude % 360) + 360) % 360;
  const signIndex = Math.floor(norm / 30);
  const degInSign = norm % 30;
  const partSize = 30 / divisionNumber;
  const partIndex = Math.floor(degInSign / partSize);
  const degInPart = (degInSign % partSize) * divisionNumber;

  let vargaSignIndex = 0;

  switch (divisionNumber) {
    case 1: // D1 Rashi
      vargaSignIndex = signIndex;
      break;

    case 2: // D2 Hora (Odd signs: Sun 0-15° Leo, Moon 15-30° Cancer. Even signs: Moon 0-15° Cancer, Sun 15-30° Leo)
      if (signIndex % 2 === 0) {
        // Odd sign (Aries, Gemini, etc. - 0-indexed: 0, 2, 4)
        vargaSignIndex = partIndex === 0 ? 4 : 3; // Leo (4) or Cancer (3)
      } else {
        // Even sign
        vargaSignIndex = partIndex === 0 ? 3 : 4; // Cancer (3) or Leo (4)
      }
      break;

    case 3: // D3 Drekkana (1st part: same sign, 2nd: 5th from it, 3rd: 9th from it)
      vargaSignIndex = (signIndex + partIndex * 4) % 12;
      break;

    case 4: // D4 Chaturthamsha (1st: same, 2nd: 4th, 3rd: 7th, 4th: 10th from it)
      vargaSignIndex = (signIndex + partIndex * 3) % 12;
      break;

    case 7: // D7 Saptamsha (Odd signs: starts from same sign. Even signs: starts from 7th from it)
      if (signIndex % 2 === 0) {
        vargaSignIndex = (signIndex + partIndex) % 12;
      } else {
        vargaSignIndex = (signIndex + 6 + partIndex) % 12;
      }
      break;

    case 9: // D9 Navamsa (Fire: Aries, Earth: Capricorn, Air: Libra, Water: Cancer)
      {
        const element = signIndex % 4;
        let startSign = 0;
        if (element === 0) startSign = 0; // Aries
        else if (element === 1) startSign = 9; // Capricorn
        else if (element === 2) startSign = 6; // Libra
        else startSign = 3; // Cancer
        vargaSignIndex = (startSign + partIndex) % 12;
      }
      break;

    case 10: // D10 Dashamsha (Odd: starts from same sign. Even: starts from 9th from it)
      if (signIndex % 2 === 0) {
        vargaSignIndex = (signIndex + partIndex) % 12;
      } else {
        vargaSignIndex = (signIndex + 8 + partIndex) % 12;
      }
      break;

    case 12: // D12 Dwadashamsha (Starts from the sign itself and counts consecutively)
      vargaSignIndex = (signIndex + partIndex) % 12;
      break;

    case 16: // D16 Shodashamsha (Movable: Aries, Fixed: Leo, Dual: Sagittarius)
      {
        const modality = signIndex % 3;
        let startSign = 0;
        if (modality === 0) startSign = 0; // Aries
        else if (modality === 1) startSign = 4; // Leo
        else startSign = 8; // Sagittarius
        vargaSignIndex = (startSign + partIndex) % 12;
      }
      break;

    case 20: // D20 Vimshamsha (Movable: Aries, Fixed: Sagittarius, Dual: Leo)
      {
        const modality = signIndex % 3;
        let startSign = 0;
        if (modality === 0) startSign = 0;
        else if (modality === 1) startSign = 8;
        else startSign = 4;
        vargaSignIndex = (startSign + partIndex) % 12;
      }
      break;

    case 24: // D24 Chaturvimshamsha / Siddhamsa (Odd: Leo, Even: Cancer)
      if (signIndex % 2 === 0) {
        vargaSignIndex = (4 + partIndex) % 12; // Starts from Leo
      } else {
        vargaSignIndex = (3 + partIndex) % 12; // Starts from Cancer
      }
      break;

    case 27: // D27 Saptavimshamsha / Nakshatramsha (Fire: Aries, Earth: Cancer, Air: Libra, Water: Capricorn)
      {
        const element = signIndex % 4;
        let startSign = 0;
        if (element === 0) startSign = 0;
        else if (element === 1) startSign = 3;
        else if (element === 2) startSign = 6;
        else startSign = 9;
        vargaSignIndex = (startSign + partIndex) % 12;
      }
      break;

    case 30: // D30 Trimshamsha (Degrees allocated to Mars, Saturn, Jupiter, Mercury, Venus)
      if (signIndex % 2 === 0) {
        // Odd signs: Mars (0-5° Aries), Saturn (5-10° Aquarius), Jupiter (10-18° Sagittarius), Mercury (18-25° Gemini), Venus (25-30° Libra)
        if (degInSign < 5) vargaSignIndex = 0; // Aries
        else if (degInSign < 10) vargaSignIndex = 10; // Aquarius
        else if (degInSign < 18) vargaSignIndex = 8; // Sagittarius
        else if (degInSign < 25) vargaSignIndex = 2; // Gemini
        else vargaSignIndex = 6; // Libra
      } else {
        // Even signs: Venus (0-5° Taurus), Mercury (5-12° Virgo), Jupiter (12-20° Pisces), Saturn (20-25° Capricorn), Mars (25-30° Scorpio)
        if (degInSign < 5) vargaSignIndex = 1; // Taurus
        else if (degInSign < 12) vargaSignIndex = 5; // Virgo
        else if (degInSign < 20) vargaSignIndex = 11; // Pisces
        else if (degInSign < 25) vargaSignIndex = 9; // Capricorn
        else vargaSignIndex = 7; // Scorpio
      }
      break;

    case 40: // D40 Khavedamsha (Odd: Aries, Even: Libra)
      if (signIndex % 2 === 0) {
        vargaSignIndex = (0 + partIndex) % 12;
      } else {
        vargaSignIndex = (6 + partIndex) % 12;
      }
      break;

    case 45: // D45 Akshavedamsha (Movable: Aries, Fixed: Leo, Dual: Sagittarius)
      {
        const modality = signIndex % 3;
        let startSign = 0;
        if (modality === 0) startSign = 0;
        else if (modality === 1) startSign = 4;
        else startSign = 8;
        vargaSignIndex = (startSign + partIndex) % 12;
      }
      break;

    case 60: // D60 Shashtiamsha (Starts from the sign itself and counts consecutively for all 60 parts)
      vargaSignIndex = (signIndex + partIndex) % 12;
      break;

    default:
      vargaSignIndex = (signIndex + partIndex) % 12;
  }

  return {
    sign: SIGNS[vargaSignIndex],
    signIndex: vargaSignIndex,
    degree: degInPart,
  };
}

const VARGA_METADATA: Record<number, { code: string; name: string; signification: string; warning?: string }> = {
  1: { code: "D1", name: "Rashi", signification: "Physical body, overall destiny, baseline vitality" },
  2: { code: "D2", name: "Hora", signification: "Wealth, financial accumulation, resources" },
  3: { code: "D3", name: "Drekkana", signification: "Siblings, courage, initiatives, third house matters" },
  4: { code: "D4", name: "Chaturthamsha", signification: "Fixed assets, real estate, mother, fortune" },
  7: { code: "D7", name: "Saptamsha", signification: "Progeny, children, creative legacy" },
  9: { code: "D9", name: "Navamsa", signification: "Dharma, marriage partner, inner strength, soul purpose" },
  10: { code: "D10", name: "Dashamsha", signification: "Career, public reputation, professional achievements" },
  12: { code: "D12", name: "Dwadashamsha", signification: "Parents, ancestry, inherited karma" },
  16: { code: "D16", name: "Shodashamsha", signification: "Vehicles, comforts, happiness, luxuries" },
  20: { code: "D20", name: "Vimshamsha", signification: "Spiritual practice, devotion, meditation, upasana" },
  24: { code: "D24", name: "Chaturvimshamsha", signification: "Higher education, intellect, academic mastery" },
  27: { code: "D27", name: "Saptavimshamsha", signification: "Inherent strengths, physical resilience, vulnerabilities" },
  30: { code: "D30", name: "Trimshamsha", signification: "Difficulties, arishta, health obstacles, moral challenges" },
  40: { code: "D40", name: "Khavedamsha", signification: "Auspicious and inauspicious karmic fruits" },
  45: { code: "D45", name: "Akshavedamsha", signification: "General character, moral purity, conduct" },
  60: {
    code: "D60",
    name: "Shashtiamsha",
    signification: "Past-life karma, root causal destiny (Supreme Parashari weight)",
    warning: "D60 is highly sensitive to exact birth time (shifts every ~2 minutes). Exact birth time precision is required.",
  },
};

/**
 * Calculates a complete Varga chart for an entire planetary placement set and Lagna.
 */
export function calculateVargaChart(
  vargaNumber: number,
  ascendantSidereal: number,
  planetLongitudes: Record<string, number>
): VargaChartResult {
  const meta = VARGA_METADATA[vargaNumber] || {
    code: `D${vargaNumber}`,
    name: `Divisional ${vargaNumber}`,
    signification: `Sub-divisional analysis ${vargaNumber}`,
  };

  const ascPos = calculateVargaPosition(ascendantSidereal, vargaNumber);
  const planets: Record<string, VargaPlanetPlacement> = {};

  for (const [pName, sLong] of Object.entries(planetLongitudes)) {
    const pPos = calculateVargaPosition(sLong, vargaNumber);
    const houseFromLagna = ((pPos.signIndex - ascPos.signIndex + 12) % 12) + 1;

    planets[pName] = {
      planet: pName,
      sign: pPos.sign,
      signIndex: pPos.signIndex,
      degree: Math.round(pPos.degree * 100) / 100,
      houseFromLagna,
    };
  }

  return {
    vargaCode: meta.code,
    name: meta.name,
    divisionNumber: vargaNumber,
    signification: meta.signification,
    sensitivityWarning: meta.warning,
    ascendant: ascPos,
    planets,
  };
}

/**
 * Calculates all 16 Shodashvargas in one comprehensive evaluation.
 */
export function calculateAllShodashvargas(
  ascendantSidereal: number,
  planetLongitudes: Record<string, number>
): Record<string, VargaChartResult> {
  const vargaNumbers = [1, 2, 3, 4, 7, 9, 10, 12, 16, 20, 24, 27, 30, 40, 45, 60];
  const results: Record<string, VargaChartResult> = {};

  for (const num of vargaNumbers) {
    const chart = calculateVargaChart(num, ascendantSidereal, planetLongitudes);
    results[chart.vargaCode] = chart;
  }

  return results;
}
