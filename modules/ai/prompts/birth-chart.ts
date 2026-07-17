import type { AIPromptTemplate } from '../types';

export const birthChartPrompt: AIPromptTemplate = {
  id: 'birth-chart-interpretation',
  name: 'Birth Chart Interpretation',
  template: `Analyze the following birth chart and provide a comprehensive interpretation.

Sun Sign: {{sunSign}}
Moon Sign: {{moonSign}}
Rising Sign: {{risingSign}}
Key Aspects: {{aspects}}

Provide insights on:
1. Core personality traits
2. Emotional nature
3. Public persona and first impressions
4. Key life themes based on planetary aspects
5. Strengths and growth areas`,
  variables: ['sunSign', 'moonSign', 'risingSign', 'aspects'],
  render(vars: Record<string, string>): string {
    let result = this.template;
    for (const [key, value] of Object.entries(vars)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
  },
};
