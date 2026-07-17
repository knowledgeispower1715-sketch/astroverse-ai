"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Calendar, Heart, Briefcase, Activity, ShieldCheck, ChevronLeft, ArrowRight } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { zodiacSigns } from "@/config/astrology";

const MOCK_FORECASTS: Record<string, { love: string; career: string; health: string; finance: string; score: number }> = {
  default: {
    love: "Cosmic alignments favor honest communication today. Share your feelings with a loved one.",
    career: "A minor hurdle might challenge your workflow. Rely on collaboration to resolve it efficiently.",
    health: "Vitality is high, but remember to rest. A simple mindfulness walk will restore emotional focus.",
    finance: "Excellent time to audit budgets. Avoid speculative investments for the next 24 hours.",
    score: 82,
  },
};

export default function DailyHoroscopePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeSign = searchParams.get("sign") || "Aries";

  const [datePeriod, setDatePeriod] = useState<"yesterday" | "today" | "tomorrow">("today");
  const [activeTab, setActiveTab] = useState<"love" | "career" | "health" | "finance">("love");

  const signData = zodiacSigns.find((s) => s.name === activeSign) || zodiacSigns[0];
  const forecast = MOCK_FORECASTS[activeSign.toLowerCase()] || MOCK_FORECASTS.default;

  const handleSignChange = (signName: string) => {
    router.push(`/horoscope/daily?sign=${signName}`);
  };

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Link */}
        <Link href="/horoscope" className="inline-flex items-center gap-1.5 text-xs hover:underline mb-8" style={{ color: "var(--text-muted)" }}>
          <ChevronLeft className="w-4 h-4" />
          Back to Signs Catalog
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <span className="text-5xl" style={{ color: "var(--gold)" }}>{signData.symbol}</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>{signData.name} Daily Forecast</h1>
              <p className="text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>{signData.dateRange} • Ruler: {signData.ruler}</p>
            </div>
          </div>

          {/* Date Selector */}
          <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/5 w-full md:w-auto">
            {(["yesterday", "today", "tomorrow"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setDatePeriod(period)}
                className={`flex-1 md:flex-initial px-4 py-2 text-xs font-semibold rounded-md capitalize transition-all ${
                  datePeriod === period ? "bg-gold text-black shadow-md" : "text-white/60 hover:text-white"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sign Swapper */}
          <div className="lg:col-span-1 glass rounded-xl p-5 border border-white/5 h-fit max-h-[420px] overflow-y-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Select Sign</h3>
            <div className="space-y-1">
              {zodiacSigns.map((sign) => (
                <button
                  key={sign.name}
                  onClick={() => handleSignChange(sign.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    activeSign === sign.name ? "bg-white/10 text-gold-light" : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{sign.symbol}</span>
                    <span>{sign.name}</span>
                  </span>
                  <ChevronLeft className="w-3.5 h-3.5 rotate-180 opacity-50" />
                </button>
              ))}
            </div>
          </div>

          {/* Reading Display */}
          <div className="lg:col-span-3 space-y-6">
            {/* Aspect tabs */}
            <div className="flex gap-2 border-b border-white/5 pb-px overflow-x-auto">
              {[
                { id: "love", label: "Love & Synastry", icon: Heart },
                { id: "career", label: "Career & Work", icon: Briefcase },
                { id: "health", label: "Vitality & Mind", icon: Activity },
                { id: "finance", label: "Finance & Trade", icon: ShieldCheck },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as "love" | "career" | "health" | "finance")}
                    className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "border-gold text-gold-light"
                        : "border-transparent text-white/50 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Reading Box */}
            <div className="glass rounded-2xl p-6 sm:p-8 border border-white/5 space-y-6 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 100% 0%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)" }} />
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider" style={{ color: "var(--text-muted)" }}>Reading Analysis</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: "rgba(212,175,55,0.1)", color: "var(--gold-light)" }}>
                  Cosmic Score: {forecast.score}%
                </span>
              </div>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {forecast[activeTab]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
