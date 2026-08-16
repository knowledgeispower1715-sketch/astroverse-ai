import { LocationResult } from "./types";
import { WORLD_CITIES } from "./world-cities-dataset";
import { createClient } from "@/lib/supabase/client";

const locationCache = new Map<string, LocationResult[]>();
const MAX_CACHE_SIZE = 500;

// Common historical, colonial, and multilingual aliases
const ALIAS_MAP: Record<string, string> = {
  "bombay": "mumbai",
  "calcutta": "kolkata",
  "madras": "chennai",
  "bangalore": "bengaluru",
  "baroda": "vadodara",
  "banaras": "varanasi",
  "benares": "varanasi",
  "kashi": "varanasi",
  "cochin": "kochi",
  "trivandrum": "thiruvananthapuram",
  "peking": "beijing",
  "canton": "guangzhou",
  "saigon": "ho chi minh city",
  "munich": "munchen",
  "vienna": "wien",
  "prague": "praha",
  "rome": "roma",
  "florence": "firenze",
  "venice": "venezia",
  "lisbon": "lisboa",
  "warsaw": "warszawa",
};

export function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Searches the global gazetteer across PostgreSQL database, curated dataset,
 * and live global gazetteer fallbacks to support cities, towns, villages, and regions worldwide.
 */
