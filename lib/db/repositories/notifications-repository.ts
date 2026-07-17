import type { SupabaseClient } from "@supabase/supabase-js";

export interface NotificationInput {
  title: string;
  message: string;
}

export class NotificationsRepository {
  constructor(private supabase: SupabaseClient) {}

  async getByUser(userId: string) {
    const { data, error } = await this.supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return { data, error };
  }

  async markAsRead(id: string, userId: string) {
    const { data, error } = await this.supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .eq("user_id", userId)
      .select();
    return { data, error };
  }

  async create(userId: string, input: NotificationInput) {
    const { data, error } = await this.supabase
      .from("notifications")
      .insert([{ user_id: userId, ...input, is_read: false }])
      .select()
      .single();
    return { data, error };
  }
}
