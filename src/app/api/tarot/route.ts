import { NextRequest, NextResponse } from "next/server";
import { drawCards, SPREADS } from "@/modules/tarot-engine";
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
    const { spreadId = "three-card", question, save = false } = body;

    if (!SPREADS[spreadId]) {
      return NextResponse.json(
        { error: `Invalid spreadId. Supported spreads: ${Object.keys(SPREADS).join(", ")}` },
        { status: 400 }
      );
    }

    const reading = drawCards(spreadId, question);

    if (save) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("tarot_readings").insert({
          id: reading.id,
          user_id: user.id,
          spread_id: reading.spreadId,
          question: reading.question,
          drawn_cards: reading.drawnCards,
          cosmic_context: reading.cosmicContext,
          created_at: reading.createdAt,
        });
      }
    }

    return NextResponse.json({ reading });
  } catch (error) {
    console.error("Tarot generation error:", error);
    return NextResponse.json({ error: "Failed to generate tarot reading" }, { status: 500 });
  }
}
