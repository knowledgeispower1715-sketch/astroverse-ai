/**
 * Deterministic hourly Hora-based horoscope.
 * Each hour ruled by a different planet following the Chaldean Hora sequence.
 * Results vary by: sign, date, hour, planetary positions.
 */

import {
  dateToJD,
  computeVedicLongitudes,
  longToSignDeg,
  deterministicHash,
  scoreFromHash,
  type ZodiacSignName,
  SIGNS,
} from "./astro-math";

// Hora order starting from Sunday: Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars
const HORA_PLANETS = ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"] as const;
type HoraPlanet = typeof HORA_PLANETS[number];

// First hora of each weekday (0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat)
const WEEKDAY_FIRST_HORA_IDX = [0, 3, 6, 2, 5, 1, 4] as const;

export function getHoraPlanet(date: Date, hour: number): HoraPlanet {
  const dow = date.getDay(); // 0=Sun
  const firstHoraIdx = WEEKDAY_FIRST_HORA_IDX[dow];
  const horaIdx = (firstHoraIdx + hour) % 7;
  return HORA_PLANETS[horaIdx];
}

const HORA_QUALITIES: Record<HoraPlanet, { energy: string; suitable: string; avoid: string }> = {
  Sun: { energy: "Leadership", suitable: "Official meetings, career moves, showcasing work, authority interactions", avoid: "Hiding, deferring decisions, passive activities" },
  Moon: { energy: "Receptive", suitable: "Emotional conversations, nurturing relationships, home activities, intuitive work", avoid: "Confrontation, contracts, speculation" },
  Mars: { energy: "Dynamic", suitable: "Physical activity, competitive tasks, bold decisions, starting new projects", avoid: "Negotiations requiring patience, financial commitments" },
  Mercury: { energy: "Analytical", suitable: "Writing, communication, data analysis, study, planning, contracts", avoid: "Heavy physical labor, emotionally charged discussions" },
  Jupiter: { energy: "Expansive", suitable: "Teaching, learning, signing agreements, legal matters, investments, ceremonies", avoid: "Selfish pursuits, cutting corners, shortcuts" },
  Venus: { energy: "Harmonious", suitable: "Creative work, romance, social meetings, arts, luxury, beauty, diplomacy", avoid: "Aggressive tactics, confrontational language, isolation" },
  Saturn: { energy: "Disciplined", suitable: "Administrative work, long-term planning, filing, organization, deep focus", avoid: "Social events, speculation, hasty decisions" },
};

function signOffset(planetSign: ZodiacSignName, natalSign: string): number {
  const pi = SIGNS.indexOf(planetSign);
  const ni = SIGNS.indexOf(natalSign as ZodiacSignName);
  return ((pi - ni + 12) % 12);
}

function horaScore(horaPlanet: HoraPlanet, planetSign: ZodiacSignName, sign: string, seed: number): number {
  const offset = signOffset(planetSign, sign);
  let base = 55;
  if (offset === 4 || offset === 8) base = 80; // trine
  else if (offset === 2 || offset === 10) base = 70; // sextile
  else if (offset === 3 || offset === 9) base = 40; // square
  else if (offset === 6) base = 35; // opposition
  // Hora planet bonus/penalty
  const benefics: HoraPlanet[] = ["Jupiter", "Venus", "Moon"];
  const malefics: HoraPlanet[] = ["Saturn", "Mars"];
  if (benefics.includes(horaPlanet)) base = Math.min(99, base + 10);
  if (malefics.includes(horaPlanet)) base = Math.max(20, base - 8);
  // Small deterministic variation
  const variation = scoreFromHash(deterministicHash(seed ^ 0xAB12), -5, 5);
  return Math.max(20, Math.min(99, base + variation));
}

export interface HourlySlot {
  hour: number;
  label: string;
  horaPlanet: string;
  energy: string;
  score: number;
  career: number;
  love: number;
  health: number;
  finance: number;
  suitable: string;
  avoid: string;
  focus: string;
}

const FOCUS_ACTIVITIES: Record<HoraPlanet, string[]> = {
  Sun: ["Present key proposal", "Discuss with seniors", "Set daily intentions", "Showcase achievements"],
  Moon: ["Check in with loved ones", "Journal reflections", "Creative visualization", "Rest and recharge"],
  Mars: ["High-intensity workout", "Tackle challenging task", "Start new initiative", "Clear backlog"],
  Mercury: ["Write reports", "Review contracts", "Study or research", "Send important emails"],
  Jupiter: ["Strategic planning session", "Teach or mentor", "Review investments", "Educational content"],
  Venus: ["Client relationship call", "Creative project work", "Team appreciation", "Artistic expression"],
  Saturn: ["Process management review", "Long-term budgeting", "Documentation", "Organize workspace"],
};

export function generateHourlyForecast(sign: string, date: Date = new Date()): HourlySlot[] {
  const jd = dateToJD(date);
  const longs = computeVedicLongitudes(jd);

  const planetSignMap: Record<string, ZodiacSignName> = {
    Sun: longToSignDeg(longs.Sun).sign,
    Moon: longToSignDeg(longs.Moon).sign,
    Mars: longToSignDeg(longs.Mars).sign,
    Mercury: longToSignDeg(longs.Mercury).sign,
    Jupiter: longToSignDeg(longs.Jupiter).sign,
    Venus: longToSignDeg(longs.Venus).sign,
    Saturn: longToSignDeg(longs.Saturn).sign,
  };

  const dateSeed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const signSeed = sign.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

  const slots: HourlySlot[] = [];
  for (let h = 0; h < 24; h++) {
    const horaPlanet = getHoraPlanet(date, h);
    const horaPlanetSign = planetSignMap[horaPlanet] ?? longToSignDeg(longs.Sun).sign;
    const seed = dateSeed * 1000 + signSeed * 100 + h;

    const score = horaScore(horaPlanet, horaPlanetSign, sign, seed);
    const quality = HORA_QUALITIES[horaPlanet];
    const focusList = FOCUS_ACTIVITIES[horaPlanet];
    const focusIdx = scoreFromHash(deterministicHash(seed ^ 0x9F1A), 0, focusList.length - 1);

    // Sub-dimension scores vary by planet
    const careerBase = ["Sun", "Mercury", "Saturn"].includes(horaPlanet) ? score + 8 : score - 5;
    const loveBase = ["Venus", "Moon"].includes(horaPlanet) ? score + 10 : score - 8;
    const healthBase = ["Mars", "Sun"].includes(horaPlanet) ? score + 10 : score - 5;
    const financeBase = ["Jupiter", "Mercury"].includes(horaPlanet) ? score + 8 : score - 6;

    const pad = (n: number) => String(n).padStart(2, "0");
    const ampm = h < 12 ? "AM" : "PM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;

    slots.push({
      hour: h,
      label: `${pad(h12)}:00 ${ampm}`,
      horaPlanet,
      energy: quality.energy,
      score: Math.max(20, Math.min(99, score)),
      career: Math.max(20, Math.min(99, careerBase)),
      love: Math.max(20, Math.min(99, loveBase)),
      health: Math.max(20, Math.min(99, healthBase)),
      finance: Math.max(20, Math.min(99, financeBase)),
      suitable: quality.suitable,
      avoid: quality.avoid,
      focus: focusList[focusIdx],
    });
  }

  return slots;
}
