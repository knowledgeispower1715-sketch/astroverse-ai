/**
 * Deterministic horoscope generator based on actual planetary positions.
 * No fake data. No Math.random(). Results differ by sign, date, and planetary state.
 */

import {
  dateToJD,
  computeVedicLongitudes,
  longToSignDeg,
  deterministicHash,
  scoreFromHash,
  SIGNS,
  type ZodiacSignName,
} from "./astro-math";

const SIGN_INDEX: Record<string, number> = {};
SIGNS.forEach((s, i) => { SIGN_INDEX[s] = i; });

/** How far (in sign steps) planet is from sign — 0 = same, 6 = opposite, etc. */
function signOffset(planetSign: ZodiacSignName, natalSign: string): number {
  const pi = SIGNS.indexOf(planetSign);
  const ni = SIGN_INDEX[natalSign] ?? 0;
  return ((pi - ni + 12) % 12);
}

/** 1=trine, 2=sextile, 3=square, 4=opposition based on offset */
function aspectQuality(offset: number): "trine" | "sextile" | "square" | "opposition" | "neutral" {
  if (offset === 4 || offset === 8) return "trine";
  if (offset === 2 || offset === 10) return "sextile";
  if (offset === 3 || offset === 9) return "square";
  if (offset === 6) return "opposition";
  return "neutral";
}

function aspectScore(aspect: ReturnType<typeof aspectQuality>): number {
  switch (aspect) {
    case "trine": return 85;
    case "sextile": return 70;
    case "square": return 35;
    case "opposition": return 30;
    default: return 55;
  }
}

export interface DailyForecast {
  sign: string;
  date: string;
  overall: number;
  love: number;
  career: number;
  health: number;
  finance: number;
  luckyNumber: number;
  luckyColor: string;
  mood: string;
  guidance: string;
  caution: string;
  favorableTime: string;
  planetaryInfluences: { planet: string; sign: string; aspect: string; effect: string }[];
}

const COLORS = ["Ruby Red", "Sapphire Blue", "Emerald Green", "Amethyst Violet", "Gold", "Silver", "Coral", "Indigo", "Pearl White", "Topaz Yellow", "Jade", "Obsidian"];
const MOODS = ["Inspired", "Reflective", "Energetic", "Cautious", "Adventurous", "Creative", "Focused", "Receptive", "Assertive", "Harmonious", "Analytical", "Intuitive"];

const GUIDANCE: Record<string, string[]> = {
  trine: [
    "Cosmic energies flow favorably. Trust your instincts and take deliberate steps toward your goals.",
    "A supportive current runs through today. Collaborative ventures and creative pursuits flourish.",
    "Opportunities arise naturally. Act on inspired ideas without overthinking.",
  ],
  sextile: [
    "Mild cosmic support lends itself to steady progress. Build on existing foundations.",
    "Communication and planning are highlighted. Share ideas and gather feedback.",
    "Moderate cosmic backing rewards measured effort. Consistency over bursts of activity.",
  ],
  square: [
    "Friction in the cosmic field demands patience. Avoid confrontations; channel tension into focused work.",
    "Challenging alignments call for adaptability. Recalibrate plans rather than forcing outcomes.",
    "Resistance is information. Identify what isn't working and release attachment to fixed outcomes.",
  ],
  opposition: [
    "A polarizing planetary dynamic creates tension between two areas of life. Seek middle ground.",
    "External pressures may challenge your direction. Conserve energy and choose battles wisely.",
    "Opposing cosmic forces seek integration. Balance and compromise are more powerful than force.",
  ],
  neutral: [
    "A measured day with mixed currents. Focus on tasks requiring precision and attention to detail.",
    "Neutral cosmic conditions favor routine maintenance and clearing backlog.",
    "Low volatility creates an opening for deep work and introspection.",
  ],
};

