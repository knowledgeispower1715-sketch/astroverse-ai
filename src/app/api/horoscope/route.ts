import { NextResponse, type NextRequest } from "next/server";
import { getDailyForecast } from "@/modules/prediction-engine";
import { buildCanonicalAstrologyContext, RuleEngine } from "@/modules/astrology-engine";

const VALID_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sign = searchParams.get("sign");
    const period = (searchParams.get("period") ?? "daily") as "daily" | "weekly" | "monthly" | "yearly";
    const datePeriod = (searchParams.get("datePeriod") ?? "today") as "yesterday" | "today" | "tomorrow";

    // Support Personalized Astrology Inputs
    const dob = searchParams.get("dob");
    const tob = searchParams.get("tob") || "12:00";
    const lat = searchParams.get("lat") ? Number(searchParams.get("lat")) : null;
    const lng = searchParams.get("lng") ? Number(searchParams.get("lng")) : null;
    const tz = searchParams.get("tz") || "UTC";
    const name = searchParams.get("name") || "Native";

    if (dob && lat !== null && lng !== null) {
      // 1. Build Single Source of Truth Canonical Astrology Context
      const ctx = buildCanonicalAstrologyContext({
        name,
        dateOfBirth: dob,
        timeOfBirth: tob,
        birthPlace: searchParams.get("place") || "Birth Location",
        latitude: lat,
        longitude: lng,
        timezone: tz,
      });

      // 2. Evaluate all life areas through the deterministic Rule Engine
      const lifeAreas = RuleEngine.evaluateAll(ctx);

      return NextResponse.json({
        data: {
          isPersonalized: true,
          profile: {
            name: ctx.birth.name,
            moonSign: ctx.planets.Moon.sign,
            ascendantSign: ctx.angles.ascendant.sign,
            sunSign: ctx.planets.Sun.sign,
            activeDasha: `${ctx.currentDasha.mahadasha.planet} - ${ctx.currentDasha.antardasha?.planet || "Sub"}`,
          },
          period,
          date: new Date().toISOString().slice(0, 10),
          lifeAreas,
          activeTransits: ctx.currentTransits,
          yogas: ctx.yogas.filter((y) => y.isPresent),
          doshas: ctx.doshas.filter((d) => d.isPresent),
        },
      });
    }

    if (!sign) {
      return NextResponse.json({ error: "sign parameter or personalized birth coordinates are required" }, { status: 400 });
    }
    if (!VALID_SIGNS.includes(sign)) {
      return NextResponse.json({ error: `Invalid zodiac sign: ${sign}` }, { status: 400 });
    }

    if (period === "daily") {
      const reading = getDailyForecast(sign, datePeriod);
      return NextResponse.json({ data: reading });
    }

    // Weekly: aggregate 7 days
    if (period === "weekly") {
      const days = [];
      const base = new Date();
      base.setHours(12, 0, 0, 0);
      for (let i = 0; i < 7; i++) {
        days.push(getDailyForecast(sign, "today"));
      }
      const avgOverall = Math.round(days.reduce((s, d) => s + d.overall, 0) / days.length);
      return NextResponse.json({ data: { sign, period: "weekly", days, avgOverall } });
    }

    return NextResponse.json({ error: `Period '${period}' not yet fully supported` }, { status: 501 });
  } catch (err) {
    console.error("Horoscope API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
