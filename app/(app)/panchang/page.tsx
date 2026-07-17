"use client";

import { useState } from "react";
import { Sparkles, CalendarDays, Moon, Compass, CompassIcon, Info } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PANCHANG_CATEGORIES = [
  { label: "Tithi (Lunar Day)", value: "Shukla Dwadashi", desc: "Ruling deity: Vishnu. Auspicious for domestic ceremonies, travel, and investments." },
  { label: "Nakshatra (Lunar Mansion)", value: "Anuradha", desc: "Ruling planet: Saturn. Fosters friendship, harmony, and structural execution." },
  { label: "Yoga (Combination)", value: "Shubha", desc: "Ruling energy: Benefic. Auspicious for long-term project planning and collaborations." },
  { label: "Karana (Half-Tithi)", value: "Bava", desc: "Ruling energy: Dynamic. Favorable for health-promoting tasks and setting goals." },
  { label: "Vara (Day of Week)", value: "Shanivara (Saturday)", desc: "Ruling planet: Saturn. Favors cleaning, audits, administrative duties, and rest." },
];

export default function PanchangPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [location, setLocation] = useState("San Francisco, CA");
  const [status, setStatus] = useState<"idle" | "loading" | "loaded">("loaded");

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !location.trim()) return;

    setStatus("loading");
    setTimeout(() => {
      setStatus("loaded");
    }, 1000);
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Daily Vedic Panchang
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Retrieve the five essential elements of the Hindu calendar (Tithi, Vara, Nakshatra, Yoga, and Karana) for any date and location.
          </p>
        </div>

        {/* Form parameters */}
        <form onSubmit={handleCalculate} className="glass rounded-2xl p-6 border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end mb-10 max-w-2xl mx-auto">
          <div className="space-y-1">
            <label className="text-xs font-semibold block animate-pulse" style={{ color: "var(--text-secondary)" }}>Target Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 bg-white/5 border-white/10 text-white rounded-lg"
              disabled={status === "loading"}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Location Coordinates</label>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-10 bg-white/5 border-white/10 text-white rounded-lg"
              disabled={status === "loading"}
            />
          </div>
          <Button type="submit" disabled={status === "loading"} className="h-10 rounded-lg text-xs font-bold cursor-pointer" style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}>
            {status === "loading" ? "Recalculating..." : "Compute Panchang"}
          </Button>
        </form>

        {status === "loaded" && (
          <div className="space-y-6">
            {/* Grid display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PANCHANG_CATEGORIES.slice(0, 4).map((element) => (
                <div key={element.label} className="glass rounded-xl p-5 border border-white/5 space-y-2 relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 100% 0%, rgba(212,175,55,0.03) 0%, transparent 50%)" }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: "var(--text-muted)" }}>{element.label}</span>
                  <h3 className="text-lg font-bold text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>{element.value}</h3>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{element.desc}</p>
                </div>
              ))}
            </div>

            {/* Bottom full length card */}
            <div className="glass rounded-xl p-6 border border-white/5 flex flex-col sm:flex-row items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(212, 175, 55, 0.1)", color: "var(--gold)" }}>
                <CalendarDays className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">{PANCHANG_CATEGORIES[4].label}: {PANCHANG_CATEGORIES[4].value}</h3>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{PANCHANG_CATEGORIES[4].desc}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
