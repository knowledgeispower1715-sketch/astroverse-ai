"use client";

import { useState } from "react";
import { Sparkles, ShieldAlert, Award, Star, ListChecks, CheckCircle2 } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";

const MOCK_REMEDIES = [
  { planet: "Mars (Manglik / Affliction)", gemstone: "Red Coral (Moonga)", mantra: "Om Angarakaya Namaha", donation: "Red lentils, copper utensils on Tuesdays", fast: "Tuesday fasting" },
  { planet: "Saturn (Sade Sati / Weak)", gemstone: "Blue Sapphire (Neelam)", mantra: "Om Sham Shanaishcharaya Namaha", donation: "Black sesame seeds, iron pans, mustard oil on Saturdays", fast: "Saturday fasting" },
  { planet: "Mercury (Weak intellect)", gemstone: "Emerald (Panna)", mantra: "Om Budhaya Namaha", donation: "Green clothing, mung beans to charitable institutions on Wednesdays", fast: "Wednesday fasting" },
];

export default function RemediesPage() {
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Vedic Remedies Advisor
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Mitigate planetary doshas and strengthen weak natal planetary configurations with mantras, gemstones, donations, and fasting guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Afflictions checklist */}
          <div className="md:col-span-1 glass rounded-xl p-5 border border-white/5 h-fit">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
              <ListChecks className="w-4 h-4 text-gold" />
              Natal Placements
            </h3>
            <div className="space-y-2">
              {MOCK_REMEDIES.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPlanet(idx)}
                  className={`w-full text-left p-3.5 rounded-lg text-xs font-semibold border transition-all ${
                    selectedPlanet === idx
                      ? "bg-white/10 border-gold/40 text-gold-light"
                      : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  {item.planet}
                </button>
              ))}
            </div>
          </div>

          {/* Prescriptions Display */}
          <div className="md:col-span-2">
            {selectedPlanet === null ? (
              <div className="glass rounded-xl p-8 border border-white/5 text-center flex flex-col items-center justify-center min-h-[300px]" style={{ color: "var(--text-muted)" }}>
                <ShieldAlert className="w-10 h-10 mb-4 text-gold" />
                <p className="text-sm">Select an affliction placement on the left to read recommended mantras, fasts, and gemstones.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="glass rounded-xl p-6 border border-white/5 space-y-4">
                  <h3 className="text-lg font-bold text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>
                    Remedy Prescription: {MOCK_REMEDIES[selectedPlanet].planet.split(" ")[0]}
                  </h3>
                  
                  {/* Grid details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/5 space-y-1">
                      <span className="font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Gemstone Suggestion</span>
                      <p className="font-semibold text-white">{MOCK_REMEDIES[selectedPlanet].gemstone}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/5 space-y-1">
                      <span className="font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Vedic Mantra</span>
                      <p className="font-semibold text-white italic">{MOCK_REMEDIES[selectedPlanet].mantra}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/5 space-y-1">
                      <span className="font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Donation Charity</span>
                      <p className="font-semibold text-white">{MOCK_REMEDIES[selectedPlanet].donation}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/5 space-y-1">
                      <span className="font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Fasting Vrat</span>
                      <p className="font-semibold text-white">{MOCK_REMEDIES[selectedPlanet].fast}</p>
                    </div>
                  </div>
                </div>

                {/* Warning note */}
                <div className="flex gap-2 p-4 rounded-lg bg-white/5 border border-white/5 text-[11px] text-white/50 leading-relaxed">
                  <Star className="w-4.5 h-4.5 shrink-0 text-gold" fill="var(--gold)" />
                  <span>NOTE: Consult with a professional astrologer before purchasing or wearing high-carat gemstones. Mantra counts should ideally be recited 108 times daily.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
