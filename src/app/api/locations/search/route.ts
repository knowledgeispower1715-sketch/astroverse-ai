import { NextResponse, type NextRequest } from "next/server";
import { searchLocations } from "@/modules/location-engine";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || searchParams.get("query") || "";
  const country = searchParams.get("country") || undefined;
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 15, 50) : 15;

  if (!q.trim() || q.trim().length < 2) {
    return NextResponse.json({ success: true, data: [] });
  }

  try {
    const results = await searchLocations(q, { countryCode: country, limit });
    return NextResponse.json({ 
      success: true, 
      count: results.length,
      data: results 
    });
  } catch (err) {
    console.error("Locations search error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to query global gazetteer." },
      { status: 500 }
    );
  }
}
