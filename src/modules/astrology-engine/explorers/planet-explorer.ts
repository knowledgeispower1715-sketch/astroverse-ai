/**
 * ============================================================================
 * AstroVerse AI — Interactive Planet & Transit Explorer Engine
 * ============================================================================
 * Generates structured, deterministic astronomical and astrological breakdowns
 * for every celestial body (Sun through Ketu + Outer Planets).
 * ============================================================================
 */

import { CanonicalAstrologyContext, PlanetaryPlacement } from "../canonical-context";

export interface PlanetExplorerData {
  planet: string;
  symbol: string;
  natalPlacement: PlanetaryPlacement;
  currentTransit: {
    sign: string;
    degree: number;
    houseFromAscendant: number;
    houseFromMoon: number;
    motion: "direct" | "retrograde";
    activationSummary: string;
  };
  karakatwas: string[]; // Traditional natural significations
  functionalNature: "benefic" | "malefic" | "yogakaraka" | "neutral";
  strengthBreakdown: {
    dignity: string;
    score: number; // 0..100
    isExalted: boolean;
    isDebilitated: boolean;
    isCombust: boolean;
    houseStrength: string;
  };
  relationships: {
    toAscendant: string;
    toMoon: string;
    toSun: string;
  };
  traditionalInterpretation: {
    natalTheme: string;
    currentTransitTheme: string;
    supportivePotential: string;
    challengingPotential: string;
    prescribedRemedy: string;
  };
}

const PLANET_KARAKAS: Record<string, string[]> = {
  Sun: ["Soul (Atma)", "Father", "Authority", "Vitality", "Leadership", "Government", "Self-respect"],
  Moon: ["Mind (Manas)", "Mother", "Emotions", "Intuition", "Nourishment", "Memory", "Public Appeal"],
  Mars: ["Energy", "Courage", "Brothers", "Real Estate", "Initiative", "Protection", "Ambition"],
  Mercury: ["Intellect (Buddhi)", "Communication", "Logic", "Trade & Commerce", "Analytical Skill", "Writing"],
  Jupiter: ["Wisdom (Guru)", "Children", "Wealth", "Dharma", "Higher Learning", "Grace", "Optimism"],
  Venus: ["Love", "Spouse", "Beauty", "Arts", "Vehicles", "Luxury", "Refinement", "Diplomacy"],
  Saturn: ["Discipline", "Longevity", "Karma", "Perseverance", "Patience", "Hard Work", "Detachment"],
  Rahu: ["Innovation", "Obsession", "Unconventional Paths", "Material Ambition", "Foreign Connections"],
  Ketu: ["Moksha (Liberation)", "Detachment", "Spiritual Wisdom", "Occult Mastery", "Intuition"],
};

