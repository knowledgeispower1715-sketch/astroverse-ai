import { NextResponse, type NextRequest } from "next/server";
import { getCurrentTransits } from "@/modules/prediction-engine";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD." }, { status: 400 });
    }
    const transits = getCurrentTransits(date);
    return NextResponse.json({ data: transits, date: dateStr });
  } catch (err) {
    console.error("Transit API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
