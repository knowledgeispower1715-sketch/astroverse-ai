import { NextResponse } from "next/server";
import { getAstrologyProvider } from "@/modules/astrology-engine";
import type { AstrologySystemId, HouseSystemId } from "@/types/astrology";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { birthDate, birthTime, latitude, longitude, timezone, system = "western", houseSystem = "placidus" } = body;

    if (!birthDate || !birthTime || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: "Missing required fields: birthDate, birthTime, latitude, longitude" }, { status: 400 });
    }

    const provider = getAstrologyProvider(system as AstrologySystemId);
    const result = await provider.calculateChart({
      birthDate: new Date(birthDate),
      birthTime,
      latitude,
      longitude,
      timezone: timezone || "UTC",
      system: system as AstrologySystemId,
      houseSystem: houseSystem as HouseSystemId,
    });

    return NextResponse.json({ data: result });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
