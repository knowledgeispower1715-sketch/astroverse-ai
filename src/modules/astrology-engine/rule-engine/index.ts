/**
 * ============================================================================
 * AstroVerse AI — Rule Engine & Evidence-First Architecture
 * ============================================================================
 * Evaluates canonical astrological facts against classical rule models,
 * balances supportive and challenging indicators, calculates evidence weights,
 * and synthesizes transparent, personalized interpretations.
 * ============================================================================
 */

import { CanonicalAstrologyContext } from "../canonical-context";

export type LifeAreaCategory =
  | "career"
  | "finance"
  | "love"
  | "family"
  | "health"
  | "education"
  | "travel"
  | "spirituality";

export interface AstrologicalRule {
  id: string;
  category: LifeAreaCategory | "general";
  name: string;
  priority: number; // 1 (lowest) to 10 (highest)
  weight: number; // -10 (strongly challenging) to +10 (strongly supportive)
  condition: (ctx: CanonicalAstrologyContext) => boolean;
  getEvidence: (ctx: CanonicalAstrologyContext) => string;
  supportiveText: string;
  challengingText?: string;
  precaution?: string;
}

export interface StructuredEvidencePrediction {
  predictionId: string;
  category: LifeAreaCategory;
  title: string;
  statement: string;
  confidence: "High Indication" | "Moderate Indication" | "Possible Tendency";
  evidenceScore: number; // 0..100
  supportingFactors: string[];
  challengingFactors: string[];
  timingFactors: string[];
  precautions: string[];
  practicalActions: string[];
  rulesMatched: string[];
  calculationVersion: string;
}

export interface RuleEngineEvaluation {
  category: LifeAreaCategory;
  score: number; // 0..100
  supportiveWeight: number;
  challengingWeight: number;
  netWeight: number;
  prediction: StructuredEvidencePrediction;
}

