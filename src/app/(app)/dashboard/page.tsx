"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  Moon, 
  Sun, 
  Heart, 
  Orbit, 
  CalendarDays, 
  FileText, 
  ArrowRight, 
  LogOut,
  Layers,
  MapPin,
  Clock,
  ShieldCheck
} from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { AnimatedCard } from "@/components/shared/animated-card";
import { Button } from "@/components/ui/button";
import { getMoonPhase, getCurrentZodiacSeason } from "@/utils/date-utils";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/(auth)/actions";
import { buildUserAstrologyContext, type UserAstrologyContext } from "@/modules/astrology-engine";
import { useProfile } from "@/components/profile/profile-context";
import { ProfileSwitcher, type ProfileOption } from "@/components/profile/profile-switcher";
import { InteractiveCelestialCanvas } from "@/components/celestial/interactive-celestial-canvas";

const DASHBOARD_TOOLS = [
  { href: "/kundli", label: "Kundli Generator", desc: "Generate authentic Vedic birth charts with planetary placements and D1/D9.", icon: FileText, color: "from-[#f5d061] to-[#d4af37]" },
  { href: "/horoscope", label: "Cosmic Horoscopes", desc: "Personalized daily, hourly, and weekly forecasts based on your Moon sign.", icon: Sun, color: "from-[#f59e0b] to-[#ec4899]" },
  { href: "/transit", label: "Transit Tracker", desc: "Real-time planetary transits compared against your natal placements.", icon: Orbit, color: "from-[#7c3aed] to-[#a855f7]" },
  { href: "/tarot", label: "Tarot Oracle", desc: "Draw authentic 78-card archetypes aligned with your current transit cycles.", icon: Layers, color: "from-[#8b5cf6] to-[#6366f1]" },
  { href: "/panchang", label: "Daily Panchang", desc: "Location-aware Tithi, Vara, Nakshatra, Yoga, and Karana muhurtas.", icon: CalendarDays, color: "from-[#10b981] to-[#3b82f6]" },
  { href: "/compatibility", label: "Compatibility", desc: "Ashtakoota & Guna Milan synastry analysis between two charts.", icon: Heart, color: "from-[#ec4899] to-[#f43f5e]" },
  { href: "/numerology", label: "Numerology Matrix", desc: "Compute Life Path, Destiny, and Expression numbers from your DOB.", icon: Sparkles, color: "from-[#f59e0b] to-[#10b981]" },
];

export default function DashboardPage() {
  const router = useRouter();
  const moonPhase = getMoonPhase();
  const zodiacSeason = getCurrentZodiacSeason();
  const { profiles, activeProfile, activeProfileId, setActiveProfileId } = useProfile();
  const [userName, setUserName] = useState("User");
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const name = user.user_metadata?.name || user.email?.split("@")[0] || "User";
          setUserName(name);
        }
      } catch (err) {
        console.error("Error loading dashboard user data:", err);
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUserData();
  }, []);

  const astroContext = useMemo<UserAstrologyContext | null>(() => {
    if (!activeProfile || !activeProfile.date_of_birth || !activeProfile.birth_place) {
      return null;
    }
    return buildUserAstrologyContext({
      name: activeProfile.name || userName,
      dateOfBirth: activeProfile.date_of_birth,
      timeOfBirth: activeProfile.time_of_birth || "12:00:00",
      birthPlace: activeProfile.birth_place,
      country: activeProfile.country,
      latitude: Number(activeProfile.latitude) || 0,
      longitude: Number(activeProfile.longitude) || 0,
      timezone: activeProfile.timezone || "UTC",
    });
  }, [activeProfile, userName]);

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

  const handleSignOut = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <PageWrapper title="Dashboard | AstroVerse AI" description="Your personalized cosmic control center.">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Welcome Header */}
        <div className="glass rounded-2xl p-6 sm:p-8 border border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 100% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)" }} />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base shrink-0" style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl sm:text-3xl font-extrabold text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>
                    Welcome, {loadingUser ? "..." : userName}
                  </h1>
                  {profileOptions.length > 0 && (
                    <ProfileSwitcher
                      profiles={profileOptions}
                      activeProfileId={activeProfileId}
                      onSelectProfile={setActiveProfileId}
                    />
                  )}
                </div>

                <p className="text-xs sm:text-sm text-white/60 flex items-center gap-2 mt-1">
                  {astroContext ? (
                    <>
                      <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span>{astroContext.profile.birthPlace}</span>
                      <span>•</span>
                      <Clock className="w-3.5 h-3.5 text-white/40 shrink-0" />
                      <span>{astroContext.profile.timezone}</span>
                    </>
                  ) : (
                    <span>Explore your personalized cosmic calculations below.</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="gap-2 border-white/10 text-xs hover:border-white/20 text-white/70 hover:text-white cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Personalized Astrology Snapshot Banner */}
        {astroContext && (
          <div className="glass rounded-2xl p-6 border border-gold/20 bg-gradient-to-r from-gold/5 via-transparent to-purple-900/10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
              <div>
                <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider block">Natal Sun Sign</span>
                <span className="text-sm sm:text-base font-bold text-gold-light">{astroContext.sun.sign}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider block">Moon / Rashi</span>
                <span className="text-sm sm:text-base font-bold text-white">{astroContext.moon.sign}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider block">Ascendant (Lagna)</span>
                <span className="text-sm sm:text-base font-bold text-gold-light">{astroContext.ascendant.sign} ({astroContext.ascendant.degree}°)</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider block">Lunar Nakshatra</span>
                <span className="text-sm sm:text-base font-bold text-white">{astroContext.moon.nakshatra.name}</span>
              </div>
            </div>
          </div>
        )}

        {/* Real-Time Cosmic Weather Widget */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedCard delay={0.05} className="p-5 flex items-center justify-between border-white/10">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-light">Current Moon Phase</span>
              <h3 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                {moonPhase}
              </h3>
              <p className="text-xs text-white/50">Lunar synodic cycle</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Moon className="w-5 h-5 text-indigo-300" />
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.1} className="p-5 flex items-center justify-between border-white/10">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-light">Zodiac Ingress</span>
              <h3 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                {zodiacSeason}
              </h3>
              <p className="text-xs text-white/50">Current solar season</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
              <Sun className="w-5 h-5 text-amber-300" />
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.15} className="p-5 flex items-center justify-between border-white/10">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-light">Ephemeris Precision</span>
              <h3 className="text-base font-bold text-emerald-400" style={{ fontFamily: "var(--font-outfit)" }}>
                Active &amp; Calibrated
              </h3>
              <p className="text-xs text-white/50">Swiss Ephemeris / Lahiri</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
          </AnimatedCard>
        </div>

        {/* Interactive 3D Canvas */}
        <InteractiveCelestialCanvas />

        {/* Computational Astrology Tools Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
            Computational Tools &amp; Engines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {DASHBOARD_TOOLS.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <Link href={tool.href} key={tool.href} className="block group">
                  <AnimatedCard delay={0.05 * idx} className="p-5 h-full transition-all duration-300 group-hover:border-gold/40 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-md", tool.color)}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-gold transition-colors mb-1" style={{ fontFamily: "var(--font-outfit)" }}>
                          {tool.label}
                        </h3>
                        <p className="text-xs text-white/60 leading-relaxed">
                          {tool.desc}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gold-light group-hover:translate-x-1 transition-transform mt-3">
                      <span className="font-semibold text-[11px]">Launch Engine</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </AnimatedCard>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
