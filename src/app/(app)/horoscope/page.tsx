"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Sun, Calendar } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { AnimatedCard } from "@/components/shared/animated-card";
import { Button } from "@/components/ui/button";
import { zodiacSigns } from "@/config/astrology";

const FORECAST_PERIODS = [
  { href: "/horoscope/daily", label: "Daily Horoscope", desc: "Your personal forecast for the day." },
  { href: "/horoscope/hourly", label: "Hourly Timeline", desc: "Track hourly cosmic energy shifts." },
  { href: "/horoscope/weekly", label: "Weekly Guide", desc: "Plan ahead with weekly alignments." },
  { href: "/horoscope/monthly", label: "Monthly Outlook", desc: "Longer-term celestial predictions." },
  { href: "/horoscope/yearly", label: "Yearly Trends", desc: "Overview of key retrogrades and transits." },
];

export default function HoroscopePage() {
  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12 sm:mb-16">
          <h1
            className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-4"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Cosmic Horoscopes
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Select your zodiac sign to read daily forecast reports, or choose a period index below to explore detailed timelines.
          </p>
        </div>

        {/* Forecast Periods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {FORECAST_PERIODS.map((period, idx) => (
            <Link href={period.href} key={idx} className="block group">
              <div className="glass rounded-xl p-5 border border-white/5 h-full hover:border-gold/30 hover:shadow-lg transition-all duration-300">
                <h3 className="font-bold text-sm text-gradient-gold mb-1" style={{ fontFamily: "var(--font-outfit)" }}>{period.label}</h3>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{period.desc}</p>
                <div className="mt-4 flex items-center justify-between text-[10px] uppercase font-bold text-white/40 group-hover:text-gold-light transition-colors">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Zodiac Signs List */}
        <h2 className="text-lg font-bold mb-6 text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>Zodiac Sign Catalog</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {zodiacSigns.map((sign, index) => (
            <Link href={`/horoscope/daily?sign=${sign.name}`} key={sign.name} className="block group">
              <AnimatedCard
                delay={index * 0.03}
                glowColor={index % 2 === 0 ? "gold" : "purple"}
                className="p-6 text-center cursor-pointer border-white/5 group-hover:border-gold/30"
              >
                <span className="text-4xl sm:text-5xl block mb-3 animate-pulse" style={{ color: "var(--gold)" }}>{sign.symbol}</span>
                <h3 className="text-lg font-bold mb-1 text-white group-hover:text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>{sign.name}</h3>
                <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>{sign.dateRange}</p>
                <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-white/50 group-hover:text-gold-light transition-colors">
                  <span>Daily Forecast</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </AnimatedCard>
            </Link>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
