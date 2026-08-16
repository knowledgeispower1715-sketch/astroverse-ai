export type { AstrologyProvider, ChartCalculationInput, ChartCalculationResult } from './types';
export { WesternAstrologyProvider } from './systems/western';
export { VedicAstrologyProvider } from './systems/vedic';
export { ChineseAstrologyProvider } from './systems/chinese';
export { calculatePlanetaryPositions, dateToJulianDay } from './calculations/planet-positions';
export { calculateHouseCusps } from './calculations/house-systems';
export { calculateAspects } from './calculations/aspects';
export * from './calculations/zodiac';
export * from './context';
export * from './canonical-context';
export * from './rule-engine';
export * from './timing/transit-timeline';
export * from './explorers/planet-explorer';
export * from './vargas/varga-engine';
export * from './ashtakavarga/ashtakavarga-engine';
export * from './kp/kp-engine';
export * from './bhava-chalit/bhava-chalit-engine';
export * from './dashas/yogini-dasha';
export * from './cross-validation/cross-validator';
export * from './audit/calculation-audit';

import type { AstrologyProvider } from './types';
import type { AstrologySystemId } from '@/types/astrology';
import { WesternAstrologyProvider } from './systems/western';
import { VedicAstrologyProvider } from './systems/vedic';
import { ChineseAstrologyProvider } from './systems/chinese';

const providers: Record<AstrologySystemId, AstrologyProvider> = {
  western: new WesternAstrologyProvider(),
  vedic: new VedicAstrologyProvider(),
  chinese: new ChineseAstrologyProvider(),
};

export function getAstrologyProvider(system: AstrologySystemId): AstrologyProvider {
  return providers[system];
}
