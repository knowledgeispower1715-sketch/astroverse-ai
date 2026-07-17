import type { Testimonial, FAQItem } from '@/types';

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Aria Nightshade',
    role: 'Professional Astrologer',
    avatar: '/avatars/aria.jpg',
    quote: 'AstroVerse AI has revolutionized my practice. The birth chart analysis is incredibly detailed and the AI interpretations are remarkably accurate. My clients are amazed.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Marcus Chen',
    role: 'Vedic Astrology Student',
    avatar: '/avatars/marcus.jpg',
    quote: 'Finally, an app that supports both Western and Vedic systems. The transit predictions helped me prepare for my Saturn return with confidence and clarity.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Luna Silveira',
    role: 'Spiritual Coach',
    avatar: '/avatars/luna.jpg',
    quote: 'The compatibility analysis feature is extraordinary. It helped me understand my relationships on a cosmic level. The tarot integration adds another beautiful dimension.',
    rating: 5,
  },
];

export const faqItems: FAQItem[] = [
  {
    question: 'What makes AstroVerse AI different from other astrology apps?',
    answer: 'AstroVerse AI combines traditional astrological wisdom with advanced AI to deliver hyper-personalized readings. Unlike generic apps that only use your sun sign, we analyze your complete birth chart including all planetary positions, houses, and aspects for truly accurate insights.',
  },
  {
    question: 'Which astrology systems do you support?',
    answer: 'We currently support Western Tropical, Vedic (Jyotish), and Chinese astrology systems. Each system offers unique perspectives, and you can switch between them seamlessly to get a comprehensive cosmic view.',
  },
  {
    question: 'How accurate are the AI-generated readings?',
    answer: 'Our AI has been trained on centuries of astrological texts and refined by professional astrologers. While no astrology reading is a certainty, our interpretations consistently receive high accuracy ratings from both beginners and professional astrologers.',
  },
  {
    question: 'Do I need to know my exact birth time?',
    answer: 'Your exact birth time allows for the most precise chart calculation, especially for house placements and your rising sign. However, you can still get valuable insights from your planetary positions even without an exact time.',
  },
  {
    question: 'Is my personal data secure?',
    answer: 'Absolutely. We use end-to-end encryption for all personal data, including birth information. We never sell your data to third parties, and you can delete your account and all associated data at any time.',
  },
  {
    question: 'Can I use AstroVerse AI for professional astrological consultations?',
    answer: 'Yes! Many professional astrologers use AstroVerse AI to enhance their practice. Our detailed chart analysis, transit tracking, and compatibility reports serve as excellent tools for professional consultations.',
  },
];
