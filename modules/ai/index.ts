export type { AIProvider, AIRequestOptions, AIResponse, AIPromptTemplate } from './types';
export { OpenAIProvider } from './providers/openai';
export { GeminiProvider } from './providers/gemini';
export { birthChartPrompt } from './prompts/birth-chart';
export { horoscopePrompt } from './prompts/horoscope';

import type { AIProvider } from './types';
import { OpenAIProvider } from './providers/openai';
import { GeminiProvider } from './providers/gemini';

const providers: Record<string, () => AIProvider> = {
  openai: () => new OpenAIProvider(),
  gemini: () => new GeminiProvider(),
};

export function getAIProvider(id = 'gemini'): AIProvider {
  const factory = providers[id];
  if (!factory) throw new Error(`Unknown AI provider: ${id}`);
  return factory();
}
