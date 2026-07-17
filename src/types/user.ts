export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'premium' | 'admin';
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  astrologySystem: 'western' | 'vedic' | 'chinese';
  houseSystem: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    dailyHoroscope: boolean;
    transits: boolean;
    newsletters: boolean;
  };
  timezone: string;
  locale: string;
}

export interface UserProfile extends User {
  birthDate?: Date;
  birthTime?: string;
  birthPlace?: string;
  sunSign?: string;
  moonSign?: string;
  risingSign?: string;
}
