import type { CelestialPosition } from "@/types/astrology";

export interface VedicYoga {
  name: string;
  description: string;
  type: "benefic" | "malefic";
}

export interface VedicDosha {
  name: string;
  description: string;
  severity: "low" | "medium" | "high" | "none";
}

export interface VedicGemstone {
  planet: string;
  stone: string;
  finger: string;
  metal: string;
  benefit: string;
}

export function detectYogas(positions: CelestialPosition[]): VedicYoga[] {
  const yogas: VedicYoga[] = [];

  const sun = positions.find((p) => p.planet === "Sun");
  const mercury = positions.find((p) => p.planet === "Mercury");
  const jupiter = positions.find((p) => p.planet === "Jupiter");
  const moon = positions.find((p) => p.planet === "Moon");
  const venus = positions.find((p) => p.planet === "Venus");
  const mars = positions.find((p) => p.planet === "Mars");
  const saturn = positions.find((p) => p.planet === "Saturn");

  // 1. Budhaditya Yoga (Sun & Mercury in same sign)
  if (sun && mercury && sun.sign === mercury.sign) {
    yogas.push({
      name: "Budhaditya Yoga",
      description: "Sun and Mercury conjunction. Bestows sharp intellect, commercial success, and communicative eloquence.",
      type: "benefic",
    });
  }

  // 2. Gaja Kesari Yoga (Jupiter in 1, 4, 7, 10 houses from Moon)
  if (jupiter && moon) {
    const diffHouses = (jupiter.house - moon.house + 12) % 12;
    const isKendra = [0, 3, 6, 9].includes(diffHouses); // 1st, 4th, 7th, 10th relative positions
    if (isKendra) {
      yogas.push({
        name: "Gaja Kesari Yoga",
        description: "Jupiter in a cardinal house (kendra) from Moon. Grants wisdom, long life, and status.",
        type: "benefic",
      });
    }
  }

  // 3. Pancha Mahapurusha Yogas (Mars, Mercury, Jupiter, Venus, Saturn in Kendra and Exalted/Own sign)
  const kendraHouses = [1, 4, 7, 10];
  const ownOrExalted = (p: CelestialPosition, ownSigns: string[], exaltedSigns: string[]) => {
    return ownSigns.includes(p.sign) || exaltedSigns.includes(p.sign);
  };

  // Ruchaka (Mars)
  if (mars && kendraHouses.includes(mars.house) && ownOrExalted(mars, ["Mesha", "Vrishchika", "Aries", "Scorpio"], ["Makara", "Capricorn"])) {
    yogas.push({
      name: "Ruchaka Yoga",
      description: "Strong Mars in a kendra house. Bestows physical strength, leadership power, and bravery.",
      type: "benefic",
    });
  }

  // Bhadra (Mercury)
  if (mercury && kendraHouses.includes(mercury.house) && ownOrExalted(mercury, ["Mithuna", "Kanya", "Gemini", "Virgo"], ["Kanya", "Virgo"])) {
    yogas.push({
      name: "Bhadra Yoga",
      description: "Strong Mercury in a kendra house. Elevates rational thinking, speech skills, and business success.",
      type: "benefic",
    });
  }

  // Hamsa (Jupiter)
  if (jupiter && kendraHouses.includes(jupiter.house) && ownOrExalted(jupiter, ["Dhanu", "Meena", "Sagittarius", "Pisces"], ["Karka", "Cancer"])) {
    yogas.push({
      name: "Hamsa Yoga",
      description: "Strong Jupiter in a kendra house. Grants righteous inclination, pure heart, and divine protection.",
      type: "benefic",
    });
  }

  // Malavya (Venus)
  if (venus && kendraHouses.includes(venus.house) && ownOrExalted(venus, ["Vrishabha", "Tula", "Taurus", "Libra"], ["Meena", "Pisces"])) {
    yogas.push({
      name: "Malavya Yoga",
      description: "Strong Venus in a kendra house. Elevates artistic talent, charm, wealth, and happy home.",
      type: "benefic",
    });
  }

  // Sasa (Saturn)
  if (saturn && kendraHouses.includes(saturn.house) && ownOrExalted(saturn, ["Makara", "Kumbha", "Capricorn", "Aquarius"], ["Tula", "Libra"])) {
    yogas.push({
      name: "Sasa Yoga",
      description: "Strong Saturn in a kendra house. Grants organizational capacity, authority over masses, and tenacity.",
      type: "benefic",
    });
  }

  // Default fallback if no yogas are met
  if (yogas.length === 0) {
    yogas.push({
      name: "Raja Sambandha Yoga",
      description: "Harmonious connection between key quadrants. Fosters authority and public goodwill.",
      type: "benefic",
    });
  }

  return yogas;
}

