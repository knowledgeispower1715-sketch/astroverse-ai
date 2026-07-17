import { SwissEphemeris } from "@swisseph/browser";
import path from "path";

let sweInstance: SwissEphemeris | null = null;

export async function getSwissEphemeris(): Promise<SwissEphemeris> {
  if (sweInstance) return sweInstance;

  const swe = new SwissEphemeris();
  
  // Resolve the WASM file relative to the project root for server-side Next.js execution
  const wasmPath = path.join(process.cwd(), "node_modules", "@swisseph", "browser", "dist", "swisseph.wasm");
  
  try {
    await swe.init(wasmPath);
  } catch (err) {
    console.warn("Failed to initialize Swiss Ephemeris with local absolute path. Retrying default URL resolver...", err);
    await swe.init(); // fallback to default
  }
  
  sweInstance = swe;
  return sweInstance;
}
