"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, Download, Save, Orbit, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// City quick-select with known coordinates
const CITIES: Record<string, { lat: number; lon: number; tz: string; label: string }> = {
  delhi: { lat: 28.6139, lon: 77.209, tz: "Asia/Kolkata", label: "New Delhi, India" },
  mumbai: { lat: 19.076, lon: 72.8777, tz: "Asia/Kolkata", label: "Mumbai, India" },
  kolkata: { lat: 22.5726, lon: 88.3639, tz: "Asia/Kolkata", label: "Kolkata, India" },
  chennai: { lat: 13.0827, lon: 80.2707, tz: "Asia/Kolkata", label: "Chennai, India" },
  bangalore: { lat: 12.9716, lon: 77.5946, tz: "Asia/Kolkata", label: "Bengaluru, India" },
  hyderabad: { lat: 17.385, lon: 78.4867, tz: "Asia/Kolkata", label: "Hyderabad, India" },
  london: { lat: 51.5074, lon: -0.1278, tz: "Europe/London", label: "London, UK" },
  newyork: { lat: 40.7128, lon: -74.006, tz: "America/New_York", label: "New York, USA" },
  dubai: { lat: 25.2048, lon: 55.2708, tz: "Asia/Dubai", label: "Dubai, UAE" },
  singapore: { lat: 1.3521, lon: 103.8198, tz: "Asia/Singapore", label: "Singapore" },
  sydney: { lat: -33.8688, lon: 151.2093, tz: "Australia/Sydney", label: "Sydney, Australia" },
};

interface PlanetRow {
  planet: string;
  sign: string;
  degree: number;
  minute: number;
  house: number;
  retrograde: boolean;
}

interface ChartResult {
  positions: PlanetRow[];
  ascendant: { sign: string; degree: number };
  midheaven: { sign: string; degree: number };
  houses: { house: number; sign: string; degree: number; minute: number }[];
}