// ----------------------------------------------------------------------------
// STRUCTURED RULE BASE
// ----------------------------------------------------------------------------
const ASTROLOGY_RULES: AstrologicalRule[] = [
  // --- CAREER RULES ---
  {
    id: "R_CAR_10TH_JUPITER",
    category: "career",
    name: "Jupiter in 10th House",
    priority: 9,
    weight: 8,
    condition: (ctx) => ctx.planets.Jupiter.house === 10,
    getEvidence: (ctx) => `Jupiter occupies natal 10th House of Career (${ctx.planets.Jupiter.sign}) with dignity ${ctx.planets.Jupiter.dignity}.`,
    supportiveText: "Natural expansion, ethical authority, mentorship opportunities, and professional recognition in leadership or advisory roles.",
    precaution: "Avoid complacency or over-promising on deliverables.",
  },
  {
    id: "R_CAR_10TH_SUN",
    category: "career",
    name: "Sun in 10th House (Digbala)",
    priority: 9,
    weight: 9,
    condition: (ctx) => ctx.planets.Sun.house === 10,
    getEvidence: (ctx) => `Sun possesses directional strength (Digbala) in the 10th House (${ctx.planets.Sun.sign}).`,
    supportiveText: "Strong executive vision, organizational prominence, administrative capability, and capacity to handle large responsibilities.",
    precaution: "Maintain collaborative diplomacy with superiors and avoid authoritarian tendencies.",
  },
  {
    id: "R_CAR_10TH_SATURN",
    category: "career",
    name: "Saturn in 10th House",
    priority: 8,
    weight: 5,
    condition: (ctx) => ctx.planets.Saturn.house === 10,
    getEvidence: (ctx) => `Saturn resides in 10th House (${ctx.planets.Saturn.sign}), imposing discipline and steady structural growth.`,
    supportiveText: "Long-term enduring success built through meticulous persistence, mastery of craft, and high organizational stamina.",
    challengingText: "Initial career phases may encounter procedural delays or heavy responsibilities before recognition arrives.",
    precaution: "Patience and structured processes yield permanent career stability.",
  },
  {
    id: "R_CAR_DASHA_JUPITER",
    category: "career",
    name: "Active Jupiter Dasha",
    priority: 7,
    weight: 6,
    condition: (ctx) => ctx.currentDasha.mahadasha.planet === "Jupiter",
    getEvidence: (ctx) => `Operating under Jupiter Mahadasha cycle (${ctx.currentDasha.mahadasha.startDate.slice(0, 4)} - ${ctx.currentDasha.mahadasha.endDate.slice(0, 4)}).`,
    supportiveText: "Expansion of professional horizons, advisory recognition, learning new skills, and constructive career mentorship.",
    precaution: "Ensure strategic focus to avoid scattering energies across too many ventures.",
  },
  {
    id: "R_CAR_TRANSIT_JUPITER_10",
    category: "career",
    name: "Transiting Jupiter in 10th House",
    priority: 8,
    weight: 7,
    condition: (ctx) => ctx.currentTransits.Jupiter?.natalHouseActivated === 10,
    getEvidence: (ctx) => `Transiting Jupiter currently transits through natal 10th House (${ctx.currentTransits.Jupiter.transitingSign}).`,
    supportiveText: "A key timing window for career elevation, launching projects, applying for promotions, or gaining public acclaim.",
    precaution: "Leverage this transit window with concrete, disciplined execution.",
  },
  {
    id: "R_CAR_TRANSIT_SATURN_10",
    category: "career",
    name: "Transiting Saturn in 10th House",
    priority: 8,
    weight: -3,
    condition: (ctx) => ctx.currentTransits.Saturn?.natalHouseActivated === 10,
    getEvidence: (ctx) => `Transiting Saturn transits the 10th House of Career (${ctx.currentTransits.Saturn.transitingSign}).`,
    supportiveText: "Deep operational consolidation and establishment of permanent professional foundations.",
    challengingText: "Increased workload, demanding oversight from superiors, and need for meticulous error-checking.",
    precaution: "Prioritize stress management and maintain rigorous documentation in all workplace affairs.",
  },

  // --- FINANCE RULES ---
  {
    id: "R_FIN_2ND_VENUS",
    category: "finance",
    name: "Venus in 2nd House",
    priority: 8,
    weight: 7,
    condition: (ctx) => ctx.planets.Venus.house === 2,
    getEvidence: (ctx) => `Venus occupies the 2nd House of Accumulated Wealth (${ctx.planets.Venus.sign}).`,
    supportiveText: "Favorable capacity for steady resource accumulation, aesthetic investments, and family wealth preservation.",
    precaution: "Watch discretionary luxury expenditures.",
  },
  {
    id: "R_FIN_11TH_MERCURY",
    category: "finance",
    name: "Mercury in 11th House of Gains",
    priority: 8,
    weight: 8,
    condition: (ctx) => ctx.planets.Mercury.house === 11,
    getEvidence: (ctx) => `Mercury resides in 11th House of Income and Network Gains (${ctx.planets.Mercury.sign}).`,
    supportiveText: "Multiple income streams generated through analytical intellect, trade, digital networks, and professional contracts.",
    precaution: "Review all contracts and investment terms carefully before committing capital.",
  },
  {
    id: "R_FIN_RAHU_2ND",
    category: "finance",
    name: "Rahu in 2nd House",
    priority: 7,
    weight: -4,
    condition: (ctx) => ctx.planets.Rahu.house === 2,
    getEvidence: (ctx) => `Rahu occupies the 2nd House of Financial Resources (${ctx.planets.Rahu.sign}).`,
    supportiveText: "Innovative unconventional wealth channels and ambition for rapid financial growth.",
    challengingText: "Sudden financial fluctuations and temptation toward speculative shortcuts.",
    precaution: "Avoid unverified speculative schemes; maintain conservative emergency reserves.",
  },

  // --- LOVE & RELATIONSHIPS RULES ---
  {
    id: "R_LOVE_7TH_JUPITER",
    category: "love",
    name: "Jupiter in 7th House",
    priority: 9,
    weight: 8,
    condition: (ctx) => ctx.planets.Jupiter.house === 7,
    getEvidence: (ctx) => `Jupiter blesses the 7th House of Partnership (${ctx.planets.Jupiter.sign}).`,
    supportiveText: "Promotes mutual respect, mature wisdom, philosophical compatibility, and stability in committed unions.",
    precaution: "Ensure personal boundaries are maintained alongside high relationship ideals.",
  },
  {
    id: "R_LOVE_7TH_VENUS",
    category: "love",
    name: "Venus in 7th House",
    priority: 8,
    weight: 7,
    condition: (ctx) => ctx.planets.Venus.house === 7,
    getEvidence: (ctx) => `Venus resides in 7th House of Relationships (${ctx.planets.Venus.sign}).`,
    supportiveText: "Strong affectionate bond, shared aesthetic appreciation, and harmony in emotional dynamics.",
    precaution: "Do not let avoidance of conflict prevent honest communication on difficult topics.",
  },
  {
    id: "R_LOVE_7TH_MARS",
    category: "love",
    name: "Mars in 7th House (Mangal Placement)",
    priority: 9,
    weight: -5,
    condition: (ctx) => ctx.planets.Mars.house === 7,
    getEvidence: (ctx) => `Mars placed in 7th House (${ctx.planets.Mars.sign}) exerting intense energetic influence on partnerships.`,
    supportiveText: "Dynamic passion, protective loyalty, and proactive shared goals.",
    challengingText: "Potential for friction, quick temper flare-ups, and struggles over control.",
    precaution: "Practice pause-and-reflect communication and channel excess physical energy into sports or joint activities.",
  },

  // --- HEALTH & WELLBEING RULES ---
  {
    id: "R_HLT_1ST_SUN",
    category: "health",
    name: "Sun in Ascendant Lagna",
    priority: 8,
    weight: 8,
    condition: (ctx) => ctx.planets.Sun.house === 1,
    getEvidence: (ctx) => `Sun sits in 1st House Lagna (${ctx.planets.Sun.sign}), boosting constitutional vitality.`,
    supportiveText: "Robust baseline stamina, rapid recuperative capacity, and vibrant self-confidence.",
    precaution: "Keep body temperature balanced, stay hydrated, and guard against ocular strain.",
  },
  {
    id: "R_HLT_6TH_MARS",
    category: "health",
    name: "Mars in 6th House (Upachaya Strength)",
    priority: 8,
    weight: 7,
    condition: (ctx) => ctx.planets.Mars.house === 6,
    getEvidence: (ctx) => `Mars in 6th House of Immunity and Overcoming Obstacles (${ctx.planets.Mars.sign}).`,
    supportiveText: "High immunological resistance, capacity to overcome health challenges, and strong athletic recovery.",
    precaution: "Avoid overexertion, inflammation, and rushing through physical workouts.",
  },
  {
    id: "R_HLT_6TH_SATURN",
    category: "health",
    name: "Saturn in 6th House",
    priority: 8,
    weight: 6,
    condition: (ctx) => ctx.planets.Saturn.house === 6,
    getEvidence: (ctx) => `Saturn in 6th House (${ctx.planets.Saturn.sign}) gives victory over ailments through regular discipline.`,
    supportiveText: "Resilient long-term health achieved through consistent diet, sleep hygiene, and physical routine.",
    precaution: "Maintain joint mobility, posture ergonomics, and consistent daily stretching.",
  },

  // --- SPIRITUALITY & PERSONAL GROWTH ---
  {
    id: "R_SPI_9TH_JUPITER",
    category: "spirituality",
    name: "Jupiter in 9th House of Dharma",
    priority: 9,
    weight: 9,
    condition: (ctx) => ctx.planets.Jupiter.house === 9,
    getEvidence: (ctx) => `Jupiter placed in its natural domicile 9th House of Dharma (${ctx.planets.Jupiter.sign}).`,
    supportiveText: "Profound philosophical orientation, alignment with ethical purpose, and natural mentorship abilities.",
    precaution: "Remain open to varied viewpoints and avoid dogmatic preconceptions.",
  },
  {
    id: "R_SPI_12TH_KETU",
    category: "spirituality",
    name: "Ketu in 12th House of Moksha",
    priority: 9,
    weight: 9,
    condition: (ctx) => ctx.planets.Ketu.house === 12,
    getEvidence: (ctx) => `Ketu in 12th House of Spiritual Liberation (${ctx.planets.Ketu.sign}).`,
    supportiveText: "Natural inclination toward introspective meditation, dream clarity, detachment from materialism, and spiritual insight.",
    precaution: "Ground spiritual insights into practical daily responsibilities and service.",
  },
];

