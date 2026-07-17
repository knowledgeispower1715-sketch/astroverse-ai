import { durations, easings } from "../tokens/animations";

export const transitions = {
  default: { duration: durations.normal, ease: easings.easeOut },
  fast: { duration: durations.fast, ease: easings.easeOut },
  slow: { duration: durations.slow, ease: easings.easeOut },
  spring: easings.spring,
  springBouncy: easings.springBouncy,
  springGentle: easings.springGentle,
} as const;

export const whileHover = {
  scale: { scale: 1.05, transition: transitions.fast },
  lift: { y: -4, transition: transitions.fast },
  glow: { boxShadow: '0 0 30px rgba(212, 175, 55, 0.4)', transition: transitions.default },
  subtle: { scale: 1.02, transition: transitions.fast },
} as const;

export const whileTap = {
  scale: { scale: 0.98 },
  press: { scale: 0.95 },
} as const;