const CAUTION: Record<string, string> = {
  trine: "Avoid complacency. Favorable conditions can encourage underpreparation.",
  sextile: "Opportunities require action — favorable windows close if not engaged.",
  square: "Impulsive reactions during challenging transits can create lasting difficulties.",
  opposition: "Projection and blame are traps. Look inward before pointing outward.",
  neutral: "Inertia is the primary risk today. Maintain momentum through structured routine.",
};

function planetEffect(planet: string, aspect: string): string {
  const effects: Record<string, Record<string, string>> = {
    Sun: { trine: "Vitality and leadership amplified", square: "Ego friction and authority conflicts", opposition: "Willpower challenged", sextile: "Creative self-expression favored", neutral: "Stable solar influence" },
    Moon: { trine: "Emotional clarity and domestic harmony", square: "Mood fluctuations, sensitivity heightened", opposition: "Emotional needs conflict with outer demands", sextile: "Intuition sharp and supportive", neutral: "Balanced emotional currents" },
    Mars: { trine: "Ambition drives productive action", square: "Tension and aggression risk", opposition: "External opposition challenges plans", sextile: "Physical energy channeled constructively", neutral: "Mild motivation" },
    Mercury: { trine: "Communication and contracts favored", square: "Miscommunication risk, mental tension", opposition: "Differing viewpoints create friction", sextile: "Sharp intellect supports planning", neutral: "Normal cognitive pace" },
    Jupiter: { trine: "Expansion, good fortune, opportunities abound", square: "Overconfidence and excess risk", opposition: "Growth conflicts with stability", sextile: "Optimism and learning supported", neutral: "Moderate opportunity" },
    Venus: { trine: "Love, beauty, harmony flourish", square: "Relationship tension or value conflicts", opposition: "Partnership imbalance", sextile: "Social graces and creative flow", neutral: "Balanced relational energy" },
    Saturn: { trine: "Discipline and long-term foundations rewarded", square: "Obstacles test patience and structure", opposition: "Responsibility creates pressure", sextile: "Steady work earns recognition", neutral: "Standard discipline required" },
    Rahu: { trine: "Ambition and worldly goals supported", square: "Obsession or desire misaligned", opposition: "Karmic tension surfaces", sextile: "Strategic moves advance goals", neutral: "Subtle karmic undercurrent" },
    Ketu: { trine: "Spiritual clarity and detachment beneficial", square: "Unsettlement, past karma surfaces", opposition: "Disconnection and isolation risk", sextile: "Meditation and inner work rewarded", neutral: "Mild spiritual undercurrent" },
  };
  return effects[planet]?.[aspect] ?? "Subtle influence present";
}

