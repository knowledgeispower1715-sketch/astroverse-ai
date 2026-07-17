import type { SupabaseClient } from "@supabase/supabase-js";

export interface SavedChartInput {
  birth_details_id?: string;
  name: string;
  chart_type: "western" | "vedic" | "chinese";
  placements: unknown;
  houses: unknown;
  aspects: unknown;
}

export class SavedChartsRepository {
  constructor(private supabase: SupabaseClient) {}

  async getByUser(userId: string) {
    const { data, error } = await this.supabase
      .from("saved_charts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return { data, error };
  }

  async getById(id: string) {
    const { data, error } = await this.supabase
      .from("saved_charts")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  }

  async create(userId: string, input: SavedChartInput) {
    const { data, error } = await this.supabase
      .from("saved_charts")
      .insert([{ user_id: userId, ...input }])
      .select()
      .single();
    return { data, error };
  }

  async delete(id: string, userId: string) {
    const { data, error } = await this.supabase
      .from("saved_charts")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)
      .select();
    return { data, error };
  }
}
