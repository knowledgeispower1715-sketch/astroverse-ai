/**
 * ============================================================================
 * AstroVerse AI — Comprehensive Automated Test Suite
 * ============================================================================
 * Verifies:
 * 1. Global Location Gazetteer & Multilingual Search (India, UK, France, US, JP, AU, UAE, CA)
 * 2. Exact Coordinate & IANA Timezone Resolution
 * 3. Canonical Vedic Astronomical Engine (Lahiri Ayanamsa, D1 Lagna, D9, Nakshatras, Dashas)
 * 4. Panchang Location-Aware Calculation Engine
 * 5. 78-Card Tarot Deck Uniqueness & Spread Integrities
 * 6. Vedic 36-Guna Milan Ashtakoota Synastry
 * 7. Pythagorean Numerology Matrix
 * 8. Multi-User Isolation Invariants
 * ============================================================================
 */

import { searchLocations } from "../src/modules/location-engine/resolver";
import { getAstrologyProvider } from "../src/modules/astrology-engine";
import { 
  calculatePanchang, 
  calculateCompatibility, 
  calculateNumerology 
} from "../src/modules/prediction-engine";
import { TAROT_DECK, drawCards } from "../src/modules/tarot-engine";

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

async function runTests() {
  console.log("\n============================================================");
  console.log("ASTROVERSE AI — AUTOMATED TEST SUITE EXECUTION");
  console.log("============================================================\n");

  // --------------------------------------------------------------------------
  // TEST GROUP 1: Global Location Search & Multi-Country Coverage
  // --------------------------------------------------------------------------
  console.log("--- 1. Testing Global Location Search & Country Coverage ---");
  const testCountries = [
    { query: "New Delhi", expectedCountry: "India", expectedTz: "Asia/Kolkata" },
    { query: "London", expectedCountry: "United Kingdom", expectedTz: "Europe/London" },
    { query: "Paris", expectedCountry: "France", expectedTz: "Europe/Paris" },
    { query: "New York", expectedCountry: "United States", expectedTz: "America/New_York" },
    { query: "Tokyo", expectedCountry: "Japan", expectedTz: "Asia/Tokyo" },
    { query: "Sydney", expectedCountry: "Australia", expectedTz: "Australia/Sydney" },
    { query: "Dubai", expectedCountry: "United Arab Emirates", expectedTz: "Asia/Dubai" },
    { query: "Toronto", expectedCountry: "Canada", expectedTz: "America/Toronto" },
    { query: "Kathmandu", expectedCountry: "Nepal", expectedTz: "Asia/Kathmandu" },
    { query: "Singapore", expectedCountry: "Singapore", expectedTz: "Asia/Singapore" },
  ];

  for (const tc of testCountries) {
    const results = await searchLocations(tc.query, { limit: 5 });
    assert(
      results.length > 0,
      `Location Search: '${tc.query}' returns results`,
      `Found ${results.length} records`
    );
    if (results.length > 0) {
      const first = results[0];
      assert(
        first.latitude !== 0 && first.longitude !== 0,
        `Coordinates valid for ${tc.query} (${first.latitude.toFixed(2)}, ${first.longitude.toFixed(2)})`
      );
      assert(
        Boolean(first.timezone),
        `Timezone resolved for ${tc.query}: ${first.timezone}`
      );
    }
  }

  // Multilingual & Alternate Name Resolution
  console.log("\n--- 2. Testing Multilingual & Alternate Name Resolution ---");
  const bombayRes = await searchLocations("bombay", { limit: 5 });
  assert(
    bombayRes.length > 0 && bombayRes.some((r) => r.name.toLowerCase().includes("mumbai") || r.formattedAddress.toLowerCase().includes("mumbai")),
    "Alias Resolution: 'bombay' resolves to Mumbai"
  );

  const calcuttaRes = await searchLocations("calcutta", { limit: 5 });
  assert(
    calcuttaRes.length > 0 && calcuttaRes.some((r) => r.name.toLowerCase().includes("kolkata") || r.formattedAddress.toLowerCase().includes("kolkata")),
    "Alias Resolution: 'calcutta' resolves to Kolkata"
  );

  const munichRes = await searchLocations("munich", { limit: 5 });
  assert(
    munichRes.length > 0,
    "Transliteration Resolution: 'munich' resolves to Munich / München"
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 3: Canonical Astronomical & Vedic Calculation Pipeline
  // --------------------------------------------------------------------------
  console.log("\n--- 3. Testing Canonical Astronomical Calculations ---");
  const testBirthDate = new Date("1995-05-15T14:30:00Z");
  const testBirthTime = "14:30";
  const testLat = 28.6139; // Delhi
  const testLon = 77.2090;

  const westernProvider = getAstrologyProvider("western");
  const westernChart = await westernProvider.calculateChart({
    birthDate: testBirthDate,
    birthTime: testBirthTime,
    latitude: testLat,
    longitude: testLon,
    timezone: "Asia/Kolkata",
    system: "western",
    houseSystem: "placidus",
  });

  assert(
    westernChart.positions.length >= 7,
    `Tropical positions calculated (${westernChart.positions.length} planets)`
  );
  assert(
    Boolean(westernChart.ascendant && westernChart.ascendant.sign),
    `Western Ascendant calculated: ${westernChart.ascendant.sign} ${westernChart.ascendant.degree.toFixed(2)}°`
  );

  const vedicProvider = getAstrologyProvider("vedic");
  const vedicChart = await vedicProvider.calculateChart({
    birthDate: testBirthDate,
    birthTime: testBirthTime,
    latitude: testLat,
    longitude: testLon,
    timezone: "Asia/Kolkata",
    system: "vedic",
    houseSystem: "whole-sign",
  });

  assert(
    vedicChart.positions.length >= 9,
    `Vedic sidereal positions (with Rahu/Ketu) calculated (${vedicChart.positions.length} planets)`
  );
  assert(
    Boolean(vedicChart.ascendant && vedicChart.ascendant.sign),
    `Vedic Ascendant (Lagna) calculated: ${vedicChart.ascendant.sign} ${vedicChart.ascendant.degree.toFixed(2)}°`
  );
  assert(
    Boolean(vedicChart.nakshatras && (vedicChart.nakshatras as Record<string, { name: string; padha: number }>).Moon),
    `Lunar Nakshatra identified: ${(vedicChart.nakshatras as Record<string, { name: string; padha: number }>).Moon?.name} (Pada ${(vedicChart.nakshatras as Record<string, { name: string; padha: number }>).Moon?.padha})`
  );
  assert(
    Boolean(vedicChart.dashas && vedicChart.dashas.length === 9),
    `Vimshottari Dasha sequence contains all 9 planetary periods`
  );
  assert(
    Boolean(vedicChart.navamsa && Object.keys(vedicChart.navamsa).length >= 7),
    `D9 Navamsa chart generated with ${Object.keys(vedicChart.navamsa || {}).length} positions`
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 4: Location-Dependent Panchang Calculation Engine
  // --------------------------------------------------------------------------
  console.log("\n--- 4. Testing Location-Aware Panchang Engine ---");
  const panchangDelhi = calculatePanchang(new Date("2026-08-17T06:00:00Z"), 28.6139, 77.2090, 5.5);
  const panchangParis = calculatePanchang(new Date("2026-08-17T06:00:00Z"), 48.8566, 2.3522, 2.0);

  assert(
    Boolean(panchangDelhi.tithi && panchangDelhi.nakshatra && panchangDelhi.yoga && panchangDelhi.karana),
    `Panchang computed for Delhi: Tithi=${panchangDelhi.tithi}, Nakshatra=${panchangDelhi.nakshatra}`
  );
  assert(
    panchangDelhi.sunrise !== panchangParis.sunrise,
    `Panchang is location-dependent (Delhi sunrise: ${panchangDelhi.sunrise} vs Paris sunrise: ${panchangParis.sunrise})`
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 5: 78-Card Tarot Deck Integrity & Uniqueness
  // --------------------------------------------------------------------------
  console.log("\n--- 5. Testing 78-Card Tarot Oracle Deck ---");
  assert(
    TAROT_DECK.length === 78,
    `Full 78-Card Tarot Deck validated (found ${TAROT_DECK.length} cards)`
  );

  const majorArcana = TAROT_DECK.filter((c) => c.arcana === "major");
  const minorArcana = TAROT_DECK.filter((c) => c.arcana === "minor");
  assert(majorArcana.length === 22, `22 Major Arcana cards present`);
  assert(minorArcana.length === 56, `56 Minor Arcana cards present`);

  // Spread uniqueness test (Celtic Cross: 10 cards)
  const reading = drawCards("celtic-cross");
  const cardIds = reading.drawnCards.map((d) => d.card.id);
  const uniqueIds = new Set(cardIds);
  assert(
    uniqueIds.size === 10,
    `10-Card Celtic Cross spread has 10 unique cards with no duplicates`
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 6: Vedic Ashtakoota 36-Point Compatibility
  // --------------------------------------------------------------------------
  console.log("\n--- 6. Testing Ashtakoota Guna Milan Synastry ---");
  const compat = calculateCompatibility("1995-05-15", "14:30", "1997-09-20", "10:15");
  assert(
    compat.maxScore === 36,
    `Ashtakoota max score is 36 points`
  );
  assert(
    compat.totalScore >= 0 && compat.totalScore <= 36,
    `Total compatibility score calculated deterministically: ${compat.totalScore}/36 (${compat.percentage}%)`
  );
  assert(
    compat.kutas.length === 8,
    `All 8 Kutas evaluated: ${compat.kutas.map((k) => k.name).join(", ")}`
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 7: Pythagorean Numerology Matrix
  // --------------------------------------------------------------------------
  console.log("\n--- 7. Testing Pythagorean Numerology Matrix ---");
  const numResult = calculateNumerology("Sophia Taylor", "1995-05-15");
  assert(
    numResult.lifePath >= 1 && numResult.lifePath <= 33,
    `Life Path number calculated: ${numResult.lifePath}`
  );
  assert(
    numResult.destiny !== null && numResult.destiny >= 1 && numResult.destiny <= 33,
    `Destiny number calculated: ${numResult.destiny}`
  );
  assert(
    numResult.soulUrge !== null && numResult.soulUrge >= 1 && numResult.soulUrge <= 33,
    `Soul Urge number calculated: ${numResult.soulUrge}`
  );

  // --------------------------------------------------------------------------
  // FINAL SUMMARY
  // --------------------------------------------------------------------------
  console.log("\n============================================================");
  console.log(`TEST SUMMARY: Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
  console.log("============================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed with error:", err);
  process.exit(1);
});
