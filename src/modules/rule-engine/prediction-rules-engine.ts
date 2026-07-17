import type { BirthChartData } from "@/types/astrology";

export interface PredictionScoreSet {
  love: number;
  career: number;
  health: number;
  finance: number;
}

export interface StructuredPrediction {
  period: "hourly" | "daily" | "weekly" | "monthly" | "yearly";
  date: string;
  scores: PredictionScoreSet;
  activeHora: string;
  activeDasha: string;
  primaryInfluences: string[];
  guidance: string;
  aspectsSummary: string[];
}

const HORA_LORDS = ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"];
const HORA_START_MAP: Record<number, number> = {
  0: 0, // Sunday -> Sun (index 0)
  1: 3, // Monday -> Moon (index 3)
  2: 6, // Tuesday -> Mars (index 6)
  3: 2, // Wednesday -> Mercury (index 2)
  4: 5, // Thursday -> Jupiter (index 5)
  5: 1, // Friday -> Venus (index 1)
  6: 4, // Saturday -> Saturn (index 4)
};

export function calculateHora(date: Date): string {
  // Approximate sunrise to 6:00 AM local time
  const hour = date.getHours();
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday...
  
  const hoursSinceSunrise = (hour - 6 + 24) % 24;
  const startingLordIndex = HORA_START_MAP[dayOfWeek] ?? 0;
  const currentLordIndex = (startingLordIndex + hoursSinceSunrise) % 7;
  
  return HORA_LORDS[currentLordIndex];
}

export function generateStructuredPrediction(
  chart: BirthChartData,
  date: Date,
  period: "hourly" | "daily" | "weekly" | "monthly" | "yearly"
): StructuredPrediction {
  const dateStr = date.toISOString().slice(0, 10);
  const activeHora = calculateHora(date);
  
  // Extract Vedic extensions from birth chart if present, otherwise fallback
  const chartRecord = chart as unknown as Record<string, unknown>;
  const dashaList = (chartRecord.dashas as Array<Record<string, string>>) || [];
  let activeDasha = "Rahu";
  
  // Resolve active dasha based on date
  for (const dasha of dashaList) {
    const start = new Date(dasha.startDate);
    const end = new Date(dasha.endDate);
    if (date >= start && date <= end) {
      activeDasha = dasha.planet;
      break;
    }
  }

  // Retrieve strengths
  const strengths = (chartRecord.strengths as Record<string, number>) || {};

  // Base scores
  const scores: PredictionScoreSet = { love: 75, career: 75, health: 75, finance: 75 };
  const primaryInfluences: string[] = [];
  const aspectsSummary: string[] = [];

  // RULE 1: Planet Strengths adjustment
  // Adjust base scores by natal strengths
  const sunStrength = strengths["Sun"] || 70;
  const moonStrength = strengths["Moon"] || 70;
  const mercuryStrength = strengths["Mercury"] || 70;
  const venusStrength = strengths["Venus"] || 70;
  const marsStrength = strengths["Mars"] || 70;
  const jupiterStrength = strengths["Jupiter"] || 70;

  scores.career += Math.round((sunStrength - 70) * 0.25 + (jupiterStrength - 70) * 0.25);
  scores.love += Math.round((venusStrength - 70) * 0.4);
  scores.health += Math.round((moonStrength - 70) * 0.2 + (marsStrength - 70) * 0.2);
  scores.finance += Math.round((mercuryStrength - 70) * 0.3 + (jupiterStrength - 70) * 0.2);

  // RULE 2: Active Dasha influence
  primaryInfluences.push(`Active Dasha: ${activeDasha} major cycle`);
  if (activeDasha === "Jupiter" || activeDasha === "Venus") {
    scores.career += 5;
    scores.love += 6;
    scores.finance += 7;
  } else if (activeDasha === "Saturn" || activeDasha === "Rahu" || activeDasha === "Ketu") {
    scores.health -= 5;
    scores.career -= 3;
  }

  // RULE 3: Hora influence (Hourly & Daily predictions)
  if (period === "hourly" || period === "daily") {
    primaryInfluences.push(`Hora Ruler: ${activeHora} hour`);
    if (activeHora === "Jupiter") {
      scores.career += 8;
      scores.finance += 8;
    } else if (activeHora === "Venus") {
      scores.love += 10;
    } else if (activeHora === "Mars") {
      scores.health -= 4; // high energy, possible tension
      scores.career += 4; // drive
    } else if (activeHora === "Saturn") {
      scores.finance -= 5; // caution
    }
  }

  // RULE 4: Transit aspects (simulate transiting planet aspecting natal coordinates)
  // Check aspects on natal planets
  chart.aspects.forEach((asp) => {
    if (asp.type === "trine" || asp.type === "sextile") {
      aspectsSummary.push(`Harmonious transit aspect: ${asp.planet1} ${asp.type} natal ${asp.planet2}`);
      if (asp.planet1 === "Jupiter" || asp.planet2 === "Jupiter") {
        scores.career += 4;
        scores.finance += 4;
      }
      if (asp.planet1 === "Venus" || asp.planet2 === "Venus") {
        scores.love += 5;
      }
    } else if (asp.type === "square" || asp.type === "opposition") {
      aspectsSummary.push(`Friction transit aspect: ${asp.planet1} ${asp.type} natal ${asp.planet2}`);
      if (asp.planet1 === "Saturn" || asp.planet2 === "Saturn") {
        scores.career -= 3;
        scores.health -= 4;
      }
    }
  });

  // Clamp scores between 20 and 99
  scores.love = Math.max(20, Math.min(99, scores.love));
  scores.career = Math.max(20, Math.min(99, scores.career));
  scores.health = Math.max(20, Math.min(99, scores.health));
  scores.finance = Math.max(20, Math.min(99, scores.finance));

  // Determine guidance text based on period & scores
  let guidance = "";
  if (period === "hourly") {
    if (activeHora === "Jupiter" || activeHora === "Venus") {
      guidance = "Excellent hour to initiate conversations, sign documents, or schedule meetings. Energy is expansive.";
    } else if (activeHora === "Saturn" || activeHora === "Mars") {
      guidance = "Favorable hour for structured execution or heavy training. Avoid reactive debates or quick financial purchases.";
    } else {
      guidance = "Balanced hour for standard updates, emails, and organizing workspace. Focus on clarity.";
    }
  } else if (period === "daily") {
    guidance = `A daily focus on balancing your career drives and emotional alignment. The active ${activeDasha} dasha encourages deep reflection.`;
  } else if (period === "weekly") {
    guidance = `Your weekly transit chart reveals active aspects from outer planets. Plan major review boards for mid-week when Jupiter energy is strongest.`;
  } else if (period === "monthly") {
    guidance = `This month features solar shifts. Utilize the structural parameters of your chart to organize budgets, files, and agreements.`;
  } else {
    guidance = `Your yearly forecast highlights major planetary lessons. A return of outer coordinates demands that you consolidate your long-term creative blueprints.`;
  }

  return {
    period,
    date: dateStr,
    scores,
    activeHora,
    activeDasha,
    primaryInfluences,
    guidance,
    aspectsSummary: aspectsSummary.slice(0, 4)
  };
}
