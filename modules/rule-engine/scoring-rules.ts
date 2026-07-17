import type { RuleResult } from './types';

export function aggregateScores(results: RuleResult[]): number {
  if (results.length === 0) return 0;
  const weightedSum = results.reduce((sum, r) => sum + r.score * r.confidence, 0);
  const totalWeight = results.reduce((sum, r) => sum + r.confidence, 0);
  return Math.round(weightedSum / totalWeight);
}

export function mergeKeywords(results: RuleResult[]): string[] {
  const keywords = new Set<string>();
  results.forEach((r) => r.keywords.forEach((k) => keywords.add(k)));
  return Array.from(keywords);
}

export function getTopInterpretations(results: RuleResult[], limit = 5): string[] {
  return results
    .sort((a, b) => b.score * b.confidence - a.score * a.confidence)
    .slice(0, limit)
    .map((r) => r.interpretation);
}
