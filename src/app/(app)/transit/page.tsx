"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import type { TransitPlanet } from "@/modules/prediction-engine";

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂",
  Jupiter: "♃", Saturn: "♄", Rahu: "☊", Ketu: "☋",
};

export default function TransitPage() {
  const [transits, setTransits] = useState<TransitPlanet[]>([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    fetch(`/api/transit?date=${date}`)
      .then(r => r.json())
      .then((json: { data?: TransitPlanet[]; error?: string }) => {
        if (!isCurrent) return;
        setLoading(false);
        if (json.data) setTransits(json.data);
        else setError(json.error ?? "Failed to load transits");
      })
      .catch(() => {
        if (!isCurrent) return;
        setLoading(false);
        setError("Network error. Please try again.");
      });
    return () => { isCurrent = false; };
  }, [date, reloadKey]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    setLoading(true);
    setError(null);
  };

  const speedLabel: Record<string, string> = {
    fast: "Fast", normal: "Normal", slow: "Slow", stationary: "Stationary",
  };

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Planetary Transit Tracker
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Current Vedic sidereal positions (Lahiri ayanamsa) computed from astronomical ephemeris data.
          </p>
        </div>

        {/* Date control */}
        <div className="flex items-center gap-4 mb-8 glass rounded-xl p-4 border border-white/5 max-w-sm">
          <label className="text-xs font-semibold whitespace-nowrap" style={{ color: "var(--text-muted)" }}>Select Date</label>
          <input type="date" value={date} onChange={handleDateChange}
            className="flex-1 h-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm px-3" />
          <Button variant="ghost" onClick={() => setReloadKey(k => k + 1)} disabled={loading}
            className="shrink-0 p-2" style={{ color: "var(--text-muted)" }}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center p-16 gap-4">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--gold)" }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Computing planetary positions…</p>
          </div>
        )}

        {error && !loading && (
          <div className="glass rounded-2xl p-6 border border-red-500/20 flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {!loading && !error && transits.length > 0 && (
          <div className="glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Vedic Sidereal Positions — {new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[11px]" style={{ color: "var(--text-muted)" }}>
                    <th className="px-6 py-3">Planet</th>
                    <th className="px-4 py-3">Sign (Rashi)</th>
                    <th className="px-4 py-3">Degree</th>
                    <th className="px-4 py-3">Motion</th>
                    <th className="px-4 py-3">Speed</th>
                  </tr>
                </thead>
                <tbody style={{ color: "var(--text-secondary)" }}>
                  {transits.map((t) => (
                    <tr key={t.planet} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl" style={{ color: "var(--gold)" }}>{PLANET_SYMBOLS[t.planet] ?? "★"}</span>
                          <span className="font-semibold text-white">{t.planet}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-medium text-white">{t.sign}</td>
                      <td className="px-4 py-4">{t.degree}° {t.minute}&apos;</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${t.retrograde ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}`}>
                          {t.retrograde ? "℞ Retrograde" : "Direct"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-[11px] font-semibold ${t.speedCategory === "fast" ? "text-green-400" : t.speedCategory === "stationary" ? "text-amber-400" : "text-white/60"}`}>
                          {speedLabel[t.speedCategory]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-white/5">
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                Positions calculated using mean planetary theory with Lahiri ayanamsa. Accuracy within 1–2° for most planets.
                For high-precision calculations, Swiss Ephemeris is recommended.
              </p>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