export function generateDailyForecastForSign(sign: string, date: Date = new Date()): DailyForecast {
  const jd = dateToJD(date);
  const longs = computeVedicLongitudes(jd);

  const sunInfo = longToSignDeg(longs.Sun);
  const moonInfo = longToSignDeg(longs.Moon);
  const marsInfo = longToSignDeg(longs.Mars);
  const mercInfo = longToSignDeg(longs.Mercury);
  const jupInfo = longToSignDeg(longs.Jupiter);
  const venInfo = longToSignDeg(longs.Venus);
  const satInfo = longToSignDeg(longs.Saturn);

  const sunAspect = aspectQuality(signOffset(sunInfo.sign, sign));
  const moonAspect = aspectQuality(signOffset(moonInfo.sign, sign));
  const marsAspect = aspectQuality(signOffset(marsInfo.sign, sign));
  const jupAspect = aspectQuality(signOffset(jupInfo.sign, sign));
  const venAspect = aspectQuality(signOffset(venInfo.sign, sign));
  const satAspect = aspectQuality(signOffset(satInfo.sign, sign));

  const sunScore = aspectScore(sunAspect);
  const moonScore = aspectScore(moonAspect);
  const marsScore = aspectScore(marsAspect);
  const jupScore = aspectScore(jupAspect);
  const venScore = aspectScore(venAspect);
  const satScore = aspectScore(satAspect);

  // Deterministic seed from date + sign
  const dateSeed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const signSeed = sign.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const seed = dateSeed * 31 + signSeed;

  const h1 = deterministicHash(seed ^ 0xA1B2);
  const h2 = deterministicHash(seed ^ 0xC3D4);

  const overall = Math.round((sunScore * 0.3 + moonScore * 0.25 + jupScore * 0.2 + venScore * 0.15 + satScore * 0.1));
  const love = Math.round((venScore * 0.5 + moonScore * 0.3 + marsScore * 0.2));
  const mercScore = aspectScore(aspectQuality(signOffset(mercInfo.sign, sign)));
  const career = Math.round(sunScore * 0.4 + mercScore * 0.3 + jupScore * 0.3);
  const health = Math.round((marsScore * 0.4 + moonScore * 0.3 + sunScore * 0.3));
  const finance = Math.round((jupScore * 0.5 + venScore * 0.3 + satScore * 0.2));

  const luckyNumber = ((seed % 99) + 1);
  const colorIdx = scoreFromHash(h1, 0, COLORS.length - 1);
  const moodIdx = scoreFromHash(h2, 0, MOODS.length - 1);

  // Pick guidance based on dominant aspect
  const scores = { sunScore, moonScore, jupScore, venScore, satScore };
  const dominant = Object.entries(scores).sort((a, b) => Math.abs(b[1] - 55) - Math.abs(a[1] - 55))[0];
  const dominantAspect = dominant[1] >= 70 ? "trine" : dominant[1] >= 60 ? "sextile" : dominant[1] <= 35 ? "square" : "neutral";

  const guidanceList = GUIDANCE[dominantAspect];
  const gIdx = scoreFromHash(deterministicHash(seed ^ 0xEF01), 0, guidanceList.length - 1);

  const hourOfDay = scoreFromHash(deterministicHash(seed ^ 0x2345), 6, 20);
  const favorableTime = `${hourOfDay}:00 – ${hourOfDay + 1}:00`;

  return {
    sign,
    date: date.toISOString().slice(0, 10),
    overall: Math.max(20, Math.min(99, overall)),
    love: Math.max(20, Math.min(99, love)),
    career: Math.max(20, Math.min(99, career)),
    health: Math.max(20, Math.min(99, health)),
    finance: Math.max(20, Math.min(99, finance)),
    luckyNumber,
    luckyColor: COLORS[colorIdx],
    mood: MOODS[moodIdx],
    guidance: guidanceList[gIdx],
    caution: CAUTION[dominantAspect],
    favorableTime,
    planetaryInfluences: [
      { planet: "Sun", sign: sunInfo.sign, aspect: sunAspect, effect: planetEffect("Sun", sunAspect) },
      { planet: "Moon", sign: moonInfo.sign, aspect: moonAspect, effect: planetEffect("Moon", moonAspect) },
      { planet: "Mars", sign: marsInfo.sign, aspect: marsAspect, effect: planetEffect("Mars", marsAspect) },
      { planet: "Jupiter", sign: jupInfo.sign, aspect: jupAspect, effect: planetEffect("Jupiter", jupAspect) },
      { planet: "Venus", sign: venInfo.sign, aspect: venAspect, effect: planetEffect("Venus", venAspect) },
      { planet: "Saturn", sign: satInfo.sign, aspect: satAspect, effect: planetEffect("Saturn", satAspect) },
    ],
  };
}

/** Generate structured forecast for yesterday/today/tomorrow */
export function getDailyForecast(sign: string, period: "yesterday" | "today" | "tomorrow" = "today"): DailyForecast {
  const base = new Date();
  base.setHours(12, 0, 0, 0);
  if (period === "yesterday") base.setDate(base.getDate() - 1);
  if (period === "tomorrow") base.setDate(base.getDate() + 1);
  return generateDailyForecastForSign(sign, base);
}
