import type { AIPromptTemplate } from '../types';

export const horoscopePrompt: AIPromptTemplate = {
  id: 'horoscope-reading',
  name: 'Horoscope Reading',
  template: `Generate a {{period}} horoscope for {{sign}} starting {{date}}.

Current transits: {{transits}}

Provide:
1. Overall theme for the period
2. Love and relationships
3. Career and finances
4. Health and wellness
5. Key dates to watch
6. Affirmation for the period`,
  variables: ['period', 'sign', 'date', 'transits'],
  render(vars: Record<string, string>): string {
    let result = this.template;
    for (const [key, value] of Object.entries(vars)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
  },
};
