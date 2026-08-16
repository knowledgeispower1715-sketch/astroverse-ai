"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, Orbit, Compass, User, Clock, Calendar, CheckCircle2, Info } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { 
  buildCanonicalAstrologyContext, 
  generateTransitTimeline, 
  getPlanetExplorerData,
  type CanonicalAstrologyContext,
  type TransitTimelineWindow,
  type PlanetExplorerData
} from "@/modules/astrology-engine";
import { ProfileSwitcher, type ProfileOption } from "@/components/profile/profile-switcher";
import { cn } from "@/lib/utils";

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂",
  Jupiter: "♃", Saturn: "♄", Rahu: "☊", Ketu: "☋",
};

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

export default function TransitPage() {
  const [activeTab, setActiveTab] = useState<"timeline" | "planets" | "global">("timeline");
  const [selectedHorizon, setSelectedHorizon] = useState<string>("today");
  const [selectedPlanet, setSelectedPlanet] = useState<string>("Jupiter");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);

  // User birth profile state
  const [profiles, setProfiles] = useState<RawBirthProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>("");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    async function loadUserData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserName(user.user_metadata?.name || "User");
          const { data: rawProfiles } = await supabase
            .from("birth_profiles")
            .select("*")
            .eq("user_id", user.id)
            .order("is_primary", { ascending: false });

          if (rawProfiles && rawProfiles.length > 0) {
            setProfiles(rawProfiles);
            setActiveProfileId(rawProfiles[0].id);
          }
        }
      } catch (err) {
        console.error("Error loading profiles in transit page:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, []);

  const activeRawProfile = useMemo(() => {
    return profiles.find((p) => p.id === activeProfileId) || profiles[0] || null;
  }, [profiles, activeProfileId]);

  const canonicalContext = useMemo<CanonicalAstrologyContext | null>(() => {
    if (!activeRawProfile || !activeRawProfile.date_of_birth || !activeRawProfile.birth_place) {
      return null;
    }
    return buildCanonicalAstrologyContext(
      {
        name: activeRawProfile.name || userName,
        dateOfBirth: activeRawProfile.date_of_birth,
        timeOfBirth: activeRawProfile.time_of_birth || "12:00:00",
        birthPlace: activeRawProfile.birth_place,
        country: activeRawProfile.country,
        latitude: Number(activeRawProfile.latitude) || 0,
        longitude: Number(activeRawProfile.longitude) || 0,
        timezone: activeRawProfile.timezone || "UTC",
      },
      { calculationDate: new Date(date) }
    );
  }, [activeRawProfile, userName, date]);

  const timelineWindows = useMemo<TransitTimelineWindow[]>(() => {
    if (!canonicalContext) return [];
    return generateTransitTimeline(canonicalContext, new Date(date));
  }, [canonicalContext, date]);

  const activeTimelineItem = useMemo(() => {
    return timelineWindows.find((w) => w.horizon === selectedHorizon) || timelineWindows[1] || timelineWindows[0];
  }, [timelineWindows, selectedHorizon]);

  const planetExplorerData = useMemo<PlanetExplorerData | null>(() => {
    if (!canonicalContext) return null;
    return getPlanetExplorerData(canonicalContext, selectedPlanet);
  }, [canonicalContext, selectedPlanet]);

  const profileOptions: ProfileOption[] = profiles.map((p) => ({
    id: p.id,
    name: p.name || p.profile_name || "Birth Chart",
    relationship: p.relationship || (p.is_primary ? "Self" : "Family"),
    dateOfBirth: p.date_of_birth || "",
    birthPlace: p.birth_place || "",
    isPrimary: p.is_primary,
  }));

  return (
    <PageWrapper title="Transits & Timing Windows | AstroVerse AI" description="Real-time planetary transits analyzed against your natal Lagna and Moon with deterministic timing horizons.">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header & Profile Switcher */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gold/10 border border-gold/20 text-gold-light mb-2">
              <Orbit className="w-3.5 h-3.5" />
              Gochara Ephemeris Timing Engine
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
              Planetary Transits &amp; Timing Windows
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-1">
              Active planetary motions computed from Swiss Ephemeris against {activeRawProfile?.name || userName}&apos;s natal Lagna ({canonicalContext?.angles.ascendant.sign || "—"}).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {profileOptions.length > 0 && (
              <ProfileSwitcher
                profiles={profileOptions}
                activeProfileId={activeProfileId}
                onSelectProfile={(id) => setActiveProfileId(id)}
              />
            )}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white">
              <Calendar className="w-3.5 h-3.5 text-gold" />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent border-0 text-white text-xs p-0 h-auto focus-visible:ring-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
          {[
            { id: "timeline", label: "Multi-Horizon Timing Windows", icon: Clock },
            { id: "planets", label: "Planetary Explorer", icon: Orbit },
            { id: "global", label: "Global Ephemeris Positions", icon: Compass },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as "timeline" | "planets" | "global")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                  activeTab === tab.id
                    ? "bg-gold text-black font-bold shadow-md shadow-gold/20"
                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
            <p className="text-xs text-white/60">Calculating celestial ephemeris coordinates...</p>
          </div>
        ) : !canonicalContext ? (
          <div className="p-8 text-center glass rounded-2xl border border-white/10 space-y-3">
            <User className="w-8 h-8 text-gold mx-auto" />
            <h3 className="text-base font-bold text-white">No Birth Profile Selected</h3>
            <p className="text-xs text-white/60 max-w-md mx-auto">
              Please complete onboarding or select a birth profile to calculate personalized Gochara transits against your natal chart.
            </p>
          </div>
        ) : (
          <>
            {/* TAB 1: MULTI-HORIZON TIMING TIMELINE */}
            {activeTab === "timeline" && (
              <div className="space-y-6">
                {/* Horizon Selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {timelineWindows.map((tw) => (
                    <button
                      key={tw.horizon}
                      type="button"
                      onClick={() => setSelectedHorizon(tw.horizon)}
                      className={cn(
                        "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border",
                        selectedHorizon === tw.horizon
                          ? "bg-white/15 border-gold text-gold shadow-sm font-bold"
                          : "bg-white/5 border-white/5 text-white/60 hover:text-white hover:border-white/20"
                      )}
                    >
                      {tw.horizonLabel}
                    </button>
                  ))}
                </div>

                {/* Active Window Detail Card */}
                {activeTimelineItem && (
                  <div className="glass rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-bold tracking-wider text-gold uppercase">
                          {activeTimelineItem.horizonLabel} ({activeTimelineItem.startDate} to {activeTimelineItem.endDate})
                        </span>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5" style={{ fontFamily: "var(--font-outfit)" }}>
                          {activeTimelineItem.theme}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-3 py-1 rounded-full bg-gold/10 text-gold-light border border-gold/20 font-semibold">
                          House {activeTimelineItem.activatedHouse} Activated
                        </span>
                      </div>
                    </div>

                    {/* Supportive vs Challenging Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4" />
                          Supportive Opportunity Potential
                        </div>
                        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                          {activeTimelineItem.supportivePotential}
                        </p>
                      </div>

                      <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                          <Info className="w-4 h-4" />
                          Areas Requiring Caution &amp; Balance
                        </div>
                        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                          {activeTimelineItem.challengingPotential}
                        </p>
                      </div>
                    </div>

                    {/* Precaution & Traditional Basis */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="md:col-span-2 p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Practical Action &amp; Precaution</span>
                        <p className="text-xs text-white/80">{activeTimelineItem.precautions}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Astrological Basis</span>
                        <p className="text-[11px] text-white/60">{activeTimelineItem.traditionalBasis}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PLANETARY EXPLORER */}
            {activeTab === "planets" && (
              <div className="space-y-6">
                {/* Planet Selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSelectedPlanet(p)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border",
                        selectedPlanet === p
                          ? "bg-gold text-black border-gold font-bold shadow-md"
                          : "bg-white/5 border-white/5 text-white/70 hover:text-white hover:border-white/20"
                      )}
                    >
                      <span className="font-mono text-sm">{PLANET_SYMBOLS[p]}</span>
                      {p}
                    </button>
                  ))}
                </div>

                {/* Planet Explorer Card */}
                {planetExplorerData && (
                  <div className="glass rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold/20 to-purple/30 border border-gold/30 flex items-center justify-center text-2xl text-gold font-mono">
                          {planetExplorerData.symbol}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                            {planetExplorerData.planet} Detailed Planetary Analysis
                          </h2>
                          <p className="text-xs text-white/60">
                            {planetExplorerData.strengthBreakdown.houseStrength} • Dignity: {planetExplorerData.strengthBreakdown.dignity}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs px-3 py-1 rounded bg-white/5 border border-white/10 text-white font-mono">
                          Shadbala Strength: {planetExplorerData.strengthBreakdown.score}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                          <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Natal Placement</span>
                          <p className="text-xs text-white/80 leading-relaxed">
                            {planetExplorerData.traditionalInterpretation.natalTheme}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                          <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Current Transit Gochara</span>
                          <p className="text-xs text-white/80 leading-relaxed">
                            {planetExplorerData.traditionalInterpretation.currentTransitTheme}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                          <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Natural Karakatwas (Significations)</span>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {planetExplorerData.karakatwas.map((k) => (
                              <span key={k} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/70 border border-white/5">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                          <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Prescribed Traditional Remedy</span>
                          <p className="text-xs text-white/80 leading-relaxed">
                            {planetExplorerData.traditionalInterpretation.prescribedRemedy}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: GLOBAL EPHEMERIS POSITIONS */}
            {activeTab === "global" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.values(canonicalContext.planets).map((p) => (
                  <div key={p.id} className="glass rounded-xl p-4 border border-white/5 space-y-2 hover:border-gold/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base text-gold font-mono">{p.symbol}</span>
                        <span className="text-sm font-bold text-white">{p.name}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">
                        House {p.house}
                      </span>
                    </div>
                    <p className="text-xs text-white/70 font-mono">
                      {p.sign} {p.degreeInSign}°{p.minuteInSign}&apos; ({p.nakshatra.name})
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-white/40 pt-2 border-t border-white/5">
                      <span>Dignity: {p.dignity}</span>
                      <span>Strength: {p.strengthScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}
