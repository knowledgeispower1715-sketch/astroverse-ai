import type { Metadata } from "next";
import { Sparkles, Gem, Info, Award } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { AnimatedCard } from "@/components/shared/animated-card";

export const metadata: Metadata = {
  title: "Gemstones Advisor | AstroVerse AI",
  description: "Browse recommended gemstones to enhance planetary strengths.",
};

const GEMSTONES_CATALOG = [
  { name: "Ruby (Manik)", planet: "Sun", metal: "Gold / Copper", benefit: "Enhances leadership, authority, vitality, and personal confidence.", color: "from-[#ef4444] to-[#b91c1c]" },
  { name: "Pearl (Moti)", planet: "Moon", metal: "Silver", benefit: "Promotes emotional peace, mental clarity, sleep cycles, and intuition.", color: "from-[#f3f4f6] to-[#d1d5db]" },
  { name: "Emerald (Panna)", planet: "Mercury", metal: "Gold / Silver", benefit: "Boosts cognitive focus, speech articulation, business trade, and analytical memory.", color: "from-[#10b981] to-[#047857]" },
  { name: "Yellow Sapphire (Pukhraj)", planet: "Jupiter", metal: "Gold", benefit: "Attracts wisdom, spiritual alignment, legal success, and prosperity.", color: "from-[#f59e0b] to-[#b45309]" },
  { name: "Diamond (Heera)", planet: "Venus", metal: "White Gold / Platinum", benefit: "Strengthens creative arts, relationship charm, convenience, and luxury.", color: "from-[#38bdf8] to-[#0284c7]" },
  { name: "Red Coral (Moonga)", planet: "Mars", metal: "Copper / Gold", benefit: "Increases physical drive, courage, blood circulation, and competitive spirit.", color: "from-[#f97316] to-[#c2410c]" },
];

export default function GemstonesPage() {
  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Gemstones Advisor
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Browse precious gemstones governed by planetary nodes. Each stone works by absorbing specific cosmic light rays to enhance natal planet strengths.
          </p>
        </div>

        {/* Catalog grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {GEMSTONES_CATALOG.map((gem, index) => (
            <AnimatedCard key={gem.name} delay={index * 0.05} className="p-6 sm:p-8 flex flex-col justify-between border-white/5">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br text-white`} style={{ boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}>
                    <Gem className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>{gem.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: "var(--gold)" }}>Ruler: {gem.planet}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs mb-6" style={{ color: "var(--text-secondary)" }}>
                  <p>
                    <span className="font-semibold text-white block mb-0.5">Compatible Metal:</span>
                    {gem.metal}
                  </p>
                  <p>
                    <span className="font-semibold text-white block mb-0.5">Metaphysical Benefits:</span>
                    {gem.benefit}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-bold" style={{ color: "var(--text-muted)" }}>
                <span>Vedic Astrology</span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} />
                  High Premium
                </span>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
