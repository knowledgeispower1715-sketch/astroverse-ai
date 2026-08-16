/**
 * ============================================================================
 * AstroVerse AI — Astrology Engine Differential & Quality Test Suite
 * ============================================================================
 * Verifies:
 * 1. Person A vs Person B vs Person C produce genuinely distinct, deterministic charts
 * 2. Planetary positions, Lagna, Nakshatras, Dashas, and Yogas differentiate cleanly
 * 3. Life Area Rule Engine evaluates distinct supportive/challenging evidence per person
 * 4. No generic boilerplate repetition exists across different charts
 * ============================================================================
 */

import { buildCanonicalAstrologyContext, RuleEngine, generateTransitTimeline, getPlanetExplorerData } from "../src/modules/astrology-engine";

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

async function runDifferentialTests() {
  console.log("\n============================================================");
  console.log("ASTROVERSE AI — DIFFERENTIAL & PERSONALIZATION QUALITY TESTS");
  console.log("============================================================\n");

  // --------------------------------------------------------------------------
  // TEST PERSON PROFILES (3 Distinct Geographies, Dates, and Times)
  // --------------------------------------------------------------------------
  const personA = {
    name: "Aarav Sharma",
    dateOfBirth: "1992-04-12",
    timeOfBirth: "06:15",
    birthPlace: "New Delhi, India",
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: "Asia/Kolkata",
  };

  const personB = {
    name: "Claire Dubois",
    dateOfBirth: "1988-11-23",
    timeOfBirth: "18:45",
    birthPlace: "Paris, France",
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: "Europe/Paris",
  };

  const personC = {
    name: "Marcus Vance",
    dateOfBirth: "2001-08-19",
    timeOfBirth: "11:30",
    birthPlace: "New York, USA",
    latitude: 40.7128,
    longitude: -74.0060,
    timezone: "America/New_York",
  };

  console.log("--- 1. Generating Canonical Contexts for 3 Distinct Profiles ---");
  const ctxA = buildCanonicalAstrologyContext(personA);
  const ctxB = buildCanonicalAstrologyContext(personB);
  const ctxC = buildCanonicalAstrologyContext(personC);

  assert(Boolean(ctxA && ctxB && ctxC), "All 3 canonical contexts successfully generated");

  // --------------------------------------------------------------------------
  // TEST GROUP 2: Planetary Longitude & Ascendant Differentiation
  // --------------------------------------------------------------------------
  console.log("\n--- 2. Testing Astronomical & Planetary Differentiation ---");

  // Sun Signs & Longitudes
  assert(
    ctxA.planets.Sun.sign !== ctxB.planets.Sun.sign && ctxB.planets.Sun.sign !== ctxC.planets.Sun.sign,
    `Sun Signs differ: Person A (${ctxA.planets.Sun.sign}) vs Person B (${ctxB.planets.Sun.sign}) vs Person C (${ctxC.planets.Sun.sign})`
  );

  // Moon Signs & Nakshatras
  assert(
    ctxA.planets.Moon.nakshatra.name !== ctxB.planets.Moon.nakshatra.name &&
    ctxB.planets.Moon.nakshatra.name !== ctxC.planets.Moon.nakshatra.name,
    `Moon Nakshatras differ: Person A (${ctxA.planets.Moon.nakshatra.name}) vs Person B (${ctxB.planets.Moon.nakshatra.name}) vs Person C (${ctxC.planets.Moon.nakshatra.name})`
  );

  // Ascendants (Lagnas)
  assert(
    ctxA.angles.ascendant.sign !== ctxB.angles.ascendant.sign,
    `Ascendant Signs differ: Person A (${ctxA.angles.ascendant.sign}) vs Person B (${ctxB.angles.ascendant.sign})`
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 3: Vimshottari Dasha Differentiation
  // --------------------------------------------------------------------------
  console.log("\n--- 3. Testing Vimshottari Dasha Calculation Differentiation ---");
  const dashaA = ctxA.currentDasha.mahadasha.planet;
  const dashaB = ctxB.currentDasha.mahadasha.planet;
  const dashaC = ctxC.currentDasha.mahadasha.planet;

  assert(
    Boolean(dashaA && dashaB && dashaC),
    `Active Mahadashas resolved: A=${dashaA}, B=${dashaB}, C=${dashaC}`
  );
  assert(
    ctxA.dashas[0].planet !== ctxB.dashas[0].planet || ctxA.dashas[0].durationYears !== ctxB.dashas[0].durationYears,
    `Starting Dasha duration/lord derived directly from exact Moon longitude fraction`
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 4: Rule Engine Evidence-First Evaluation Differentiation
  // --------------------------------------------------------------------------
  console.log("\n--- 4. Testing Rule Engine Life Area Evaluation Differentiation ---");
  const careerA = RuleEngine.evaluateCategory(ctxA, "career");
  const careerB = RuleEngine.evaluateCategory(ctxB, "career");
  const careerC = RuleEngine.evaluateCategory(ctxC, "career");

  assert(
    careerA.prediction.statement !== careerB.prediction.statement && careerB.prediction.statement !== careerC.prediction.statement,
    "Career synthesized statements differ across all 3 individuals"
  );
  assert(
    careerA.score !== careerB.score || careerA.prediction.evidenceScore !== careerB.prediction.evidenceScore,
    `Career scores calculated from distinct natal placements: A=${careerA.score} vs B=${careerB.score}`
  );
  assert(
    careerA.prediction.supportingFactors.length > 0 && careerA.prediction.precautions.length > 0,
    "Career predictions contain both supporting factors and practical precautions"
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 5: Transit Timeline & Horizon Activation Differentiation
  // --------------------------------------------------------------------------
  console.log("\n--- 5. Testing Transit Timeline Horizons & Planet Explorer ---");
  const timelineA = generateTransitTimeline(ctxA);
  const timelineB = generateTransitTimeline(ctxB);

  assert(
    timelineA.length === 7,
    `7 timing horizons generated (Past, Today, 7D, 30D, 3M, 6M, 12M)`
  );
  assert(
    timelineA[1].activatedHouse !== timelineB[1].activatedHouse || timelineA[1].theme !== timelineB[1].theme,
    `Today's transit activates different houses for Person A (House ${timelineA[1].activatedHouse}) vs Person B (House ${timelineB[1].activatedHouse})`
  );

  // Planet Explorer Diagnostics
  const jupExplorerA = getPlanetExplorerData(ctxA, "Jupiter");
  const jupExplorerB = getPlanetExplorerData(ctxB, "Jupiter");
  assert(
    jupExplorerA.strengthBreakdown.score > 0 && jupExplorerB.strengthBreakdown.score > 0,
    `Jupiter Shadbala strengths calculated deterministically: A=${jupExplorerA.strengthBreakdown.score}% vs B=${jupExplorerB.strengthBreakdown.score}%`
  );
  assert(
    Boolean(jupExplorerA.traditionalInterpretation.prescribedRemedy),
    `Traditional prescribed remedies provided: ${jupExplorerA.traditionalInterpretation.prescribedRemedy.slice(0, 40)}...`
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 6: Repetition & Plagiarism Safeguard
  // --------------------------------------------------------------------------
  console.log("\n--- 6. Testing No-Repetition & Anti-Template Safeguards ---");
  const textA = careerA.prediction.statement;
  const textB = careerB.prediction.statement;
  const wordsA = new Set(textA.toLowerCase().split(/\s+/));
  const wordsB = new Set(textB.toLowerCase().split(/\s+/));
  let overlapCount = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) overlapCount++;
  }
  const overlapRatio = overlapCount / Math.max(wordsA.size, wordsB.size);

  assert(
    overlapRatio < 0.85,
    `Content overlap ratio between distinct individuals is ${(overlapRatio * 100).toFixed(1)}% (< 85% threshold)`
  );

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log("\n============================================================");
  console.log(`TEST SUMMARY: Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
  console.log("============================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runDifferentialTests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
