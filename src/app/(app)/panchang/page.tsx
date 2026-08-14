"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Loader2, AlertCircle, MapPin, RefreshCw } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PanchangData } from "@/modules/prediction-engine";

const CITY_COORDS: Record<string, { lat: number; lon: number; tz: number; label: string }> = {
  delhi: { lat: 28.6139, lon: 77.209, tz: 5.5, label: "New Delhi, India" },
  mumbai: { lat: 19.076, lon: 72.8777, tz: 5.5, label: "Mumbai, India" },
  kolkata: { lat: 22.5726, lon: 88.3639, tz: 5.5, label: "Kolkata, India" },
  chennai: { lat: 13.0827, lon: 80.2707, tz: 5.5, label: "Chennai, India" },
  bangalore: { lat: 12.9716, lon: 77.5946, tz: 5.5, label: "Bengaluru, India" },
  hyderabad: { lat: 17.385, lon: 78.4867, tz: 5.5, label: "Hyderabad, India" },
  jabalpur: { lat: 23.1765, lon: 79.9554, tz: 5.5, label: "Jabalpur, India" },
  london: { lat: 51.5074, lon: -0.1278, tz: 1, label: "London, UK" },
  newyork: { lat: 40.7128, lon: -74.006, tz: -4, label: "New York, USA" },
  dubai: { lat: 25.2048, lon: 55.2708, tz: 4, label: "Dubai, UAE" },
  singapore: { lat: 1.3521, lon: 103.8198, tz: 8, label: "Singapore" },
  sydney: { lat: -33.8688, lon: 151.2093, tz: 10, label: "Sydney, Australia" },
};

export default function PanchangPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [lat, setLat] = useState("23.1765");
  const [lon, setLon] = useState("79.9554");
  const [tz, setTz] = useState("5.5");
  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    fetch(`/api/panchang?date=${date}&lat=${lat}&lon=${lon}&tz=${tz}`)
      .then(r => r.json())
      .then(json => {
        if (!active) return;
        setLoading(false);
        if (json.data) setPanchang(json.data as PanchangData);
        else setError((json.error as string) ?? "Failed to compute Panchang");
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
        setError("Network error. Please try again.");
      });
    return () => { active = false; };
  }, [date, lat, lon, tz, reloadKey]);

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    const city = CITY_COORDS[key];
    if (city) {
      setLat(String(city.lat));
      setLon(String(city.lon));
      setTz(String(city.tz));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setReloadKey(k => k + 1);
  };

  const qualityColor = (q: string) =>
    q === "auspicious" ? "text-green-400" : q === "inauspicious" ? "text-red-400" : "text-white/70";

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Daily Vedic Panchang
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Computed from actual planetary positions for your date and location.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 border border-white/5 space-y-4 mb-8 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Date</label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="h-10 bg-white/5 border-white/10 text-white rounded-lg" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>City (Quick Select)</label>
              <select onChange={handleCitySelect} className="w-full h-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm px-3">
                {Object.entries(CITY_COORDS).map(([key, c]) => (
                  <option key={key} value={key} className="bg-gray-900">{c.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Latitude</label>
              <Input type="number" step="0.0001" value={lat} onChange={e => setLat(e.target.value)}
                className="h-10 bg-white/5 border-white/10 text-white rounded-lg" placeholder="e.g. 23.1765" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Longitude</label>
              <Input type="number" step="0.0001" value={lon} onChange={e => setLon(e.target.value)}
                className="h-10 bg-white/5 border-white/10 text-white rounded-lg" placeholder="e.g. 79.9554" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Timezone Offset (hours)</label>
              <Input type="number" step="0.5" value={tz} onChange={e => setTz(e.target.value)}
                className="h-10 bg-white/5 border-white/10 text-white rounded-lg" placeholder="e.g. 5.5" />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={loading} className="w-full h-10 rounded-lg text-xs font-bold cursor-pointer" style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}>
                {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Computing…</> : "Compute Panchang"}
              </Button>
            </div>
          </div>
        </form>

        {loading && !panchang && (
          <div className="flex flex-col items-center justify-center p-16 gap-4">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--gold)" }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Calculating from planetary positions…</p>
          </div>
        )}

        {error && (
          <div className="glass rounded-2xl p-6 border border-red-500/20 flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {panchang && !loading && (
          <div className="space-y-4">
            {/* Date / header */}
            <div className="glass rounded-2xl p-4 border border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase font-bold" style={{ color: "var(--text-muted)" }}>Date</p>
                <p className="text-lg font-bold text-white">{new Date(panchang.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
              <div className="flex gap-3">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold" style={{ color: "var(--text-muted)" }}>Sunrise</p>
                  <p className="text-sm font-bold text-white">{panchang.sunrise}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold" style={{ color: "var(--text-muted)" }}>Sunset</p>
                  <p className="text-sm font-bold text-white">{panchang.sunset}</p>
                </div>
              </div>
              {panchang.isMuhurta && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                  ✓ Auspicious Muhurta
                </span>
              )}
            </div>

            {/* 5 elements grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Tithi (Lunar Day)", value: panchang.tithi, sub: `Day ${panchang.lunarDay} of lunar month` },
                { label: "Vara (Day of Week)", value: panchang.vara, sub: `Ruler: ${panchang.varaPlanet}` },
                { label: "Nakshatra (Moon Mansion)", value: panchang.nakshatra, sub: `Ruler: ${panchang.nakshatraRuler}` },
                { label: "Yoga (Luni-Solar)", value: panchang.yoga, sub: <span className={`font-semibold ${qualityColor(panchang.yogaQuality)}`}>{panchang.yogaQuality}</span> },
                { label: "Karana (Half-Tithi)", value: panchang.karana, sub: "Half of current Tithi" },
                { label: "Moon Sign / Sun Sign", value: `${panchang.moonSign} / ${panchang.sunSign}`, sub: "Vedic sidereal positions" },
              ].map((el) => (
                <div key={el.label} className="glass rounded-xl p-5 border border-white/5 space-y-1 relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 100% 0%, rgba(212,175,55,0.03) 0%, transparent 50%)" }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: "var(--text-muted)" }}>{el.label}</span>
                  <h3 className="text-lg font-bold text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>{el.value}</h3>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{el.sub}</p>
                </div>
              ))}
            </div>

            {/* Inauspicious times */}
            <div className="glass rounded-xl p-5 border border-red-500/10">
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Inauspicious Time Periods</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "Rahu Kalam", time: panchang.rahuKalam },
                  { label: "Yamaganda", time: panchang.yamaganda },
                  { label: "Gulika Kalam", time: panchang.gulikaKalam },
                ].map(({ label, time }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/10">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-red-400">{label}</p>
                      <p className="text-xs text-white">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-center" style={{ color: "var(--text-muted)" }}>
              Panchang calculations are based on astronomical positions. Times are approximate. Traditional astrological content for reflection purposes.
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
