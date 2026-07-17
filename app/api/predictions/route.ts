import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generatePrediction } from "@/modules/prediction-engine/prediction-generator";
import { AstrologyService } from "@/lib/db/services/astrology-service";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { chartId, date = new Date().toISOString(), period = "daily" } = body;

    if (!chartId) {
      return NextResponse.json({ error: "Missing required parameter: chartId" }, { status: 400 });
    }

    const astroService = new AstrologyService(supabase);
    const { data: chart, error: chartError } = await astroService.getChartById(chartId);

    if (chartError || !chart) {
      return NextResponse.json({ error: chartError?.message || "Birth chart not found" }, { status: 404 });
    }

    // Call the rule-based prediction engine
    const predictionResult = await generatePrediction(chart, new Date(date), period);

    // Save prediction in DB for caching / history logs
    const savedPrediction = await astroService.savePrediction({
      target_type: "user",
      target_value: user.id,
      period: period as "hourly" | "daily" | "weekly" | "monthly" | "yearly",
      prediction_date: new Date(date).toISOString().slice(0, 10),
      scores: predictionResult.scores,
      placements: { activeHora: predictionResult.activeHora, activeDasha: predictionResult.activeDasha },
      content: predictionResult.guidance,
    });

    return NextResponse.json({
      success: true,
      prediction: predictionResult,
      dbRef: savedPrediction.data
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to process prediction rules";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetType = searchParams.get("target_type") as "sign" | "user";
  const targetValue = searchParams.get("target_value");
  const period = searchParams.get("period") as "hourly" | "daily" | "weekly" | "monthly" | "yearly";
  const date = searchParams.get("date");

  if (!targetType || !targetValue || !period || !date) {
    return NextResponse.json({ error: "Missing required query parameters" }, { status: 400 });
  }

  const supabase = await createClient();
  const astroService = new AstrologyService(supabase);
  const { data, error } = await astroService.getForecast(targetType, targetValue, period, date);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, data });
}
