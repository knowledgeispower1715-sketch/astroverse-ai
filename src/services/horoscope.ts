import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types';
import type { HoroscopeReading } from '@/types/astrology';

export async function getDailyHoroscope(sign: string): Promise<ApiResponse<HoroscopeReading>> {
  return apiClient.get(`/horoscope?sign=${sign}&period=daily`);
}

export async function getWeeklyHoroscope(sign: string): Promise<ApiResponse<HoroscopeReading>> {
  return apiClient.get(`/horoscope?sign=${sign}&period=weekly`);
}

export async function getMonthlyHoroscope(sign: string): Promise<ApiResponse<HoroscopeReading>> {
  return apiClient.get(`/horoscope?sign=${sign}&period=monthly`);
}
