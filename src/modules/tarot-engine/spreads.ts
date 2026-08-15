import { SpreadDefinition } from './types';

export const SPREADS: Record<string, SpreadDefinition> = {
  'single': {
    id: 'single',
    name: 'Single Card',
    description: 'A single card draw for quick insights or daily guidance.',
    cardCount: 1,
    positions: [
      { index: 0, name: 'Card', description: 'The core answer, focus, or theme of your inquiry.' }
    ]
  },
  'three-card': {
    id: 'three-card',
    name: 'Three Card Spread',
    description: 'A classic spread representing the flow of time and cause-and-effect.',
    cardCount: 3,
    positions: [
      { index: 0, name: 'Past', description: 'Events or energies from the past that are influencing the current situation.' },
      { index: 1, name: 'Present', description: 'The current state of affairs, the core issue, or where you stand right now.' },
      { index: 2, name: 'Future', description: 'The likely outcome or direction things are heading if the current path continues.' }
    ]
  },
  'celtic-cross': {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    description: 'A comprehensive 10-card spread for deep analysis of complex situations.',
    cardCount: 10,
    positions: [
      { index: 0, name: 'Present', description: 'Your current situation or state of mind.' },
      { index: 1, name: 'Challenge', description: 'The immediate obstacle or conflict facing you.' },
      { index: 2, name: 'Foundation', description: 'The subconscious influences or root causes behind the situation.' },
      { index: 3, name: 'Recent Past', description: 'Events that have recently transpired and shaped the present.' },
      { index: 4, name: 'Crown', description: 'Your conscious goals, ideals, or what you are focusing on.' },
      { index: 5, name: 'Near Future', description: 'What is approaching in the short term.' },
      { index: 6, name: 'Self', description: 'Your self-perception and personal attitude towards the situation.' },
      { index: 7, name: 'Environment', description: 'External influences, other people, or your surroundings.' },
      { index: 8, name: 'Hopes/Fears', description: 'Your hidden desires, anxieties, or expectations.' },
      { index: 9, name: 'Outcome', description: 'The ultimate resolution or long-term result.' }
    ]
  },
  'relationship': {
    id: 'relationship',
    name: 'Relationship Spread',
    description: 'Analyzes the dynamics, strengths, and challenges between two individuals.',
    cardCount: 6,
    positions: [
      { index: 0, name: 'You', description: 'Your role, feelings, and energy in the relationship.' },
      { index: 1, name: 'Partner', description: 'The other person\'s role, feelings, and energy.' },
      { index: 2, name: 'Connection', description: 'The current state of the relationship and how you bond.' },
      { index: 3, name: 'Strength', description: 'The positive aspects and foundation of the relationship.' },
      { index: 4, name: 'Challenge', description: 'The obstacles or areas of tension between you.' },
      { index: 5, name: 'Outcome', description: 'The probable future of the relationship.' }
    ]
  }
};
