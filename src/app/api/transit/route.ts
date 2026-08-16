import { NextResponse, type NextRequest } from "next/server";
import { getCurrentTransits } from "@/modules/prediction-engine";
import { buildCanonicalAstrologyContext, generateTransitTimeline, getPlanetExplorerData } from "@/modules/astrology-engine";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD." }, { status: 400 });
    }

    const dob = searchParams.get("dob");
    const tob = searchParams.get("tob") || "12:00";
    const lat = searchParams.get("lat") ? Number(searchParams.get("lat")) : null;
    const lng = searchParams.get("lng") ? Number(searchParams.get("lng")) : null;
    const tz = searchParams.get("tz") || "UTC";
    const name = searchParams.get("name") || "Native";

    if (dob && lat !== null && lng !== null) {
      const ctx = buildCanonicalAstrologyContext(
        {
          name,
          dateOfBirth: dob,
          timeOfBirth: tob,
          birthPlace: searchParams.get("place") || "Birth Location",
          latitude: lat,
          longitude: lng,
          timezone: tz,
        },
        { calculationDate: date }
      );

      const timeline = generateTransitTimeline(ctx, date);
      const planetDetails = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].map(
        (p) => getPlanetExplorerData(ctx, p)
      );

      return NextResponse.json({
        data: {
          isPersonalized: true,
          date: dateStr,
          currentTransits: ctx.currentTransits,
          timeline,
          planetDetails,
          ascendantSign: ctx.angles.ascendant.sign,
          moonSign: ctx.planets.Moon.sign,
        },
      });
    }

    const transits = getCurrentTransits(date);
    return NextResponse.json({ data: transits, date: dateStr });
  } catch (err) {
    console.error("Transit API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
