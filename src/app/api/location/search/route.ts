import { NextResponse, type NextRequest } from "next/server";
import { searchLocations } from "@/modules/location-engine";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q.trim() || q.trim().length < 2) {
    return NextResponse.json({ success: true, data: [] });
  }

  try {
    const results = await searchLocations(q);
    return NextResponse.json({ success: true, data: results });
  } catch (err) {
    console.error("Location search error:", err);
    return NextResponse.json({ success: false, error: "Failed to search locations" }, { status: 500 });
  }
}
