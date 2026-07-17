import type { SupabaseClient } from "@supabase/supabase-js";

export interface BirthDetailsInput {
  name: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  latitude?: number;
  longitude?: number;
  timezone_id?: string;
}

export class BirthDetailsRepository {
  constructor(private supabase: SupabaseClient) {}

  async getByUser(userId: string) {
    const { data, error } = await this.supabase
      .from("birth_details")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return { data, error };
  }

  async getById(id: string) {
    const { data, error } = await this.supabase
      .from("birth_details")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  }

  async create(userId: string, input: BirthDetailsInput) {
    const { data, error } = await this.supabase
      .from("birth_details")
      .insert([{ user_id: userId, ...input }])
      .select()
      .single();
    return { data, error };
  }

  async delete(id: string, userId: string) {
    const { data, error } = await this.supabase
      .from("birth_details")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)
      .select();
    return { data, error };
  }
}
