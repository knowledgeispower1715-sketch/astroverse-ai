"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Orbit, Clock } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { AnimatedCard } from "@/components/shared/animated-card";

const HOURLY_TIMELINE = [
  { hour: "08:00 AM", score: 85, energy: "Harmonious", desc: "Venus/Moon Hora. Excellent for creative pitches and social check-ins." },
  { hour: "10:00 AM", score: 72, energy: "Focused", desc: "Mercury Hora. Strong cognitive energy. Focus on code, metrics, or content audits." },
  { hour: "12:00 PM", score: 55, energy: "Intense", desc: "Mars Hora. High potential for direct friction. Step away from reactive discussions." },
  { hour: "02:00 PM", score: 90, energy: "Auspicious", desc: "Jupiter Hora. Highest positive score. Perfect window to sign agreements or pitch plans." },
  { hour: "04:00 PM", score: 64, energy: "Slow", desc: "Saturn Hora. Low momentum. Focus on routine administrative cleanup." },
];

export default function HourlyHoroscopePage() {
  const [selectedHour, setSelectedHour] = useState(0);

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
          <h1 className="text-3xl font-extrabold text-gradient-gold mb-2" style={{ fontFamily: "var(--font-outfit)" }}>Hourly Energy Forecast</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Monitor the hour-by-hour cosmic alignments (Hora cycles) to schedule key meetings, focused sprints, or rest windows.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hour Selectors */}
          <div className="md:col-span-1 space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {HOURLY_TIMELINE.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedHour(idx)}
                className={`w-full flex items-center justify-between p-4 rounded-xl text-left border transition-all ${
                  selectedHour === idx
                    ? "bg-white/10 border-gold/40 text-gold-light"
                    : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-semibold">{item.hour}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(212,175,55,0.1)", color: "var(--gold-light)" }}>
                  {item.score}%
                </span>
              </button>
            ))}
          </div>

          {/* Detailed Hour Display */}
          <div className="md:col-span-2">
            <AnimatedCard className="p-8 h-full flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs uppercase font-bold tracking-wider" style={{ color: "var(--text-muted)" }}>Hourly Alignment Details</span>
                  <div className="flex items-center gap-1 text-xs" style={{ color: "var(--gold-light)" }}>
                    <Orbit className="w-4 h-4 animate-spin-slow" />
                    <span>{HOURLY_TIMELINE[selectedHour].energy}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-white" style={{ fontFamily: "var(--font-outfit)" }}>{HOURLY_TIMELINE[selectedHour].hour}</h2>
                <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                  {HOURLY_TIMELINE[selectedHour].desc}
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-between items-center text-xs" style={{ color: "var(--text-muted)" }}>
                <span>Hora calculations update hourly</span>
                <span>Active Cycle</span>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
