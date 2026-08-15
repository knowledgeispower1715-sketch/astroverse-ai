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
  Compass,
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
import { ProfileSwitcher, type ProfileOption } from "@/components/profile/profile-switcher";

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
  is_approximate_time?: boolean;
  is_unknown_time?: boolean;
}

const DASHBOARD_TOOLS = [
  { href: "/kundli", label: "Kundli Generator", desc: "Generate authentic Vedic birth charts with planetary placements and D1/D9.", icon: FileText, color: "from-[#f5d061] to-[#d4af37]" },
  { href: "/horoscope", label: "Cosmic Horoscopes", desc: "Personalized daily, hourly, and weekly forecasts based on your Moon sign.", icon: Sun, color: "from-[#f59e0b] to-[#ec4899]" },
  { href: "/tarot", label: "Tarot Oracle", desc: "Draw authentic 78-card archetypes aligned with your current transit cycles.", icon: Layers, color: "from-[#8b5cf6] to-[#6366f1]" },
  { href: "/transit", label: "Transit Tracker", desc: "Real-time planetary transits compared against your natal placements.", icon: Orbit, color: "from-[#7c3aed] to-[#a855f7]" },
  { href: "/panchang", label: "Daily Panchang", desc: "Location-aware Tithi, Vara, Nakshatra, Yoga, and Karana muhurtas.", icon: CalendarDays, color: "from-[#10b981] to-[#3b82f6]" },
  { href: "/compatibility", label: "Compatibility", desc: "Ashtakoota & Guna Milan synastry analysis between two charts.", icon: Heart, color: "from-[#ec4899] to-[#f43f5e]" },
  { href: "/numerology", label: "Numerology Matrix", desc: "Compute Life Path, Destiny, and Expression numbers from your DOB.", icon: Sparkles, color: "from-[#f59e0b] to-[#10b981]" },
];

export default function DashboardPage() {
  const router = useRouter();
  const moonPhase = getMoonPhase();
  const zodiacSeason = getCurrentZodiacSeason();
  const [userName, setUserName] = useState("Seeker");
  const [profiles, setProfiles] = useState<RawBirthProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>("");
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const name = user.user_metadata?.name || user.email?.split("@")[0] || "Seeker";
          setUserName(name);

          // Fetch all birth profiles owned by user
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
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUserData();
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
      isApproximateTime: activeRawProfile.is_approximate_time,
      isUnknownTime: activeRawProfile.is_unknown_time,
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
                    "Welcome to your private astrological sanctuary."
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/onboarding">
                <Button variant="outline" size="sm" className="text-xs border-gold/30 text-gold-light hover:bg-gold/10 gap-1.5 cursor-pointer">
                  <Compass className="w-3.5 h-3.5" />
                  Add Birth Chart
                </Button>
              </Link>
              <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-xs text-white/50 hover:text-white cursor-pointer">
                <LogOut className="w-4 h-4 mr-1" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Onboarding Reminder Banner if No Birth Profile */}
        {!loadingUser && profiles.length === 0 && (
          <div className="p-6 rounded-2xl glass border border-gold/40 bg-gold/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in shadow-xl">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gold-light flex items-center gap-2">
                <Compass className="w-5 h-5 text-gold" />
                Initialize Your Cosmic Blueprint
              </h3>
              <p className="text-xs sm:text-sm text-white/70">
                To unlock astronomical accuracy for your Kundli, Moon Sign, Lagna, and Dasha cycles, configure your worldwide birth location and exact time.
              </p>
            </div>
            <Link href="/onboarding" className="shrink-0">
              <Button className="font-semibold text-xs rounded-full px-6 py-2 cursor-pointer gap-2" style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}>
                Start Onboarding
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}

        {/* Personal Astrology Summary Matrix */}
        {astroContext && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in">
            {/* Moon Rashi */}
            <div className="glass rounded-xl p-4 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-purple-light" />
                Moon Sign (Rashi)
              </span>
              <p className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                {astroContext.moon.sign}
              </p>
              <p className="text-[11px] text-white/50 font-mono">
                {astroContext.moon.degree.toFixed(2)}° in {astroContext.moon.sign}
              </p>
            </div>

            {/* Nakshatra & Pada */}
            <div className="glass rounded-xl p-4 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                Nakshatra
              </span>
              <p className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                {astroContext.moon.nakshatra.name}
              </p>
              <p className="text-[11px] text-white/50">
                Pada {astroContext.moon.nakshatra.pada} • Lord {astroContext.moon.nakshatra.ruler}
              </p>
            </div>

            {/* Ascendant (Lagna) */}
            <div className="glass rounded-xl p-4 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider flex items-center gap-1.5">
                <Orbit className="w-3.5 h-3.5 text-blue-400" />
                Ascendant (Lagna)
              </span>
              <p className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                {astroContext.ascendant.sign}
              </p>
              <p className="text-[11px] text-white/50 font-mono">
                {astroContext.ascendant.degree}° {astroContext.ascendant.minute}&apos; ({astroContext.ascendant.nakshatra.name})
              </p>
            </div>

            {/* Current Vimshottari Dasha */}
            <div className="glass rounded-xl p-4 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Current Mahadasha
              </span>
              <p className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                {astroContext.currentDasha ? `${astroContext.currentDasha.planet} Dasha` : "Active"}
              </p>
              <p className="text-[11px] text-white/50 font-mono">
                Until {astroContext.currentDasha ? new Date(astroContext.currentDasha.endDate).getFullYear() : "—"}
              </p>
            </div>
          </div>
        )}

        {/* Global Celestial Weather Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass rounded-xl p-4 border border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple/10 text-purple-light shrink-0">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-white/50 tracking-wider">Current Lunar Phase</p>
              <p className="text-sm font-semibold text-white">{moonPhase}</p>
            </div>
          </div>

          <div className="glass rounded-xl p-4 border border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gold/10 text-gold shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-white/50 tracking-wider">Solar Season</p>
              <p className="text-sm font-semibold text-white">{zodiacSeason} Season</p>
            </div>
          </div>
        </div>

        {/* Core Astrology Tools Catalog */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
              Astrological Services & Oracles
            </h2>
            <span className="text-xs text-white/40">Free Authenticated Access</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DASHBOARD_TOOLS.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Link href={tool.href} key={tool.href} className="block group">
                  <AnimatedCard delay={index * 0.05} className="p-6 h-full cursor-pointer transition-all duration-300 group-hover:border-gold/30">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-gradient-to-br", tool.color)}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base font-semibold text-white group-hover:text-gradient-gold mb-1" style={{ fontFamily: "var(--font-outfit)" }}>
                      {tool.label}
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed">
                      {tool.desc}
                    </p>
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
