import { NextResponse, type NextRequest } from "next/server";
import { calculateCompatibility } from "@/modules/prediction-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      dob1?: string; time1?: string;
      dob2?: string; time2?: string;
    };
    const { dob1, time1, dob2, time2 } = body;

    if (!dob1 || !dob2) {
      return NextResponse.json({ error: "dob1 and dob2 are required (YYYY-MM-DD)" }, { status: 400 });
    }

    const result = calculateCompatibility(dob1, time1 ?? "12:00", dob2, time2 ?? "12:00");
    return NextResponse.json({ data: result });
  } catch (err) {
    console.error("Compatibility API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
