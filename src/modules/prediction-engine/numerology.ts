/**
 * Real numerology engine — Pythagorean system.
 * Life Path, Destiny/Expression, Soul Urge, Personality, Birthday numbers.
 * All calculations deterministic from actual user inputs.
 */

const LETTER_VALUES: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

function reduceToSingle(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split("").reduce((s, d) => s + parseInt(d, 10), 0);
  }
  return n;
}

function nameValue(name: string): number {
  return name.toUpperCase().split("").reduce((sum, ch) => sum + (LETTER_VALUES[ch] ?? 0), 0);
}

function vowelValue(name: string): number {
  return name.toUpperCase().split("").reduce((sum, ch) => sum + (VOWELS.has(ch) ? (LETTER_VALUES[ch] ?? 0) : 0), 0);
}

function consonantValue(name: string): number {
  return name.toUpperCase().split("").reduce((sum, ch) => {
    return LETTER_VALUES[ch] !== undefined && !VOWELS.has(ch) ? sum + LETTER_VALUES[ch] : sum;
  }, 0);
}

export interface NumerologyResult {
  lifePath: number;
  destiny: number | null;
  soulUrge: number | null;
  personality: number | null;
  birthday: number;
  interpretations: {
    lifePath: { title: string; description: string };
    destiny: { title: string; description: string } | null;
    soulUrge: { title: string; description: string } | null;
    personality: { title: string; description: string } | null;
    birthday: { title: string; description: string };
  };
}

const INTERPRETATIONS: Record<number, { title: string; description: string }> = {
  1: { title: "The Pioneer & Leader", description: "Independent, ambitious, and original. You are driven to forge your own path. Natural leadership abilities combined with creative courage define your vibration. Watch for excessive self-reliance or arrogance." },
  2: { title: "The Diplomat & Peacemaker", description: "Cooperative, sensitive, and intuitive. You thrive in partnership and excel at mediation. Your strength lies in understanding others deeply. Avoid codependency and self-neglect." },
  3: { title: "The Communicator & Creative", description: "Expressive, joyful, and imaginative. You carry the gift of creative communication. Art, writing, and social connection energize you. Watch for scattered focus and superficiality." },
  4: { title: "The Builder & Organizer", description: "Disciplined, practical, and methodical. You build lasting structures and value order and reliability. Loyalty is your hallmark. Avoid rigidity and excessive caution." },
  5: { title: "The Adventurer & Freedom-Seeker", description: "Dynamic, versatile, and progressive. You crave variety, freedom, and sensory experience. Adaptability is your superpower. Guard against restlessness and overindulgence." },
  6: { title: "The Nurturer & Caretaker", description: "Responsible, loving, and harmonious. You are drawn to family, beauty, and service. Your healing and teaching gifts are profound. Avoid perfectionism and martyrdom." },
  7: { title: "The Analyst & Truth-Seeker", description: "Introspective, spiritual, and intellectual. You seek deeper understanding beyond surface appearances. Solitude fuels your clarity. Watch for isolation, cynicism, and emotional withdrawal." },
  8: { title: "The Executive & Manifestor", description: "Authoritative, ambitious, and resourceful. You have exceptional capacity to build material success through strategic action. Guard against materialism and the misuse of power." },
  9: { title: "The Humanitarian & Philosopher", description: "Compassionate, idealistic, and generous. You are here to serve and uplift on a broad scale. Artistic sensitivity and wisdom define you. Avoid bitterness from unfulfilled idealism." },
  11: { title: "The Master Intuitive", description: "Visionary, spiritually attuned, and inspirational. 11 is a Master Number — you carry heightened sensitivity and a calling to inspire others. Ground your intensity through structure and practice." },
  22: { title: "The Master Builder", description: "Practical visionary with the ability to turn grand ideas into tangible reality. 22 is the most powerful Master Number — discipline and service to humanity define your highest expression." },
  33: { title: "The Master Teacher", description: "Embodiment of selfless nurturing and spiritual wisdom. 33 is the rarest Master Number — your calling is to heal, teach, and uplift the collective with unconditional love." },
};

function getInterpretation(n: number): { title: string; description: string } {
  return INTERPRETATIONS[n] ?? { title: `Number ${n}`, description: "A unique and powerful vibration that combines the qualities of its root numbers." };
}

export function calculateNumerology(fullName: string, dob: string): NumerologyResult {
  // DOB format: YYYY-MM-DD
  const parts = dob.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  // Life Path = reduce(day + month + year)
  const lpDay = reduceToSingle(day);
  const lpMonth = reduceToSingle(month);
  const lpYear = String(year).split("").reduce((s, d) => s + parseInt(d, 10), 0);
  const lpYearReduced = reduceToSingle(lpYear);
  const lifePath = reduceToSingle(lpDay + lpMonth + lpYearReduced);

  // Birthday number
  const birthday = reduceToSingle(day);

  // Name-based (only if name provided)
  const cleanName = fullName.replace(/[^a-zA-Z\s]/g, "").trim();
  let destiny: number | null = null;
  let soulUrge: number | null = null;
  let personality: number | null = null;

  if (cleanName.length > 0) {
    destiny = reduceToSingle(nameValue(cleanName));
    soulUrge = reduceToSingle(vowelValue(cleanName));
    personality = reduceToSingle(consonantValue(cleanName));
  }

  return {
    lifePath,
    destiny,
    soulUrge,
    personality,
    birthday,
    interpretations: {
      lifePath: getInterpretation(lifePath),
      destiny: destiny !== null ? getInterpretation(destiny) : null,
      soulUrge: soulUrge !== null ? getInterpretation(soulUrge) : null,
      personality: personality !== null ? getInterpretation(personality) : null,
      birthday: getInterpretation(birthday),
    },
  };
}
