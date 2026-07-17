import type { NavItem, FooterLinkGroup } from '@/types';

export const mainNavItems: NavItem[] = [
  { label: 'Features', href: '/features' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const dashboardNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Birth Chart', href: '/birth-chart', icon: 'Circle' },
  { label: 'Horoscope', href: '/horoscope', icon: 'Sun' },
  { label: 'Kundli', href: '/kundli', icon: 'FileText' },
  { label: 'Panchang', href: '/panchang', icon: 'Calendar' },
  { label: 'Numerology', href: '/numerology', icon: 'Hash' },
  { label: 'Remedies', href: '/remedies', icon: 'ShieldAlert' },
  { label: 'Gemstones', href: '/gemstones', icon: 'Gem' },
  { label: 'Compatibility', href: '/compatibility', icon: 'Heart' },
  { label: 'Transits', href: '/transit', icon: 'Orbit' },
  { label: 'Tarot', href: '/tarot', icon: 'Layers' },
  { label: 'Settings', href: '/settings', icon: 'Settings' },
];

export const footerLinks: FooterLinkGroup[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Birth Charts', href: '/birth-chart' },
      { label: 'Daily Horoscopes', href: '/horoscope' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api-docs' },
      { label: 'Community', href: '/community' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Press', href: '/press' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  },
];
