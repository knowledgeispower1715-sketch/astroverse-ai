import type { SupabaseClient } from "@supabase/supabase-js";

export interface ReportInput {
  title: string;
  report_type: "kundli" | "compatibility" | "transit_forecast";
  status?: "pending" | "completed" | "failed";
  pdf_url?: string;
}

export class ReportsRepository {
  constructor(private supabase: SupabaseClient) {}

  async getByUser(userId: string) {
    const { data, error } = await this.supabase
      .from("reports")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return { data, error };
  }

  async getById(id: string) {
    const { data, error } = await this.supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  }

  async create(userId: string, input: ReportInput) {
    const { data, error } = await this.supabase
      .from("reports")
      .insert([{ user_id: userId, ...input }])
      .select()
      .single();
    return { data, error };
  }

  async updateStatus(id: string, status: "pending" | "completed" | "failed", pdfUrl?: string) {
    const updates: Partial<ReportInput> = { status };
    if (pdfUrl) updates.pdf_url = pdfUrl;

    const { data, error } = await this.supabase
      .from("reports")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  }
}
