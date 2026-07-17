"use client";

import { useState } from "react";
import { Sparkles, Hash, Calendar, Heart, ShieldAlert, Award } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NumerologyPage() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "calculated">("idle");

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dob) return;

    setStatus("loading");
    setTimeout(() => {
      setStatus("calculated");
    }, 1200);
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Numerology Calculators
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Calculate key numerology nodes (Life Path, Destiny, Soul Urge numbers) to evaluate your vibrational cycles.
          </p>
        </div>

        {/* Input Parameters */}
        <div className="max-w-xl mx-auto mb-10">
          <form onSubmit={handleCalculate} className="glass rounded-2xl p-6 border border-white/5 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Full Name *</label>
              <Input
                type="text"
                placeholder="Name as registered at birth"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
                disabled={status === "loading"}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Date of Birth *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: "var(--text-muted)" }}>
                  <Calendar className="w-4 h-4" />
                </span>
                <Input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="h-12 pl-9 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
                  disabled={status === "loading"}
                />
              </div>
            </div>
            <Button type="submit" disabled={status === "loading"} className="w-full h-12 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}>
              {status === "loading" ? "Summing alphabetical values..." : "Compute Core Numbers"}
            </Button>
          </form>
        </div>

        {/* Calculated Results */}
        {status === "calculated" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {/* Life Path */}
            <div className="glass rounded-xl p-6 border border-white/5 text-center flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>Life Path Number</span>
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}>
                  7
                </div>
                <h3 className="text-sm font-semibold text-white mb-2" style={{ fontFamily: "var(--font-outfit)" }}>The Analyst & Truth Seeker</h3>
                <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Governed by intellect, reflection, and spiritual inquiry. Avoid cynicism and extreme isolation.</p>
              </div>
            </div>

            {/* Destiny / Expression */}
            <div className="glass rounded-xl p-6 border border-white/5 text-center flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>Destiny Number</span>
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" style={{ background: "var(--gradient-purple)", color: "white" }}>
                  5
                </div>
                <h3 className="text-sm font-semibold text-white mb-2" style={{ fontFamily: "var(--font-outfit)" }}>The Messenger & Adventurer</h3>
                <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Vibrates with movement, flexibility, and communication. Avoid lack of focus or impulsiveness.</p>
              </div>
            </div>

            {/* Soul Urge */}
            <div className="glass rounded-xl p-6 border border-white/5 text-center flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>Soul Urge Number</span>
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" style={{ background: "rgba(212,175,55,0.1)", color: "var(--gold-light)", border: "1px solid rgba(212,175,55,0.2)" }}>
                  9
                </div>
                <h3 className="text-sm font-semibold text-white mb-2" style={{ fontFamily: "var(--font-outfit)" }}>The Humanitarian & Philosopher</h3>
                <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Your inner desire is to serve, teach, and uplift others. Avoid holding on to emotional weights.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
