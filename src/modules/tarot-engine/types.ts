export interface TarotCard {
  id: number;
  name: string;
  arcana: 'major' | 'minor';
  suit: 'wands' | 'cups' | 'swords' | 'pentacles' | null;
  number: number;
  uprightMeaning: string;
  reversedMeaning: string;
  keywords: string[];
  element: 'fire' | 'water' | 'air' | 'earth' | null;
  zodiacCorrespondence: string | null;
  image: string;
  love?: string;
  career?: string;
  finance?: string;
  spirituality?: string;
}

export interface SpreadPosition {
  index: number;
  name: string;
  description: string;
}

export interface SpreadDefinition {
  id: string;
  name: string;
  description: string;
  positions: SpreadPosition[];
  cardCount: number;
}

export interface DrawnCard {
  card: TarotCard;
  position: SpreadPosition;
  isReversed: boolean;
  interpretation: string;
}

export interface TarotReading {
  id: string;
  spreadId: string;
  question: string | null;
  drawnCards: DrawnCard[];
  cosmicContext: string;
  createdAt: string;
}
