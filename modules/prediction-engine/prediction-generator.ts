import type { BirthChartData } from "@/types/astrology";
import { generateStructuredPrediction, StructuredPrediction } from "../rule-engine/prediction-rules-engine";

export async function generatePrediction(
  chart: BirthChartData,
  date: Date,
  period: "hourly" | "daily" | "weekly" | "monthly" | "yearly"
): Promise<StructuredPrediction> {
  // Production-grade rule engine calculations - no AI API calls
  return generateStructuredPrediction(chart, date, period);
}
