export const durations = {
  fastest: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.7,
  slowest: 1.0,
} as const;

export const easings = {
  easeOut: [0.16, 1, 0.3, 1] as const,
  easeIn: [0.4, 0, 1, 1] as const,
  easeInOut: [0.4, 0, 0.2, 1] as const,
  spring: { type: 'spring' as const, stiffness: 300, damping: 30 },
  springBouncy: { type: 'spring' as const, stiffness: 400, damping: 20 },
  springGentle: { type: 'spring' as const, stiffness: 200, damping: 40 },
} as const;
