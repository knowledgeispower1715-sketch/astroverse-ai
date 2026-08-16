/**
 * ============================================================================
 * AstroVerse AI — GeoNames Global Gazetteer Data Importer
 * ============================================================================
 * 
 * DATA SOURCE & LICENSING:
 * - Source: GeoNames geographical database (http://www.geonames.org)
 * - License: Creative Commons Attribution 4.0 International (CC-BY 4.0)
 * - Attribution: "Geographic data courtesy of GeoNames.org under CC-BY 4.0"
 * 
 * DESCRIPTION:
 * Streams and parses GeoNames tabular gazetteer files (`allCountries.txt` or
 * country-specific dumps like `IN.txt`, `US.txt`, `GB.txt`, `FR.txt`, etc.),
 * maps administrative level-1 codes (states/provinces) and ISO country names,
 * and performs chunked upserts into the PostgreSQL `locations` table.
 * 
 * USAGE:
 * 1. Download GeoNames dumps:
 *    - http://download.geonames.org/export/dump/admin1CodesASCII.txt
 *    - http://download.geonames.org/export/dump/countryInfo.txt
 *    - http://download.geonames.org/export/dump/allCountries.zip (or individual <country>.zip)
 * 
 * 2. Run the importer:
 *    npx tsx scripts/import-geonames.ts --file=./data/allCountries.txt
 *    OR for specific country:
 *    npx tsx scripts/import-geonames.ts --file=./data/IN.txt --country=IN
 * ============================================================================
 */

import * as fs from "fs";
import * as readline from "readline";
import { createClient } from "@supabase/supabase-js";

interface LocationRecord {
  geoname_id: number;
  name: string;
  ascii_name: string;
  alternate_names: string;
  latitude: number;
  longitude: number;
  feature_class: string;
  feature_code: string;
  country_code: string;
  country_name: string;
  admin1_code: string;
  admin1_name: string;
  admin2_code: string;
  admin2_name: string;
  population: number;
  elevation: number | null;
  dem: number | null;
  timezone: string;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || "";

const admin1Map = new Map<string, string>(); // "IN.16" -> "Madhya Pradesh", "US.NY" -> "New York"
const countryMap = new Map<string, string>(); // "IN" -> "India", "US" -> "United States"

export async function loadCountryInfo(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[GeoNames] countryInfo file not found at ${filePath}, skipping...`);
    return;
  }
  const fileStream = fs.createReadStream(filePath, { encoding: "utf-8" });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (line.startsWith("#") || !line.trim()) continue;
    const parts = line.split("\t");
    if (parts.length >= 5) {
      const iso = parts[0].trim();
      const countryName = parts[4].trim();
      countryMap.set(iso, countryName);
    }
  }
  console.log(`[GeoNames] Loaded ${countryMap.size} country mappings.`);
}

export async function loadAdmin1Codes(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[GeoNames] admin1CodesASCII file not found at ${filePath}, skipping...`);
    return;
  }
  const fileStream = fs.createReadStream(filePath, { encoding: "utf-8" });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line.trim()) continue;
    const parts = line.split("\t");
    if (parts.length >= 2) {
      const code = parts[0].trim(); // e.g. "IN.16" or "US.CA"
      const name = parts[1].trim(); // e.g. "Madhya Pradesh" or "California"
      admin1Map.set(code, name);
    }
  }
  console.log(`[GeoNames] Loaded ${admin1Map.size} admin1 mappings.`);
}

