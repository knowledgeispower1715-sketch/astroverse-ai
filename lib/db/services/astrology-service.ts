import type { SupabaseClient } from "@supabase/supabase-js";
import { BirthDetailsRepository, BirthDetailsInput } from "../repositories/birth-details-repository";
import { SavedChartsRepository, SavedChartInput } from "../repositories/saved-charts-repository";
import { PredictionsRepository, PredictionInput } from "../repositories/predictions-repository";
import { ReportsRepository, ReportInput } from "../repositories/reports-repository";
import { NotificationsRepository } from "../repositories/notifications-repository";

export class AstrologyService {
  private birthRepo: BirthDetailsRepository;
  private chartRepo: SavedChartsRepository;
  private predRepo: PredictionsRepository;
  private reportRepo: ReportsRepository;
  private notifRepo: NotificationsRepository;

  constructor(supabase: SupabaseClient) {
    this.birthRepo = new BirthDetailsRepository(supabase);
    this.chartRepo = new SavedChartsRepository(supabase);
    this.predRepo = new PredictionsRepository(supabase);
    this.reportRepo = new ReportsRepository(supabase);
    this.notifRepo = new NotificationsRepository(supabase);
  }

  async getBirthDetails(userId: string) {
    return this.birthRepo.getByUser(userId);
  }

  async saveBirthDetails(userId: string, input: BirthDetailsInput) {
    return this.birthRepo.create(userId, input);
  }

  async getSavedCharts(userId: string) {
    return this.chartRepo.getByUser(userId);
  }

  async getChartById(id: string) {
    return this.chartRepo.getById(id);
  }

  async saveChart(userId: string, input: SavedChartInput) {
    return this.chartRepo.create(userId, input);
  }

  async getForecast(targetType: "sign" | "user", targetValue: string, period: "hourly" | "daily" | "weekly" | "monthly" | "yearly", date: string) {
    return this.predRepo.getForecast(targetType, targetValue, period, date);
  }

  async savePrediction(input: PredictionInput) {
    return this.predRepo.create(input);
  }

  async getReports(userId: string) {
    return this.reportRepo.getByUser(userId);
  }

  async createReport(userId: string, input: ReportInput) {
    return this.reportRepo.create(userId, input);
  }

  async getNotifications(userId: string) {
    return this.notifRepo.getByUser(userId);
  }

  async markNotificationRead(id: string, userId: string) {
    return this.notifRepo.markAsRead(id, userId);
  }

  async createNotification(userId: string, title: string, message: string) {
    return this.notifRepo.create(userId, { title, message });
  }
}
