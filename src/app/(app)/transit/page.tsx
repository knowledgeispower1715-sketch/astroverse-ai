"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, AlertCircle, Orbit, Compass, User } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { buildUserAstrologyContext, type UserAstrologyContext } from "@/modules/astrology-engine";
import { ProfileSwitcher, type ProfileOption } from "@/components/profile/profile-switcher";
import type { TransitPlanet } from "@/modules/prediction-engine";

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂",
  Jupiter: "♃", Saturn: "♄", Rahu: "☊", Ketu: "☋",
};

interface PersonalTransitImpact {
  planet: string;
  transitSign: string;
  transitDegree: number;
  natalSign: string;
  transitedHouse: number;
  isRetrograde: boolean;
  aspectToNatal: string;
  impactType: "benefic" | "challenging" | "transformative";
  interpretation: string;
}

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
  const [activeTab, setActiveTab] = useState<"personal" | "global">("personal");
  const [transits, setTransits] = useState<TransitPlanet[]>([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      }
    }
    loadUserData();
  }, []);

  const activeRawProfile = useMemo(() => {
    return profiles.find((p) => p.id === activeProfileId) || profiles[0] || null;
  }, [profiles, activeProfileId]);

  const astroContext = useMemo<UserAstrologyContext | null>(() => {
    if (!activeRawProfile || !activeRawProfile.date_of_birth || !activeRawProfile.birth_place) {
      return null;
    }
    return buildUserAstrologyContext({
      name: activeRawProfile.name || userName,
      dateOfBirth: activeRawProfile.date_of_birth,
      timeOfBirth: activeRawProfile.time_of_birth || "12:00:00",
      birthPlace: activeRawProfile.birth_place,
      country: activeRawProfile.country,
      latitude: Number(activeRawProfile.latitude) || 0,
      longitude: Number(activeRawProfile.longitude) || 0,
      timezone: activeRawProfile.timezone || "UTC",
    });
  }, [activeRawProfile, userName]);

  const profileOptions = useMemo<ProfileOption[]>(() => {
    return profiles.map((p) => ({
      id: p.id,
      name: p.name || p.profile_name || "My Chart",
      relationship: p.relationship || (p.is_primary ? "Self" : "Family"),
      birthPlace: p.birth_place || "Global",
      dateOfBirth: p.date_of_birth || "",
      isPrimary: p.is_primary,
    }));
  }, [profiles]);

  // Fetch planetary transits
  useEffect(() => {
    let isCurrent = true;
    async function fetchTransits() {
      try {
        const res = await fetch(`/api/transit?date=${date}`);
        const json = await res.json() as { data?: TransitPlanet[]; error?: string };
        if (!isCurrent) return;
        setLoading(false);
        if (json.data) setTransits(json.data);
        else setError(json.error ?? "Failed to load transits");
      } catch {
        if (!isCurrent) return;
        setLoading(false);
        setError("Network error. Please try again.");
      }
    }
    fetchTransits();
    return () => { isCurrent = false; };
  }, [date]);

  // Compute Personal Transit Matrix
  const personalImpacts = useMemo<PersonalTransitImpact[]>(() => {
    if (!astroContext || !transits || transits.length === 0) return [];

    const SIGNS = [
      "Aries", "Taurus", "Gemini", "Cancer",
      "Leo", "Virgo", "Libra", "Scorpio",
      "Sagittarius", "Capricorn", "Aquarius", "Pisces",
    ];

    const lagnaSignIndex = SIGNS.indexOf(astroContext.ascendant.sign);

    return transits.map((t) => {
      const transitSignIndex = SIGNS.indexOf(t.sign);
      const houseNumber = ((transitSignIndex - lagnaSignIndex + 12) % 12) + 1;

      // Find corresponding natal planet
      const natalPlanet = astroContext.planets[t.planet as keyof typeof astroContext.planets];
      const natalSign = natalPlanet ? natalPlanet.sign : "Unknown";

      let impactType: "benefic" | "challenging" | "transformative" = "benefic";
      let interpretation = "";

      if (t.planet === "Jupiter") {
        impactType = [1, 5, 9, 11].includes(houseNumber) ? "benefic" : "transformative";
        interpretation = `Jupiter transiting your natal ${houseNumber}th House expands wisdom, fortune, and long-term opportunity in this life sector.`;
      } else if (t.planet === "Saturn") {
        impactType = [3, 6, 11].includes(houseNumber) ? "benefic" : "challenging";
        interpretation = `Saturn transiting your natal ${houseNumber}th House demands discipline, patience, and structured consolidation of effort.`;
      } else if (t.planet === "Rahu" || t.planet === "Ketu") {
        impactType = "transformative";
        interpretation = `${t.planet} activating your natal ${houseNumber}th House creates karmic shifts and sudden insights in its domain.`;
      } else if (t.planet === "Mars") {
        impactType = [3, 6, 10, 11].includes(houseNumber) ? "benefic" : "challenging";
        interpretation = `Mars in your ${houseNumber}th House injects dynamic drive and assertive energy, requiring constructive outlets.`;
      } else {
        interpretation = `${t.planet} illuminating your ${houseNumber}th House highlights everyday focus, social interactions, and mental clarity.`;
      }

      return {
        planet: t.planet,
        transitSign: t.sign,
        transitDegree: t.degree,
        natalSign,
        transitedHouse: houseNumber,
        isRetrograde: t.retrograde,
        aspectToNatal: t.sign === natalSign ? "Conjunction (0°)" : "Gochara Transit",
        impactType,
        interpretation,
      };
    });
  }, [astroContext, transits]);

  return (
    <PageWrapper title="Planetary Transit Tracker | AstroVerse AI" description="Real-time planetary transits integrated with your personal natal chart placements.">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-gold/10 border border-gold/20 text-gold-light">
            <Orbit className="w-3.5 h-3.5" />
            Live Celestial Transits (Gochara)
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>
            Planetary Transit Tracker
          </h1>
          <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto">
            Observe the current movements of the Grahas across the sidereal zodiac and their direct gravitational influence on your natal birth chart.
          </p>
        </div>

        {/* Tab Selector & Controls Bar */}
        <div className="glass rounded-2xl p-4 sm:p-6 border border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xl">
          {/* Segmented Tab */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab("personal")}
              className={`py-2 px-4 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "personal"
                  ? "bg-gold/20 text-gold-light border border-gold/40 shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Personal Transits
            </button>
            <button
              onClick={() => setActiveTab("global")}
              className={`py-2 px-4 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "global"
                  ? "bg-gold/20 text-gold-light border border-gold/40 shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              Global Celestial Sky
            </button>
          </div>

          {/* Date Picker & Profile Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {activeTab === "personal" && profileOptions.length > 0 && (
              <ProfileSwitcher
                profiles={profileOptions}
                activeProfileId={activeProfileId}
                onSelectProfile={setActiveProfileId}
              />
            )}

            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-10 bg-white/5 border-white/10 text-white rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="glass rounded-2xl p-16 border border-white/5 text-center space-y-4">
            <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" />
            <p className="text-sm font-semibold text-white">Computing planetary transit coordinates...</p>
          </div>
        ) : error ? (
          <div className="glass rounded-2xl p-8 border border-red-500/20 text-center space-y-3 bg-red-500/5">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        ) : (
          <>
            {/* PERSONAL TRANSITS VIEW */}
            {activeTab === "personal" && (
              <div className="space-y-6 animate-fade-in">
                {!astroContext ? (
                  <div className="glass rounded-2xl p-12 border border-white/5 text-center space-y-3">
                    <Compass className="w-10 h-10 text-gold/40 mx-auto" />
                    <h3 className="text-base font-bold text-white">Configure Your Natal Chart</h3>
                    <p className="text-xs text-white/50 max-w-md mx-auto">
                      Personal transit analysis requires your birth details to map real-time planetary transits against your 12 Bhava (houses).
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                          Personalized Gochara Influences for {astroContext.profile.name}
                        </h2>
                        <p className="text-xs text-white/50">
                          Natal Ascendant: <strong className="text-gold-light">{astroContext.ascendant.sign}</strong> • Moon Sign: <strong className="text-purple-light">{astroContext.moon.sign}</strong>
                        </p>
                      </div>
                      <span className="text-xs text-white/40 font-mono">Date: {date}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {personalImpacts.map((imp) => (
                        <div
                          key={imp.planet}
                          className="glass rounded-xl p-5 border border-white/5 hover:border-gold/30 transition-all space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl font-bold text-gold font-mono">{PLANET_SYMBOLS[imp.planet] || "●"}</span>
                              <div>
                                <h3 className="text-sm font-bold text-white">{imp.planet}</h3>
                                <p className="text-[11px] text-white/50 font-mono">
                                  Currently {imp.transitDegree.toFixed(1)}° in {imp.transitSign} {imp.isRetrograde && "(Retrograde)"}
                                </p>
                              </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-gold/10 text-gold-light border border-gold/20">
                              House {imp.transitedHouse}
                            </span>
                          </div>

                          <p className="text-xs text-white/70 leading-relaxed">
                            {imp.interpretation}
                          </p>

                          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                            <span>Natal Placement: {imp.natalSign}</span>
                            <span className="capitalize text-emerald-400 font-medium">{imp.aspectToNatal}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* GLOBAL TRANSITS VIEW */}
            {activeTab === "global" && (
              <div className="glass rounded-2xl border border-white/5 overflow-hidden animate-fade-in">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Universal Sidereal Positions — {new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </h3>
                  <span className="text-xs text-white/40">Lahiri Ayanamsa</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-[11px] text-white/40">
                        <th className="px-6 py-3">Planet</th>
                        <th className="px-4 py-3">Sign (Rashi)</th>
                        <th className="px-4 py-3">Degrees</th>
                        <th className="px-4 py-3">Nakshatra</th>
                        <th className="px-4 py-3">Motion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {transits.map((p) => (
                        <tr key={p.planet} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-3.5 font-bold text-white flex items-center gap-2">
                            <span className="text-gold font-mono text-base">{PLANET_SYMBOLS[p.planet] || "●"}</span>
                            {p.planet}
                          </td>
                          <td className="px-4 py-3.5 text-gold-light font-medium">{p.sign}</td>
                          <td className="px-4 py-3.5 font-mono">{p.degree.toFixed(2)}°</td>
                          <td className="px-4 py-3.5 text-white/60 capitalize">{p.speedCategory}</td>
                          <td className="px-4 py-3.5">
                            {p.retrograde ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                Retrograde (R)
                              </span>
                            ) : (
                              <span className="text-[10px] text-white/40">Direct</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </PageWrapper>
  );
}
