import type { SupabaseClient } from "@supabase/supabase-js";

export interface FavoriteInput {
  favorite_type: "chart" | "blog" | "prediction";
  favorite_id: string;
}

export class FavoritesRepository {
  constructor(private supabase: SupabaseClient) {}

  async getByUser(userId: string) {
    const { data, error } = await this.supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return { data, error };
  }

  async add(userId: string, input: FavoriteInput) {
    const { data, error } = await this.supabase
      .from("favorites")
      .insert([{ user_id: userId, ...input }])
      .select()
      .single();
    return { data, error };
  }

  async remove(userId: string, favoriteType: "chart" | "blog" | "prediction", favoriteId: string) {
    const { data, error } = await this.supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("favorite_type", favoriteType)
      .eq("favorite_id", favoriteId)
      .select();
    return { data, error };
  }
}
