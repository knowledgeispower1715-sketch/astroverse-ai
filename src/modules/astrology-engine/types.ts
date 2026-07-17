import type { AstrologySystemId, HouseSystemId, CelestialPosition, HouseCusp, Aspect } from '@/types/astrology';

export interface ChartCalculationInput {
  birthDate: Date;
  birthTime: string;
  latitude: number;
  longitude: number;
  timezone: string;
  system: AstrologySystemId;
  houseSystem: HouseSystemId;
}

export interface ChartCalculationResult {
  positions: CelestialPosition[];
  houses: HouseCusp[];
  aspects: Aspect[];
  ascendant: { sign: string; degree: number };
  midheaven: { sign: string; degree: number };
  nakshatras?: Record<string, unknown>;
  navamsa?: Record<string, unknown>;
  strengths?: Record<string, number>;
  dashas?: unknown[];
  yogas?: unknown[];
  doshas?: unknown[];
  remedies?: string[];
  gemstones?: unknown[];
}

export interface AstrologyProvider {
  id: AstrologySystemId;
  name: string;
  calculateChart(input: ChartCalculationInput): Promise<ChartCalculationResult>;
  getSunSign(date: Date): string;
  getMoonSign(date: Date, time: string, latitude: number, longitude: number): Promise<string>;
}
