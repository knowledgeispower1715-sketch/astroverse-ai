import { NextResponse, type NextRequest } from "next/server";
import { getDailyForecast } from "@/modules/prediction-engine";

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

    if (!sign) {
      return NextResponse.json({ error: "sign parameter is required" }, { status: 400 });
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
        const d = new Date(base.getTime() + i * 86400000);
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
