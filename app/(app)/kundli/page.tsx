"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, Download, Save, AlertCircle } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [formData, setFormData] = useState({ name: "", dob: "", time: "", place: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "calculated" | "error">("idle");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [exportStatus, setExportStatus] = useState<"idle" | "exporting" | "exported">("idle");
  const [resultData, setResultData] = useState<ResultData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.dob || !formData.time || !formData.place.trim()) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      // Geocoding fallback: Default to New Delhi (28.6139, 77.2090)
      let lat = 28.6139;
      let lng = 77.2090;
      const lowerPlace = formData.place.toLowerCase();
      if (lowerPlace.includes("mumbai") || lowerPlace.includes("bombay")) {
        lat = 19.0760; lng = 72.8777;
      } else if (lowerPlace.includes("london")) {
        lat = 51.5074; lng = -0.1278;
      } else if (lowerPlace.includes("york")) {
        lat = 40.7128; lng = -74.0060;
      }

      const res = await fetch("/api/birth-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate: formData.dob,
          birthTime: formData.time,
          latitude: lat,
          longitude: lng,
          timezone: "Asia/Kolkata",
          system: "vedic",
          houseSystem: "whole-sign"
        })
      });

      const body = await res.json();
      if (res.ok && body.data) {
        setResultData(body.data as ResultData);
        setStatus("calculated");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
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
          latitude: 28.6139,
          longitude: 77.2090,
          timezone_id: "Asia/Kolkata"
        })
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
          aspects: resultData.aspects
        })
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
      "7": [], "8": [], "9": [], "10": [], "11": [], "12": []
    };

    const signIndexMap: Record<string, string> = {
      "Taurus": "1", "Gemini": "2", "Cancer": "3", "Leo": "4", "Virgo": "5", "Libra": "6",
      "Scorpio": "7", "Sagittarius": "8", "Capricorn": "9", "Aquarius": "10", "Pisces": "11", "Aries": "12",
      "Vrishabha": "1", "Mithuna": "2", "Karka": "3", "Simha": "4", "Kanya": "5", "Tula": "6",
      "Vrishchika": "7", "Dhanu": "8", "Makara": "9", "Kumbha": "10", "Meena": "11", "Mesha": "12"
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
          "Mars": "Ma", "Jupiter": "Ju", "Saturn": "Sa", "Uranus": "Ur", "Neptune": "Ne", "Pluto": "Pl"
        };
        grid[box].push(abb[p.planet] || p.planet.slice(0, 2));
      }
    });

    return grid;
  };

  const mapNavamsaToGrid = (navamsaMap: Record<string, { sign: string; degree: number }>) => {
    const grid: Record<string, string[]> = {
      "1": [], "2": [], "3": [], "4": [], "5": [], "6": [],
      "7": [], "8": [], "9": [], "10": [], "11": [], "12": []
    };

    const signIndexMap: Record<string, string> = {
      "Vrishabha": "1", "Mithuna": "2", "Karka": "3", "Simha": "4", "Kanya": "5", "Tula": "6",
      "Vrishchika": "7", "Dhanu": "8", "Makara": "9", "Kumbha": "10", "Meena": "11", "Mesha": "12",
      "Taurus": "1", "Gemini": "2", "Cancer": "3", "Leo": "4", "Virgo": "5", "Libra": "6",
      "Scorpio": "7", "Sagittarius": "8", "Capricorn": "9", "Aquarius": "10", "Pisces": "11", "Aries": "12"
    };

    Object.entries(navamsaMap).forEach(([planet, data]) => {
      const box = signIndexMap[data.sign];
      if (box) {
        const abb: Record<string, string> = {
          "Sun": "Su", "Moon": "Mo", "Mercury": "Me", "Venus": "Ve",
          "Mars": "Ma", "Jupiter": "Ju", "Saturn": "Sa", "Ascendant": "ASC"
        };
        grid[box].push(abb[planet] || planet.slice(0, 2));
      }
    });

    return grid;
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 print:p-0">
        <div className="text-center mb-12 print:hidden">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Vedic Kundli Generator
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Input birth parameters to compute detailed planetary positions, Lagna charts, Vimshottari Dashas, and prescribed remedies.
          </p>
        </div>

        {status !== "calculated" && (
          <div className="max-w-xl mx-auto print:hidden">
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 border border-white/5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Name *</label>
                <Input
                  type="text"
                  placeholder="Enter name"
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

              <div className="space-y-1">
                <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Place of Birth *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: "var(--text-muted)" }}>
                    <MapPin className="w-4 h-4" />
                  </span>
                  <Input
                    type="text"
                    placeholder="City, State, Country"
                    value={formData.place}
                    onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                    className="h-12 pl-9 bg-white/5 border-white/10 text-white rounded-lg"
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 text-xs text-red-500 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Please fill in all required fields.</span>
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

        {status === "calculated" && resultData && (
          <div className="space-y-8 animate-fade-in print:space-y-4">
            {/* Header / Actions Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 glass rounded-2xl border border-white/5 print:border-none print:bg-transparent print:p-0">
              <div>
                <h2 className="text-xl font-bold text-white print:text-black" style={{ fontFamily: "var(--font-outfit)" }}>{formData.name}&apos;s Natal Report</h2>
                <p className="text-xs print:text-black" style={{ color: "var(--text-secondary)" }}>Born: {formData.dob} at {formData.time} in {formData.place}</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto print:hidden">
                <Button onClick={handleSave} variant="outline" disabled={saveStatus === "saving"} className="flex-1 sm:flex-none text-xs gap-1.5 h-10 border-white/10 hover:border-gold/30">
                  <Save className="w-4 h-4" />
                  {saveStatus === "saved" ? "Saved!" : saveStatus === "error" ? "Error Saving" : "Save to Dashboard"}
                </Button>
                <Button onClick={handleExport} disabled={exportStatus === "exporting"} className="flex-1 sm:flex-none text-xs gap-1.5 h-10" style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}>
                  <Download className="w-4 h-4" />
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

              {/* Data sheets column */}
              <div className="lg:col-span-2 space-y-6 print:w-full print:space-y-4">
                {/* Placements Sheet */}
                <div className="glass rounded-2xl p-6 border border-white/5 print:border-none print:bg-transparent print:p-0">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4 print:text-black" style={{ color: "var(--text-muted)" }}>Planetary Placements</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 print:border-black" style={{ color: "var(--text-muted)" }}>
                          <th className="pb-3 print:text-black">Planet</th>
                          <th className="pb-3 print:text-black">Zodiac Sign</th>
                          <th className="pb-3 print:text-black">Degrees</th>
                          <th className="pb-3 print:text-black">House</th>
                          <th className="pb-3 print:text-black">Dignity / Strength</th>
                        </tr>
                      </thead>
                      <tbody style={{ color: "var(--text-secondary)" }} className="print:text-black">
                        {resultData.positions.map((pos) => (
                          <tr key={pos.planet} className="border-b border-white/5 hover:bg-white/5 transition-colors print:border-black">
                            <td className="py-3 font-semibold text-white print:text-black">{pos.planet}</td>
                            <td className="py-3">{pos.sign}</td>
                            <td className="py-3">{pos.degree}°{String(pos.minute).padStart(2, "0")}&apos; {pos.retrograde ? " (R)" : ""}</td>
                            <td className="py-3">House {pos.house}</td>
                            <td className="py-3">{resultData.strengths?.[pos.planet] || 70}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Yogas / Doshas Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 print:grid-cols-2">
                  {/* Yogas */}
                  <div className="glass rounded-xl p-5 border border-white/5 print:border-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider block mb-3 text-green-500 print:text-green-700">Active Yogas</span>
                    <ul className="space-y-3 text-xs">
                      {resultData.yogas?.map((y) => (
                        <li key={y.name}>
                          <h4 className="font-bold text-white print:text-black">{y.name}</h4>
                          <p style={{ color: "var(--text-muted)" }} className="print:text-black">{y.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Doshas */}
                  <div className="glass rounded-xl p-5 border border-white/5 print:border-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider block mb-3 text-red-500 print:text-red-700">Active Doshas</span>
                    <ul className="space-y-3 text-xs">
                      {resultData.doshas?.map((d) => (
                        <li key={d.name}>
                          <h4 className="font-bold text-white print:text-black">{d.name}</h4>
                          <p style={{ color: "var(--text-muted)" }} className="print:text-black">{d.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Remedies & Gemstones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 print:grid-cols-2">
                  {/* Prescribed Remedies */}
                  <div className="glass rounded-xl p-5 border border-white/5 print:border-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider block mb-3 text-gradient-gold print:text-black font-extrabold">Prescribed Remedies</span>
                    <ul className="space-y-2 text-xs list-disc list-inside print:text-black" style={{ color: "var(--text-secondary)" }}>
                      {resultData.remedies?.map((rem, i) => (
                        <li key={i}>{rem}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Gemstones */}
                  <div className="glass rounded-xl p-5 border border-white/5 print:border-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider block mb-3 text-gradient-gold print:text-black font-extrabold">Recommended Gemstones</span>
                    <ul className="space-y-3 text-xs">
                      {resultData.gemstones?.map((g) => (
                        <li key={g.planet}>
                          <h4 className="font-bold text-white print:text-black">{g.stone} ({g.planet})</h4>
                          <p style={{ color: "var(--text-muted)" }} className="print:text-black">
                            <span className="font-semibold">Wear on:</span> {g.finger} in {g.metal}. <br />
                            {g.benefit}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Reset option */}
            <div className="text-center print:hidden">
              <Button onClick={() => setStatus("idle")} variant="ghost" className="text-xs" style={{ color: "var(--text-muted)" }}>
                Generate Another Kundli Report
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Print custom styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          header, footer, nav, button, .print\\:hidden {
            display: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
          .print\\:bg-transparent {
            background: transparent !important;
            box-shadow: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:text-black {
            color: black !important;
          }
          svg {
            border: 1px solid black !important;
            background: white !important;
          }
          svg text {
            fill: black !important;
          }
        }
      `}</style>
    </PageWrapper>
  );
}
