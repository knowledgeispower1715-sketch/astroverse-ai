import type { SupabaseClient } from "@supabase/supabase-js";

export interface BlogInput {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
}

export class BlogsRepository {
  constructor(private supabase: SupabaseClient) {}

  async list() {
    const { data, error } = await this.supabase
      .from("blogs")
      .select("*")
      .order("published_at", { ascending: false });
    return { data, error };
  }

  async getBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .single();
    return { data, error };
  }

  async create(input: BlogInput) {
    const { data, error } = await this.supabase
      .from("blogs")
      .insert([input])
      .select()
      .single();
    return { data, error };
  }

  async delete(id: string) {
    const { data, error } = await this.supabase
      .from("blogs")
      .delete()
      .eq("id", id)
      .select();
    return { data, error };
  }
}
