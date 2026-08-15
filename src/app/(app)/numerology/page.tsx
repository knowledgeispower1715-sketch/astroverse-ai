"use client";

import { useState } from "react";
import { Calendar, Loader2, AlertCircle } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { NumerologyResult } from "@/modules/prediction-engine";

function NumberCircle({ n, gradient }: { n: number; label?: string; gradient: string }) {
  return (
    <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 border-2" style={{ background: gradient, color: "var(--bg-primary)", borderColor: "transparent" }}>
      {n}
    </div>
  );
}

export default function NumerologyPage() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/numerology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dob }),
      });
      const json = await res.json() as { data?: NumerologyResult; error?: string };
      if (json.data) setResult(json.data);
      else setError(json.error ?? "Calculation failed");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cards = result ? [
    { label: "Life Path", number: result.lifePath, interp: result.interpretations.lifePath, gradient: "var(--gradient-gold)" },
    result.destiny !== null ? { label: "Destiny / Expression", number: result.destiny!, interp: result.interpretations.destiny!, gradient: "var(--gradient-purple)" } : null,
    result.soulUrge !== null ? { label: "Soul Urge", number: result.soulUrge!, interp: result.interpretations.soulUrge!, gradient: "rgba(212,175,55,0.2)" } : null,
    result.personality !== null ? { label: "Personality", number: result.personality!, interp: result.interpretations.personality!, gradient: "rgba(124,58,237,0.3)" } : null,
    { label: "Birthday", number: result.birthday, interp: result.interpretations.birthday, gradient: "rgba(16,185,129,0.2)" },
  ].filter(Boolean) : [];

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Numerology Calculator
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Pythagorean numerology system. Life Path computed from date of birth. Destiny, Soul Urge, and Personality computed from your full birth name.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-10">
          <form onSubmit={handleCalculate} className="glass rounded-2xl p-6 border border-white/5 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Full Name at Birth <span className="text-white/40">(optional — enables Destiny, Soul Urge, Personality)</span></label>
              <Input type="text" placeholder="Enter full name as registered at birth"
                value={name} onChange={e => setName(e.target.value)}
                className="h-12 bg-white/5 border-white/10 text-white rounded-lg" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Date of Birth *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: "var(--text-muted)" }}>
                  <Calendar className="w-4 h-4" />
                </span>
                <Input type="date" value={dob} onChange={e => setDob(e.target.value)} required
                  className="h-12 pl-9 bg-white/5 border-white/10 text-white rounded-lg" />
              </div>
            </div>
            <Button type="submit" disabled={loading || !dob}
              className="w-full h-12 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Computing Core Numbers…</> : "Compute Core Numbers"}
            </Button>
          </form>
        </div>

        {error && (
          <div className="glass rounded-2xl p-6 border border-red-500/20 flex items-center gap-4 max-w-xl mx-auto mb-6">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => card && (
                <div key={card.label} className="glass rounded-xl p-6 border border-white/5 text-center flex flex-col justify-between min-h-[240px]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider block mb-3" style={{ color: "var(--text-muted)" }}>{card.label}</span>
                    <NumberCircle n={card.number} label={card.label} gradient={card.gradient} />
                    <h3 className="text-sm font-semibold text-white mb-2" style={{ fontFamily: "var(--font-outfit)" }}>{card.interp.title}</h3>
                    <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{card.interp.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-center" style={{ color: "var(--text-muted)" }}>
              Numerology is an interpretive system for self-reflection. Results are for entertainment purposes only.
              Calculations use the standard Pythagorean system.
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