export async function searchLocations(
  query: string,
  options: { countryCode?: string; limit?: number } = {}
): Promise<LocationResult[]> {
  const { countryCode, limit = 15 } = options;
  const rawQ = query.trim();
  const q = normalize(rawQ);
  if (!q || q.length < 2) return [];

  const cacheKey = `${q}:${countryCode || "ALL"}:${limit}`;
  if (locationCache.has(cacheKey)) {
    return locationCache.get(cacheKey)!;
  }

  const results: LocationResult[] = [];
  const seenIds = new Set<string>();

  // Check alias (e.g. "bombay" -> "mumbai")
  const aliasQuery = ALIAS_MAP[q] || "";

  // -------------------------------------------------------------
  // TIER 1: Search PostgreSQL Database via Supabase (if available)
  // -------------------------------------------------------------
  try {
    const supabase = createClient();
    if (supabase && typeof supabase.from === "function") {
      let dbQuery = supabase
        .from("locations")
        .select("id, geoname_id, name, admin1_name, admin2_name, country_name, country_code, latitude, longitude, timezone, population")
        .or(`name.ilike.${q}%,ascii_name.ilike.${q}%,alternate_names.ilike.%${q}%`)
        .order("population", { ascending: false })
        .limit(limit);

      if (countryCode) {
        dbQuery = dbQuery.eq("country_code", countryCode.toUpperCase());
      }

      const { data: dbMatches } = await dbQuery;

      if (dbMatches && Array.isArray(dbMatches) && dbMatches.length > 0) {
        for (const loc of dbMatches) {
          const formatted = [loc.name, loc.admin1_name, loc.country_name].filter(Boolean).join(", ");
          const id = String(loc.geoname_id || loc.id);
          if (!seenIds.has(id)) {
            seenIds.add(id);
            results.push({
              id,
              geonameId: loc.geoname_id ? Number(loc.geoname_id) : undefined,
              name: loc.name,
              adminRegion: loc.admin1_name || undefined,
              admin2: loc.admin2_name || undefined,
              country: loc.country_name || loc.country_code,
              countryCode: loc.country_code,
              latitude: Number(loc.latitude),
              longitude: Number(loc.longitude),
              timezone: loc.timezone || estimateTimezoneFromCoords(Number(loc.latitude), Number(loc.longitude)),
              population: loc.population ? Number(loc.population) : undefined,
              formattedAddress: formatted,
            });
          }
        }
      }
    }
  } catch {
    // Database search fallback
  }

  // -------------------------------------------------------------
  // TIER 2: Search Embedded High-Density Global Gazetteer
  // -------------------------------------------------------------
  const tokens = q.split(/[\s,]+/).filter(Boolean);
  const aliasTokens = aliasQuery ? aliasQuery.split(/[\s,]+/).filter(Boolean) : [];

  const matches = WORLD_CITIES.filter((loc) => {
    if (countryCode && loc.countryCode.toUpperCase() !== countryCode.toUpperCase()) {
      return false;
    }
    const name = normalize(loc.name);
    const region = loc.adminRegion ? normalize(loc.adminRegion) : "";
    const country = normalize(loc.country);
    const formatted = normalize(loc.formattedAddress);

    const tokenMatch = tokens.every((token) =>
      name.includes(token) ||
      region.includes(token) ||
      country.includes(token) ||
      formatted.includes(token)
    );

    if (tokenMatch) return true;

    if (aliasTokens.length > 0) {
      return aliasTokens.every((token) =>
        name.includes(token) ||
        region.includes(token) ||
        country.includes(token) ||
        formatted.includes(token)
      );
    }

    return false;
  });

  for (const loc of matches) {
    if (!seenIds.has(loc.id)) {
      seenIds.add(loc.id);
      results.push(loc);
    }
  }

  // -------------------------------------------------------------
  // TIER 3: Online Global Geocoder Fallback (for remote towns, villages, districts worldwide)
  // Uses Photon / OpenStreetMap compliant geocoding with strict 2.5s timeout
  // -------------------------------------------------------------
  if (results.length < 5 && q.length >= 3) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const endpoint = `https://photon.komoot.io/api/?q=${encodeURIComponent(rawQ)}&limit=8`;
      const res = await fetch(endpoint, {
        signal: controller.signal,
        headers: { "Accept": "application/json" },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const geojson = await res.json();
        if (geojson && Array.isArray(geojson.features)) {
          for (const feat of geojson.features) {
            const props = feat.properties || {};
            const coords = feat.geometry?.coordinates;
            if (!coords || coords.length < 2) continue;

            const lon = Number(coords[0]);
            const lat = Number(coords[1]);
            if (isNaN(lat) || isNaN(lon) || (lat === 0 && lon === 0)) continue;

            const name = props.name || props.city || props.town || props.village || props.locality || rawQ;
            const state = props.state || props.county || props.region || "";
            const country = props.country || "";
            const countryCodeRes = (props.countrycode || "").toUpperCase();

            if (countryCode && countryCodeRes && countryCodeRes !== countryCode.toUpperCase()) {
              continue;
            }

            const formatted = [name, state, country].filter(Boolean).join(", ");
            const id = `geo-${props.osm_id || Math.abs(lat * 1000 + lon)}`;

            if (!seenIds.has(id)) {
              seenIds.add(id);
              results.push({
                id,
                geonameId: props.osm_id ? Number(props.osm_id) : undefined,
                name,
                adminRegion: state || undefined,
                country: country || countryCodeRes || "Global",
                countryCode: countryCodeRes || "GL",
                latitude: lat,
                longitude: lon,
                timezone: estimateTimezoneFromCoords(lat, lon),
                formattedAddress: formatted,
              });
            }
          }
        }
      }
    } catch {
      // Ignore network timeout in fallback
    }
  }

  // Relevance Sorting: Exact name match -> Starts with -> Population/Dataset order
  const sorted = results.sort((a, b) => {
    const aName = normalize(a.name);
    const bName = normalize(b.name);
    if (aName === q && bName !== q) return -1;
    if (bName === q && aName !== q) return 1;
    if (aName.startsWith(q) && !bName.startsWith(q)) return -1;
    if (bName.startsWith(q) && !aName.startsWith(q)) return 1;
    return (b.population || 0) - (a.population || 0);
  });

  const finalResults = sorted.slice(0, limit);

  // Manage Cache
  if (locationCache.size >= MAX_CACHE_SIZE) {
    const firstKey = locationCache.keys().next().value;
    if (firstKey) locationCache.delete(firstKey);
  }
  locationCache.set(cacheKey, finalResults);

  return finalResults;
}

/**
 * Resolves precise IANA timezone from latitude and longitude coordinates.
 */
