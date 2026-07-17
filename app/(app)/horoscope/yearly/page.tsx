import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, BarChart3, TrendingUp, HelpCircle } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { AnimatedCard } from "@/components/shared/animated-card";

export const metadata: Metadata = {
  title: "Yearly Horoscope | AstroVerse AI",
  description: "Read your yearly astrological outlook.",
};

const YEARLY_TRENDS = [
  { area: "Personal Development", score: 88, status: "Peak Progress", desc: "A great year for expansion and learning, governed by Jupiter's favorable transit parameters." },
  { area: "Professional Endeavors", score: 75, status: "Steady Growth", desc: "Saturn demands structure and responsibility. Focus on operational excellence over rapid expansion." },
  { area: "Social Relationships", score: 82, status: "Deep Connections", desc: "Pluto highlights deep, transformative bonds. Muck out superficial alliances." },
];

export default function YearlyHoroscopePage() {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Link */}
        <Link href="/horoscope" className="inline-flex items-center gap-1.5 text-xs hover:underline mb-8" style={{ color: "var(--text-muted)" }}>
          <ChevronLeft className="w-4 h-4" />
          Back to Signs Catalog
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gradient-gold mb-2" style={{ fontFamily: "var(--font-outfit)" }}>2026 Yearly Cosmic Forecast</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Discover the long-term planetary arcs and transit nodes governing your life path for the active year.
          </p>
        </div>

        {/* Trends Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {YEARLY_TRENDS.map((trend, idx) => (
            <AnimatedCard key={idx} delay={idx * 0.1} className="p-6 flex flex-col justify-between border-white/5">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{trend.area}</span>
                  <BarChart3 className="w-4 h-4 text-gold" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white" style={{ fontFamily: "var(--font-outfit)" }}>{trend.status}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{trend.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold" style={{ color: "var(--text-muted)" }}>Yearly Score</span>
                <span className="text-sm font-bold text-gold-light">{trend.score}%</span>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* Summary Card */}
        <div className="glass rounded-xl p-8 border border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-gold">
            <TrendingUp className="w-5 h-5" />
            <h3 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>Cosmic Summary for 2026</h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            2026 is marked by major planetary shifts. Saturn&apos;s transit requests a methodical, disciplined layout for long-term project planning. Jupiter offers expansion in creative sectors, encouraging writing, publishing, and public teaching. Ensure clean documentation across retrogrades.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
