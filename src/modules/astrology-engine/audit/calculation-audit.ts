/**
 * ============================================================================
 * AstroVerse AI — Internal Calculation Audit Engine
 * ============================================================================
 * Generates an exhaustive mathematical audit report for any birth profile
 * to verify astronomical precision, ayanamsa, houses, dashas, and vargas.
 * ============================================================================
 */

import { buildCanonicalAstrologyContext, CanonicalBirthInput } from "../canonical-context";
import { calculateAllShodashvargas } from "../vargas/varga-engine";
import { calculateAshtakavarga } from "../ashtakavarga/ashtakavarga-engine";
import { analyzeKP } from "../kp/kp-engine";
import { calculateBhavaChalit } from "../bhava-chalit/bhava-chalit-engine";
import { calculateYoginiDasha } from "../dashas/yogini-dasha";
import { crossValidateDomain } from "../cross-validation/cross-validator";

export interface CalculationAuditReport {
  profileSummary: {
    name: string;
    localDateTime: string;
    utcDateTime: string;
    location: string;
    coordinates: string;
    timezone: string;
  };
  astronomicalMetrics: {
    julianDay: number;
    gmst: string;
    ramc: string;
    obliquityOfEcliptic: string;
    ayanamsaValue: string;
    ephemerisPrecision: string;
  };
  angles: {
    ascendantLagna: string;
    midheavenMC: string;
    descendant: string;
    imumCoeli: string;
  };
  planetaryTable: Array<{
    planet: string;
    symbol: string;
    siderealLongitude: string;
    tropicalLongitude: string;
    sign: string;
    degreeFormatted: string;
    house: number;
    nakshatra: string;
    pada: number;
    dignity: string;
    strengthScore: number;
    isRetrograde: boolean;
    isCombust: boolean;
  }>;
  houseTable: Array<{
    house: number;
    sign: string;
    lord: string;
    occupants: string[];
    savPoints: number;
  }>;
  dashaState: {
    vimshottariMaha: string;
    vimshottariAntar: string;
    activeYogini: string;
  };
  ashtakavargaSummary: {
    totalSAV: number; // 337 invariant
    savByHouse: number[];
  };
  kpSummary: {
    ascendantSubLord: string;
    moonSubLord: string;
    rulingPlanets: string[];
  };
  vargasAvailable: string[];
  crossValidationVerdict: string;
}

