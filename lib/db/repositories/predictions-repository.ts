import type { SupabaseClient } from "@supabase/supabase-js";

export interface PredictionInput {
  target_type: "sign" | "user";
  target_value: string;
  period: "hourly" | "daily" | "weekly" | "monthly" | "yearly";
  prediction_date: string;
  scores: { love: number; career: number; health: number; finance: number };
  placements?: unknown;
  content: string;
}

export class PredictionsRepository {
  constructor(private supabase: SupabaseClient) {}

  async getForecast(
    targetType: "sign" | "user",
    targetValue: string,
    period: "hourly" | "daily" | "weekly" | "monthly" | "yearly",
    date: string
  ) {
    const { data, error } = await this.supabase
      .from("predictions")
      .select("*")
      .eq("target_type", targetType)
      .eq("target_value", targetValue)
      .eq("period", period)
      .eq("prediction_date", date)
      .maybeSingle();
    return { data, error };
  }

  async create(input: PredictionInput) {
    const { data, error } = await this.supabase
      .from("predictions")
      .insert([input])
      .select()
      .single();
    return { data, error };
  }
}
