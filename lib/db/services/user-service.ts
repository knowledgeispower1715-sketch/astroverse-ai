import type { SupabaseClient } from "@supabase/supabase-js";
import { UserRepository } from "../repositories/user-repository";

export class UserService {
  private userRepo: UserRepository;

  constructor(supabase: SupabaseClient) {
    this.userRepo = new UserRepository(supabase);
  }

  async getProfile(userId: string) {
    return this.userRepo.getProfile(userId);
  }

  async updateProfile(userId: string, name: string) {
    return this.userRepo.updateProfile(userId, { name });
  }

  async getSettings(userId: string) {
    return this.userRepo.getSettings(userId);
  }

  async updateSettings(userId: string, settings: {
    astrology_system?: string;
    house_system?: string;
    theme?: string;
    daily_horoscope_alert?: boolean;
    transits_alert?: boolean;
    newsletters_alert?: boolean;
    timezone?: string;
    locale?: string;
  }) {
    return this.userRepo.updateSettings(userId, settings);
  }
}
