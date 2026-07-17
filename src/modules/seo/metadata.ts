import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export function createMetadata(overrides: Partial<Metadata> = {}): Metadata {
  const title = overrides.title
    ? `${overrides.title} | ${siteConfig.name}`
    : siteConfig.name;

  return {
    title,
    description: (overrides.description as string) || siteConfig.description,
    keywords: [...siteConfig.keywords],
    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: title as string,
      description: (overrides.description as string) || siteConfig.description,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
      ...(overrides.openGraph || {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: title as string,
      description: (overrides.description as string) || siteConfig.description,
      images: [siteConfig.ogImage],
      creator: '@astroverse_ai',
      ...(overrides.twitter || {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    ...overrides,
  };
}
