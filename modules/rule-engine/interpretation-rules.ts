import type { Rule, RuleContext, RuleResult } from './types';

export const planetInSignRules: Rule[] = [
  {
    id: 'sun-in-fire',
    name: 'Sun in Fire Sign',
    priority: 10,
    condition: (ctx: RuleContext) =>
      ctx.planet === 'Sun' && ['Aries', 'Leo', 'Sagittarius'].includes(ctx.sign),
    action: (_ctx: RuleContext): RuleResult => ({
      interpretation: 'Your Sun in a Fire sign brings natural leadership, enthusiasm, and a vibrant creative spirit.',
      keywords: ['leadership', 'energy', 'creativity', 'passion'],
      score: 85,
      confidence: 0.9,
    }),
  },
  {
    id: 'sun-in-earth',
    name: 'Sun in Earth Sign',
    priority: 10,
    condition: (ctx: RuleContext) =>
      ctx.planet === 'Sun' && ['Taurus', 'Virgo', 'Capricorn'].includes(ctx.sign),
    action: (_ctx: RuleContext): RuleResult => ({
      interpretation: 'Your Sun in an Earth sign grounds you with practicality, determination, and material wisdom.',
      keywords: ['stability', 'practicality', 'determination', 'reliability'],
      score: 80,
      confidence: 0.9,
    }),
  },
  {
    id: 'sun-in-air',
    name: 'Sun in Air Sign',
    priority: 10,
    condition: (ctx: RuleContext) =>
      ctx.planet === 'Sun' && ['Gemini', 'Libra', 'Aquarius'].includes(ctx.sign),
    action: (_ctx: RuleContext): RuleResult => ({
      interpretation: 'Your Sun in an Air sign gifts you with intellectual curiosity, social grace, and innovative thinking.',
      keywords: ['intellect', 'communication', 'innovation', 'social'],
      score: 82,
      confidence: 0.9,
    }),
  },
  {
    id: 'sun-in-water',
    name: 'Sun in Water Sign',
    priority: 10,
    condition: (ctx: RuleContext) =>
      ctx.planet === 'Sun' && ['Cancer', 'Scorpio', 'Pisces'].includes(ctx.sign),
    action: (_ctx: RuleContext): RuleResult => ({
      interpretation: 'Your Sun in a Water sign bestows deep emotional intelligence, intuition, and empathic abilities.',
      keywords: ['intuition', 'emotion', 'empathy', 'depth'],
      score: 83,
      confidence: 0.9,
    }),
  },
];

export const retrogradeRules: Rule[] = [
  {
    id: 'mercury-retrograde',
    name: 'Mercury Retrograde',
    priority: 15,
    condition: (ctx: RuleContext) => ctx.planet === 'Mercury' && ctx.retrograde,
    action: (_ctx: RuleContext): RuleResult => ({
      interpretation: 'Mercury retrograde invites reflection on communication patterns. Review, revise, and reconnect rather than initiating new ventures.',
      keywords: ['reflection', 'review', 'caution', 'delays'],
      score: 60,
      confidence: 0.85,
    }),
  },
];
