import { NextResponse, type NextRequest } from "next/server";
import { calculateNumerology } from "@/modules/prediction-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { name?: string; dob?: string };
    const { name, dob } = body;

    if (!dob) {
      return NextResponse.json({ error: "dob is required (YYYY-MM-DD)" }, { status: 400 });
    }

    const result = calculateNumerology(name ?? "", dob);
    return NextResponse.json({ data: result });
  } catch (err) {
    console.error("Numerology API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
