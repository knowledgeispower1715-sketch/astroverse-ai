import { NextResponse, type NextRequest } from "next/server";
import { calculatePanchang } from "@/modules/prediction-engine";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
    const latStr = searchParams.get("lat") ?? "23.1765";
    const lonStr = searchParams.get("lon") ?? "79.9554";
    const tzStr = searchParams.get("tz") ?? "5.5";

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD." }, { status: 400 });
    }

    const latitude = parseFloat(latStr);
    const longitude = parseFloat(lonStr);
    const tzOffset = parseFloat(tzStr);

    if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json({ error: "Invalid latitude or longitude" }, { status: 400 });
    }

    const panchang = calculatePanchang(date, latitude, longitude, tzOffset);
    return NextResponse.json({ data: panchang });
  } catch (err) {
    console.error("Panchang API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