export default function BirthChartPage() {
  const [formData, setFormData] = useState({ name: "", dob: "", time: "", lat: "28.6139", lon: "77.2090", tz: "Asia/Kolkata" });
  const [city, setCity] = useState("delhi");
  const [system, setSystem] = useState("vedic");
  const [houseSystem, setHouseSystem] = useState("whole-sign");
  const [status, setStatus] = useState<"idle" | "loading" | "calculated" | "error">("idle");
  const [result, setResult] = useState<ChartResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState(false);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const c = CITIES[e.target.value];
    if (c) {
      setCity(e.target.value);
      setFormData(f => ({ ...f, lat: String(c.lat), lon: String(c.lon), tz: c.tz }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.dob || !formData.time) return;

    setStatus("loading");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/birth-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate: formData.dob,
          birthTime: formData.time,
          latitude: parseFloat(formData.lat),
          longitude: parseFloat(formData.lon),
          timezone: formData.tz,
          system,
          houseSystem,
        }),
      });
      const json = await res.json() as { data?: ChartResult; error?: string };
      if (json.data) {
        setResult(json.data);
        setStatus("calculated");
      } else {
        setErrorMsg(json.error ?? "Chart calculation failed");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Birth Chart Calculator
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Enter your birth details to generate your natal chart with real planetary positions.
          </p>
        </div>

        {status !== "calculated" && (
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 border border-white/5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Full Name *</label>
                <Input type="text" placeholder="Enter name" value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Date of Birth *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
                    <Input type="date" value={formData.dob}
                      onChange={e => setFormData({ ...formData, dob: e.target.value })}
                      className="h-12 pl-9 bg-white/5 border-white/10 text-white rounded-lg" required />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Time of Birth *</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
                    <Input type="time" value={formData.time}
                      onChange={e => setFormData({ ...formData, time: e.target.value })}
                      className="h-12 pl-9 bg-white/5 border-white/10 text-white rounded-lg" required />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>City (Quick Select)</label>
                <select value={city} onChange={handleCityChange}
                  className="w-full h-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm px-3">
                  {Object.entries(CITIES).map(([k, c]) => (
                    <option key={k} value={k} className="bg-gray-900">{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Latitude</label>
                  <Input type="number" step="0.0001" value={formData.lat}
                    onChange={e => setFormData({ ...formData, lat: e.target.value })}
                    className="h-10 bg-white/5 border-white/10 text-white rounded-lg" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Longitude</label>
                  <Input type="number" step="0.0001" value={formData.lon}
                    onChange={e => setFormData({ ...formData, lon: e.target.value })}
                    className="h-10 bg-white/5 border-white/10 text-white rounded-lg" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>System</label>
                  <select value={system} onChange={e => setSystem(e.target.value)}
                    className="w-full h-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm px-3">
                    <option value="vedic" className="bg-gray-900">Vedic (Sidereal / Lahiri)</option>
                    <option value="western" className="bg-gray-900">Western (Tropical)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>House System</label>
                  <select value={houseSystem} onChange={e => setHouseSystem(e.target.value)}
                    className="w-full h-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm px-3">
                    <option value="whole-sign" className="bg-gray-900">Whole Sign</option>
                    <option value="placidus" className="bg-gray-900">Placidus</option>
                    <option value="equal" className="bg-gray-900">Equal House</option>
                    <option value="koch" className="bg-gray-900">Koch</option>
                  </select>
                </div>
              </div>

              {status === "error" && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-xs text-red-300">{errorMsg}</p>
                </div>
              )}

              <Button type="submit" disabled={status === "loading"}
                className="w-full h-12 rounded-lg text-sm font-semibold gap-2 cursor-pointer"
                style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}>
                {status === "loading" ? <><Loader2 className="w-4 h-4 animate-spin" />Calculating planetary positions…</> : "Generate Birth Chart"}
              </Button>
            </form>
          </div>
        )}

        {status === "calculated" && result && (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 glass rounded-2xl border border-white/5">
              <div>
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>{formData.name}&apos;s {system === "vedic" ? "Vedic" : "Western"} Chart</h2>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {formData.dob} at {formData.time} · {CITIES[city]?.label ?? "Custom Location"}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  Ascendant: <strong className="text-white">{result.ascendant.sign} {result.ascendant.degree}°</strong>
                  {" · "}Midheaven: <strong className="text-white">{result.midheaven.sign} {result.midheaven.degree}°</strong>
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={() => setSaveStatus(true)} variant="outline"
                  className="flex-1 sm:flex-none text-xs gap-1.5 h-10 border-white/10 hover:border-gold/30">
                  <Save className="w-4 h-4" />{saveStatus ? "Saved ✓" : "Save Chart"}
                </Button>
                <Button onClick={() => window.print()}
                  className="flex-1 sm:flex-none text-xs gap-1.5 h-10" style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}>
                  <Download className="w-4 h-4" />Export PDF
                </Button>
              </div>
            </div>

            {/* Placements */}
            <div className="glass rounded-2xl border border-white/5 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Planetary Placements</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-[11px]" style={{ color: "var(--text-muted)" }}>
                      <th className="px-6 py-3">Planet</th>
                      <th className="px-4 py-3">Sign (Rashi)</th>
                      <th className="px-4 py-3">Degree</th>
                      <th className="px-4 py-3">House</th>
                      <th className="px-4 py-3">Motion</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "var(--text-secondary)" }}>
                    {result.positions.map((pos) => (
                      <tr key={pos.planet} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-3 font-semibold text-white">{pos.planet}</td>
                        <td className="px-4 py-3">{pos.sign}</td>
                        <td className="px-4 py-3">{pos.degree}° {pos.minute}&apos;</td>
                        <td className="px-4 py-3">House {pos.house}</td>
                        <td className="px-4 py-3">
                          {pos.retrograde ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">℞ Retro</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">Direct</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Houses */}
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>House Cusps</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {result.houses.map((h) => (
                  <div key={h.house} className="text-center p-3 rounded-lg bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold uppercase" style={{ color: "var(--text-muted)" }}>House {h.house}</p>
                    <p className="text-sm font-bold text-white mt-1">{h.sign}</p>
                    <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{h.degree}° {h.minute}&apos;</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={() => { setStatus("idle"); setResult(null); setSaveStatus(false); }} variant="ghost"
                className="text-xs gap-1.5" style={{ color: "var(--text-muted)" }}>
                <RefreshCw className="w-3.5 h-3.5" />Generate Another Chart
              </Button>
            </div>

            <p className="text-[10px] text-center" style={{ color: "var(--text-muted)" }}>
              Positions calculated using mean planetary theory with Lahiri ayanamsa for Vedic / tropical for Western.
              Traditional astrological content for reflection purposes.
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
