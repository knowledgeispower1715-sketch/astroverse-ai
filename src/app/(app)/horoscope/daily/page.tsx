"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, ChevronLeft } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { zodiacSigns } from "@/config/astrology";
import type { DailyForecast } from "@/modules/prediction-engine";

function ScoreBar({ score, label }: { score: number; label: string }) {
  const color = score >= 70 ? "bg-green-500" : score >= 50 ? "bg-gold" : "bg-red-500";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
        <span>{label}</span>
        <span className="font-bold" style={{ color: "var(--gold-light)" }}>{score}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10">
        <div className={`h-1.5 rounded-full transition-all duration-700 ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function DailyHoroscopeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeSign, setActiveSignState] = useState(searchParams.get("sign") || "Aries");
  const signName = activeSign;
  const [datePeriod, setDatePeriod] = useState<"yesterday" | "today" | "tomorrow">("today");
  const [forecast, setForecast] = useState<DailyForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const signData = zodiacSigns.find((s) => s.name === signName) || zodiacSigns[0];

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/horoscope?sign=${signName}&period=daily&datePeriod=${datePeriod}`)
      .then(r => r.json())
      .then((json: { data?: DailyForecast; error?: string }) => {
        if (cancelled) return;
        setLoading(false);
        if (json.data) setForecast(json.data);
        else setError(json.error ?? "Failed to load forecast");
      })
      .catch(() => { if (!cancelled) { setLoading(false); setError("Network error."); } });
    return () => { cancelled = true; };
  }, [signName, datePeriod]);

  const handleSignChange = (signName2: string) => {
    router.push(`/horoscope/daily?sign=${signName2}`);
    setActiveSignState(signName2);
  };



  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/horoscope" className="inline-flex items-center gap-1.5 text-xs hover:underline mb-8" style={{ color: "var(--text-muted)" }}>
          <ChevronLeft className="w-4 h-4" />Back to Signs Catalog
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <span className="text-5xl" style={{ color: "var(--gold)" }}>{signData.symbol}</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>{signData.name} Daily Forecast</h1>
              <p className="text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>{signData.dateRange} • Ruler: {signData.ruler}</p>
            </div>
          </div>
          <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/5 w-full md:w-auto">
            {(["yesterday", "today", "tomorrow"] as const).map((period) => (
              <button key={period} onClick={() => setDatePeriod(period)}
                className={`flex-1 md:flex-initial px-4 py-2 text-xs font-semibold rounded-md capitalize transition-all ${datePeriod === period ? "bg-gold text-black shadow-md" : "text-white/60 hover:text-white"}`}>
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sign Selector */}
          <div className="lg:col-span-1 glass rounded-xl p-5 border border-white/5 h-fit max-h-[420px] overflow-y-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Select Sign</h3>
            <div className="space-y-1">
              {zodiacSigns.map((sign) => (
                <button key={sign.name} onClick={() => handleSignChange(sign.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${activeSign === sign.name ? "bg-white/10 text-gold-light" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{sign.symbol}</span>
                    <span>{sign.name}</span>
                  </span>
                  <ChevronLeft className="w-3.5 h-3.5 rotate-180 opacity-50" />
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {loading && (
              <div className="glass rounded-2xl p-12 border border-white/5 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--gold)" }} />
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>Computing planetary alignments…</p>
              </div>
            )}

            {error && !loading && (
              <div className="glass rounded-2xl p-8 border border-red-500/20 flex items-center gap-4">
                <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {forecast && !loading && !error && (
              <>
                {/* Overall score */}
                <div className="glass rounded-2xl p-6 border border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-xs uppercase font-bold mb-1" style={{ color: "var(--text-muted)" }}>Overall</p>
                    <p className="text-2xl font-extrabold text-gradient-gold">{forecast.overall}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase font-bold mb-1" style={{ color: "var(--text-muted)" }}>Mood</p>
                    <p className="text-sm font-semibold text-white">{forecast.mood}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase font-bold mb-1" style={{ color: "var(--text-muted)" }}>Lucky No.</p>
                    <p className="text-2xl font-extrabold text-gradient-gold">{forecast.luckyNumber}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase font-bold mb-1" style={{ color: "var(--text-muted)" }}>Lucky Color</p>
                    <p className="text-sm font-semibold text-white">{forecast.luckyColor}</p>
                  </div>
                </div>

                {/* Score bars */}
                <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
              <ScoreBar score={forecast.love} label="Love & Relationships" />
              <ScoreBar score={forecast.career} label="Career & Work" />
              <ScoreBar score={forecast.health} label="Health & Vitality" />
              <ScoreBar score={forecast.finance} label="Finance & Wealth" />
                </div>

                {/* Guidance */}
                <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
                  <p className="text-xs uppercase font-bold tracking-wider" style={{ color: "var(--text-muted)" }}>Today&apos;s Guidance</p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{forecast.guidance}</p>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-300">{forecast.caution}</p>
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Favorable time window: <span className="font-semibold text-white">{forecast.favorableTime}</span>
                  </div>
                </div>

                {/* Planetary influences */}
                <div className="glass rounded-2xl p-6 border border-white/5">
                  <p className="text-xs uppercase font-bold tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Planetary Influences</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {forecast.planetaryInfluences.map((inf) => (
                      <div key={inf.planet} className="p-3 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-white">{inf.planet} in {inf.sign}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold capitalize ${inf.aspect === "trine" || inf.aspect === "sextile" ? "bg-green-500/20 text-green-400" : inf.aspect === "square" || inf.aspect === "opposition" ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white/50"}`}>
                            {inf.aspect}
                          </span>
                        </div>
                        <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{inf.effect}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-center" style={{ color: "var(--text-muted)" }}>
                  Astrological interpretations are traditional and for entertainment/reflection purposes only.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default function DailyHoroscopePage() {
  return (
    <Suspense fallback={
      <PageWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--gold)" }} />
        </div>
      </PageWrapper>
    }>
      <DailyHoroscopeContent />
    </Suspense>
  );
}
