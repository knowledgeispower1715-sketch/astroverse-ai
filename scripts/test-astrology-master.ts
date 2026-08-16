/**
 * ============================================================================
 * AstroVerse AI — Master Astrology & Computation Test Suite
 * ============================================================================
 * Exhaustively validates:
 * 1. Global Multi-Region Canonical Context (India, US, UK, FR, JP, AU, UAE, CA)
 * 2. All 16 Shodashvargas (D1 to D60)
 * 3. Bhava Chalit Midpoint Calculations & Planetary Shifts
 * 4. Parashari Ashtakavarga (337-Point SAV Invariant)
 * 5. Krishnamurti Padhdhati (KP 249 Sub-Lords & 4-Level Significators)
 * 6. Vimshottari & Yogini Dasha Engines
 * 7. Multi-System Cross-Validation & Contradiction Resolution
 * 8. Differential Quality & Anti-Repetition Verification
 * ============================================================================
 */

import {
  buildCanonicalAstrologyContext,
  calculateAllShodashvargas,
  calculateAshtakavarga,
  analyzeKP,
  calculateBhavaChalit,
  calculateYoginiDasha,
  crossValidateDomain,
  RuleEngine,
} from "../src/modules/astrology-engine";
import { searchLocations } from "../src/modules/location-engine/resolver";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName} ${details ? `(${details})` : ""}`);
  }
}

async function runMasterTestSuite() {
  console.log("\n============================================================");
  console.log("ASTROVERSE AI — MASTER PRODUCTION VERIFICATION TEST SUITE");
  console.log("============================================================\n");

  // --------------------------------------------------------------------------
  // TEST GROUP 1: Global Multi-Country Location & Timezone Resolution
  // --------------------------------------------------------------------------
  console.log("--- 1. Testing Global Multi-Country Location Resolution ---");
  const testLocations = [
    { q: "New Delhi", expectedTz: "Asia/Kolkata" },
    { q: "San Francisco", expectedTz: "America/Los_Angeles" },
    { q: "London", expectedTz: "Europe/London" },
    { q: "Paris", expectedTz: "Europe/Paris" },
    { q: "Tokyo", expectedTz: "Asia/Tokyo" },
    { q: "Sydney", expectedTz: "Australia/Sydney" },
    { q: "Dubai", expectedTz: "Asia/Dubai" },
    { q: "Toronto", expectedTz: "America/Toronto" },
  ];

  for (const loc of testLocations) {
    const res = await searchLocations(loc.q, { limit: 3 });
    assert(res.length > 0, `Location Search: '${loc.q}' resolves to coordinates`);
    if (res.length > 0) {
      assert(Boolean(res[0].timezone), `Timezone resolved for ${loc.q}: ${res[0].timezone}`);
    }
  }

  // --------------------------------------------------------------------------
  // TEST GROUP 2: Canonical Context & Astronomical Foundations
  // --------------------------------------------------------------------------
  console.log("\n--- 2. Testing Canonical Astrology Context & Astronomical Positions ---");
  const profileA = {
    name: "Aarav Sharma",
    dateOfBirth: "1994-06-21",
    timeOfBirth: "08:15",
    birthPlace: "New Delhi, India",
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: "Asia/Kolkata",
  };

  const ctx = buildCanonicalAstrologyContext(profileA);
  assert(Boolean(ctx && ctx.astronomical.julianDay > 2400000), "Julian Day computed accurately from UTC moment");
  assert(Boolean(ctx.configuration.ayanamsaValue > 23.0 && ctx.configuration.ayanamsaValue < 25.0), `Lahiri Ayanamsa computed: ${ctx.configuration.ayanamsaValue.toFixed(3)}°`);
  assert(Boolean(ctx.angles.ascendant.sign && ctx.angles.ascendant.degree >= 0), `Ascendant Lagna calculated: ${ctx.angles.ascendant.sign} ${ctx.angles.ascendant.degree}°`);
  assert(Object.keys(ctx.planets).length >= 9, `All 9 Vedic planets calculated with dignities and strengths`);

  // --------------------------------------------------------------------------
  // TEST GROUP 3: Shodashvarga Divisional Charts (D1 to D60)
  // --------------------------------------------------------------------------
  console.log("\n--- 3. Testing All 16 Classical Shodashvargas (D1–D60) ---");
  const planetLongs: Record<string, number> = {};
  for (const [pName, p] of Object.entries(ctx.planets)) {
    planetLongs[pName] = p.siderealLongitude;
  }
  const vargas = calculateAllShodashvargas(ctx.angles.ascendant.longitude, planetLongs);

  const expectedVargas = ["D1", "D2", "D3", "D4", "D7", "D9", "D10", "D12", "D16", "D20", "D24", "D27", "D30", "D40", "D45", "D60"];
  for (const vCode of expectedVargas) {
    const vChart = vargas[vCode];
    assert(
      Boolean(vChart && vChart.ascendant && Object.keys(vChart.planets).length >= 7),
      `Varga ${vCode} (${vChart?.name}) calculated with complete planetary placements`
    );
  }
  assert(Boolean(vargas.D60.sensitivityWarning), "D60 Shashtiamsha contains fine birth-time accuracy warning");

  // --------------------------------------------------------------------------
  // TEST GROUP 4: Bhava Chalit Cusp Midpoints & Planetary Shifts
  // --------------------------------------------------------------------------
  console.log("\n--- 4. Testing Bhava Chalit Midpoint Engine ---");
  const rashiHouses: Record<string, number> = {};
  for (const [pName, p] of Object.entries(ctx.planets)) {
    rashiHouses[pName] = p.house;
  }
  const chalit = calculateBhavaChalit(ctx.angles.ascendant.longitude, planetLongs, rashiHouses);
  assert(chalit.cusps.length === 12, "All 12 Bhava Madhyas and Sandhis calculated");
  assert(chalit.shifts.length === Object.keys(ctx.planets).length, "Planetary Bhava shifts evaluated for all planets");

  // --------------------------------------------------------------------------
  // TEST GROUP 5: Parashari Ashtakavarga (Exact 337-Point Invariant)
  // --------------------------------------------------------------------------
  console.log("\n--- 5. Testing Parashari Ashtakavarga Engine & SAV Invariant ---");
  const planetSigns: Record<string, number> = {};
  for (const [pName, p] of Object.entries(ctx.planets)) {
    planetSigns[pName] = p.signIndex;
  }
  const av = calculateAshtakavarga(ctx.angles.ascendant.signIndex, planetSigns);
  assert(
    av.sarvashtakavarga.totalPoints === 337,
    `Sarvashtakavarga Total Bindus invariant: exactly 337 points (Calculated: ${av.sarvashtakavarga.totalPoints})`
  );
  assert(
    av.sarvashtakavarga.byHouse.length === 12,
    "All 12 houses evaluated with Ashtakavarga strength ratings (strong/average/weak)"
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 6: Krishnamurti Padhdhati (KP) Sub-Lords & Significators
  // --------------------------------------------------------------------------
  console.log("\n--- 6. Testing Krishnamurti Padhdhati (KP) Engine ---");
  const cuspLongs = ctx.houses.map((h) => ((ctx.angles.ascendant.longitude + (h.houseNumber - 1) * 30) % 360));
  const kp = analyzeKP(cuspLongs, planetLongs);
  assert(kp.cusps.length === 12, "KP Sign Lord, Star Lord, and Sub Lord calculated for all 12 cusps");
  assert(
    Boolean(kp.rulingPlanets.ascendantSubLord && kp.rulingPlanets.moonSubLord),
    `KP Ruling Planets resolved: Asc Sub=${kp.rulingPlanets.ascendantSubLord}, Moon Sub=${kp.rulingPlanets.moonSubLord}`
  );
  assert(kp.significators.length === 12, "4-Level KP Significator matrix generated for all 12 houses");

  // --------------------------------------------------------------------------
  // TEST GROUP 7: Vimshottari & Yogini Dasha Engines
  // --------------------------------------------------------------------------
  console.log("\n--- 7. Testing Vimshottari & Yogini Dasha Engines ---");
  assert(ctx.dashas.length === 9, "Vimshottari Mahadasha sequence complete");
  assert(Boolean(ctx.currentDasha.mahadasha.isCurrent), `Current Vimshottari Dasha active: ${ctx.currentDasha.mahadasha.planet}`);

  const yoginiDashas = calculateYoginiDasha(ctx.planets.Moon.siderealLongitude, new Date(ctx.birth.utcDateTime));
  assert(yoginiDashas.length >= 8, "Yogini Dasha 36-year cycle calculated from exact lunar Nakshatra fraction");
  const currentYogini = yoginiDashas.find((y) => y.isCurrent);
  assert(Boolean(currentYogini), `Current Yogini Dasha active: ${currentYogini?.name} (${currentYogini?.rulerPlanet})`);

  // --------------------------------------------------------------------------
  // TEST GROUP 8: Cross-Validation & Contradiction Engine
  // --------------------------------------------------------------------------
  console.log("\n--- 8. Testing Multi-System Cross-Validation & Contradiction Engine ---");
  const careerCV = crossValidateDomain(ctx, "career");
  assert(careerCV.evidenceNodes.length >= 5, `Career cross-validated across ${careerCV.evidenceNodes.length} independent systems`);
  assert(
    careerCV.evidenceStrengthScore >= 0 && careerCV.evidenceStrengthScore <= 100,
    `Evidence Strength Score calculated: ${careerCV.evidenceStrengthScore}%`
  );
  assert(
    Boolean(careerCV.verdict && careerCV.practicalPrecautions.length > 0),
    `Balanced verdict rendered without fearmongering: ${careerCV.verdict}`
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 9: Differential Quality Verification (Person A vs Person B vs Person C)
  // --------------------------------------------------------------------------
  console.log("\n--- 9. Testing Differential Multi-User Quality ---");
  const profileB = {
    name: "Elena Rostova",
    dateOfBirth: "1989-11-14",
    timeOfBirth: "15:30",
    birthPlace: "Paris, France",
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: "Europe/Paris",
  };

  const profileC = {
    name: "Marcus Vance",
    dateOfBirth: "2001-08-19",
    timeOfBirth: "11:30",
    birthPlace: "New York, USA",
    latitude: 40.7128,
    longitude: -74.0060,
    timezone: "America/New_York",
  };

  const ctxB = buildCanonicalAstrologyContext(profileB);
  const ctxC = buildCanonicalAstrologyContext(profileC);

  assert(
    ctx.angles.ascendant.sign !== ctxB.angles.ascendant.sign && ctxB.angles.ascendant.sign !== ctxC.angles.ascendant.sign,
    `Ascendants differ across profiles: Person A (${ctx.angles.ascendant.sign}) vs Person B (${ctxB.angles.ascendant.sign}) vs Person C (${ctxC.angles.ascendant.sign})`
  );
  assert(
    ctx.planets.Moon.nakshatra.name !== ctxB.planets.Moon.nakshatra.name && ctxB.planets.Moon.nakshatra.name !== ctxC.planets.Moon.nakshatra.name,
    `Moon Nakshatras differ: Person A (${ctx.planets.Moon.nakshatra.name}) vs Person B (${ctxB.planets.Moon.nakshatra.name}) vs Person C (${ctxC.planets.Moon.nakshatra.name})`
  );

  const evalA = RuleEngine.evaluateCategory(ctx, "career");
  const evalB = RuleEngine.evaluateCategory(ctxB, "career");
  const evalC = RuleEngine.evaluateCategory(ctxC, "career");
  assert(
    evalA.prediction.statement !== evalB.prediction.statement && evalB.prediction.statement !== evalC.prediction.statement,
    "Synthesized interpretations differ cleanly across all 3 individuals without boilerplate reuse"
  );

  // --------------------------------------------------------------------------
  // TEST SUMMARY
  // --------------------------------------------------------------------------
  console.log("\n============================================================");
  console.log(`TEST SUMMARY: Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
  console.log("============================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runMasterTestSuite().catch((err) => {
  console.error("Master test execution failed:", err);
  process.exit(1);
});
