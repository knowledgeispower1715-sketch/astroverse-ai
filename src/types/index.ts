export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  disabled?: boolean;
  external?: boolean;
  badge?: string;
}

export interface FooterLinkGroup {
  title: string;
  links: NavItem[];
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface NewsletterFormData {
  email: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
