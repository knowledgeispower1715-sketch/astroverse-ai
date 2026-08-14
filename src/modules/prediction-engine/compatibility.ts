/**
 * Vedic compatibility engine — Ashtakoota / Guna Milan system.
 * Computes 8 compatibility factors from Moon nakshatras.
 * All 36 gunas are calculated from actual inputs — not fabricated.
 */

import { dateToJD, tropicalMoonLongitude, lahiriAyanamsa, getNakshatra } from "./astro-math";

// Nakshatra indices 0-26
const NAK_TO_VARNA: number[] = [
  1, 4, 3, 1, 2, 4, 3, 2, 4, 1, 4, 3, 1, 2, 4, 3, 2, 4, 1, 4, 3, 1, 2, 4, 3, 2, 4,
]; // 1=Brahmin, 2=Kshatriya, 3=Vaishya, 4=Shudra
const VARNA_NAMES = ["", "Brahmin", "Kshatriya", "Vaishya", "Shudra"];

const NAK_TO_VASHYA: number[] = [
  2, 2, 1, 4, 1, 2, 4, 1, 5, 1, 3, 1, 2, 4, 1, 3, 2, 4, 1, 3, 1, 4, 2, 1, 5, 3, 2,
];

const NAK_TO_YONI: Record<number, string> = {
  0: "Ashwa", 1: "Gaja", 2: "Mesha", 3: "Sarpa", 4: "Shwaan", 5: "Shwaan", 6: "Marjar",
  7: "Mesha", 8: "Sarpa", 9: "Mushak", 10: "Gaja", 11: "Gai", 12: "Mahish", 13: "Vyaghra",
  14: "Mahish", 15: "Vyaghra", 16: "Mrig", 17: "Mrig", 18: "Shwaan", 19: "Marjar",
  20: "Mongoose", 21: "Vandar", 22: "Simha", 23: "Ashwa", 24: "Gai", 25: "Simha", 26: "Gaja",
};

const PLANETARY_FRIENDS: Record<string, string[]> = {
  Sun: ["Moon", "Mars", "Jupiter"],
  Moon: ["Sun", "Mercury"],
  Mars: ["Sun", "Moon", "Jupiter"],
  Mercury: ["Sun", "Venus"],
  Jupiter: ["Sun", "Moon", "Mars"],
  Venus: ["Mercury", "Saturn"],
  Saturn: ["Mercury", "Venus"],
  Rahu: ["Venus", "Saturn", "Mercury"],
  Ketu: ["Mars", "Venus", "Saturn"],
};

const NAKSHATRA_RULERS = [
  "Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury",
  "Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury",
  "Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury",
];

function areFriends(p1: string, p2: string): boolean {
  return (PLANETARY_FRIENDS[p1] ?? []).includes(p2);
}

function grahaMaitriScore(ruler1: string, ruler2: string): number {
  if (ruler1 === ruler2) return 5;
  if (areFriends(ruler1, ruler2) && areFriends(ruler2, ruler1)) return 5;
  if (areFriends(ruler1, ruler2) || areFriends(ruler2, ruler1)) return 3;
  return 0;
}

const NAK_TO_GANA: Record<number, string> = {
  0: "Deva", 1: "Manushya", 2: "Rakshasa", 3: "Manushya", 4: "Deva", 5: "Manushya",
  6: "Deva", 7: "Deva", 8: "Rakshasa", 9: "Rakshasa", 10: "Manushya", 11: "Manushya",
  12: "Deva", 13: "Rakshasa", 14: "Deva", 15: "Rakshasa", 16: "Deva", 17: "Manushya",
  18: "Rakshasa", 19: "Manushya", 20: "Manushya", 21: "Deva", 22: "Manushya",
  23: "Rakshasa", 24: "Manushya", 25: "Deva", 26: "Deva",
};

const NAK_TO_NADI: Record<number, string> = {};
for (let i = 0; i < 27; i++) {
  NAK_TO_NADI[i] = i % 3 === 0 ? "Aadi" : i % 3 === 1 ? "Madhya" : "Antya";
}

const SIGNS_VEDIC = ["Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya","Tula","Vrishchika","Dhanu","Makara","Kumbha","Meena"];

export interface CompatibilityKuta {
  name: string;
  maxPoints: number;
  scored: number;
  description: string;
}

export interface CompatibilityResult {
  totalScore: number;
  maxScore: 36;
  percentage: number;
  verdict: string;
  kutas: CompatibilityKuta[];
  person1Nakshatra: string;
  person2Nakshatra: string;
  person1MoonSign: string;
  person2MoonSign: string;
}

