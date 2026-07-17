import type { AnalyticsEvent, AnalyticsProvider } from './types';

class AnalyticsTracker {
  private providers: AnalyticsProvider[] = [];

  registerProvider(provider: AnalyticsProvider): void {
    this.providers.push(provider);
  }

  track(name: string, category: string, properties: Record<string, string | number | boolean> = {}): void {
    const event: AnalyticsEvent = {
      name,
      category,
      properties,
      timestamp: new Date(),
    };

    this.providers.forEach((provider) => {
      try {
        provider.track(event);
      } catch (error) {
        console.error(`Analytics tracking error (${provider.id}):`, error);
      }
    });
  }

  identify(userId: string, traits: Record<string, unknown> = {}): void {
    this.providers.forEach((provider) => {
      try {
        provider.identify(userId, traits);
      } catch (error) {
        console.error(`Analytics identify error (${provider.id}):`, error);
      }
    });
  }

  page(name: string, properties: Record<string, string> = {}): void {
    this.providers.forEach((provider) => {
      try {
        provider.page(name, properties);
      } catch (error) {
        console.error(`Analytics page error (${provider.id}):`, error);
      }
    });
  }
}

export const analytics = new AnalyticsTracker();
