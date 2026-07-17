export const viewportOnce = {
  once: true,
  margin: '-80px' as const,
  amount: 0.2 as const,
};

export const viewportRepeat = {
  once: false,
  margin: '-80px' as const,
  amount: 0.2 as const,
};

export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 },
};

export const modalTransition = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
  transition: { duration: 0.2 },
};
