export type { Rule, RuleContext, RuleResult, RuleSet } from './types';
export { planetInSignRules, retrogradeRules } from './interpretation-rules';
export { aggregateScores, mergeKeywords, getTopInterpretations } from './scoring-rules';

import type { Rule, RuleContext, RuleResult, RuleSet } from './types';

export function createRuleSet(id: string, name: string, rules: Rule[]): RuleSet {
  return {
    id,
    name,
    rules: rules.sort((a, b) => b.priority - a.priority),
    evaluate(context: RuleContext): RuleResult[] {
      return this.rules
        .filter((rule) => rule.condition(context))
        .map((rule) => rule.action(context));
    },
  };
}
