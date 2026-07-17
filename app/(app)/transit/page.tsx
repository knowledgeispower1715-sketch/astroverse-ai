import type { Metadata } from "next";
import { Sparkles, Orbit, AlertCircle, Compass, HelpCircle } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { AnimatedCard } from "@/components/shared/animated-card";

export const metadata: Metadata = {
  title: "Transit Tracker | AstroVerse AI",
  description: "Monitor live planetary positions and retrogrades.",
};

const TRANSITING_PLANETS = [
  { planet: "Sun", sign: "Cancer", degree: "26°10'", state: "Direct", speed: "Normal" },
  { planet: "Moon", sign: "Leo", degree: "08°45'", state: "Direct", speed: "Fast" },
  { planet: "Mercury", sign: "Leo", degree: "11°15'", state: "Direct", speed: "Normal" },
  { planet: "Venus", sign: "Virgo", degree: "03°22'", state: "Direct", speed: "Normal" },
  { planet: "Mars", sign: "Gemini", degree: "14°40'", state: "Direct", speed: "Normal" },
  { planet: "Jupiter", sign: "Gemini", degree: "28°10'", state: "Direct", speed: "Slow" },
  { planet: "Saturn", sign: "Pisces", degree: "19°05'", state: "Retrograde", speed: "Stationary" },
];

export default function TransitPage() {
  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Planetary Transit Tracker
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Monitor the real-time movement of celestial bodies through the zodiac signs and identify active retrograde cycles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wheel Placeholder */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center p-8 glass rounded-2xl border border-white/5 min-h-[350px] relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.05) 0%, transparent 60%)" }} />
            <Orbit className="w-28 h-28 mb-6 text-gold animate-spin-slow" />
            <h3 className="text-sm font-bold text-white mb-1" style={{ fontFamily: "var(--font-outfit)" }}>Live Ephemeris Plot</h3>
            <span className="text-[10px] uppercase font-bold" style={{ color: "var(--text-muted)" }}>Updates every 2 hours</span>
          </div>

          {/* Placements Table */}
          <div className="lg:col-span-2 glass rounded-2xl p-6 border border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Current Transit Degrees</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10" style={{ color: "var(--text-muted)" }}>
                    <th className="pb-3">Planet</th>
                    <th className="pb-3">Zodiac Sign</th>
                    <th className="pb-3">Degree</th>
                    <th className="pb-3">Motion State</th>
                    <th className="pb-3">Daily Velocity</th>
                  </tr>
                </thead>
                <tbody style={{ color: "var(--text-secondary)" }}>
                  {TRANSITING_PLANETS.map((pos) => (
                    <tr key={pos.planet} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 font-semibold text-white flex items-center gap-2">
                        <span>{pos.planet}</span>
                      </td>
                      <td className="py-3">{pos.sign}</td>
                      <td className="py-3">{pos.degree}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          pos.state === "Retrograde" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"
                        }`}>
                          {pos.state}
                        </span>
                      </td>
                      <td className="py-3">{pos.speed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
