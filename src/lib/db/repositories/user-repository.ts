import type { SupabaseClient } from "@supabase/supabase-js";

export class UserRepository {
  constructor(private supabase: SupabaseClient) {}

  async getProfile(userId: string) {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    return { data, error };
  }

  async updateProfile(userId: string, updates: { name?: string; role?: string }) {
    const { data, error } = await this.supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
    return { data, error };
  }

  async getSettings(userId: string) {
    const { data, error } = await this.supabase
      .from("settings")
      .select("*")
      .eq("user_id", userId)
      .single();
    return { data, error };
  }

  async updateSettings(userId: string, updates: {
    astrology_system?: string;
    house_system?: string;
    theme?: string;
    daily_horoscope_alert?: boolean;
    transits_alert?: boolean;
    newsletters_alert?: boolean;
    timezone?: string;
    locale?: string;
  }) {
    const { data, error } = await this.supabase
      .from("settings")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();
    return { data, error };
  }
}
