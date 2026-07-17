import type { Variants } from "motion/react";
import { durations, easings } from "../tokens/animations";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: durations.normal, ease: easings.easeOut } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: durations.slow, ease: easings.easeOut } },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: durations.slow, ease: easings.easeOut } },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: durations.slow, ease: easings.easeOut } },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: durations.slow, ease: easings.easeOut } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: durations.normal, ease: easings.easeOut } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: { duration: durations.fast, ease: easings.easeOut } },
};

export const glowPulse = {
  initial: { boxShadow: '0 0 10px rgba(212, 175, 55, 0.1)' },
  animate: {
    boxShadow: [
      '0 0 10px rgba(212, 175, 55, 0.1)',
      '0 0 25px rgba(212, 175, 55, 0.3)',
      '0 0 10px rgba(212, 175, 55, 0.1)',
    ],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
};