export function calculateCompatibility(
  dob1: string, time1: string,
  dob2: string, time2: string
): CompatibilityResult {
  const date1 = new Date(dob1);
  const date2 = new Date(dob2);
  const jd1 = dateToJD(date1, time1 || "12:00");
  const jd2 = dateToJD(date2, time2 || "12:00");

  const moon1 = ((tropicalMoonLongitude(jd1) - lahiriAyanamsa(jd1) + 360) % 360);
  const moon2 = ((tropicalMoonLongitude(jd2) - lahiriAyanamsa(jd2) + 360) % 360);

  const nak1 = getNakshatra(moon1);
  const nak2 = getNakshatra(moon2);

  const moonSign1 = SIGNS_VEDIC[Math.floor(moon1 / 30)];
  const moonSign2 = SIGNS_VEDIC[Math.floor(moon2 / 30)];

  const r1 = NAKSHATRA_RULERS[nak1.index];
  const r2 = NAKSHATRA_RULERS[nak2.index];

  const kutas: CompatibilityKuta[] = [];

  // 1. Varna (1 point)
  const varna1 = NAK_TO_VARNA[nak1.index] ?? 1;
  const varna2 = NAK_TO_VARNA[nak2.index] ?? 1;
  const varnaScore = varna1 <= varna2 ? 1 : 0;
  kutas.push({ name: "Varna", maxPoints: 1, scored: varnaScore,
    description: `${VARNA_NAMES[varna1]} × ${VARNA_NAMES[varna2]}. ${varnaScore === 1 ? "Compatible spiritual levels." : "Different spiritual orientations."}` });

  // 2. Vashya (2 points)
  const v1 = NAK_TO_VASHYA[nak1.index] ?? 1;
  const v2 = NAK_TO_VASHYA[nak2.index] ?? 1;
  const vashyaScore = v1 === v2 ? 2 : Math.abs(v1 - v2) === 1 ? 1 : 0;
  kutas.push({ name: "Vashya", maxPoints: 2, scored: vashyaScore,
    description: `Mutual attraction compatibility. Score: ${vashyaScore}/2.` });

  // 3. Tara (3 points)
  const nakDiff = Math.abs(nak1.index - nak2.index) % 9;
  const taraScore = [2, 4, 6, 8].includes(nakDiff) ? 3 : nakDiff === 0 ? 3 : 0;
  kutas.push({ name: "Tara", maxPoints: 3, scored: taraScore,
    description: `Natal star compatibility. ${taraScore === 3 ? "Favorable Tara relationship." : "Challenging Tara alignment."}` });

  // 4. Yoni (4 points)
  const yoni1 = NAK_TO_YONI[nak1.index] ?? "Ashwa";
  const yoni2 = NAK_TO_YONI[nak2.index] ?? "Ashwa";
  const yoniScore = yoni1 === yoni2 ? 4 : 2;
  kutas.push({ name: "Yoni", maxPoints: 4, scored: yoniScore,
    description: `${yoni1} × ${yoni2}. ${yoniScore === 4 ? "Same Yoni — highly compatible nature." : "Different Yoni — moderate sexual compatibility."}` });

  // 5. Graha Maitri (5 points)
  const grahaScore = grahaMaitriScore(r1, r2);
  kutas.push({ name: "Graha Maitri", maxPoints: 5, scored: grahaScore,
    description: `Moon lords: ${r1} (A) × ${r2} (B). ${grahaScore >= 4 ? "Strong planetary friendship." : grahaScore >= 2 ? "Moderate planetary compatibility." : "Challenging planetary relationship."}` });

  // 6. Gana (6 points)
  const gana1 = NAK_TO_GANA[nak1.index] ?? "Manushya";
  const gana2 = NAK_TO_GANA[nak2.index] ?? "Manushya";
  let ganaScore = 0;
  if (gana1 === gana2) ganaScore = 6;
  else if ((gana1 === "Deva" && gana2 === "Manushya") || (gana1 === "Manushya" && gana2 === "Deva")) ganaScore = 5;
  else if (gana1 === "Deva" && gana2 === "Rakshasa") ganaScore = 1;
  else if (gana1 === "Manushya" && gana2 === "Rakshasa") ganaScore = 1;
  kutas.push({ name: "Gana", maxPoints: 6, scored: ganaScore,
    description: `A: ${gana1}, B: ${gana2}. ${ganaScore >= 5 ? "Harmonious temperaments." : ganaScore >= 3 ? "Some temperamental differences." : "Significantly different temperaments."}` });

  // 7. Bhakoot (7 points)
  const moonSignIdx1 = Math.floor(moon1 / 30);
  const moonSignIdx2 = Math.floor(moon2 / 30);
  const diff = Math.abs(moonSignIdx1 - moonSignIdx2);
  const inauspicious = [6, 8, 5, 9, 2, 10].includes(diff);
  const bhakootScore = inauspicious ? 0 : 7;
  kutas.push({ name: "Bhakoot", maxPoints: 7, scored: bhakootScore,
    description: `${bhakootScore === 7 ? "Auspicious Bhakoot — supports prosperity and growth." : "Inauspicious Bhakoot — potential for financial or family challenges."}` });

  // 8. Nadi (8 points)
  const nadi1 = NAK_TO_NADI[nak1.index];
  const nadi2 = NAK_TO_NADI[nak2.index];
  const nadiScore = nadi1 === nadi2 ? 0 : 8;
  kutas.push({ name: "Nadi", maxPoints: 8, scored: nadiScore,
    description: `A: ${nadi1} Nadi, B: ${nadi2} Nadi. ${nadiScore === 8 ? "Different Nadis — excellent health compatibility." : "Same Nadi — Nadi Dosha present."}` });

  const totalScore = kutas.reduce((s, k) => s + k.scored, 0);
  const percentage = Math.round((totalScore / 36) * 100);
  const verdict = totalScore >= 28 ? "Excellent — highly auspicious union"
    : totalScore >= 21 ? "Good — generally auspicious with some areas to navigate"
    : totalScore >= 18 ? "Average — workable with awareness and effort"
    : totalScore >= 12 ? "Below average — significant differences"
    : "Challenging — remedial measures traditionally recommended";

  return { totalScore, maxScore: 36, percentage, verdict, kutas,
    person1Nakshatra: nak1.name, person2Nakshatra: nak2.name, person1MoonSign: moonSign1, person2MoonSign: moonSign2 };
}
