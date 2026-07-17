import type { BirthChartData, HoroscopeReading, TransitEvent } from '@/types/astrology';

export interface PredictionInput {
  chart: BirthChartData;
  date: Date;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface PredictionResult {
  reading: HoroscopeReading;
  transits: TransitEvent[];
  highlights: string[];
}

export interface PredictionEngine {
  generateHoroscope(input: PredictionInput): Promise<PredictionResult>;
  getActiveTransits(chart: BirthChartData, date: Date): Promise<TransitEvent[]>;
}
