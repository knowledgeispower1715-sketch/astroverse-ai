"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Calendar, Clock, Save, Loader2, AlertCircle, RefreshCw, Compass, CheckCircle2 } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlobalLocationPicker } from "@/components/location/global-location-picker";
import { ProfileSwitcher, type ProfileOption } from "@/components/profile/profile-switcher";
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

interface RawBirthProfile {
  id: string;
  name?: string;
  profile_name?: string;
  relationship?: string;
  date_of_birth?: string;
  time_of_birth?: string;
  birth_place?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  is_primary?: boolean;
}

export default function BirthChartPage() {
  const [profiles, setProfiles] = useState<RawBirthProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    time: "12:00",
    birthPlace: "",
    country: "",
    lat: 0,
    lon: 0,
    tz: "UTC",
  });
  const [system, setSystem] = useState("vedic");
  const [houseSystem, setHouseSystem] = useState("whole-sign");
  const [status, setStatus] = useState<"idle" | "loading" | "calculated" | "error">("idle");
  const [result, setResult] = useState<ChartResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState(false);

  const profileOptions = useMemo<ProfileOption[]>(() => {
    return profiles.map((p) => ({
      id: p.id,
      name: p.name || p.profile_name || "Birth Chart",
      relationship: p.relationship || (p.is_primary ? "Self" : "Family"),
      birthPlace: p.birth_place || "Worldwide",
      dateOfBirth: p.date_of_birth || "",
      isPrimary: p.is_primary,
    }));
  }, [profiles]);

  const calculateChart = useCallback(async (data: typeof formData, sys = system, hSys = houseSystem) => {
    if (!data.name.trim() || !data.dob || !data.lat || !data.lon) return;

    setStatus("loading");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/birth-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate: data.dob,
          birthTime: data.time || "12:00",
          latitude: data.lat,
          longitude: data.lon,
          timezone: data.tz || "UTC",
          system: sys,
          houseSystem: hSys,
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
  }, [system, houseSystem]);

  useEffect(() => {
    async function loadSavedProfiles() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: rawProfiles } = await supabase
            .from("birth_profiles")
            .select("*")
            .eq("user_id", user.id)
            .order("is_primary", { ascending: false });

          if (rawProfiles && rawProfiles.length > 0) {
            setProfiles(rawProfiles);
            const primary = rawProfiles[0];
            setActiveProfileId(primary.id);

            const initial = {
              name: primary.name || primary.profile_name || user.user_metadata?.name || "Self",
              dob: primary.date_of_birth || "",
              time: primary.time_of_birth ? primary.time_of_birth.slice(0, 5) : "12:00",
              birthPlace: primary.birth_place || "",
              country: primary.country || "",
              lat: Number(primary.latitude) || 0,
              lon: Number(primary.longitude) || 0,
              tz: primary.timezone || "UTC",
            };
            setFormData(initial);

            if (initial.dob && initial.lat && initial.lon) {
              calculateChart(initial);
            }
          }
        }
      } catch (err) {
        console.error("Error loading profiles for birth chart:", err);
      }
    }
    loadSavedProfiles();
  }, [calculateChart]);

  const handleSelectProfile = (profileId: string) => {
    setActiveProfileId(profileId);
    const selected = profiles.find((p) => p.id === profileId);
    if (selected) {
      const next = {
        name: selected.name || selected.profile_name || "Self",
        dob: selected.date_of_birth || "",
        time: selected.time_of_birth ? selected.time_of_birth.slice(0, 5) : "12:00",
        birthPlace: selected.birth_place || "",
        country: selected.country || "",
        lat: Number(selected.latitude) || 0,
        lon: Number(selected.longitude) || 0,
        tz: selected.timezone || "UTC",
      };
      setFormData(next);
      if (next.dob && next.lat && next.lon) {
        calculateChart(next);
      } else {
        setStatus("idle");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateChart(formData);
  };

  const handleSave = async () => {
    if (!result) return;
    setSaveStatus(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("saved_charts").insert({
        user_id: user.id,
        name: `${formData.name}'s Chart (${system})`,
        chart_type: system,
        placements: result.positions,
        houses: result.houses,
        aspects: [],
      });
    } catch (err) {
      console.error("Save chart error:", err);
    } finally {
      setTimeout(() => setSaveStatus(false), 2000);
    }
  };

  return (
    <PageWrapper title="Birth Chart Calculator | AstroVerse AI" description="Generate your authentic natal birth chart with astronomical planetary positions.">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header with Profile Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>
                Birth Chart Calculator
              </h1>
              {profileOptions.length > 0 && (
                <ProfileSwitcher
                  profiles={profileOptions}
                  activeProfileId={activeProfileId}
                  onSelectProfile={handleSelectProfile}
                />
              )}
            </div>
            <p className="text-xs sm:text-sm text-white/60 mt-1">
              High-precision astronomical engine calculating natal positions, house cusps, and ascendant degrees worldwide.
            </p>
          </div>
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
                  placeholder="Enter full name"
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
                    onChange={e => {
                      setSystem(e.target.value);
                      if (formData.dob && formData.lat && formData.lon) {
                        calculateChart(formData, e.target.value, houseSystem);
                      }
                    }}
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
                    onChange={e => {
                      setHouseSystem(e.target.value);
                      if (formData.dob && formData.lat && formData.lon) {
                        calculateChart(formData, system, e.target.value);
                      }
                    }}
                    className="w-full h-10 bg-white/5 border border-white/10 text-white rounded-lg px-2 text-xs focus:outline-none focus:border-gold/50"
                  >
                    <option value="whole-sign" className="bg-black text-white">Whole Sign</option>
                    <option value="placidus" className="bg-black text-white">Placidus</option>
                    <option value="equal" className="bg-black text-white">Equal</option>
                    <option value="koch" className="bg-black text-white">Koch</option>
                  </select>
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-xs text-red-500 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">
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
                {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {status === "loading" ? "Calculating planetary cusps..." : "Calculate Natal Chart"}
              </Button>
            </form>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-2 space-y-6">
            {status === "calculated" && result ? (
              <div className="space-y-6 animate-fade-in">
                {/* Highlights Card */}
                <div className="glass rounded-2xl p-6 border border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Ascendant (Lagna)</p>
                      <p className="text-xl font-bold text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>
                        {result.ascendant.sign} {result.ascendant.degree.toFixed(2)}°
                      </p>
                    </div>
                    {result.midheaven && (
                      <div>
                        <p className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Midheaven (MC)</p>
                        <p className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                          {result.midheaven.sign} {result.midheaven.degree.toFixed(2)}°
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleSave}
                    variant="outline"
                    size="sm"
                    className="text-xs border-white/10 hover:border-gold/30 gap-1.5"
                  >
                    {saveStatus ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Save className="w-3.5 h-3.5" />}
                    {saveStatus ? "Saved!" : "Save Chart"}
                  </Button>
                </div>

                {/* Planetary Positions Table */}
                <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">
                    Planetary Placements ({system.toUpperCase()})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-white/50">
                          <th className="pb-2">Planet</th>
                          <th className="pb-2">Sign</th>
                          <th className="pb-2">Exact Longitude</th>
                          <th className="pb-2">House</th>
                          <th className="pb-2">Motion</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {result.positions.map((p, idx) => (
                          <tr key={idx} className="hover:bg-white/5">
                            <td className="py-2.5 font-semibold text-white">{p.planet}</td>
                            <td className="py-2.5 text-white/80">{p.sign}</td>
                            <td className="py-2.5 font-mono text-white/60">{p.degree}° {p.minute}&apos;</td>
                            <td className="py-2.5 text-white/60">House {p.house}</td>
                            <td className="py-2.5">
                              {p.retrograde ? (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 font-mono">Retrograde (R)</span>
                              ) : (
                                <span className="text-white/40 text-[10px]">Direct</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Houses Table */}
                {result.houses && result.houses.length > 0 && (
                  <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">
                      House Cusps ({houseSystem})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {result.houses.map((h) => (
                        <div key={h.house} className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
                          <span className="text-[10px] font-bold text-gold uppercase tracking-wider">House {h.house}</span>
                          <p className="text-xs font-semibold text-white">{h.sign}</p>
                          <p className="text-[10px] text-white/50 font-mono">{h.degree}° {h.minute}&apos;</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass rounded-2xl p-12 border border-white/5 text-center space-y-3">
                <Compass className="w-10 h-10 text-gold/30 mx-auto" />
                <h3 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                  Your Cosmic Blueprint Awaits
                </h3>
                <p className="text-xs text-white/60 max-w-md mx-auto">
                  Select a saved birth profile or input birth parameters on the left to compute your authentic planetary coordinates, house cusps, and ascendant degree.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
