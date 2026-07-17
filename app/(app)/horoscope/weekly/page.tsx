"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, CalendarDays, Heart, Briefcase, Activity } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { AnimatedCard } from "@/components/shared/animated-card";

export default function WeeklyHoroscopePage() {
  const [activeTab, setActiveTab] = useState<"love" | "career" | "health">("love");

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Link */}
        <Link href="/horoscope" className="inline-flex items-center gap-1.5 text-xs hover:underline mb-8" style={{ color: "var(--text-muted)" }}>
          <ChevronLeft className="w-4 h-4" />
          Back to Signs Catalog
        </Link>

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gradient-gold mb-2" style={{ fontFamily: "var(--font-outfit)" }}>Weekly Forecast</h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Analyze the overarching transits and moon cycles shaping the week.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-white/5 border border-white/5" style={{ color: "var(--text-secondary)" }}>
            <CalendarDays className="w-4.5 h-4.5 text-gold" />
            <span>Jul 18 - Jul 25, 2026</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/5 pb-px mb-6">
          {[
            { id: "love", label: "Love & Romance", icon: Heart },
            { id: "career", label: "Career & Focus", icon: Briefcase },
            { id: "health", label: "Health & Vitality", icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "love" | "career" | "health")}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "border-gold text-gold-light"
                    : "border-transparent text-white/50 hover:text-white"
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Reading Box */}
        <AnimatedCard className="p-8">
          {activeTab === "love" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>Emotional Cycles & Synergy</h3>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                This week&apos;s lunar transit through Cancer fosters emotional depth and domestic warmth. Engage in open dialogues about shared spaces or relationship parameters. A midweek square from Mars advises against reactive defense mechanisms.
              </p>
            </div>
          )}

          {activeTab === "career" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>Professional Momentum</h3>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Mercury in Leo encourages bold expressions and structural audits. Schedule key review boards or project sprint planning during Jupiter&apos;s positive Hora windows. Avoid launching unverified content on Friday&apos;s Saturn ingress.
              </p>
            </div>
          )}

          {activeTab === "health" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>Wellness & Recharge</h3>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Planetary aspects call for balancing high cognitive output with structural rest. Practice breath exercises to mitigate solar plexus tension caused by Mercury-Mars aspects. Warm hydration is favored.
              </p>
            </div>
          )}
        </AnimatedCard>
      </div>
    </PageWrapper>
  );
}
