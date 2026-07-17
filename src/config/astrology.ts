export const zodiacSigns = [
  { name: 'Aries', symbol: '♈', element: 'fire', modality: 'cardinal', ruler: 'Mars', dateRange: 'Mar 21 - Apr 19' },
  { name: 'Taurus', symbol: '♉', element: 'earth', modality: 'fixed', ruler: 'Venus', dateRange: 'Apr 20 - May 20' },
  { name: 'Gemini', symbol: '♊', element: 'air', modality: 'mutable', ruler: 'Mercury', dateRange: 'May 21 - Jun 20' },
  { name: 'Cancer', symbol: '♋', element: 'water', modality: 'cardinal', ruler: 'Moon', dateRange: 'Jun 21 - Jul 22' },
  { name: 'Leo', symbol: '♌', element: 'fire', modality: 'fixed', ruler: 'Sun', dateRange: 'Jul 23 - Aug 22' },
  { name: 'Virgo', symbol: '♍', element: 'earth', modality: 'mutable', ruler: 'Mercury', dateRange: 'Aug 23 - Sep 22' },
  { name: 'Libra', symbol: '♎', element: 'air', modality: 'cardinal', ruler: 'Venus', dateRange: 'Sep 23 - Oct 22' },
  { name: 'Scorpio', symbol: '♏', element: 'water', modality: 'fixed', ruler: 'Pluto', dateRange: 'Oct 23 - Nov 21' },
  { name: 'Sagittarius', symbol: '♐', element: 'fire', modality: 'mutable', ruler: 'Jupiter', dateRange: 'Nov 22 - Dec 21' },
  { name: 'Capricorn', symbol: '♑', element: 'earth', modality: 'cardinal', ruler: 'Saturn', dateRange: 'Dec 22 - Jan 19' },
  { name: 'Aquarius', symbol: '♒', element: 'air', modality: 'fixed', ruler: 'Uranus', dateRange: 'Jan 20 - Feb 18' },
  { name: 'Pisces', symbol: '♓', element: 'water', modality: 'mutable', ruler: 'Neptune', dateRange: 'Feb 19 - Mar 20' },
] as const;

export const planets = [
  { name: 'Sun', symbol: '☉', category: 'personal' },
  { name: 'Moon', symbol: '☽', category: 'personal' },
  { name: 'Mercury', symbol: '☿', category: 'personal' },
  { name: 'Venus', symbol: '♀', category: 'personal' },
  { name: 'Mars', symbol: '♂', category: 'personal' },
  { name: 'Jupiter', symbol: '♃', category: 'social' },
  { name: 'Saturn', symbol: '♄', category: 'social' },
  { name: 'Uranus', symbol: '♅', category: 'transpersonal' },
  { name: 'Neptune', symbol: '♆', category: 'transpersonal' },
  { name: 'Pluto', symbol: '♇', category: 'transpersonal' },
] as const;

export const houseSystems = [
  { id: 'placidus', name: 'Placidus', description: 'Most commonly used in Western astrology' },
  { id: 'whole-sign', name: 'Whole Sign', description: 'Ancient system, one sign per house' },
  { id: 'equal', name: 'Equal House', description: 'Each house spans exactly 30 degrees' },
  { id: 'koch', name: 'Koch', description: 'Time-based house division' },
  { id: 'campanus', name: 'Campanus', description: 'Space-based house division' },
  { id: 'regiomontanus', name: 'Regiomontanus', description: 'Used in horary astrology' },
] as const;

export const astrologySystemTypes = [
  { id: 'western', name: 'Western Tropical', description: 'Based on the tropical zodiac aligned with equinoxes' },
  { id: 'vedic', name: 'Vedic (Jyotish)', description: 'Based on the sidereal zodiac aligned with fixed stars' },
  { id: 'chinese', name: 'Chinese', description: 'Based on lunar calendar cycles and five elements' },
] as const;

export type ZodiacSign = typeof zodiacSigns[number];
export type Planet = typeof planets[number];
export type HouseSystem = typeof houseSystems[number];
export type AstrologySystem = typeof astrologySystemTypes[number];
