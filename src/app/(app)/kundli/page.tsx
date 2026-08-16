"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Calendar, Clock, Download, Save, AlertCircle, Sparkles, RefreshCw, Compass } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlobalLocationPicker } from "@/components/location/global-location-picker";
import { ProfileSwitcher, type ProfileOption } from "@/components/profile/profile-switcher";
import { createClient } from "@/lib/supabase/client";

interface CalculationItem {
  planet: string;
  sign: string;
  degree: number;
  minute: number;
  retrograde: boolean;
  house: number;
}

interface YogaItem {
  name: string;
  description: string;
  type: "benefic" | "malefic";
}

interface DoshaItem {
  name: string;
  description: string;
  severity: "low" | "medium" | "high" | "none";
}

interface GemstoneItem {
  planet: string;
  stone: string;
  finger: string;
  metal: string;
  benefit: string;
}

interface ResultData {
  positions: CalculationItem[];
  houses: { house: number; sign: string; degree: number; minute: number }[];
  aspects: { planet1: string; planet2: string; type: string; orb: number; applying: boolean }[];
  ascendant: { sign: string; degree: number };
  midheaven: { sign: string; degree: number };
  nakshatras: Record<string, { name: string; ruler: string; degreeInNakshatra: number; padha: number }>;
  navamsa: Record<string, { sign: string; degree: number }>;
  strengths: Record<string, number>;
  dashas: { planet: string; durationYears: number; startDate: string; endDate: string }[];
  yogas: YogaItem[];
  doshas: DoshaItem[];
  remedies: string[];
  gemstones: GemstoneItem[];
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

// South Indian style SVG chart render helper
const SVGChart = ({ title, planets }: { title: string; planets: Record<string, string[]> }) => (
  <div className="flex flex-col items-center gap-2">
    <span className="text-xs font-bold text-gradient-gold uppercase tracking-wider">{title}</span>
    <svg className="w-64 h-64 border border-gold/30 bg-black/40 rounded-xl" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      {/* Outer borders */}
      <rect x="5" y="5" width="390" height="390" fill="none" stroke="var(--gold)" strokeWidth="2" opacity="0.3" />
      {/* South Indian 4x4 Grid divisions */}
      <line x1="100" y1="5" x2="100" y2="395" stroke="var(--gold)" strokeWidth="1" opacity="0.2" />
      <line x1="200" y1="5" x2="200" y2="395" stroke="var(--gold)" strokeWidth="1" opacity="0.2" />
      <line x1="300" y1="5" x2="300" y2="395" stroke="var(--gold)" strokeWidth="1" opacity="0.2" />
      
      <line x1="5" y1="100" x2="395" y2="100" stroke="var(--gold)" strokeWidth="1" opacity="0.2" />
      <line x1="5" y1="200" x2="395" y2="200" stroke="var(--gold)" strokeWidth="1" opacity="0.2" />
      <line x1="5" y1="300" x2="395" y2="300" stroke="var(--gold)" strokeWidth="1" opacity="0.2" />

      {/* Middle empty space box */}
      <rect x="100" y="100" width="200" height="200" fill="var(--bg-primary)" opacity="0.9" />
      <text x="200" y="210" textAnchor="middle" fill="var(--gold-light)" fontSize="18" fontWeight="bold" opacity="0.8">AstroVerse AI</text>

      {/* Place planets inside boxes */}
      <text x="150" y="60" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        {planets["1"]?.join(", ") || ""}
      </text>
      <text x="250" y="60" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        {planets["2"]?.join(", ") || ""}
      </text>
      <text x="350" y="60" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        {planets["3"]?.join(", ") || ""}
      </text>
      <text x="350" y="160" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        {planets["4"]?.join(", ") || ""}
      </text>
      <text x="350" y="260" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        {planets["5"]?.join(", ") || ""}
      </text>
      <text x="350" y="360" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        {planets["6"]?.join(", ") || ""}
      </text>
      <text x="250" y="360" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        {planets["7"]?.join(", ") || ""}
      </text>
      <text x="150" y="360" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        {planets["8"]?.join(", ") || ""}
      </text>
      <text x="50" y="360" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        {planets["9"]?.join(", ") || ""}
      </text>
      <text x="50" y="260" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        {planets["10"]?.join(", ") || ""}
      </text>
      <text x="50" y="160" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        {planets["11"]?.join(", ") || ""}
      </text>
      <text x="50" y="60" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        {planets["12"]?.join(", ") || ""}
      </text>
    </svg>
  </div>
);

export default function KundliPage() {
  const [profiles, setProfiles] = useState<RawBirthProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    time: "12:00",
    place: "",
    country: "",
    latitude: 0,
    longitude: 0,
    timezone: "UTC",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "calculated" | "error">("idle");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [exportStatus, setExportStatus] = useState<"idle" | "exporting" | "exported">("idle");
  const [resultData, setResultData] = useState<ResultData | null>(null);

  // Compute profile options for switcher
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

  // Calculation handler
  const calculateChart = useCallback(async (params: typeof formData) => {
    if (!params.dob || !params.latitude || !params.longitude) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/birth-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate: params.dob,
          birthTime: params.time || "12:00",
          latitude: params.latitude,
          longitude: params.longitude,
          timezone: params.timezone || "UTC",
          system: "vedic",
          houseSystem: "whole-sign",
        }),
      });

      const body = await res.json();
      if (res.ok && body.data) {
        setResultData(body.data as ResultData);
        setStatus("calculated");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Kundli calculation error:", err);
      setStatus("error");
    }
  }, []);

  // Fetch all user birth profiles on mount
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

            const initialForm = {
              name: primary.name || primary.profile_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
              dob: primary.date_of_birth || "",
              time: primary.time_of_birth ? primary.time_of_birth.slice(0, 5) : "12:00",
              place: primary.birth_place || "",
              country: primary.country || "",
              latitude: Number(primary.latitude) || 0,
              longitude: Number(primary.longitude) || 0,
              timezone: primary.timezone || "UTC",
            };
            setFormData(initialForm);

            // Auto-calculate if profile has valid coordinates and DOB
            if (initialForm.dob && initialForm.latitude && initialForm.longitude) {
              calculateChart(initialForm);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching birth profiles for kundli:", err);
      }
    }
    loadSavedProfiles();
  }, [calculateChart]);

  // Handle switching profiles
  const handleSelectProfile = (profileId: string) => {
    setActiveProfileId(profileId);
    const selected = profiles.find((p) => p.id === profileId);
    if (selected) {
      const nextForm = {
        name: selected.name || selected.profile_name || "User",
        dob: selected.date_of_birth || "",
        time: selected.time_of_birth ? selected.time_of_birth.slice(0, 5) : "12:00",
        place: selected.birth_place || "",
        country: selected.country || "",
        latitude: Number(selected.latitude) || 0,
        longitude: Number(selected.longitude) || 0,
        timezone: selected.timezone || "UTC",
      };
      setFormData(nextForm);
      if (nextForm.dob && nextForm.latitude && nextForm.longitude) {
        calculateChart(nextForm);
      } else {
        setStatus("idle");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.dob || !formData.place.trim() || !formData.latitude || !formData.longitude) {
      setStatus("error");
      return;
    }
    calculateChart(formData);
  };

  const handleSave = async () => {
    if (!resultData) return;
    setSaveStatus("saving");
    try {
      // 1. Save Birth details
      const birthRes = await fetch("/api/birth-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          birth_date: formData.dob,
          birth_time: formData.time,
          birth_place: formData.place,
          latitude: formData.latitude,
          longitude: formData.longitude,
          timezone_id: formData.timezone,
        }),
      });

      const birthBody = await birthRes.json();
      if (!birthRes.ok) throw new Error();

      // 2. Save calculated chart
      const chartRes = await fetch("/api/saved-charts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birth_details_id: birthBody.data.id,
          name: `${formData.name}'s Vedic Kundli`,
          chart_type: "vedic",
          placements: resultData.positions,
          houses: resultData.houses,
          aspects: resultData.aspects,
        }),
      });

      if (!chartRes.ok) throw new Error();

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  const handleExport = () => {
    setExportStatus("exporting");
    setTimeout(() => {
      window.print();
      setExportStatus("exported");
      setTimeout(() => setExportStatus("idle"), 2000);
    }, 500);
  };

  const mapPlacementsToGrid = (positions: CalculationItem[], ascendantSign: string) => {
    const grid: Record<string, string[]> = {
      "1": [], "2": [], "3": [], "4": [], "5": [], "6": [],
      "7": [], "8": [], "9": [], "10": [], "11": [], "12": [],
    };

    const signIndexMap: Record<string, string> = {
      "Taurus": "1", "Gemini": "2", "Cancer": "3", "Leo": "4", "Virgo": "5", "Libra": "6",
      "Scorpio": "7", "Sagittarius": "8", "Capricorn": "9", "Aquarius": "10", "Pisces": "11", "Aries": "12",
      "Vrishabha": "1", "Mithuna": "2", "Karka": "3", "Simha": "4", "Kanya": "5", "Tula": "6",
      "Vrishchika": "7", "Dhanu": "8", "Makara": "9", "Kumbha": "10", "Meena": "11", "Mesha": "12",
    };

    const ascBox = signIndexMap[ascendantSign];
    if (ascBox) {
      grid[ascBox].push("ASC");
    }

    positions.forEach((p) => {
      const box = signIndexMap[p.sign];
      if (box) {
        const abb: Record<string, string> = {
          "Sun": "Su", "Moon": "Mo", "Mercury": "Me", "Venus": "Ve",
          "Mars": "Ma", "Jupiter": "Ju", "Saturn": "Sa", "Uranus": "Ur", "Neptune": "Ne", "Pluto": "Pl",
          "Rahu": "Ra", "Ketu": "Ke",
        };
        grid[box].push(abb[p.planet] || p.planet.slice(0, 2));
      }
    });

    return grid;
  };

  const mapNavamsaToGrid = (navamsaMap: Record<string, { sign: string; degree: number }>) => {
    const grid: Record<string, string[]> = {
      "1": [], "2": [], "3": [], "4": [], "5": [], "6": [],
      "7": [], "8": [], "9": [], "10": [], "11": [], "12": [],
    };

    const signIndexMap: Record<string, string> = {
      "Vrishabha": "1", "Mithuna": "2", "Karka": "3", "Simha": "4", "Kanya": "5", "Tula": "6",
      "Vrishchika": "7", "Dhanu": "8", "Makara": "9", "Kumbha": "10", "Meena": "11", "Mesha": "12",
      "Taurus": "1", "Gemini": "2", "Cancer": "3", "Leo": "4", "Virgo": "5", "Libra": "6",
      "Scorpio": "7", "Sagittarius": "8", "Capricorn": "9", "Aquarius": "10", "Pisces": "11", "Aries": "12",
    };

    Object.entries(navamsaMap).forEach(([planet, data]) => {
      const box = signIndexMap[data.sign];
      if (box) {
        const abb: Record<string, string> = {
          "Sun": "Su", "Moon": "Mo", "Mercury": "Me", "Venus": "Ve",
          "Mars": "Ma", "Jupiter": "Ju", "Saturn": "Sa", "Ascendant": "ASC",
          "Rahu": "Ra", "Ketu": "Ke",
        };
        grid[box].push(abb[planet] || planet.slice(0, 2));
      }
    });

    return grid;
  };

  return (
    <PageWrapper title="Vedic Kundli Generator | AstroVerse AI" description="Generate authentic Vedic birth charts with planetary placements and D1/D9.">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 print:p-0">
        
        {/* Header with Profile Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 print:hidden">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>
                Vedic Kundli Generator
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
              Deterministic astronomical calculation based on Vedic Lahiri Ayanamsa and authentic planetary positions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/onboarding">
              <Button variant="outline" size="sm" className="text-xs border-gold/30 text-gold-light hover:bg-gold/10 gap-1.5 cursor-pointer">
                <Compass className="w-3.5 h-3.5" />
                Add New Chart Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Input Form if not calculated or user wishes to edit */}
        {status !== "calculated" && (
          <div className="max-w-xl mx-auto print:hidden animate-fade-in">
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 border border-white/5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Person Name *</label>
                <Input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 bg-white/5 border-white/10 text-white rounded-lg"
                  disabled={status === "loading"}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Date of Birth *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: "var(--text-muted)" }}>
                      <Calendar className="w-4 h-4" />
                    </span>
                    <Input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="h-12 pl-9 bg-white/5 border-white/10 text-white rounded-lg"
                      disabled={status === "loading"}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Time of Birth *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: "var(--text-muted)" }}>
                      <Clock className="w-4 h-4" />
                    </span>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="h-12 pl-9 bg-white/5 border-white/10 text-white rounded-lg"
                      disabled={status === "loading"}
                    />
                  </div>
                </div>
              </div>

              {/* Global Worldwide Location Picker */}
              <GlobalLocationPicker
                value={{
                  birthPlace: formData.place,
                  country: formData.country,
                  latitude: formData.latitude,
                  longitude: formData.longitude,
                  timezone: formData.timezone,
                }}
                onChange={(loc) => {
                  setFormData((prev) => ({
                    ...prev,
                    place: loc.birthPlace,
                    country: loc.country,
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    timezone: loc.timezone,
                  }));
                }}
              />

              {status === "error" && (
                <div className="flex items-center gap-2 text-xs text-red-500 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Please enter all required fields including a valid worldwide birth location.</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full h-12 rounded-lg text-sm font-semibold gap-2 cursor-pointer"
                style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
              >
                {status === "loading" ? "Aligning planetary coordinates..." : "Generate Kundli Chart"}
              </Button>
            </form>
          </div>
        )}

        {/* Calculated Results Presentation */}
        {status === "calculated" && resultData && (
          <div className="space-y-8 animate-fade-in print:space-y-4">
            {/* Header / Actions Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 glass rounded-2xl border border-white/5 print:border-none print:bg-transparent print:p-0">
              <div>
                <h2 className="text-xl font-bold text-white print:text-black" style={{ fontFamily: "var(--font-outfit)" }}>
                  {formData.name ? `${formData.name}'s Natal Kundli` : "Natal Kundli Report"}
                </h2>
                <p className="text-xs print:text-black text-white/60">
                  Born {formData.dob} at {formData.time} in {formData.place || "Worldwide"} ({formData.timezone})
                </p>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto print:hidden">
                <Button onClick={() => setStatus("idle")} variant="outline" size="sm" className="text-xs border-white/10 hover:border-gold/30">
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  Modify Details
                </Button>
                <Button onClick={handleSave} variant="outline" size="sm" disabled={saveStatus === "saving"} className="text-xs border-white/10 hover:border-gold/30">
                  <Save className="w-3.5 h-3.5 mr-1" />
                  {saveStatus === "saved" ? "Saved!" : saveStatus === "error" ? "Error Saving" : "Save Chart"}
                </Button>
                <Button onClick={handleExport} size="sm" disabled={exportStatus === "exporting"} className="text-xs" style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}>
                  <Download className="w-3.5 h-3.5 mr-1" />
                  {exportStatus === "exported" ? "Downloaded!" : "Export PDF"}
                </Button>
              </div>
            </div>

            {/* Layout Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block print:space-y-6">
              {/* Charts grid column */}
              <div className="lg:col-span-1 space-y-6 print:flex print:flex-row print:justify-around print:gap-4">
                <SVGChart 
                  title="Lagna Chart (D1)" 
                  planets={mapPlacementsToGrid(resultData.positions, resultData.ascendant.sign)} 
                />
                <SVGChart 
                  title="Navamsa Chart (D9)" 
                  planets={mapNavamsaToGrid(resultData.navamsa || {})} 
                />
              </div>

              {/* Data tables column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Planetary Placements Table */}
                <div className="glass rounded-2xl p-6 border border-white/5 print:border-none print:p-0">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4 print:text-black" style={{ color: "var(--text-muted)" }}>
                    Planetary Positions (Vedic / Sidereal)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 print:border-black text-white/50 print:text-black">
                          <th className="pb-2">Planet</th>
                          <th className="pb-2">Sign (Rashi)</th>
                          <th className="pb-2">Degrees</th>
                          <th className="pb-2">House</th>
                          <th className="pb-2">Motion</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 print:divide-black">
                        {resultData.positions.map((p, idx) => (
                          <tr key={idx} className="hover:bg-white/5">
                            <td className="py-2.5 font-semibold text-white print:text-black">{p.planet}</td>
                            <td className="py-2.5 text-white/80 print:text-black">{p.sign}</td>
                            <td className="py-2.5 font-mono text-white/60 print:text-black">{p.degree}° {p.minute}&apos;</td>
                            <td className="py-2.5 text-white/60 print:text-black">House {p.house}</td>
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

                {/* Nakshatras & Vimshottari Dasha */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nakshatra Summary */}
                  <div className="glass rounded-xl p-5 border border-white/5 space-y-3">
                    <h4 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Lunar Nakshatra
                    </h4>
                    {resultData.nakshatras?.Moon ? (
                      <div className="space-y-1">
                        <p className="text-base font-bold text-white">{resultData.nakshatras.Moon.name}</p>
                        <p className="text-xs text-white/60">
                          Pada {resultData.nakshatras.Moon.padha} • Lord: {resultData.nakshatras.Moon.ruler}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-white/50">Computed from natal Moon longitude.</p>
                    )}
                  </div>

                  {/* Ascendant Lagna */}
                  <div className="glass rounded-xl p-5 border border-white/5 space-y-3">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5" />
                      Ascendant (Lagna)
                    </h4>
                    <div className="space-y-1">
                      <p className="text-base font-bold text-white">{resultData.ascendant.sign}</p>
                      <p className="text-xs text-white/60 font-mono">
                        {resultData.ascendant.degree.toFixed(2)}°
                      </p>
                    </div>
                  </div>
                </div>

                {/* Yogas and Doshas */}
                {(resultData.yogas?.length > 0 || resultData.doshas?.length > 0) && (
                  <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">
                      Key Yogas & Planetary Doshas
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {resultData.yogas?.map((y, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                            {y.type} Yoga
                          </span>
                          <p className="text-xs font-bold text-white">{y.name}</p>
                          <p className="text-[11px] text-white/60">{y.description}</p>
                        </div>
                      ))}
                      {resultData.doshas?.map((d, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                            {d.severity} severity
                          </span>
                          <p className="text-xs font-bold text-white">{d.name}</p>
                          <p className="text-[11px] text-white/60">{d.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prescribed Gemstones & Remedies */}
                {resultData.gemstones?.length > 0 && (
                  <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gold">
                      Prescribed Astrological Gemstones
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {resultData.gemstones.map((g, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                          <p className="text-xs font-bold text-white">{g.stone} ({g.planet})</p>
                          <p className="text-[11px] text-white/60">Wear on {g.finger} in {g.metal}</p>
                          <p className="text-[11px] text-gold-light/80">{g.benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
