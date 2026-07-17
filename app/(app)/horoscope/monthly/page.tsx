import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Info, CalendarDays } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { AnimatedCard } from "@/components/shared/animated-card";

export const metadata: Metadata = {
  title: "Monthly Horoscope | AstroVerse AI",
  description: "Read your monthly astrological outlook.",
};

const MONTHLY_TRANSITS = [
  { date: "July 22, 2026", title: "Sun enters Leo", desc: "Initiates a season of high creativity, leadership expression, and self-confidence." },
  { date: "July 24, 2026", title: "Mercury retrogrades in Leo", desc: "Advises careful contract reviews and clear, patient team discussions." },
  { date: "July 28, 2026", title: "Venus conjuncts Mars in Virgo", desc: "Fosters analytical collaboration and meticulous refinement of creative works." },
];

export default function MonthlyHoroscopePage() {
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
          <h1 className="text-3xl font-extrabold text-gradient-gold mb-2" style={{ fontFamily: "var(--font-outfit)" }}>Monthly Astrological Outlook</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            A comprehensive mapping of long-term planetary movements and transit ingresses for the active month.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Outlook content */}
          <div className="md:col-span-2 space-y-6">
            <AnimatedCard className="p-8">
              <h2 className="text-xl font-bold mb-4 text-white" style={{ fontFamily: "var(--font-outfit)" }}>General Energy Dynamics</h2>
              <p className="text-sm sm:text-base leading-relaxed text-white/80" style={{ color: "var(--text-secondary)" }}>
                July 2026 presents a transition from emotional water signs into self-expressive fire placements. As the Sun transitions to Leo, active creation and leadership take focus. However, Mercury&apos;s retrograde on July 24 demands caution. Audit plans before launching new ventures.
              </p>
            </AnimatedCard>
          </div>

          {/* Key Transit Dates list */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Key Transit Dates</h3>
            {MONTHLY_TRANSITS.map((item, idx) => (
              <div key={idx} className="glass rounded-xl p-4 border border-white/5 space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gold">
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
