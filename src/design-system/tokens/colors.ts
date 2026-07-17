export const colors = {
  gold: { DEFAULT: '#d4af37', light: '#f5d061', dark: '#b8960c', muted: 'rgba(212, 175, 55, 0.15)' },
  purple: { DEFAULT: '#7c3aed', light: '#a855f7', dark: '#5b21b6', muted: 'rgba(124, 58, 237, 0.15)' },
  background: { primary: '#0a0a1a', secondary: '#111127', surface: '#1a1a3e', card: 'rgba(26, 26, 62, 0.6)' },
  text: { primary: '#f5f5f0', secondary: '#a0a0b8', muted: '#6b6b80' },
} as const;

export const gradients = {
  gold: 'linear-gradient(135deg, #d4af37, #f5d061)',
  purple: 'linear-gradient(135deg, #7c3aed, #a855f7)',
  cosmic: 'linear-gradient(135deg, #d4af37, #7c3aed, #a855f7)',
  darkFade: 'linear-gradient(180deg, #0a0a1a, #111127)',
  heroRadial: 'radial-gradient(ellipse at 50% 0%, rgba(124, 58, 237, 0.15) 0%, transparent 60%)',
} as const;

export const glows = {
  gold: '0 0 20px rgba(212, 175, 55, 0.3)',
  goldStrong: '0 0 40px rgba(212, 175, 55, 0.5)',
  purple: '0 0 20px rgba(124, 58, 237, 0.3)',
  purpleStrong: '0 0 40px rgba(124, 58, 237, 0.5)',
  cosmic: '0 0 30px rgba(212, 175, 55, 0.2), 0 0 60px rgba(124, 58, 237, 0.1)',
} as const;
