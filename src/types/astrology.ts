export type Element = 'fire' | 'earth' | 'air' | 'water';
export type Modality = 'cardinal' | 'fixed' | 'mutable';
export type PlanetCategory = 'personal' | 'social' | 'transpersonal';
export type AstrologySystemId = 'western' | 'vedic' | 'chinese';
export type HouseSystemId = 'placidus' | 'whole-sign' | 'equal' | 'koch' | 'campanus' | 'regiomontanus';

export interface CelestialPosition {
  planet: string;
  sign: string;
  degree: number;
  minute: number;
  retrograde: boolean;
  house: number;
}

export interface HouseCusp {
  house: number;
  sign: string;
  degree: number;
  minute: number;
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile';
  orb: number;
  applying: boolean;
}

export interface BirthChartData {
  id: string;
  name: string;
  birthDate: Date;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;
  system: AstrologySystemId;
  houseSystem: HouseSystemId;
  positions: CelestialPosition[];
  houses: HouseCusp[];
  aspects: Aspect[];
  createdAt: Date;
  updatedAt: Date;
}

export interface HoroscopeReading {
  id: string;
  sign: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: Date;
  content: string;
  mood: string;
  luckyNumber: number;
  luckyColor: string;
  compatibility: string;
  rating: number;
}

export interface CompatibilityResult {
  id: string;
  chart1: BirthChartData;
  chart2: BirthChartData;
  overallScore: number;
  categories: {
    romance: number;
    communication: number;
    values: number;
    trust: number;
    intellect: number;
    emotions: number;
  };
  synastryAspects: Aspect[];
  interpretation: string;
}

export interface TransitEvent {
  id: string;
  planet: string;
  sign: string;
  type: 'ingress' | 'retrograde' | 'direct' | 'aspect';
  date: Date;
  description: string;
  impact: 'high' | 'medium' | 'low';
}
