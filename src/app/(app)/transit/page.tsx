"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Orbit, 
  Compass, 
  User, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Layers,
  Sparkles,
  ShieldAlert,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnimatedCard } from "@/components/shared/animated-card";
import { 
  buildCanonicalAstrologyContext, 
  generateTransitTimeline, 
  getPlanetExplorerData,
  crossValidateDomain,
  calculateAshtakavarga,
  type CanonicalAstrologyContext,
  type TransitTimelineWindow,
  type PlanetExplorerData
} from "@/modules/astrology-engine";
import { useProfile } from "@/components/profile/profile-context";
import { ProfileSwitcher, type ProfileOption } from "@/components/profile/profile-switcher";
import { cn } from "@/lib/utils";

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂",
  Jupiter: "♃", Saturn: "♄", Rahu: "☊", Ketu: "☋",
};

export default function TransitPage() {
  const { profiles, activeProfile, activeProfileId, setActiveProfileId, hasProfile, loading: profileLoading } = useProfile();
  const [activeTab, setActiveTab] = useState<"timeline" | "planets" | "global">("timeline");
  const [selectedHorizon, setSelectedHorizon] = useState<string>("today");
  const [selectedPlanet, setSelectedPlanet] = useState<string>("Jupiter");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  // Compute canonical context from active profile
  const canonicalContext = useMemo<CanonicalAstrologyContext | null>(() => {
    if (!activeProfile || !activeProfile.date_of_birth || !activeProfile.birth_place) {
      return null;
    }
    return buildCanonicalAstrologyContext(
      {
        name: activeProfile.name || "My Chart",
        dateOfBirth: activeProfile.date_of_birth,
        timeOfBirth: activeProfile.time_of_birth || "12:00:00",
        birthPlace: activeProfile.birth_place,
        country: activeProfile.country,
        latitude: Number(activeProfile.latitude) || 0,
        longitude: Number(activeProfile.longitude) || 0,
        timezone: activeProfile.timezone || "UTC",
      },
      { calculationDate: new Date(date) }
    );
  }, [activeProfile, date]);

  // Compute transit timing windows across 7 horizons
  const timelineWindows = useMemo<TransitTimelineWindow[]>(() => {
    if (!canonicalContext) return [];
    return generateTransitTimeline(canonicalContext, new Date(date));
  }, [canonicalContext, date]);

  const activeTimelineItem = useMemo(() => {
    return timelineWindows.find((w) => w.horizon === selectedHorizon) || timelineWindows[1] || timelineWindows[0];
  }, [timelineWindows, selectedHorizon]);

  // Compute planet explorer diagnostics
  const planetExplorerData = useMemo<PlanetExplorerData | null>(() => {
    if (!canonicalContext) return null;
    return getPlanetExplorerData(canonicalContext, selectedPlanet);
  }, [canonicalContext, selectedPlanet]);

  // Multi-System Cross-Validation
  const crossValidation = useMemo(() => {
    if (!canonicalContext) return null;
    return crossValidateDomain(canonicalContext, "career");
  }, [canonicalContext]);

  // Ashtakavarga SAV scores
  const ashtakavarga = useMemo(() => {
    if (!canonicalContext) return null;
    const planetSigns: Record<string, number> = {};
    for (const [pName, p] of Object.entries(canonicalContext.planets)) {
      planetSigns[pName] = p.signIndex;
    }
    return calculateAshtakavarga(canonicalContext.angles.ascendant.signIndex, planetSigns);
  }, [canonicalContext]);

  const profileOptions: ProfileOption[] = profiles.map((p) => ({
    id: p.id,
    name: p.name || p.profile_name || "Birth Chart",
    relationship: p.relationship || (p.is_primary ? "Self" : "Family"),
    dateOfBirth: p.date_of_birth || "",
    birthPlace: p.birth_place || "",
    isPrimary: p.is_primary,
  }));

  return (
    <PageWrapper title="Gochara Transits & Timing Windows | AstroVerse AI" description="Real-time planetary transits analyzed against your natal Lagna and Moon with deterministic multi-horizon timing.">
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
              {activeProfile ? (
                <>Active planetary motions computed from Swiss Ephemeris against <strong>{activeProfile.name}</strong>&apos;s natal Lagna ({canonicalContext?.angles.ascendant.sign || "—"}).</>
              ) : (
                <>Real-time planetary ephemeris motions and Gochara transits across all 12 sidereal zodiac signs.</>
              )}
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

        {/* Unauthenticated / No Profile Warning State */}
        {!hasProfile && !profileLoading && (
          <div className="glass rounded-2xl p-8 border border-gold/30 text-center space-y-4 max-w-2xl mx-auto my-8">
            <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto text-gold">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
              Select or Create a Birth Profile for Personalized Gochara
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Planetary transits activate specific houses relative to your individual <strong>Ascendant (Lagna)</strong> and <strong>Moon Sign (Rashi)</strong>. Set up your birth profile once to unlock personalized multi-horizon timing and Dasha integration.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link href="/kundli">
                <Button className="h-10 px-6 text-xs font-bold bg-gold text-black hover:bg-gold-light">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Calculate My Kundli &amp; Save Profile
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button variant="outline" className="h-10 px-5 text-xs border-white/10 text-white/80 hover:text-white">
                  Quick Setup
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Profile Summary Strip (When Profile Active) */}
        {canonicalContext && activeProfile && (
          <div className="glass-strong rounded-2xl p-5 border border-white/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
            <div>
              <span className="text-white/40 block text-[10px] uppercase tracking-wider font-semibold">Profile</span>
              <span className="font-bold text-white truncate block">{activeProfile.name}</span>
            </div>
            <div>
              <span className="text-white/40 block text-[10px] uppercase tracking-wider font-semibold">Birthplace</span>
              <span className="text-white/80 truncate block">{activeProfile.birth_place}</span>
            </div>
            <div>
              <span className="text-white/40 block text-[10px] uppercase tracking-wider font-semibold">Natal Lagna</span>
              <span className="font-bold text-gold-light block">{canonicalContext.angles.ascendant.sign} ({canonicalContext.angles.ascendant.degree}°)</span>
            </div>
            <div>
              <span className="text-white/40 block text-[10px] uppercase tracking-wider font-semibold">Moon Sign / Rashi</span>
              <span className="font-bold text-white block">{canonicalContext.planets.Moon.sign}</span>
            </div>
            <div>
              <span className="text-white/40 block text-[10px] uppercase tracking-wider font-semibold">Nakshatra</span>
              <span className="text-white/80 block">{canonicalContext.planets.Moon.nakshatra.name} (P{canonicalContext.planets.Moon.nakshatra.pada || 1})</span>
            </div>
            <div>
              <span className="text-white/40 block text-[10px] uppercase tracking-wider font-semibold">Active Dasha</span>
              <span className="font-bold text-emerald-400 block">{canonicalContext.currentDasha.mahadasha.planet} Mahadasha</span>
            </div>
          </div>
        )}

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

        {/* TAB 1: MULTI-HORIZON TIMING WINDOWS */}
        {activeTab === "timeline" && (
          <div className="space-y-6">
            {/* Horizon Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {timelineWindows.map((w) => (
                <button
                  key={w.horizon}
                  type="button"
                  onClick={() => setSelectedHorizon(w.horizon)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border",
                    selectedHorizon === w.horizon
                      ? "bg-white/15 border-gold text-gold-light shadow-lg font-bold"
                      : "bg-white/5 border-white/5 text-white/60 hover:text-white hover:border-white/20"
                  )}
                >
                  {w.horizonLabel}
                </button>
              ))}
            </div>

            {activeTimelineItem && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Window Focus Card */}
                <div className="lg:col-span-2 space-y-6">
                  <AnimatedCard className="p-6 sm:p-8 space-y-6 border-gold/30">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-light">
                          {activeTimelineItem.horizonLabel} ({activeTimelineItem.startDate} to {activeTimelineItem.endDate})
                        </span>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5" style={{ fontFamily: "var(--font-outfit)" }}>
                          {activeTimelineItem.theme}
                        </h2>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-gold/10 border border-gold/20 text-xs font-bold text-gold shrink-0">
                        House {activeTimelineItem.activatedHouse} Activated
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Transit Planetary Driver</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white">
                            {activeTimelineItem.transitingPlanet} in {activeTimelineItem.transitingSign}
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gold-light">
                            {activeTimelineItem.aspectToNatal}
                          </span>
                        </div>
                      </div>

                      {/* Supportive vs Challenging Potentials */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                            <TrendingUp className="w-3.5 h-3.5" />
                            Supportive Opportunities
                          </span>
                          <p className="text-xs text-white/80 leading-relaxed">
                            {activeTimelineItem.supportivePotential}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Structural Pacing &amp; Challenges
                          </span>
                          <p className="text-xs text-white/80 leading-relaxed">
                            {activeTimelineItem.challengingPotential}
                          </p>
                        </div>
                      </div>

                      {/* Precautions */}
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-gold">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Practical Action Guidelines
                        </span>
                        <div className="flex items-start gap-2 text-xs text-white/70">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold/60 shrink-0 mt-0.5" />
                          <span>{activeTimelineItem.precautions}</span>
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                </div>

                {/* Cross-Validation & Dasha Summary Column */}
                <div className="space-y-6">
                  {crossValidation && (
                    <AnimatedCard className="p-6 space-y-4 border-white/10">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-gold" />
                          Multi-System Cross-Validation
                        </span>
                        <span className="text-xs font-mono font-bold text-gold-light">
                          {crossValidation.evidenceStrengthScore}% Score
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-gold/10 border border-gold/20">
                          <span className="text-[10px] uppercase font-bold text-gold-light block mb-0.5">Synthesis Verdict</span>
                          <p className="text-xs font-semibold text-white">{crossValidation.verdict}</p>
                        </div>

                        <div className="space-y-2 text-xs">
                          {crossValidation.evidenceNodes.slice(0, 4).map((node, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-[11px]">
                              <span className="text-white/60">{node.system}</span>
                              <span className={cn(
                                "font-semibold capitalize",
                                node.effect === "supportive" ? "text-emerald-400" : node.effect === "challenging" ? "text-amber-400" : "text-white/70"
                              )}>
                                {node.effect}
                              </span>
                            </div>
                          ))}
                        </div>

                        <p className="text-[11px] text-white/50 leading-relaxed pt-1">
                          {crossValidation.contradictionAnalysis.summary}
                        </p>
                      </div>
                    </AnimatedCard>
                  )}

                  {ashtakavarga && (
                    <AnimatedCard className="p-6 space-y-3 border-white/10">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-gold" />
                        Sarvashtakavarga (SAV) Transit Support
                      </span>
                      <p className="text-[11px] text-white/60 leading-relaxed">
                        Total bindus: <strong>337</strong> across 12 houses. Activated house {activeTimelineItem.activatedHouse} has {ashtakavarga.sarvashtakavarga.byHouse[activeTimelineItem.activatedHouse - 1]?.points || 28} points ({ashtakavarga.sarvashtakavarga.byHouse[activeTimelineItem.activatedHouse - 1]?.rating || "average"}).
                      </p>
                    </AnimatedCard>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PLANETARY EXPLORER */}
        {activeTab === "planets" && (
          <div className="space-y-6">
            {/* Planet Selector Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
              {["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].map((pName) => (
                <button
                  key={pName}
                  type="button"
                  onClick={() => setSelectedPlanet(pName)}
                  className={cn(
                    "p-3 rounded-xl text-center border transition-all cursor-pointer",
                    selectedPlanet === pName
                      ? "bg-gold text-black border-gold shadow-lg shadow-gold/20 font-bold"
                      : "bg-white/5 border-white/5 text-white/70 hover:text-white hover:border-white/20"
                  )}
                >
                  <span className="text-lg block">{PLANET_SYMBOLS[pName] || "★"}</span>
                  <span className="text-xs block mt-1">{pName}</span>
                </button>
              ))}
            </div>

            {planetExplorerData && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Natal vs Transit Placement */}
                <AnimatedCard className="p-6 space-y-4 border-white/10">
                  <div className="flex items-center gap-2 text-gold">
                    <Orbit className="w-4 h-4" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                      {planetExplorerData.planet} Dynamics
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-[10px] text-white/40 uppercase font-bold">Natal Placement</span>
                      <p className="text-sm font-bold text-white">
                        House {planetExplorerData.natalPlacement.house} · {planetExplorerData.natalPlacement.sign} ({planetExplorerData.natalPlacement.degreeInSign.toFixed(2)}°)
                      </p>
                      <span className="text-[10px] text-gold-light capitalize">Dignity: {planetExplorerData.strengthBreakdown.dignity}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-[10px] text-white/40 uppercase font-bold">Current Transit Position</span>
                      <p className="text-sm font-bold text-emerald-400">
                        {planetExplorerData.currentTransit.sign} ({planetExplorerData.currentTransit.degree.toFixed(2)}°) {planetExplorerData.currentTransit.motion === "retrograde" ? "(Retrograde)" : ""}
                      </p>
                      <span className="text-[10px] text-white/60">House {planetExplorerData.currentTransit.houseFromAscendant} from Natal Lagna</span>
                    </div>

                    <div className="p-3 rounded-xl bg-gold/10 border border-gold/20">
                      <span className="text-[10px] text-gold-light uppercase font-bold">Shadbala Strength Rating</span>
                      <p className="text-base font-extrabold text-gradient-gold">
                        {planetExplorerData.strengthBreakdown.score}% · {planetExplorerData.strengthBreakdown.houseStrength}
                      </p>
                    </div>
                  </div>
                </AnimatedCard>

                {/* Natural Karakatwas & Interpretation */}
                <AnimatedCard className="p-6 space-y-4 border-white/10 lg:col-span-2">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Natural Karakatwas (Significations)</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {planetExplorerData.karakatwas.map((k, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1">Natal Astrological Theme</h4>
                      <p className="text-xs leading-relaxed text-white/80">{planetExplorerData.traditionalInterpretation.natalTheme}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1">Current Transit Influence</h4>
                      <p className="text-xs leading-relaxed text-white/80">{planetExplorerData.traditionalInterpretation.currentTransitTheme}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-gold/20">
                      <h4 className="text-xs font-bold text-gold uppercase tracking-wider mb-1">Prescribed Traditional Remedy</h4>
                      <p className="text-xs leading-relaxed text-white/70">{planetExplorerData.traditionalInterpretation.prescribedRemedy}</p>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: GLOBAL EPHEMERIS POSITIONS */}
        {activeTab === "global" && (
          <div className="glass rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                  High-Precision Ephemeris Positions (Sidereal Lahiri)
                </h3>
                <p className="text-xs text-white/50">
                  Target calculation moment: {date} 00:00:00 UTC · Swiss Ephemeris / High-Accuracy Analytical Engine
                </p>
              </div>
              <span className="text-[11px] font-mono text-gold-light bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                Lahiri Ayanamsa: {canonicalContext?.configuration.ayanamsaValue.toFixed(4) || "23.85"}°
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Body</th>
                    <th className="py-3 px-4">Sign</th>
                    <th className="py-3 px-4">Sidereal Longitude</th>
                    <th className="py-3 px-4">Degrees / Minutes</th>
                    <th className="py-3 px-4">Nakshatra</th>
                    <th className="py-3 px-4">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {canonicalContext && Object.values(canonicalContext.planets).map((p) => (
                    <tr key={p.name} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <span className="text-gold text-base">{p.symbol}</span>
                        <span>{p.name}</span>
                      </td>
                      <td className="py-3 px-4 text-white/80">{p.sign}</td>
                      <td className="py-3 px-4 font-mono text-white/60">{p.siderealLongitude.toFixed(4)}°</td>
                      <td className="py-3 px-4 text-gold-light font-mono">{p.degreeInSign}° {p.minuteInSign}&apos; {p.secondInSign}&quot;</td>
                      <td className="py-3 px-4 text-white/70">{p.nakshatra.name} (P{p.nakshatra.pada || 1})</td>
                      <td className="py-3 px-4">
                        {p.isRetrograde ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">Retrograde</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">Direct</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </PageWrapper>
  );
}
