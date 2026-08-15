import { NextRequest, NextResponse } from "next/server";
import { drawCards, SPREADS, TarotReading } from "@/modules/tarot-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("tarot_readings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tarot readings:", error);
      return NextResponse.json({ readings: [] });
    }

    return NextResponse.json({ readings: data || [] });
  } catch (error) {
    console.error("Tarot API error:", error);
    return NextResponse.json({ error: "Failed to retrieve readings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. If explicitly saving an existing reading
    if (body.action === "save" && body.reading) {
      const existingReading = body.reading as TarotReading;
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { error: insertError } = await supabase.from("tarot_readings").insert({
        id: existingReading.id,
        user_id: user.id,
        spread_id: existingReading.spreadId,
        question: existingReading.question,
        drawn_cards: existingReading.drawnCards,
        cosmic_context: existingReading.cosmicContext,
        created_at: existingReading.createdAt,
      });

      if (insertError) {
        console.error("Save reading error:", insertError);
        return NextResponse.json({ error: "Failed to save reading to database" }, { status: 500 });
      }

      return NextResponse.json({ success: true, readingId: existingReading.id });
    }

    // 2. Otherwise generate a new reading
    const { spreadId = "three-card", question } = body;

    if (!SPREADS[spreadId]) {
      return NextResponse.json(
        { error: `Invalid spreadId. Supported spreads: ${Object.keys(SPREADS).join(", ")}` },
        { status: 400 }
      );
    }

    const reading = drawCards(spreadId, question);

    return NextResponse.json({ reading });
  } catch (error) {
    console.error("Tarot generation error:", error);
    return NextResponse.json({ error: "Failed to process tarot reading" }, { status: 500 });
  }
}
