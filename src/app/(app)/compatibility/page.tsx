"use client";

import { useState } from "react";
import { Sparkles, Heart, RefreshCw, Star, Info, MessageSquare } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CompatibilityPage() {
  const [formData, setFormData] = useState({
    name1: "", dob1: "", time1: "", place1: "",
    name2: "", dob2: "", time2: "", place2: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "calculated">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name1.trim() || !formData.dob1 || !formData.name2.trim() || !formData.dob2) return;

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
            Relationship Compatibility
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Discover the chemistry and dynamics between two charts using advanced synastry aspect models.
          </p>
        </div>

        {status !== "calculated" && (
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Partner 1 */}
              <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>Person A Details</h3>
                <div className="space-y-1">
                  <label className="text-xs font-semibold block text-white/70">Name</label>
                  <Input
                    type="text"
                    placeholder="Enter name"
                    value={formData.name1}
                    onChange={(e) => setFormData({ ...formData, name1: e.target.value })}
                    className="h-10 bg-white/5 border-white/10 text-white rounded-lg"
                    disabled={status === "loading"}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold block text-white/70">Birth Date</label>
                    <Input
                      type="date"
                      value={formData.dob1}
                      onChange={(e) => setFormData({ ...formData, dob1: e.target.value })}
                      className="h-10 bg-white/5 border-white/10 text-white rounded-lg"
                      disabled={status === "loading"}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold block text-white/70">Birth Time</label>
                    <Input
                      type="time"
                      value={formData.time1}
                      onChange={(e) => setFormData({ ...formData, time1: e.target.value })}
                      className="h-10 bg-white/5 border-white/10 text-white rounded-lg"
                      disabled={status === "loading"}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold block text-white/70">Birth Place</label>
                  <Input
                    type="text"
                    placeholder="City, State"
                    value={formData.place1}
                    onChange={(e) => setFormData({ ...formData, place1: e.target.value })}
                    className="h-10 bg-white/5 border-white/10 text-white rounded-lg"
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              {/* Partner 2 */}
              <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>Person B Details</h3>
                <div className="space-y-1">
                  <label className="text-xs font-semibold block text-white/70">Name</label>
                  <Input
                    type="text"
                    placeholder="Enter name"
                    value={formData.name2}
                    onChange={(e) => setFormData({ ...formData, name2: e.target.value })}
                    className="h-10 bg-white/5 border-white/10 text-white rounded-lg"
                    disabled={status === "loading"}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold block text-white/70">Birth Date</label>
                    <Input
                      type="date"
                      value={formData.dob2}
                      onChange={(e) => setFormData({ ...formData, dob2: e.target.value })}
                      className="h-10 bg-white/5 border-white/10 text-white rounded-lg"
                      disabled={status === "loading"}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold block text-white/70">Birth Time</label>
                    <Input
                      type="time"
                      value={formData.time2}
                      onChange={(e) => setFormData({ ...formData, time2: e.target.value })}
                      className="h-10 bg-white/5 border-white/10 text-white rounded-lg"
                      disabled={status === "loading"}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold block text-white/70">Birth Place</label>
                  <Input
                    type="text"
                    placeholder="City, State"
                    value={formData.place2}
                    onChange={(e) => setFormData({ ...formData, place2: e.target.value })}
                    className="h-10 bg-white/5 border-white/10 text-white rounded-lg"
                    disabled={status === "loading"}
                  />
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button type="submit" disabled={status === "loading"} className="h-12 px-10 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}>
                {status === "loading" ? "Analyzing chart midpoints..." : "Analyze Compatibility"}
              </Button>
            </div>
          </form>
        )}

        {status === "calculated" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Header Result */}
            <div className="glass rounded-2xl p-6 border border-white/5 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.06) 0%, transparent 60%)" }} />
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(212, 175, 55, 0.1)", color: "var(--gold)" }}>
                <Heart className="w-8 h-8 fill-current text-gold animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-outfit)" }}>{formData.name1} & {formData.name2}</h2>
              <div className="text-4xl font-extrabold text-gradient-gold mb-2">88%</div>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Auspicious Chemistry</span>
            </div>

            {/* Score Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="glass rounded-xl p-5 border border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-white/50">Communication</span>
                <span className="text-lg font-bold text-white">92%</span>
              </div>
              <div className="glass rounded-xl p-5 border border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-white/50">Values Alignment</span>
                <span className="text-lg font-bold text-white">85%</span>
              </div>
              <div className="glass rounded-xl p-5 border border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-white/50">Long-term Destiny</span>
                <span className="text-lg font-bold text-white">87%</span>
              </div>
            </div>

            {/* Reset option */}
            <div className="text-center">
              <Button onClick={() => setStatus("idle")} variant="ghost" className="text-xs gap-1.5" style={{ color: "var(--text-muted)" }}>
                <RefreshCw className="w-3.5 h-3.5" />
                Compare Another Pair
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
