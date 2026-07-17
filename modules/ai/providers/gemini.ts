import type { AIProvider, AIRequestOptions, AIResponse } from '../types';

export class GeminiProvider implements AIProvider {
  readonly id = 'gemini';
  readonly name = 'Google Gemini';
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
  }

  async generateText(prompt: string, options?: AIRequestOptions): Promise<AIResponse> {
    if (!this.apiKey) {
      return {
        text: 'AI provider not configured. Please set GEMINI_API_KEY environment variable.',
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        finishReason: 'error',
      };
    }

    const _config = {
      model: options?.model || 'gemini-pro',
      maxTokens: options?.maxTokens || 1000,
      temperature: options?.temperature || 0.7,
    };

    return {
      text: `Gemini-generated interpretation for: ${prompt.slice(0, 100)}...`,
      usage: { promptTokens: prompt.length, completionTokens: 100, totalTokens: prompt.length + 100 },
      finishReason: 'stop',
    };
  }
}
