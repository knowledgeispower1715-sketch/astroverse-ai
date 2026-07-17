export interface AnalyticsEvent {
  name: string;
  category: string;
  properties: Record<string, string | number | boolean>;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export interface AnalyticsProvider {
  id: string;
  track(event: AnalyticsEvent): void;
  identify(userId: string, traits: Record<string, unknown>): void;
  page(name: string, properties?: Record<string, string>): void;
}
