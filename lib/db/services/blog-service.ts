import type { SupabaseClient } from "@supabase/supabase-js";
import { BlogsRepository, BlogInput } from "../repositories/blogs-repository";
import { FavoritesRepository } from "../repositories/favorites-repository";

export class BlogService {
  private blogRepo: BlogsRepository;
  private favRepo: FavoritesRepository;

  constructor(supabase: SupabaseClient) {
    this.blogRepo = new BlogsRepository(supabase);
    this.favRepo = new FavoritesRepository(supabase);
  }

  async getBlogsList() {
    return this.blogRepo.list();
  }

  async getBlogBySlug(slug: string) {
    return this.blogRepo.getBySlug(slug);
  }

  async createBlog(input: BlogInput) {
    return this.blogRepo.create(input);
  }

  async getFavorites(userId: string) {
    return this.favRepo.getByUser(userId);
  }

  async addFavorite(userId: string, favoriteType: "chart" | "blog" | "prediction", favoriteId: string) {
    return this.favRepo.add(userId, { favorite_type: favoriteType, favorite_id: favoriteId });
  }

  async removeFavorite(userId: string, favoriteType: "chart" | "blog" | "prediction", favoriteId: string) {
    return this.favRepo.remove(userId, favoriteType, favoriteId);
  }
}
