/**
 * ============================================================================
 * AstroVerse AI — Tarot Asset & Integrity Validation Script
 * ============================================================================
 * Verifies:
 * 1. Exactly 78 Tarot cards defined
 * 2. 22 Major Arcana + 14 Wands + 14 Cups + 14 Swords + 14 Pentacles
 * 3. All 78 image paths resolve to valid physical assets on disk
 * 4. Card back asset exists and is accessible
 * 5. Unique IDs and unique image paths with 0 duplicates
 * ============================================================================
 */

import * as fs from "fs";
import * as path from "path";
import { tarotCards } from "../src/config/tarotCards";

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition: boolean, name: string, detail?: string) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ PASS: ${name}`);
  } else {
    failedChecks++;
    console.error(`  ✗ FAIL: ${name} ${detail ? `(${detail})` : ""}`);
  }
}

function runTarotValidation() {
  console.log("\n============================================================");
  console.log("ASTROVERSE AI — TAROT ASSET & INTEGRITY VALIDATION");
  console.log("============================================================\n");

  assert(tarotCards.length === 78, `Total Card Count: Expected 78, got ${tarotCards.length}`);

  const majorCount = tarotCards.filter((c) => c.arcana === "major").length;
  const wandsCount = tarotCards.filter((c) => c.suit === "wands").length;
  const cupsCount = tarotCards.filter((c) => c.suit === "cups").length;
  const swordsCount = tarotCards.filter((c) => c.suit === "swords").length;
  const pentaclesCount = tarotCards.filter((c) => c.suit === "pentacles").length;

  assert(majorCount === 22, `22 Major Arcana cards validated (Found: ${majorCount})`);
  assert(wandsCount === 14, `14 Suit of Wands cards validated (Found: ${wandsCount})`);
  assert(cupsCount === 14, `14 Suit of Cups cards validated (Found: ${cupsCount})`);
  assert(swordsCount === 14, `14 Suit of Swords cards validated (Found: ${swordsCount})`);
  assert(pentaclesCount === 14, `14 Suit of Pentacles cards validated (Found: ${pentaclesCount})`);

  // Check Card Back
  const cardBackPath = path.join(process.cwd(), "public", "tarot", "card-back.svg");
  assert(fs.existsSync(cardBackPath), `Card Back asset exists at public/tarot/card-back.svg`);

  // Check image paths resolution
  const seenIds = new Set<number>();
  const seenPaths = new Set<string>();
  let missingFiles = 0;

  for (const card of tarotCards) {
    if (seenIds.has(card.id)) {
      assert(false, `Duplicate card ID detected: ${card.id}`);
    }
    seenIds.add(card.id);

    if (seenPaths.has(card.image)) {
      assert(false, `Duplicate card image path detected: ${card.image}`);
    }
    seenPaths.add(card.image);

    const fullDiskPath = path.join(process.cwd(), "public", card.image);
    if (!fs.existsSync(fullDiskPath)) {
      missingFiles++;
      console.error(`  ✗ Missing card asset: ${card.name} -> ${fullDiskPath}`);
    }
  }

  assert(missingFiles === 0, `All 78 card vector assets resolve on disk with 0 missing files`);

  console.log("\n============================================================");
  console.log(`TAROT VALIDATION SUMMARY: Total: ${totalChecks} | Passed: ${passedChecks} | Failed: ${failedChecks}`);
  console.log("============================================================\n");

  if (failedChecks > 0) {
    process.exit(1);
  }
}

runTarotValidation();
