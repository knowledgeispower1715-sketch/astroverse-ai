"use client";

import { useState } from "react";
import { RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CompatibilityResult, CompatibilityKuta } from "@/modules/prediction-engine";

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 70 ? "#22c55e" : score >= 50 ? "#d4af37" : "#ef4444";
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={8} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
    </svg>
  );
}

function KutaRow({ kuta }: { kuta: CompatibilityKuta }) {
  const pct = (kuta.scored / kuta.maxPoints) * 100;
  const color = pct >= 70 ? "bg-green-500" : pct >= 40 ? "bg-gold" : "bg-red-500";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-white">{kuta.name}</span>
        <span style={{ color: "var(--gold-light)" }}>{kuta.scored}/{kuta.maxPoints}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{kuta.description}</p>
    </div>
  );
}

export default function CompatibilityPage() {
  const [formData, setFormData] = useState({
    name1: "", dob1: "", time1: "", place1: "",
    name2: "", dob2: "", time2: "", place2: "",
  });
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dob1 || !formData.dob2) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dob1: formData.dob1, time1: formData.time1 || "12:00", dob2: formData.dob2, time2: formData.time2 || "12:00" }),
      });
      const json = await res.json() as { data?: CompatibilityResult; error?: string };
      if (json.data) setResult(json.data);
      else setError(json.error ?? "Calculation failed");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Vedic Compatibility
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Ashtakoota Guna Milan — 36-point compatibility analysis using Moon&apos;s Nakshatra position.
          </p>
        </div>

        {!result && (
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Person A */}
              <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>Person A</h3>
                {[
                  { label: "Full Name", key: "name1", type: "text", placeholder: "Enter name" },
                  { label: "Date of Birth *", key: "dob1", type: "date", placeholder: "" },
                  { label: "Birth Time (if known)", key: "time1", type: "time", placeholder: "" },
                  { label: "Birth Place", key: "place1", type: "text", placeholder: "City, Country" },
                ].map(f => (
                  <div key={f.key} className="space-y-1">
                    <label className="text-xs font-semibold block text-white/70">{f.label}</label>
                    <Input type={f.type} placeholder={f.placeholder}
                      value={formData[f.key as keyof typeof formData]}
                      onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                      className="h-10 bg-white/5 border-white/10 text-white rounded-lg" />
                  </div>
                ))}
              </div>

              {/* Person B */}
              <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>Person B</h3>
                {[
                  { label: "Full Name", key: "name2", type: "text", placeholder: "Enter name" },
                  { label: "Date of Birth *", key: "dob2", type: "date", placeholder: "" },
                  { label: "Birth Time (if known)", key: "time2", type: "time", placeholder: "" },
                  { label: "Birth Place", key: "place2", type: "text", placeholder: "City, Country" },
                ].map(f => (
                  <div key={f.key} className="space-y-1">
                    <label className="text-xs font-semibold block text-white/70">{f.label}</label>
                    <Input type={f.type} placeholder={f.placeholder}
                      value={formData[f.key as keyof typeof formData]}
                      onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                      className="h-10 bg-white/5 border-white/10 text-white rounded-lg" />
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="glass rounded-xl p-4 border border-red-500/20 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <div className="text-center">
              <Button type="submit" disabled={loading || !formData.dob1 || !formData.dob2}
                className="h-12 px-10 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}>
                {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Analyzing Nakshatra compatibility…</> : "Analyze Compatibility"}
              </Button>
            </div>
          </form>
        )}

        {result && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="glass rounded-2xl p-6 border border-white/5 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 60%)" }} />
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <ScoreRing score={result.percentage} size={120} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-gradient-gold">{result.totalScore}</span>
                    <span className="text-[10px] text-white/50">/ 36</span>
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-outfit)" }}>
                {formData.name1 || "Person A"} & {formData.name2 || "Person B"}
              </h2>
              <p className="text-sm font-semibold text-gradient-gold mb-2">{result.percentage}% Compatibility</p>
              <p className="text-xs max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>{result.verdict}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
                <span>A: Moon in <strong className="text-white">{result.person1Nakshatra}</strong> ({result.person1MoonSign})</span>
                <span>B: Moon in <strong className="text-white">{result.person2Nakshatra}</strong> ({result.person2MoonSign})</span>
              </div>
            </div>

            {/* Kutas */}
            <div className="glass rounded-2xl p-6 border border-white/5">
              <p className="text-xs uppercase font-bold tracking-wider mb-6" style={{ color: "var(--text-muted)" }}>Ashtakoota Breakdown</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {result.kutas.map((kuta) => <KutaRow key={kuta.name} kuta={kuta} />)}
              </div>
            </div>

            <div className="text-center">
              <Button onClick={() => { setResult(null); setError(null); }} variant="ghost"
                className="text-xs gap-1.5" style={{ color: "var(--text-muted)" }}>
                <RefreshCw className="w-3.5 h-3.5" />Compare Another Pair
              </Button>
            </div>

            <p className="text-[10px] text-center" style={{ color: "var(--text-muted)" }}>
              Vedic compatibility analysis is a traditional system for reflection. Not a guarantee of relationship outcomes.
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
