import { LocationResult } from "./types";
import { WORLD_CITIES } from "./world-cities-dataset";

const locationCache = new Map<string, LocationResult[]>();

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Searches the global database for matching locations.
 */
export async function searchLocations(query: string): Promise<LocationResult[]> {
  const q = normalize(query);
  if (!q || q.length < 2) return [];

  if (locationCache.has(q)) {
    return locationCache.get(q)!;
  }

  // 1. Search local indexed database
  const localMatches = WORLD_CITIES.filter((loc) => {
    const name = normalize(loc.name);
    const region = loc.adminRegion ? normalize(loc.adminRegion) : "";
    const country = normalize(loc.country);
    const formatted = normalize(loc.formattedAddress);

    return (
      name.includes(q) ||
      region.includes(q) ||
      country.includes(q) ||
      formatted.includes(q)
    );
  });

  // Sort by relevance (exact startsWith gets top priority)
  const sorted = localMatches.sort((a, b) => {
    const aName = normalize(a.name);
    const bName = normalize(b.name);
    if (aName.startsWith(q) && !bName.startsWith(q)) return -1;
    if (!aName.startsWith(q) && bName.startsWith(q)) return 1;
    return 0;
  });

  locationCache.set(q, sorted);
  return sorted;
}

/**
 * Resolves approximate IANA timezone from latitude and longitude if not otherwise known.
 */
export function estimateTimezoneFromCoords(lat: number, lng: number): string {
  // Approximate standard timezone longitude bands (15 deg per hour)
  if (lat >= 6 && lat <= 37 && lng >= 68 && lng <= 97) return "Asia/Kolkata"; // India subcontinent
  if (lat >= 26 && lat <= 31 && lng >= 80 && lng <= 89) return "Asia/Kathmandu"; // Nepal
  if (lat >= 49 && lat <= 60 && lng >= -11 && lng <= 2) return "Europe/London"; // UK
  if (lat >= 24 && lat <= 50 && lng >= -125 && lng <= -66) {
    if (lng > -86) return "America/New_York";
    if (lng > -100) return "America/Chicago";
    if (lng > -114) return "America/Denver";
    return "America/Los_Angeles";
  }
  if (lat >= 30 && lat <= 46 && lng >= 129 && lng <= 146) return "Asia/Tokyo"; // Japan
  if (lat <= -10 && lat >= -45 && lng >= 112 && lng <= 154) return "Australia/Sydney"; // Australia East
  if (lat >= 22 && lat <= 26 && lng >= 51 && lng <= 57) return "Asia/Dubai"; // UAE
  if (lat >= 35 && lat <= 71 && lng >= -10 && lng <= 40) return "Europe/Paris"; // Central Europe

  // Generic offset calculation
  const offsetHours = Math.round(lng / 15);
  return offsetHours >= 0 ? `Etc/GMT-${offsetHours}` : `Etc/GMT+${Math.abs(offsetHours)}`;
}