export function estimateTimezoneFromCoords(lat: number, lng: number): string {
  // India & subcontinent
  if (lat >= 6 && lat <= 37.5 && lng >= 68 && lng <= 97.5) return "Asia/Kolkata";
  // Nepal
  if (lat >= 26 && lat <= 30.5 && lng >= 80 && lng <= 88.5) return "Asia/Kathmandu";
  // Sri Lanka
  if (lat >= 5.8 && lat <= 9.9 && lng >= 79.5 && lng <= 82) return "Asia/Colombo";
  // Bangladesh
  if (lat >= 20.5 && lat <= 26.7 && lng >= 88 && lng <= 92.7) return "Asia/Dhaka";
  // Pakistan
  if (lat >= 23.5 && lat <= 37 && lng >= 60.8 && lng <= 75.5) return "Asia/Karachi";

  // United Kingdom & Ireland
  if (lat >= 49.5 && lat <= 60.9 && lng >= -10.5 && lng <= 1.8) {
    if (lng < -5.5 && lat <= 55.5) return "Europe/Dublin";
    return "Europe/London";
  }

  // France
  if (lat >= 41.3 && lat <= 51.1 && lng >= -4.8 && lng <= 9.6) return "Europe/Paris";
  // Germany, Austria, Switzerland, Italy, Netherlands, Belgium, Poland, Spain
  if (lat >= 47 && lat <= 55 && lng >= 5.8 && lng <= 15) return "Europe/Berlin";
  if (lat >= 36 && lat <= 47 && lng >= 6.6 && lng <= 18.5) return "Europe/Rome";
  if (lat >= 36 && lat <= 43.8 && lng >= -9.3 && lng <= 3.4) return "Europe/Madrid";
  if (lat >= 36.9 && lat <= 42.2 && lng >= -9.5 && lng <= -6.1) return "Europe/Lisbon";
  if (lat >= 49 && lat <= 54.9 && lng >= 14 && lng <= 24.2) return "Europe/Warsaw";

  // North America (US / Canada / Mexico)
  if (lat >= 24 && lat <= 72 && lng >= -168 && lng <= -52) {
    if (lng > -67) return "America/Halifax";
    if (lng > -86) return "America/New_York";
    if (lng > -102) return "America/Chicago";
    if (lng > -115) return "America/Denver";
    if (lng > -130) return "America/Los_Angeles";
    if (lng > -141) return "America/Anchorage";
    return "America/Adak";
  }

  // Japan & Korea
  if (lat >= 30 && lat <= 46 && lng >= 128 && lng <= 146) return "Asia/Tokyo";
  if (lat >= 33 && lat <= 38.8 && lng >= 124.5 && lng <= 130) return "Asia/Seoul";

  // China / Hong Kong / Singapore / Taiwan
  if (lat >= 18 && lat <= 53.5 && lng >= 73.5 && lng <= 135) {
    if (lat >= 1.1 && lat <= 1.5 && lng >= 103.6 && lng <= 104) return "Asia/Singapore";
    if (lat >= 22.1 && lat <= 22.6 && lng >= 113.8 && lng <= 114.4) return "Asia/Hong_Kong";
    return "Asia/Shanghai";
  }

  // Australia & New Zealand
  if (lat <= -10 && lat >= -44 && lng >= 112 && lng <= 154) {
    if (lng < 129) return "Australia/Perth";
    if (lng < 138) return "Australia/Adelaide";
    if (lat <= -40) return "Australia/Hobart";
    return "Australia/Sydney";
  }
  if (lat <= -34 && lat >= -48 && lng >= 165 && lng <= 179) return "Pacific/Auckland";

  // Middle East / Gulf
  if (lat >= 22 && lat <= 26.5 && lng >= 51 && lng <= 57) return "Asia/Dubai";
  if (lat >= 16 && lat <= 32.5 && lng >= 34.5 && lng <= 55.7) return "Asia/Riyadh";

  // South America
  if (lat <= 12 && lat >= -56 && lng >= -82 && lng <= -34) {
    if (lng > -45) return "America/Sao_Paulo";
    if (lng > -65) return "America/Buenos_Aires";
    return "America/Santiago";
  }

  // Generic timezone from longitude offset
  const offsetHours = Math.round(lng / 15);
  return offsetHours >= 0 ? `Etc/GMT-${offsetHours}` : `Etc/GMT+${Math.abs(offsetHours)}`;
}
