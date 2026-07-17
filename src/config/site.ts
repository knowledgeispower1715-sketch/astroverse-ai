export const siteConfig = {
  name: 'AstroVerse AI',
  description: 'Unlock the secrets of the cosmos with AI-powered astrology. Get personalized birth charts, daily horoscopes, compatibility analysis, and transit predictions.',
  url: 'https://astroverse.ai',
  ogImage: 'https://astroverse.ai/og.jpg',
  creator: 'AstroVerse AI Team',
  keywords: [
    'astrology', 'horoscope', 'birth chart', 'zodiac', 'AI astrology',
    'compatibility', 'transit', 'tarot', 'vedic astrology', 'natal chart',
    'astrology app', 'cosmic insights', 'star signs',
  ],
  links: {
    twitter: 'https://twitter.com/astroverse_ai',
    github: 'https://github.com/astroverse-ai',
    discord: 'https://discord.gg/astroverse',
  },
} as const;

export type SiteConfig = typeof siteConfig;