export function getPlanetExplorerData(
  ctx: CanonicalAstrologyContext,
  planetName: string
): PlanetExplorerData {
  const natal = ctx.planets[planetName] || ctx.planets.Sun;
  const transit = ctx.currentTransits[planetName];

  const moonHouse = ctx.planets.Moon.house;
  const houseFromMoon = ((natal.house - moonHouse + 12) % 12) + 1;

  const transitSign = transit ? transit.transitingSign : natal.sign;
  const transitDeg = transit ? transit.transitingDegree : natal.degreeInSign;
  const transitHouseAsc = transit ? transit.natalHouseActivated : natal.house;
  const transitHouseMoon = ((transitHouseAsc - moonHouse + 12) % 12) + 1;

  // Determine functional nature for this Lagna
  let functionalNature: PlanetExplorerData["functionalNature"] = "neutral";
  if (planetName === "Jupiter" || planetName === "Venus") functionalNature = "benefic";
  else if (planetName === "Saturn" || planetName === "Mars" || planetName === "Rahu" || planetName === "Ketu") functionalNature = "malefic";

  const strengthScore = natal.strengthScore;
  const isExalted = natal.dignity === "exalted";
  const isDebilitated = natal.dignity === "debilitated";

  // House strength descriptor
  let houseStrength = "Average House Placement";
  if ([1, 4, 7, 10].includes(natal.house)) houseStrength = "Strong (Kendra / Pillar House)";
  else if ([5, 9].includes(natal.house)) houseStrength = "Auspicious (Trikona / Trine House)";
  else if ([6, 8, 12].includes(natal.house)) houseStrength = "Challenging (Dusthana / Transformation House)";

  // Natal themes
  const natalTheme = `${planetName} placed in House ${natal.house} (${natal.sign}, ${natal.degreeInSign}°${natal.minuteInSign}') with ${natal.nakshatra.name} Nakshatra (Pada ${natal.nakshatra.pada || 1}).`;
  const currentTransitTheme = `Currently transiting ${transitSign} in your natal House ${transitHouseAsc} (and House ${transitHouseMoon} from natal Moon).`;

  let supportive = "";
  let challenging = "";
  let remedy = "";

  if (planetName === "Sun") {
    supportive = "Cultivates authoritative presence, clear self-identity, and executive clarity.";
    challenging = "Watch for ego clashes with authority figures and unnecessary pride.";
    remedy = "Offer water (Arghya) to the rising Sun and recite the Aditya Hridaya Stotram.";
  } else if (planetName === "Moon") {
    supportive = "Deep emotional perception, receptive intuition, and strong public relatability.";
    challenging = "Susceptibility to fluctuating moods and emotional exhaustion.";
    remedy = "Practice evening meditation, hydration balance, and chanting Om Som Somaya Namaha.";
  } else if (planetName === "Mars") {
    supportive = "Courageous initiative, athletic vigor, and direct task execution.";
    challenging = "Impulsiveness, hasty speech under pressure, and friction in joint ventures.";
    remedy = "Engage in regular physical workouts, physical charity, and Hanuman Chalisa recitation.";
  } else if (planetName === "Mercury") {
    supportive = "Sharp analytical capacity, persuasive writing, and adaptability in negotiations.";
    challenging = "Mental scatteredness, overthinking, and nervous strain.";
    remedy = "Keep organized journals, practice breathwork, and support green environmental causes.";
  } else if (planetName === "Jupiter") {
    supportive = "Wise guidance, moral clarity, academic/philosophical growth, and constructive mentorship.";
    challenging = "Risk of over-expansion and ungrounded optimism.";
    remedy = "Honor mentors/teachers, study philosophical texts, and chant Om Gram Greem Graum Sah Gurave Namah.";
  } else if (planetName === "Venus") {
    supportive = "Aesthetic appreciation, diplomatic charm, artistic creativity, and relational harmony.";
    challenging = "Self-indulgence and conflict avoidance.";
    remedy = "Foster creative artistic hobbies, maintain respect for partners, and donate white items on Fridays.";
  } else if (planetName === "Saturn") {
    supportive = "Unshakeable persistence, methodical mastery, ethical discipline, and durability.";
    challenging = "Feelings of delay, heavy duties, and temporary isolation.";
    remedy = "Practice selfless service (Seva) to the elderly or underprivileged, and chant Maha Mrityunjaya Mantra.";
  } else if (planetName === "Rahu") {
    supportive = "Innovative breakthroughs, out-of-the-box strategy, and global networking.";
    challenging = "Restless desires, illusionary shortcuts, and anxiety.";
    remedy = "Keep routine disciplined, ground into nature walks, and chant Om Raam Rahave Namaha.";
  } else {
    supportive = "Intuitive spiritual depth, non-attachment, and psychological insight.";
    challenging = "Feelings of disconnect from material goals.";
    remedy = "Engage in silent meditation, yoga, and chant Om Kem Ketave Namaha.";
  }

  return {
    planet: planetName,
    symbol: natal.symbol,
    natalPlacement: natal,
    currentTransit: {
      sign: transitSign,
      degree: Math.floor(transitDeg),
      houseFromAscendant: transitHouseAsc,
      houseFromMoon: transitHouseMoon,
      motion: "direct",
      activationSummary: transit ? transit.interpretation : `${planetName} activates natal House ${natal.house}.`,
    },
    karakatwas: PLANET_KARAKAS[planetName] || ["General Planetary Significator"],
    functionalNature,
    strengthBreakdown: {
      dignity: natal.dignity.toUpperCase(),
      score: strengthScore,
      isExalted,
      isDebilitated,
      isCombust: natal.isCombust,
      houseStrength,
    },
    relationships: {
      toAscendant: `Placed in House ${natal.house} from Lagna (${ctx.angles.ascendant.sign})`,
      toMoon: `Placed in House ${houseFromMoon} from Natal Moon (${ctx.planets.Moon.sign})`,
      toSun: `${natal.isCombust ? "Combust (within 6.5° of Sun)" : "Free of Combustion"}`,
    },
    traditionalInterpretation: {
      natalTheme,
      currentTransitTheme,
      supportivePotential: supportive,
      challengingPotential: challenging,
      prescribedRemedy: remedy,
    },
  };
}
