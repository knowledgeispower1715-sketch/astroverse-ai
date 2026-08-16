"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Save, Loader2, AlertCircle, RefreshCw, Compass } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlobalLocationPicker } from "@/components/location/global-location-picker";
import { createClient } from "@/lib/supabase/client";

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
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    time: "12:00",
    birthPlace: "",
    country: "",
    lat: 28.6139,
    lon: 77.2090,
    tz: "Asia/Kolkata",
  });
  const [system, setSystem] = useState("vedic");
  const [houseSystem, setHouseSystem] = useState("whole-sign");
  const [status, setStatus] = useState<"idle" | "loading" | "calculated" | "error">("idle");
  const [result, setResult] = useState<ChartResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState(false);

  // Auto-prefill from primary birth profile
  useEffect(() => {
    async function loadPrimaryProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("birth_profiles")
            .select("*")
            .eq("user_id", user.id)
            .order("is_primary", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (profile && profile.date_of_birth) {
            setFormData({
              name: profile.name || user.user_metadata?.name || "Self",
              dob: profile.date_of_birth,
              time: profile.time_of_birth ? profile.time_of_birth.slice(0, 5) : "12:00",
              birthPlace: profile.birth_place || "",
              country: profile.country || "",
              lat: Number(profile.latitude) || 28.6139,
              lon: Number(profile.longitude) || 77.2090,
              tz: profile.timezone || "Asia/Kolkata",
            });
          }
        }
      } catch (err) {
        console.error("Error loading primary profile for birth chart:", err);
      }
    }
    loadPrimaryProfile();
  }, []);

  const calculateChart = async (overrideData?: typeof formData) => {
    const data = overrideData || formData;
    if (!data.name.trim() || !data.dob || !data.time) return;

    setStatus("loading");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/birth-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate: data.dob,
          birthTime: data.time,
          latitude: data.lat,
          longitude: data.lon,
          timezone: data.tz,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateChart();
  };

  return (
    <PageWrapper title="Birth Chart Calculator | AstroVerse AI" description="Generate your authentic natal birth chart with astronomical planetary positions.">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Birth Chart Calculator
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Enter your birth details to generate your authentic natal chart with high-precision planetary positions and house cusps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="glass rounded-2xl p-6 sm:p-8 border border-white/5 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-outfit)" }}>
              <Compass className="w-5 h-5 text-gold" />
              Birth Blueprint
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Full Name</label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. User Name"
                  className="h-10 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Date of Birth</label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <Input
                      type="date"
                      value={formData.dob}
                      onChange={e => setFormData(f => ({ ...f, dob: e.target.value }))}
                      className="h-10 pl-8 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Time of Birth</label>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={e => setFormData(f => ({ ...f, time: e.target.value }))}
                      className="h-10 pl-8 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50 text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Global Location Picker */}
              <GlobalLocationPicker
                value={{
                  birthPlace: formData.birthPlace,
                  country: formData.country,
                  latitude: formData.lat,
                  longitude: formData.lon,
                  timezone: formData.tz,
                }}
                onChange={(loc) => {
                  setFormData((prev) => ({
                    ...prev,
                    birthPlace: loc.birthPlace,
                    country: loc.country,
                    lat: loc.latitude,
                    lon: loc.longitude,
                    tz: loc.timezone,
                  }));
                }}
              />

              {/* Calculation Options */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Zodiac System</label>
                  <select
                    value={system}
                    onChange={e => setSystem(e.target.value)}
                    className="w-full h-10 bg-white/5 border border-white/10 text-white rounded-lg px-2 text-xs focus:outline-none focus:border-gold/50"
                  >
                    <option value="vedic" className="bg-black text-white">Vedic (Sidereal)</option>
                    <option value="western" className="bg-black text-white">Western (Tropical)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>House System</label>
                  <select
                    value={houseSystem}
                    onChange={e => setHouseSystem(e.target.value)}
                    className="w-full h-10 bg-white/5 border border-white/10 text-white rounded-lg px-2 text-xs focus:outline-none focus:border-gold/50"
                  >
                    <option value="whole-sign" className="bg-black text-white">Whole Sign</option>
                    <option value="placidus" className="bg-black text-white">Placidus</option>
                    <option value="equal-house" className="bg-black text-white">Equal House</option>
                  </select>
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full h-11 rounded-lg text-xs font-semibold gap-2 cursor-pointer mt-2"
                style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Calculating Celestial Chart...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Generate Birth Chart
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-2 space-y-6">
            {status === "idle" && (
              <div className="glass rounded-2xl p-12 border border-white/5 text-center space-y-3">
                <Compass className="w-10 h-10 text-gold/40 mx-auto" />
                <h3 className="text-base font-bold text-white">Ready for Calculation</h3>
                <p className="text-xs text-white/50 max-w-sm mx-auto">
                  Confirm your birth coordinates and click Generate Birth Chart to calculate your planetary placements.
                </p>
              </div>
            )}

            {status === "loading" && (
              <div className="glass rounded-2xl p-16 border border-white/5 text-center space-y-4">
                <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" />
                <p className="text-sm font-semibold text-white">Computing astronomical ephemeris...</p>
                <p className="text-xs text-white/40">Calculating Sidereal Lagna, Lahiri Ayanamsa, and Bhava cusps.</p>
              </div>
            )}

            {status === "calculated" && result && (
              <div className="space-y-6 animate-fade-in">
                {/* Summary badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="glass rounded-xl p-3 border border-white/5 text-center">
                    <span className="text-[10px] uppercase font-bold text-white/40 block">Ascendant (Lagna)</span>
                    <span className="text-sm font-bold text-gold-light">{result.ascendant?.sign} {result.ascendant?.degree?.toFixed(1)}°</span>
                  </div>
                  <div className="glass rounded-xl p-3 border border-white/5 text-center">
                    <span className="text-[10px] uppercase font-bold text-white/40 block">Midheaven (MC)</span>
                    <span className="text-sm font-bold text-purple-light">{result.midheaven?.sign} {result.midheaven?.degree?.toFixed(1)}°</span>
                  </div>
                  <div className="glass rounded-xl p-3 border border-white/5 text-center col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase font-bold text-white/40 block">Zodiac System</span>
                    <span className="text-sm font-bold text-white capitalize">{system} • {houseSystem}</span>
                  </div>
                </div>

                {/* Planetary Positions Table */}
                <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                      Planetary Placements & Houses
                    </h3>
                    <Button
                      onClick={() => setSaveStatus(true)}
                      variant="outline"
                      size="sm"
                      className="text-xs border-gold/30 text-gold-light hover:bg-gold/10 gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {saveStatus ? "Saved to Profile" : "Save Chart"}
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-white/40 text-left">
                          <th className="py-2.5 px-3 font-semibold">Planet</th>
                          <th className="py-2.5 px-3 font-semibold">Zodiac Sign</th>
                          <th className="py-2.5 px-3 font-semibold">Degrees</th>
                          <th className="py-2.5 px-3 font-semibold">Bhava (House)</th>
                          <th className="py-2.5 px-3 font-semibold">Motion</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-white/80">
                        {result.positions?.map((p, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-white">{p.planet}</td>
                            <td className="py-2.5 px-3 text-gold-light font-medium">{p.sign}</td>
                            <td className="py-2.5 px-3 font-mono">{p.degree}° {p.minute}&apos;</td>
                            <td className="py-2.5 px-3">House {p.house}</td>
                            <td className="py-2.5 px-3">
                              {p.retrograde ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                                  Retrograde (R)
                                </span>
                              ) : (
                                <span className="text-[10px] text-white/40">Direct</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 12 Houses Table */}
                {result.houses && (
                  <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                      12 Bhava (House Cusps)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {result.houses.map((h) => (
                        <div key={h.house} className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                          <span className="text-[10px] text-white/40 block">House {h.house}</span>
                          <span className="text-xs font-bold text-white block mt-0.5">{h.sign}</span>
                          <span className="text-[10px] text-white/50 font-mono">{h.degree}° {h.minute}&apos;</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
