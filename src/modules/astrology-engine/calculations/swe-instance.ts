import { SwissEphemeris } from "@swisseph/browser";
import path from "path";
import { pathToFileURL } from "url";

let sweInstance: SwissEphemeris | null = null;

export async function getSwissEphemeris(): Promise<SwissEphemeris | null> {
  if (sweInstance) return sweInstance;

  try {
    const swe = new SwissEphemeris();
    const wasmPath = path.join(process.cwd(), "node_modules", "@swisseph", "browser", "dist", "swisseph.wasm");
    
    // Support Windows file URLs in Node/Next environments
    const wasmUrl = pathToFileURL(wasmPath).href;

    try {
      await swe.init(wasmUrl);
    } catch {
      await swe.init(wasmPath);
    }

    sweInstance = swe;
    return sweInstance;
  } catch (err) {
    console.warn("[SwissEphemeris] WASM binary initialization failed, falling back to analytical ephemeris engine:", (err as Error).message);
    return null;
  }
}