export async function importGeoNames(
  filePath: string,
  options: {
    batchSize?: number;
    minPopulation?: number;
    targetCountry?: string;
    dryRun?: boolean;
  } = {}
) {
  const { batchSize = 1000, minPopulation = 0, targetCountry, dryRun = false } = options;

  if (!fs.existsSync(filePath)) {
    throw new Error(`GeoNames file not found at ${filePath}`);
  }

  console.log(`[GeoNames] Beginning import from ${filePath}...`);
  if (dryRun) console.log("[GeoNames] DRY RUN mode enabled. No records will be written.");

  const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY 
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null;

  if (!supabase && !dryRun) {
    console.warn("[GeoNames] No SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY provided. Switching to dry-run verification mode.");
  }

  const fileStream = fs.createReadStream(filePath, { encoding: "utf-8" });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let lineCount = 0;
  let importedCount = 0;
  let batch: LocationRecord[] = [];

  for await (const line of rl) {
    lineCount++;
    if (!line.trim() || line.startsWith("#")) continue;

    // GeoNames tab-separated columns:
    // 0: geonameid
    // 1: name
    // 2: asciiname
    // 3: alternatenames
    // 4: latitude
    // 5: longitude
    // 6: feature class (A, H, L, P, R, S, T, U, V)
    // 7: feature code (PPL, PPLA, ADM1, etc.)
    // 8: country code (ISO-2)
    // 9: cc2
    // 10: admin1 code
    // 11: admin2 code
    // 12: admin3 code
    // 13: admin4 code
    // 14: population
    // 15: elevation
    // 16: dem (digital elevation model)
    // 17: timezone (IANA ID)
    // 18: modification date
    const cols = line.split("\t");
    if (cols.length < 18) continue;

    const featureClass = cols[6];
    // Filter only populated places ('P') and administrative divisions ('A')
    if (featureClass !== "P" && featureClass !== "A") continue;

    const countryCode = cols[8].trim().toUpperCase();
    if (targetCountry && countryCode !== targetCountry.toUpperCase()) continue;

    const population = parseInt(cols[14], 10) || 0;
    if (population < minPopulation && featureClass === "P") continue;

    const lat = parseFloat(cols[4]);
    const lng = parseFloat(cols[5]);
    if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) continue;

    const admin1Code = cols[10].trim();
    const admin1Key = `${countryCode}.${admin1Code}`;
    const admin1Name = admin1Map.get(admin1Key) || admin1Code;
    const countryName = countryMap.get(countryCode) || countryCode;

    const record: LocationRecord = {
      geoname_id: parseInt(cols[0], 10),
      name: cols[1].trim(),
      ascii_name: cols[2].trim(),
      alternate_names: cols[3].slice(0, 1000).trim(),
      latitude: lat,
      longitude: lng,
      feature_class: featureClass,
      feature_code: cols[7].trim(),
      country_code: countryCode,
      country_name: countryName,
      admin1_code: admin1Code,
      admin1_name: admin1Name,
      admin2_code: cols[11].trim(),
      admin2_name: "",
      population: population,
      elevation: cols[15] ? parseInt(cols[15], 10) || null : null,
      dem: cols[16] ? parseInt(cols[16], 10) || null : null,
      timezone: cols[17].trim() || "UTC",
    };

    batch.push(record);

    if (batch.length >= batchSize) {
      if (!dryRun && supabase) {
        const { error } = await supabase.from("locations").upsert(batch, { onConflict: "geoname_id" });
        if (error) {
          console.error(`[GeoNames] Batch upsert error at line ${lineCount}:`, error.message);
        } else {
          importedCount += batch.length;
          console.log(`[GeoNames] Upserted ${importedCount} records (processed ${lineCount} lines)...`);
        }
      } else {
        importedCount += batch.length;
        if (importedCount % 5000 === 0) {
          console.log(`[GeoNames] Validated ${importedCount} records (line ${lineCount})...`);
        }
      }
      batch = [];
    }
  }

  // Flush remaining
  if (batch.length > 0) {
    if (!dryRun && supabase) {
      const { error } = await supabase.from("locations").upsert(batch, { onConflict: "geoname_id" });
      if (error) console.error("[GeoNames] Final batch upsert error:", error.message);
      else importedCount += batch.length;
    } else {
      importedCount += batch.length;
    }
  }

  console.log(`\n============================================================`);
  console.log(`[GeoNames] Import Finished!`);
  console.log(`Total lines read: ${lineCount}`);
  console.log(`Total valid locations parsed: ${importedCount}`);
  console.log(`============================================================\n`);
}

// CLI Execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const fileArg = args.find((a) => a.startsWith("--file="))?.split("=")[1] || "./data/allCountries.txt";
  const countryArg = args.find((a) => a.startsWith("--country="))?.split("=")[1];
  const dryRun = args.includes("--dry-run");

  console.log("[GeoNames] Initializing GeoNames importer...");
  Promise.all([
    loadCountryInfo("./data/countryInfo.txt"),
    loadAdmin1Codes("./data/admin1CodesASCII.txt"),
  ])
    .then(() => importGeoNames(fileArg, { targetCountry: countryArg, dryRun }))
    .catch((err) => {
      console.error("[GeoNames] Import failed:", err);
      process.exit(1);
    });
}