export function generateCalculationAudit(input: CanonicalBirthInput): CalculationAuditReport {
  const ctx = buildCanonicalAstrologyContext(input);

  const planetLongs: Record<string, number> = {};
  const planetSigns: Record<string, number> = {};
  const rashiHouses: Record<string, number> = {};

  for (const [pName, p] of Object.entries(ctx.planets)) {
    planetLongs[pName] = p.siderealLongitude;
    planetSigns[pName] = p.signIndex;
    rashiHouses[pName] = p.house;
  }

  const ascLong = ctx.angles.ascendant.longitude;
  const ascSignIdx = ctx.angles.ascendant.signIndex;

  const vargas = calculateAllShodashvargas(ascLong, planetLongs);
  const sav = calculateAshtakavarga(ascSignIdx, planetSigns);
  const cuspLongs = ctx.houses.map((h) => ((ascLong + (h.houseNumber - 1) * 30) % 360));
  const kp = analyzeKP(cuspLongs, planetLongs);
  calculateBhavaChalit(ascLong, planetLongs, rashiHouses);
  const yogini = calculateYoginiDasha(ctx.planets.Moon.siderealLongitude, new Date(ctx.birth.utcDateTime));
  const activeYogini = yogini.find((y) => y.isCurrent) || yogini[0];
  const careerCV = crossValidateDomain(ctx, "career");

  const planetaryTable = Object.values(ctx.planets).map((p) => ({
    planet: p.name,
    symbol: p.symbol,
    siderealLongitude: `${p.siderealLongitude.toFixed(4)}°`,
    tropicalLongitude: `${p.tropicalLongitude.toFixed(4)}°`,
    sign: p.sign,
    degreeFormatted: `${p.degreeInSign}° ${p.minuteInSign}' ${p.secondInSign}"`,
    house: p.house,
    nakshatra: p.nakshatra.name,
    pada: p.nakshatra.pada || 1,
    dignity: p.dignity,
    strengthScore: p.strengthScore,
    isRetrograde: p.isRetrograde,
    isCombust: p.isCombust,
  }));

  const houseTable = ctx.houses.map((h, idx) => ({
    house: h.houseNumber,
    sign: h.sign,
    lord: h.lord,
    occupants: h.occupants,
    savPoints: sav.sarvashtakavarga.byHouse[idx]?.points || 28,
  }));

  return {
    profileSummary: {
      name: ctx.birth.name,
      localDateTime: `${ctx.birth.localDate} ${ctx.birth.localTime}`,
      utcDateTime: ctx.birth.utcDateTime,
      location: ctx.birth.birthPlace,
      coordinates: `${ctx.birth.latitude.toFixed(4)}° N/S, ${ctx.birth.longitude.toFixed(4)}° E/W`,
      timezone: ctx.birth.timezone,
    },
    astronomicalMetrics: {
      julianDay: ctx.astronomical.julianDay,
      gmst: `${ctx.astronomical.gmst.toFixed(4)}°`,
      ramc: `${ctx.astronomical.ramc.toFixed(4)}°`,
      obliquityOfEcliptic: `${ctx.astronomical.obliquity.toFixed(4)}°`,
      ayanamsaValue: `${ctx.configuration.ayanamsaValue.toFixed(4)}° (Lahiri Chitrapaksha)`,
      ephemerisPrecision: ctx.ephemerisVersion,
    },
    angles: {
      ascendantLagna: `${ctx.angles.ascendant.sign} ${ctx.angles.ascendant.degree}° ${ctx.angles.ascendant.minute}' (${ctx.angles.ascendant.longitude.toFixed(2)}°)`,
      midheavenMC: `${ctx.angles.midheaven.sign} ${ctx.angles.midheaven.degree}° (${ctx.angles.midheaven.longitude.toFixed(2)}°)`,
      descendant: `${ctx.angles.descendant.sign} ${ctx.angles.descendant.degree}° (${ctx.angles.descendant.longitude.toFixed(2)}°)`,
      imumCoeli: `${ctx.angles.imumCoeli.sign} ${ctx.angles.imumCoeli.degree}° (${ctx.angles.imumCoeli.longitude.toFixed(2)}°)`,
    },
    planetaryTable,
    houseTable,
    dashaState: {
      vimshottariMaha: `${ctx.currentDasha.mahadasha.planet} (${ctx.currentDasha.mahadasha.startDate.slice(0, 4)} - ${ctx.currentDasha.mahadasha.endDate.slice(0, 4)})`,
      vimshottariAntar: ctx.currentDasha.antardasha?.planet || "—",
      activeYogini: `${activeYogini.name} (${activeYogini.rulerPlanet} ruler)`,
    },
    ashtakavargaSummary: {
      totalSAV: sav.sarvashtakavarga.totalPoints,
      savByHouse: sav.sarvashtakavarga.byHouse.map((h) => h.points),
    },
    kpSummary: {
      ascendantSubLord: kp.rulingPlanets.ascendantSubLord,
      moonSubLord: kp.rulingPlanets.moonSubLord,
      rulingPlanets: [
        `Asc Star: ${kp.rulingPlanets.ascendantStarLord}`,
        `Asc Sign: ${kp.rulingPlanets.ascendantSignLord}`,
        `Moon Star: ${kp.rulingPlanets.moonStarLord}`,
        `Moon Sign: ${kp.rulingPlanets.moonSignLord}`,
        `Day Lord: ${kp.rulingPlanets.dayLord}`,
      ],
    },
    vargasAvailable: Object.keys(vargas),
    crossValidationVerdict: careerCV.verdict,
  };
}
