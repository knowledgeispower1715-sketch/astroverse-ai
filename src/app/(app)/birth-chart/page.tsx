"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Calendar, Clock, MapPin, Download, Save, Info, Orbit } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MOCK_WESTERN_POSITIONS = [
  { planet: "Sun", sign: "Leo", degree: "05°22'", house: 5, aspect: "Conjunct Ascendant" },
  { planet: "Moon", sign: "Cancer", degree: "24°40'", house: 4, aspect: "Trine Mars" },
  { planet: "Mercury", sign: "Virgo", degree: "18°15'", house: 6, aspect: "Sextile Venus" },
  { planet: "Venus", sign: "Taurus", degree: "11°05'", house: 2, aspect: "Opposite Pluto" },
  { planet: "Mars", sign: "Scorpio", degree: "29°10'", house: 8, aspect: "Square Sun" },
];

export default function BirthChartPage() {
  const [formData, setFormData] = useState({ name: "", dob: "", time: "", place: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "calculated">("idle");
  const [saveStatus, setSaveStatus] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.dob || !formData.time || !formData.place.trim()) return;

    setStatus("loading");
    setTimeout(() => {
      setStatus("calculated");
    }, 1500);
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            AI Birth Chart Report
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Map your personal birth coordinates to calculate your Western tropical natal chart placements, house systems, and planet aspects.
          </p>
        </div>

        {status !== "calculated" && (
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 border border-white/5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Name *</label>
                <Input
                  type="text"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
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
                      className="h-12 pl-9 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
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
                      className="h-12 pl-9 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
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
                    className="h-12 pl-9 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full h-12 rounded-lg text-sm font-semibold gap-2 cursor-pointer"
                style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
              >
                {status === "loading" ? "Calculating coordinates..." : "Generate Birth Chart"}
              </Button>
            </form>
          </div>
        )}

        {status === "calculated" && (
          <div className="space-y-8 animate-fade-in">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 glass rounded-2xl border border-white/5">
              <div>
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>{formData.name}&apos;s Birth Placements</h2>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Born: {formData.dob} at {formData.time} in {formData.place}</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={() => setSaveStatus(true)} variant="outline" className="flex-1 sm:flex-none text-xs gap-1.5 h-10 border-white/10 hover:border-gold/30">
                  <Save className="w-4 h-4" />
                  {saveStatus ? "Saved!" : "Save Chart"}
                </Button>
                <Button onClick={() => alert("Downloading PDF...")} className="flex-1 sm:flex-none text-xs gap-1.5 h-10" style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}>
                  <Download className="w-4 h-4" />
                  Download Report
                </Button>
              </div>
            </div>

            {/* Placements Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Circular Chart Placeholder */}
              <div className="lg:col-span-1 flex flex-col items-center justify-center p-8 glass rounded-2xl border border-white/5 min-h-[300px]">
                <Orbit className="w-24 h-24 mb-6 text-gold animate-spin-slow" />
                <h3 className="text-sm font-bold text-white mb-1" style={{ fontFamily: "var(--font-outfit)" }}>Tropical Wheel Plot</h3>
                <span className="text-[10px] uppercase font-bold" style={{ color: "var(--text-muted)" }}>Placidus Houses</span>
              </div>

              {/* Placements Table */}
              <div className="lg:col-span-2 glass rounded-2xl p-6 border border-white/5">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Zodiac Placements</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10" style={{ color: "var(--text-muted)" }}>
                        <th className="pb-3">Planet</th>
                        <th className="pb-3">Zodiac Sign</th>
                        <th className="pb-3">Coordinate</th>
                        <th className="pb-3">House Position</th>
                        <th className="pb-3">Major Aspects</th>
                      </tr>
                    </thead>
                    <tbody style={{ color: "var(--text-secondary)" }}>
                      {MOCK_WESTERN_POSITIONS.map((pos) => (
                        <tr key={pos.planet} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 font-semibold text-white">{pos.planet}</td>
                          <td className="py-3">{pos.sign}</td>
                          <td className="py-3">{pos.degree}</td>
                          <td className="py-3">House {pos.house}</td>
                          <td className="py-3">{pos.aspect}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recalculate options */}
            <div className="text-center">
              <Button onClick={() => setStatus("idle")} variant="ghost" className="text-xs" style={{ color: "var(--text-muted)" }}>
                Generate Another Western Chart
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
