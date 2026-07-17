export interface Rule {
  id: string;
  name: string;
  priority: number;
  condition: (context: RuleContext) => boolean;
  action: (context: RuleContext) => RuleResult;
}

export interface RuleContext {
  sign: string;
  planet: string;
  house: number;
  aspect?: string;
  degree: number;
  retrograde: boolean;
  metadata: Record<string, unknown>;
}

export interface RuleResult {
  interpretation: string;
  keywords: string[];
  score: number;
  confidence: number;
}

export interface RuleSet {
  id: string;
  name: string;
  rules: Rule[];
  evaluate(context: RuleContext): RuleResult[];
}