export class RuleEngine {
  /**
   * Evaluates all rules for a specific life area against the canonical context.
   */
  static evaluateCategory(ctx: CanonicalAstrologyContext, category: LifeAreaCategory): RuleEngineEvaluation {
    const matchedRules: AstrologicalRule[] = [];
    const supportingFactors: string[] = [];
    const challengingFactors: string[] = [];
    const timingFactors: string[] = [];
    const precautions: string[] = [];
    const practicalActions: string[] = [];

    let supportiveWeight = 0;
    let challengingWeight = 0;

    // 1. Evaluate specific category rules
    const relevantRules = ASTROLOGY_RULES.filter((r) => r.category === category || r.category === "general");

    for (const rule of relevantRules) {
      if (rule.condition(ctx)) {
        matchedRules.push(rule);
        const evidence = rule.getEvidence(ctx);

        if (rule.weight >= 0) {
          supportiveWeight += rule.weight * (rule.priority / 10);
          supportingFactors.push(`${evidence} → ${rule.supportiveText}`);
        } else {
          challengingWeight += Math.abs(rule.weight) * (rule.priority / 10);
          challengingFactors.push(`${evidence} → ${rule.challengingText || rule.supportiveText}`);
        }

        if (rule.precaution) {
          precautions.push(rule.precaution);
        }
      }
    }

    // 2. Add relevant timing context (Active Dasha & Transits)
    const activeDasha = ctx.currentDasha.mahadasha;
    timingFactors.push(`Active Mahadasha: ${activeDasha.planet} period (active through ${activeDasha.endDate.slice(0, 4)})`);
    if (ctx.currentDasha.antardasha) {
      timingFactors.push(`Active Antardasha: ${ctx.currentDasha.antardasha.planet} sub-period`);
    }

    // Add relevant transits activating this life area
    const houseMap: Record<LifeAreaCategory, number[]> = {
      career: [10, 6, 1, 11],
      finance: [2, 11, 5, 9],
      love: [7, 5, 11],
      family: [2, 4, 1],
      health: [1, 6, 8],
      education: [4, 5, 9],
      travel: [3, 9, 12],
      spirituality: [9, 12, 5, 8],
    };

    const targetHouses = houseMap[category] || [1, 10];
    for (const [pName, transit] of Object.entries(ctx.currentTransits)) {
      if (targetHouses.includes(transit.natalHouseActivated)) {
        timingFactors.push(`Transiting ${pName} in House ${transit.natalHouseActivated} (${transit.transitingSign}): ${transit.nature} transit activation`);
      }
    }

    // 3. Compute net score & confidence
    const netWeight = supportiveWeight - challengingWeight;
    const baseScore = 65; // neutral baseline
    const calculatedScore = Math.max(20, Math.min(95, Math.round(baseScore + netWeight * 2.5)));

    const confidence: StructuredEvidencePrediction["confidence"] =
      matchedRules.length >= 3 && Math.abs(netWeight) >= 5
        ? "High Indication"
        : matchedRules.length >= 1
        ? "Moderate Indication"
        : "Possible Tendency";

    // 4. Practical actions
    if (category === "career") {
      practicalActions.push("Align high-stakes initiatives with favorable Dasha/Transit timing windows.");
      practicalActions.push("Document measurable milestones to substantiate professional advancement.");
    } else if (category === "finance") {
      practicalActions.push("Maintain a clear budget structure and automate long-term savings.");
      practicalActions.push("Conduct thorough due diligence before speculative financial commitments.");
    } else if (category === "love") {
      practicalActions.push("Prioritize active listening and scheduled quality time with partners.");
      practicalActions.push("Acknowledge individual emotional cycles to navigate sensitive discussions gracefully.");
    } else if (category === "health") {
      practicalActions.push("Maintain consistent circadian sleep cycles and daily physical mobility.");
      practicalActions.push("Incorporate daily mindfulness or breathwork to moderate stress markers.");
    } else if (category === "spirituality") {
      practicalActions.push("Establish a dedicated 15-minute daily reflective or meditative practice.");
      practicalActions.push("Engage in regular study of philosophical and wisdom literature.");
    }

    // 5. Build Synthesized Statement
    let statement = "";
    if (supportingFactors.length > 0 && challengingFactors.length === 0) {
      statement = `Your astrological placements indicate strong supportive momentum in ${category}. Primary alignment stems from ${supportingFactors[0].split(" → ")[0]}.`;
    } else if (supportingFactors.length > 0 && challengingFactors.length > 0) {
      statement = `This area presents a dynamic interplay of supportive opportunities and necessary precautions. While ${supportingFactors[0].split(" → ")[0]} provides positive impetus, ${challengingFactors[0].split(" → ")[0]} advises steady patience and structural discipline.`;
    } else if (challengingFactors.length > 0) {
      statement = `Astrological indicators suggest a phase requiring mindful consolidation and strategic pacing in ${category}. Growth is achieved through careful process management.`;
    } else {
      statement = `Your ${category} indications reflect steady baseline energy with subtle influences from your active ${activeDasha.planet} planetary period.`;
    }

    const prediction: StructuredEvidencePrediction = {
      predictionId: `pred_${category}_${ctx.birth.utcDateTime.slice(0, 10)}`,
      category,
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Forecast & Planetary Analysis`,
      statement,
      confidence,
      evidenceScore: calculatedScore,
      supportingFactors: supportingFactors.length > 0 ? supportingFactors : ["Balanced natal placements providing steady foundational energy."],
      challengingFactors: challengingFactors.length > 0 ? challengingFactors : ["No severe planetary afflictions directly targeting this sector."],
      timingFactors,
      precautions: precautions.length > 0 ? precautions : ["Maintain steady consistency and avoid hasty decisions under emotional impulses."],
      practicalActions,
      rulesMatched: matchedRules.map((r) => r.id),
      calculationVersion: ctx.engineVersion,
    };

    return {
      category,
      score: calculatedScore,
      supportiveWeight,
      challengingWeight,
      netWeight,
      prediction,
    };
  }

  /**
   * Evaluates all life areas in one batch for comprehensive reporting.
   */
  static evaluateAll(ctx: CanonicalAstrologyContext): Record<LifeAreaCategory, RuleEngineEvaluation> {
    const categories: LifeAreaCategory[] = [
      "career",
      "finance",
      "love",
      "family",
      "health",
      "education",
      "travel",
      "spirituality",
    ];

    const result = {} as Record<LifeAreaCategory, RuleEngineEvaluation>;
    for (const cat of categories) {
      result[cat] = this.evaluateCategory(ctx, cat);
    }
    return result;
  }
}
