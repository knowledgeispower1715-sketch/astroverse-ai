import { TarotReading, DrawnCard, TarotCard, SpreadPosition } from './types';
import { TAROT_DECK } from './cards';
import { SPREADS } from './spreads';

export function generateInterpretation(card: TarotCard, position: SpreadPosition, isReversed: boolean): string {
  const meaning = isReversed ? card.reversedMeaning : card.uprightMeaning;
  return `In the position of ${position.name} (${position.description}), the ${card.name} ${isReversed ? '(Reversed) ' : ''}suggests: ${meaning}`;
}

export function generateCosmicContext(drawnCards: DrawnCard[]): string {
  const elements = drawnCards.map(c => c.card.element).filter(e => e !== null);
  const fireCount = elements.filter(e => e === 'fire').length;
  const waterCount = elements.filter(e => e === 'water').length;
  const airCount = elements.filter(e => e === 'air').length;
  const earthCount = elements.filter(e => e === 'earth').length;

  let dominantElement = 'balanced';
  const maxCount = Math.max(fireCount, waterCount, airCount, earthCount);

  if (maxCount > drawnCards.length / 2) {
    if (fireCount === maxCount) dominantElement = 'fire (passion, action, will)';
    else if (waterCount === maxCount) dominantElement = 'water (emotions, intuition, relationships)';
    else if (airCount === maxCount) dominantElement = 'air (intellect, communication, conflict)';
    else if (earthCount === maxCount) dominantElement = 'earth (material world, finances, stability)';
  }

  const majorCount = drawnCards.filter(c => c.card.arcana === 'major').length;
  let arcanaContext = 'A mix of minor day-to-day influences and major life themes.';
  if (majorCount > drawnCards.length / 2) {
    arcanaContext = 'Strong major arcana presence indicates significant life events and powerful forces at play.';
  } else if (majorCount === 0) {
    arcanaContext = 'The focus is heavily on day-to-day matters and immediate circumstances.';
  }

  return `The reading is characterized by ${dominantElement === 'balanced' ? 'a balance of elements' : 'a strong presence of ' + dominantElement}. ${arcanaContext}`;
}

export function drawCards(spreadId: string, question?: string): TarotReading {
  const spread = SPREADS[spreadId];
  if (!spread) {
    throw new Error(`Spread with ID ${spreadId} not found.`);
  }

  const deck = [...TAROT_DECK];
  // Shuffle using Math.random
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  const drawnCards: DrawnCard[] = [];
  for (let i = 0; i < spread.cardCount; i++) {
    const card = deck[i];
    const position = spread.positions[i];
    const isReversed = Math.random() < 0.3; // ~30% chance of being reversed
    
    drawnCards.push({
      card,
      position,
      isReversed,
      interpretation: generateInterpretation(card, position, isReversed)
    });
  }

  return {
    id: crypto.randomUUID(),
    spreadId,
    question: question || null,
    drawnCards,
    cosmicContext: generateCosmicContext(drawnCards),
    createdAt: new Date().toISOString()
  };
}

export function replayReading(reading: TarotReading): TarotReading {
  return reading;
}
