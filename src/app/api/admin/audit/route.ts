import { NextResponse, type NextRequest } from "next/server";
import { generateCalculationAudit } from "@/modules/astrology-engine";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dob = searchParams.get("dob") || "1995-05-15";
    const tob = searchParams.get("tob") || "14:30";
    const lat = searchParams.get("lat") ? Number(searchParams.get("lat")) : 28.6139;
    const lng = searchParams.get("lng") ? Number(searchParams.get("lng")) : 77.2090;
    const tz = searchParams.get("tz") || "Asia/Kolkata";
    const place = searchParams.get("place") || "New Delhi, India";
    const name = searchParams.get("name") || "Audit Test Profile";

    const audit = generateCalculationAudit({
      name,
      dateOfBirth: dob,
      timeOfBirth: tob,
      birthPlace: place,
      latitude: lat,
      longitude: lng,
      timezone: tz,
    });

    return NextResponse.json({
      success: true,
      audit,
    });
  } catch (err) {
    console.error("Calculation audit error:", err);
    return NextResponse.json({ error: "Failed to generate calculation audit" }, { status: 500 });
  }
}
