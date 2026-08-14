"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Clock, Loader2, AlertCircle } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { zodiacSigns } from "@/config/astrology";
import type { HourlySlot } from "@/modules/prediction-engine";

function getEnergyColor(score: number): string {
  if (score >= 75) return "text-green-400";
  if (score >= 55) return "text-gold-light";
  return "text-red-400";
}

function HourlyContent() {
  const searchParams = useSearchParams();
  const activeSign = searchParams.get("sign") || "Aries";
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());
  const [slots, setSlots] = useState<HourlySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedSign, setSelectedSign] = useState(activeSign);

  useEffect(() => {
    let active = true;
    fetch(`/api/hourly?sign=${selectedSign}&date=${selectedDate}`)
      .then(r => r.json())
      .then((json: { data?: HourlySlot[]; error?: string }) => {
        if (!active) return;
        setLoading(false);
        if (json.data) setSlots(json.data);
        else setError(json.error ?? "Failed to load hourly forecast");
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
        setError("Network error. Please try again.");
      });
    return () => { active = false; };
  }, [selectedSign, selectedDate]);

  const currentSlot = slots[selectedHour];

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/horoscope" className="inline-flex items-center gap-1.5 text-xs hover:underline mb-8" style={{ color: "var(--text-muted)" }}>
          <ChevronLeft className="w-4 h-4" />Back to Signs Catalog
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gradient-gold mb-2" style={{ fontFamily: "var(--font-outfit)" }}>Hourly Energy Forecast</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Based on Vedic Hora (planetary hour) system. Each hour is ruled by a different planet creating distinct energy patterns.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8 glass rounded-xl p-4 border border-white/5">
          <div className="flex-1 min-w-[140px] space-y-1">
            <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Zodiac Sign</label>
            <select value={selectedSign} onChange={e => setSelectedSign(e.target.value)}
              className="w-full h-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm px-3">
              {zodiacSigns.map(s => <option key={s.name} value={s.name} className="bg-gray-900">{s.name}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[140px] space-y-1">
            <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Date</label>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              className="w-full h-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm px-3" />
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center p-16 gap-4">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--gold)" }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Computing Hora cycles…</p>
          </div>
        )}

        {error && !loading && (
          <div className="glass rounded-2xl p-8 border border-red-500/20 flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {!loading && !error && slots.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hour scroll list */}
            <div className="md:col-span-1 glass rounded-xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>24-Hour Timeline</p>
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                {slots.map((slot) => (
                  <button key={slot.hour} onClick={() => setSelectedHour(slot.hour)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left border-b border-white/5 transition-colors ${selectedHour === slot.hour ? "bg-white/10 border-l-2 border-l-gold" : "hover:bg-white/5"}`}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
                      <span className="text-xs font-semibold text-white">{slot.label}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold ${getEnergyColor(slot.score)}`}>{slot.score}%</span>
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{slot.horaPlanet}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Detail panel */}
            <div className="md:col-span-2 space-y-4">
              {currentSlot && (
                <>
                  <div className="glass rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>{currentSlot.label}</h2>
                        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Hora Ruler: <span className="font-semibold text-white">{currentSlot.horaPlanet}</span></p>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-extrabold ${getEnergyColor(currentSlot.score)}`}>{currentSlot.score}%</div>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{currentSlot.energy}</p>
                      </div>
                    </div>

                    {/* Sub-scores */}
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: "Career", score: currentSlot.career },
                        { label: "Love", score: currentSlot.love },
                        { label: "Health", score: currentSlot.health },
                        { label: "Finance", score: currentSlot.finance },
                      ].map(({ label, score }) => (
                        <div key={label} className="text-center p-3 rounded-lg bg-white/5">
                          <p className="text-[10px] font-bold uppercase mb-1" style={{ color: "var(--text-muted)" }}>{label}</p>
                          <p className={`text-lg font-bold ${getEnergyColor(score)}`}>{score}%</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
                    <div>
                      <p className="text-xs font-bold uppercase mb-2" style={{ color: "var(--text-muted)" }}>Best Activities</p>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{currentSlot.suitable}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase mb-2" style={{ color: "var(--text-muted)" }}>Focus Task</p>
                      <p className="text-sm font-semibold text-white">{currentSlot.focus}</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-300">Avoid: {currentSlot.avoid}</p>
                    </div>
                  </div>
                </>
              )}

              <p className="text-[10px] text-center" style={{ color: "var(--text-muted)" }}>
                Hora calculations are based on Vedic planetary hours and are interpretive in nature.
              </p>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

export default function HourlyHoroscopePage() {
  return (
    <Suspense fallback={
      <PageWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--gold)" }} />
        </div>
      </PageWrapper>
    }>
      <HourlyContent />
    </Suspense>
  );
}
