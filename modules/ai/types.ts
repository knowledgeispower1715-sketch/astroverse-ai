export interface AIProvider {
  id: string;
  name: string;
  generateText(prompt: string, options?: AIRequestOptions): Promise<AIResponse>;
}

export interface AIRequestOptions {
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  model?: string;
}

export interface AIResponse {
  text: string;
  usage: { promptTokens: number; completionTokens: number; totalTokens: number };
  finishReason: string;
}

export interface AIPromptTemplate {
  id: string;
  name: string;
  template: string;
  variables: string[];
  render(vars: Record<string, string>): string;
}
