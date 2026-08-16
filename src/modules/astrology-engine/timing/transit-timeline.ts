/**
 * ============================================================================
 * AstroVerse AI — Transit & Timing Windows Timeline Engine
 * ============================================================================
 * Computes deterministic astrological timing windows across:
 * PAST | TODAY | NEXT 7 DAYS | NEXT 30 DAYS | NEXT 3 MONTHS | NEXT 6 MONTHS | NEXT 12 MONTHS
 * ============================================================================
 */

import { CanonicalAstrologyContext } from "../canonical-context";
import { dateToJD, lahiriAyanamsa, tropicalJupiterLongitude, tropicalSaturnLongitude, tropicalMarsLongitude, tropicalRahuLongitude, SIGNS, ZodiacSignName } from "@/modules/prediction-engine/astro-math";

export type TimelineHorizon =
  | "past_30d"
  | "today"
  | "next_7d"
  | "next_30d"
  | "next_3m"
  | "next_6m"
  | "next_12m";

export interface TransitTimelineWindow {
  horizon: TimelineHorizon;
  horizonLabel: string;
  startDate: string;
  endDate: string;
  transitingPlanet: string;
  transitingSign: ZodiacSignName;
  activatedHouse: number;
  houseSignifications: string[];
  aspectToNatal: string;
  theme: string;
  supportivePotential: string;
  challengingPotential: string;
  precautions: string;
  traditionalBasis: string;
}

export function generateTransitTimeline(ctx: CanonicalAstrologyContext, baseDate: Date = new Date()): TransitTimelineWindow[] {
  const ascSignIdx = ctx.angles.ascendant.signIndex;
  const nowMs = baseDate.getTime();
  const windows: TransitTimelineWindow[] = [];

  const horizons: Array<{
    id: TimelineHorizon;
    label: string;
    offsetDaysStart: number;
    offsetDaysEnd: number;
  }> = [
    { id: "past_30d", label: "Past 30 Days (Recent Foundation)", offsetDaysStart: -30, offsetDaysEnd: -1 },
    { id: "today", label: "Today's Active Transit Horizon", offsetDaysStart: 0, offsetDaysEnd: 0 },
    { id: "next_7d", label: "Next 7 Days (Immediate Focus)", offsetDaysStart: 1, offsetDaysEnd: 7 },
    { id: "next_30d", label: "Next 30 Days (Monthly Cycle)", offsetDaysStart: 8, offsetDaysEnd: 30 },
    { id: "next_3m", label: "Next 3 Months (Quarterly Dynamics)", offsetDaysStart: 31, offsetDaysEnd: 90 },
    { id: "next_6m", label: "Next 6 Months (Biannual Evolution)", offsetDaysStart: 91, offsetDaysEnd: 180 },
    { id: "next_12m", label: "Next 12 Months (Annual Shift)", offsetDaysStart: 181, offsetDaysEnd: 365 },
  ];

  for (const h of horizons) {
    const targetDate = new Date(nowMs + ((h.offsetDaysStart + h.offsetDaysEnd) / 2) * 86400000);
    const targetJd = dateToJD(targetDate);
    const targetAyan = lahiriAyanamsa(targetJd);

    // Calculate major slow-moving transit positions at target horizon (Jupiter, Saturn, Mars, Rahu)
    let pName = "Jupiter";
    let tropLong = tropicalJupiterLongitude(targetJd);

    if (h.id === "today" || h.id === "next_7d") {
      pName = "Mars";
      tropLong = tropicalMarsLongitude(targetJd);
    } else if (h.id === "next_3m" || h.id === "next_6m") {
      pName = "Jupiter";
      tropLong = tropicalJupiterLongitude(targetJd);
    } else if (h.id === "next_12m") {
      pName = "Saturn";
      tropLong = tropicalSaturnLongitude(targetJd);
    } else {
      pName = "Rahu";
      tropLong = tropicalRahuLongitude(targetJd);
    }

    const sidLong = ((tropLong - targetAyan) % 360 + 360) % 360;
    const signIdx = Math.floor(sidLong / 30);
    const sign = SIGNS[signIdx];
    const activatedHouse = ((signIdx - ascSignIdx + 12) % 12) + 1;
    const houseInfo = ctx.houses[activatedHouse - 1];

    const startDate = new Date(nowMs + h.offsetDaysStart * 86400000).toISOString().slice(0, 10);
    const endDate = new Date(nowMs + h.offsetDaysEnd * 86400000).toISOString().slice(0, 10);

    let supportive = "";
    let challenging = "";
    let precautions = "";

    if (pName === "Jupiter") {
      supportive = `Expansion of opportunities in ${houseInfo?.significations.slice(0, 2).join(" & ")}, favorable mentorship, and increased clarity.`;
      challenging = "Potential to over-extend financial or operational commitments through excessive optimism.";
      precautions = "Ground expansive ideas into measurable, step-by-step milestones.";
    } else if (pName === "Saturn") {
      supportive = `Establishment of durable long-term structures, high discipline, and recognition for perseverance in House ${activatedHouse}.`;
      challenging = "Heavier workload, procedural slowdowns, and testing of patience.";
      precautions = "Maintain strict schedule hygiene and avoid cutting procedural corners.";
    } else if (pName === "Mars") {
      supportive = `High initiative, physical drive, and capacity to execute demanding tasks swiftly in ${houseInfo?.significations[0] || "vitality"}.`;
      challenging = "Impatience, restlessness, and tendency to react impulsively in verbal exchanges.";
      precautions = "Direct energetic intensity into structured exercise or focused creative problem-solving.";
    } else {
      supportive = `Innovative out-of-the-box approaches and accelerated ambition regarding ${houseInfo?.significations[0]}.`;
      challenging = "Unclear expectations and temptation to pursue speculative shortcuts.";
      precautions = "Verify all details independently before committing capital or trust.";
    }

    windows.push({
      horizon: h.id,
      horizonLabel: h.label,
      startDate,
      endDate,
      transitingPlanet: pName,
      transitingSign: sign,
      activatedHouse,
      houseSignifications: houseInfo?.significations || ["Growth", "Karma"],
      aspectToNatal: `Transiting ${pName} activates natal House ${activatedHouse} (${sign})`,
      theme: `${pName} Transit in ${sign} (House ${activatedHouse} Activation)`,
      supportivePotential: supportive,
      challengingPotential: challenging,
      precautions,
      traditionalBasis: `Classical Gochara transit analysis mapped from natal Ascendant (${ctx.angles.ascendant.sign}).`,
    });
  }

  return windows;
}
