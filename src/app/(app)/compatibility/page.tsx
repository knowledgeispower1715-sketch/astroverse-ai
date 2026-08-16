"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Loader2, AlertCircle, Heart, Users, Sparkles } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlobalLocationPicker } from "@/components/location/global-location-picker";
import { createClient } from "@/lib/supabase/client";
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
    name1: "", dob1: "", time1: "12:00", place1: "", country1: "", lat1: 0, lon1: 0, tz1: "UTC",
    name2: "", dob2: "", time2: "12:00", place2: "", country2: "", lat2: 0, lon2: 0, tz2: "UTC",
  });
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPrimaryProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profiles } = await supabase
            .from("birth_profiles")
            .select("*")
            .eq("user_id", user.id)
            .order("is_primary", { ascending: false });

          if (profiles && profiles.length > 0) {
            const p1 = profiles[0];
            setFormData((prev) => ({
              ...prev,
              name1: p1.name || p1.profile_name || user.user_metadata?.name || "Person 1",
              dob1: p1.date_of_birth || "",
              time1: p1.time_of_birth ? p1.time_of_birth.slice(0, 5) : "12:00",
              place1: p1.birth_place || "",
              country1: p1.country || "",
              lat1: Number(p1.latitude) || 0,
              lon1: Number(p1.longitude) || 0,
              tz1: p1.timezone || "UTC",
            }));

            if (profiles.length > 1) {
              const p2 = profiles[1];
              setFormData((prev) => ({
                ...prev,
                name2: p2.name || p2.profile_name || "Person 2",
                dob2: p2.date_of_birth || "",
                time2: p2.time_of_birth ? p2.time_of_birth.slice(0, 5) : "12:00",
                place2: p2.birth_place || "",
                country2: p2.country || "",
                lat2: Number(p2.latitude) || 0,
                lon2: Number(p2.longitude) || 0,
                tz2: p2.timezone || "UTC",
              }));
            }
          }
        }
      } catch (err) {
        console.error("Error loading profiles for compatibility:", err);
      }
    }
    loadPrimaryProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dob1 || !formData.dob2) {
      setError("Please specify date of birth for both individuals.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          dob1: formData.dob1, 
          time1: formData.time1 || "12:00", 
          dob2: formData.dob2, 
          time2: formData.time2 || "12:00" 
        }),
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
    <PageWrapper title="Vedic Compatibility | AstroVerse AI" description="Ashtakoota 36-point Guna Milan synastry analysis between two charts.">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Vedic Compatibility Analysis
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Ashtakoota 36-Guna Milan synastry evaluation derived from lunar nakshatras and planetary harmonies.
          </p>
        </div>

        {!result && (
          <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Person A */}
              <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Users className="w-4 h-4 text-gold" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>
                    Person A Profile
                  </h3>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold block text-white/70">Full Name *</label>
                  <Input 
                    type="text" 
                    placeholder="Enter full name"
                    value={formData.name1}
                    onChange={e => setFormData({ ...formData, name1: e.target.value })}
                    className="h-11 bg-white/5 border-white/10 text-white rounded-lg" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold block text-white/70">Date of Birth *</label>
                    <Input 
                      type="date" 
                      value={formData.dob1}
                      onChange={e => setFormData({ ...formData, dob1: e.target.value })}
                      className="h-11 bg-white/5 border-white/10 text-white rounded-lg" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold block text-white/70">Birth Time</label>
                    <Input 
                      type="time" 
                      value={formData.time1}
                      onChange={e => setFormData({ ...formData, time1: e.target.value })}
                      className="h-11 bg-white/5 border-white/10 text-white rounded-lg" 
                    />
                  </div>
                </div>

                <GlobalLocationPicker
                  label="Birth Place (Worldwide)"
                  value={{
                    birthPlace: formData.place1,
                    country: formData.country1,
                    latitude: formData.lat1,
                    longitude: formData.lon1,
                    timezone: formData.tz1,
                  }}
                  onChange={(loc) => {
                    setFormData((prev) => ({
                      ...prev,
                      place1: loc.birthPlace,
                      country1: loc.country,
                      lat1: loc.latitude,
                      lon1: loc.longitude,
                      tz1: loc.timezone,
                    }));
                  }}
                />
              </div>

              {/* Person B */}
              <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>
                    Person B Profile
                  </h3>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold block text-white/70">Full Name *</label>
                  <Input 
                    type="text" 
                    placeholder="Enter full name"
                    value={formData.name2}
                    onChange={e => setFormData({ ...formData, name2: e.target.value })}
                    className="h-11 bg-white/5 border-white/10 text-white rounded-lg" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold block text-white/70">Date of Birth *</label>
                    <Input 
                      type="date" 
                      value={formData.dob2}
                      onChange={e => setFormData({ ...formData, dob2: e.target.value })}
                      className="h-11 bg-white/5 border-white/10 text-white rounded-lg" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold block text-white/70">Birth Time</label>
                    <Input 
                      type="time" 
                      value={formData.time2}
                      onChange={e => setFormData({ ...formData, time2: e.target.value })}
                      className="h-11 bg-white/5 border-white/10 text-white rounded-lg" 
                    />
                  </div>
                </div>

                <GlobalLocationPicker
                  label="Birth Place (Worldwide)"
                  value={{
                    birthPlace: formData.place2,
                    country: formData.country2,
                    latitude: formData.lat2,
                    longitude: formData.lon2,
                    timezone: formData.tz2,
                  }}
                  onChange={(loc) => {
                    setFormData((prev) => ({
                      ...prev,
                      place2: loc.birthPlace,
                      country2: loc.country,
                      lat2: loc.latitude,
                      lon2: loc.longitude,
                      tz2: loc.timezone,
                    }));
                  }}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-500 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20 max-w-md mx-auto">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="text-center pt-2">
              <Button 
                type="submit" 
                disabled={loading} 
                className="h-12 px-8 rounded-full text-sm font-semibold gap-2 cursor-pointer shadow-lg"
                style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? "Computing Guna Milan..." : "Calculate 36-Point Compatibility"}
              </Button>
            </div>
          </form>
        )}

        {result && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Overview Banner */}
            <div className="glass rounded-2xl p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div>
                <span className="text-xs uppercase font-bold text-gold tracking-wider">Ashtakoota Synastry Score</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1" style={{ fontFamily: "var(--font-outfit)" }}>
                  {formData.name1 || "Person A"} &amp; {formData.name2 || "Person B"}
                </h2>
                <p className="text-xs text-white/60 mt-1">
                  {result.verdict}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <ScoreRing score={result.percentage} size={90} />
                <div className="text-left">
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                    {result.totalScore}<span className="text-base text-white/40"> / 36</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/10 text-gold-light">
                    {result.percentage}% Match
                  </span>
                </div>
              </div>
            </div>

            {/* Ashtakoota Breakdown */}
            <div className="glass rounded-2xl p-8 border border-white/5 space-y-6">
              <h3 className="text-base font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-outfit)" }}>
                8-Fold Kuta Analysis Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.kutas.map((k) => (
                  <KutaRow key={k.name} kuta={k} />
                ))}
              </div>
            </div>

            <div className="text-center">
              <Button onClick={() => setResult(null)} variant="outline" className="text-xs border-white/10 hover:border-gold/30 cursor-pointer">
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Calculate Another Compatibility
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
