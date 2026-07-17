export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  CHART_GENERATED: 'chart_generated',
  HOROSCOPE_VIEWED: 'horoscope_viewed',
  COMPATIBILITY_CHECKED: 'compatibility_checked',
  TRANSIT_VIEWED: 'transit_viewed',
  NEWSLETTER_SUBSCRIBED: 'newsletter_subscribed',
  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  FEATURE_CLICKED: 'feature_clicked',
  CTA_CLICKED: 'cta_clicked',
  FAQ_EXPANDED: 'faq_expanded',
  THEME_TOGGLED: 'theme_toggled',
  SYSTEM_CHANGED: 'astrology_system_changed',
} as const;

export type AnalyticsEventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];