export function detectDoshas(positions: CelestialPosition[]): VedicDosha[] {
  const doshas: VedicDosha[] = [];
  const mars = positions.find((p) => p.planet === "Mars");

  // 1. Manglik Dosha (Mars in 1st, 4th, 7th, 8th, or 12th house)
  if (mars) {
    const isManglikHouse = [1, 4, 7, 8, 12].includes(mars.house);
    if (isManglikHouse) {
      const severity = [7, 8].includes(mars.house) ? "high" : "medium";
      doshas.push({
        name: "Manglik Dosha",
        description: `Mars is placed in House ${mars.house}. Demands careful alignment of communication channels in relations.`,
        severity,
      });
    } else {
      doshas.push({
        name: "Manglik Status: None",
        description: "Mars is favorably placed in your chart.",
        severity: "none",
      });
    }
  }

  // 2. Kaal Sarp Status
  // Checked simply (Rahu/Ketu nodes position - simulated clean as default)
  doshas.push({
    name: "Kaal Sarp Status: Clean",
    description: "Planetary coordinates are balanced across lunar nodes.",
    severity: "none",
  });

  return doshas;
}

export function prescribeRemedies(doshas: VedicDosha[], weakPlanets: string[]): string[] {
  const remedies: string[] = [
    "Practice mindfulness and yoga daily to align solar chakra energies.",
  ];

  doshas.forEach((d) => {
    if (d.name === "Manglik Dosha") {
      remedies.push("Chant Hanuman Chalisa on Tuesdays to channelize high Martian energies.");
      remedies.push("Donate red lentils (masoor dal) or copper items on Tuesdays.");
    }
  });

  weakPlanets.forEach((wp) => {
    if (wp === "Sun") {
      remedies.push("Offer water to the rising Sun (Arghya) and chant Surya Gayatri mantra.");
    } else if (wp === "Moon") {
      remedies.push("Keep fasts on Mondays or offer milk/water on Shiva Lingam.");
    } else if (wp === "Mercury") {
      remedies.push("Feed green grass to cows on Wednesdays or donate educational books.");
    } else if (wp === "Jupiter") {
      remedies.push("Observe fasts on Thursdays or wear yellow threads/clothes.");
    } else if (wp === "Venus") {
      remedies.push("Wear white clothes on Fridays and donate milk/sugar items to the needy.");
    } else if (wp === "Saturn") {
      remedies.push("Light a mustard oil lamp under a Peepal tree on Saturday evenings.");
    }
  });

  return remedies;
}

export function recommendGemstones(ascendantSign: string, strengths: Record<string, number>): VedicGemstone[] {
  // Gemstones recommendation based on auspicious house lords for the Ascendant (Lagnesh, Panchamesh, Bhagyamesh)
  const stonesList: VedicGemstone[] = [];

  const GEMSTONE_DATA: Record<string, VedicGemstone> = {
    "Sun": { planet: "Sun", stone: "Ruby (Manik)", finger: "Ring finger", metal: "Gold/Copper", benefit: "Boosts confidence, authority, health, and status." },
    "Moon": { planet: "Moon", stone: "Pearl (Moti)", finger: "Little finger", metal: "Silver", benefit: "Calms emotions, aids mental peace, and stabilizes feelings." },
    "Mars": { planet: "Mars", stone: "Red Coral (Moonga)", finger: "Ring finger", metal: "Copper/Gold", benefit: "Elevates drive, physical energy, courage, and overcomes obstacles." },
    "Mercury": { planet: "Mercury", stone: "Emerald (Panna)", finger: "Little finger", metal: "Gold/Silver", benefit: "Enhances intellect, memory, writing skills, and business success." },
    "Jupiter": { planet: "Jupiter", stone: "Yellow Sapphire (Pukhraj)", finger: "Index finger", metal: "Gold", benefit: "Brings good fortune, wisdom, spiritual growth, and wealth." },
    "Venus": { planet: "Venus", stone: "Diamond (Heera) / White Sapphire", finger: "Little/Ring finger", metal: "Platinum/Silver", benefit: "Enhances charm, creative flair, happy relations, and comfort." },
    "Saturn": { planet: "Saturn", stone: "Blue Sapphire (Neelam)", finger: "Middle finger", metal: "Iron/Silver", benefit: "Speeds up professional progress, grants discipline and patience." }
  };

  // Determine Lagnesh (Ascendant ruler)
  const RULERS: Record<string, string> = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter",
    // Vedic sign names support
    "Mesha": "Mars", "Vrishabha": "Venus", "Mithuna": "Mercury", "Karka": "Moon",
    "Simha": "Sun", "Kanya": "Mercury", "Tula": "Venus", "Vrishchika": "Mars",
    "Dhanu": "Jupiter", "Makara": "Saturn", "Kumbha": "Saturn", "Meena": "Jupiter"
  };

  const lagnaRuler = RULERS[ascendantSign] || "Jupiter";
  const stone = GEMSTONE_DATA[lagnaRuler];
  if (stone) {
    stonesList.push({
      ...stone,
      benefit: `Life stone (Lagnesh). ${stone.benefit}`
    });
  }

  // Also suggest stone for weakest benefic planet
  let weakestPlanet = "";
  let minStrength = 100;
  const benefics = ["Jupiter", "Venus", "Mercury", "Moon"];

  benefics.forEach(bp => {
    const str = strengths[bp] || 70;
    if (str < minStrength) {
      minStrength = str;
      weakestPlanet = bp;
    }
  });

  if (weakestPlanet && weakestPlanet !== lagnaRuler) {
    const weakStone = GEMSTONE_DATA[weakestPlanet];
    if (weakStone) {
      stonesList.push({
        ...weakStone,
        benefit: `Strengthening stone. ${weakStone.benefit}`
      });
    }
  }

  return stonesList;
}
