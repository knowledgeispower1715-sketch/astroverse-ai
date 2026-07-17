"use client";

import { useState } from "react";
import { Sparkles, HelpCircle, Layers, RefreshCw } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { AnimatedCard } from "@/components/shared/animated-card";

const MOCK_CARDS = [
  { name: "The Magician", position: "Past", meaning: "Manifestation, resourcefulness, power, inspired action." },
  { name: "The High Priestess", position: "Present", meaning: "Intuition, sacred knowledge, divine feminine, subconscious mind." },
  { name: "The Empress", position: "Future", meaning: "Femininity, beauty, nature, nurturing, abundance." },
];

export default function TarotPage() {
  const [status, setStatus] = useState<"idle" | "drawing" | "drawn">("idle");

  const handleDraw = () => {
    setStatus("drawing");
    setTimeout(() => {
      setStatus("drawn");
    }, 1500);
  };

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            AI Tarot Integration
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Draw three cards to construct a Past, Present, and Future spread aligned with your active planetary transit cycles.
          </p>
        </div>

        {status === "idle" && (
          <div className="text-center max-w-md mx-auto py-12 glass rounded-2xl border border-white/5 space-y-6">
            <Layers className="w-16 h-16 mx-auto text-gold animate-bounce" />
            <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>Three-Card Spread</h3>
            <p className="text-xs px-6" style={{ color: "var(--text-secondary)" }}>Focus on your query before shuffling and drawing the cards from the deck.</p>
            <Button onClick={handleDraw} className="rounded-lg h-12 px-10 text-sm font-semibold cursor-pointer" style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}>
              Shuffle & Draw Cards
            </Button>
          </div>
        )}

        {status === "drawing" && (
          <div className="text-center py-16">
            <RefreshCw className="w-10 h-10 animate-spin text-gold mx-auto mb-4" />
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Drawing cards from the deck...</p>
          </div>
        )}

        {status === "drawn" && (
          <div className="space-y-8 animate-fade-in">
            {/* Cards Spread */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_CARDS.map((card, idx) => (
                <AnimatedCard key={idx} delay={idx * 0.1} className="p-6 text-center border-white/5">
                  <span className="text-xs font-bold uppercase tracking-wider block mb-4" style={{ color: "var(--text-muted)" }}>{card.position}</span>
                  <div className="w-24 h-36 bg-gradient-to-br from-[#1a1a3e] to-[#0a0a1a] border border-gold/30 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Sparkles className="w-8 h-8 text-gold/50" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "var(--font-outfit)" }}>{card.name}</h3>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{card.meaning}</p>
                </AnimatedCard>
              ))}
            </div>

            {/* Reset */}
            <div className="text-center pt-6">
              <Button onClick={() => setStatus("idle")} variant="ghost" className="text-xs gap-1.5" style={{ color: "var(--text-muted)" }}>
                <RefreshCw className="w-3.5 h-3.5" />
                Draw Another Spread
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
