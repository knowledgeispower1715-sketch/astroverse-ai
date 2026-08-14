import { NextResponse, type NextRequest } from "next/server";
import { generateHourlyForecast } from "@/modules/prediction-engine";

const VALID_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sign = searchParams.get("sign");
    const dateStr = searchParams.get("date") ?? new Date().toISOString().slice(0, 10);

    if (!sign || !VALID_SIGNS.includes(sign)) {
      return NextResponse.json({ error: "Valid sign parameter is required" }, { status: 400 });
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD." }, { status: 400 });
    }

    const slots = generateHourlyForecast(sign, date);
    return NextResponse.json({ data: slots, sign, date: dateStr });
  } catch (err) {
    console.error("Hourly API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
