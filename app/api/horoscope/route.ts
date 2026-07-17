import { NextResponse, type NextRequest } from "next/server";
import { generateDailyHoroscope } from "@/modules/prediction-engine";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sign = searchParams.get("sign");
    const period = searchParams.get("period") || "daily";

    if (!sign) {
      return NextResponse.json({ error: "Sign parameter is required" }, { status: 400 });
    }

    const validSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    if (!validSigns.includes(sign)) {
      return NextResponse.json({ error: "Invalid zodiac sign" }, { status: 400 });
    }

    if (period === "daily") {
      const reading = generateDailyHoroscope(sign, new Date());
      return NextResponse.json({ data: reading });
    }

    return NextResponse.json({ error: `Period '${period}' not yet supported` }, { status: 501 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
