import type { CompatibilityResult, BirthChartData } from '@/types/astrology';
import { getZodiacCompatibility } from '@/modules/astrology-engine';

export function analyzeCompatibility(
  chart1: BirthChartData,
  chart2: BirthChartData
): CompatibilityResult {
  const sign1 = chart1.positions[0]?.sign || 'Aries';
  const sign2 = chart2.positions[0]?.sign || 'Aries';
  const baseScore = getZodiacCompatibility(sign1, sign2);

  return {
    id: `compat-${chart1.id}-${chart2.id}`,
    chart1,
    chart2,
    overallScore: baseScore,
    categories: {
      romance: Math.min(100, baseScore + Math.floor(Math.random() * 15)),
      communication: Math.min(100, baseScore + Math.floor(Math.random() * 10)),
      values: Math.min(100, baseScore + Math.floor(Math.random() * 12)),
      trust: Math.min(100, baseScore + Math.floor(Math.random() * 8)),
      intellect: Math.min(100, baseScore + Math.floor(Math.random() * 15)),
      emotions: Math.min(100, baseScore + Math.floor(Math.random() * 10)),
    },
    synastryAspects: [],
    interpretation: `The cosmic connection between ${sign1} and ${sign2} shows a ${baseScore >= 75 ? 'strong' : baseScore >= 50 ? 'moderate' : 'challenging'} alignment.`,
  };
}
