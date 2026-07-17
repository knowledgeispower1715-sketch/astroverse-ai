"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Moon, Sun, Heart, Orbit, CalendarDays, FileText, ArrowRight, User, LogOut } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { AnimatedCard } from "@/components/shared/animated-card";
import { Button } from "@/components/ui/button";
import { getMoonPhase, getCurrentZodiacSeason } from "@/utils/date-utils";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/(auth)/actions";

const DASHBOARD_TOOLS = [
  { href: "/horoscope", label: "Horoscopes", desc: "View daily, weekly, and hourly forecasts.", icon: Sun, color: "from-[#f5d061] to-[#ff9a56]" },
  { href: "/kundli", label: "Kundli Generator", desc: "Create traditional Vedic birth charts.", icon: FileText, color: "from-[#ec4899] to-[#8b5cf6]" },
  { href: "/compatibility", label: "Compatibility", desc: "Check synastry scores between charts.", icon: Heart, color: "from-[#a855f7] to-[#ec4899]" },
  { href: "/transit", label: "Transit Tracker", desc: "Monitor planetary transits in real-time.", icon: Orbit, color: "from-[#7c3aed] to-[#a855f7]" },
  { href: "/numerology", label: "Numerology", desc: "Compute Life Path and Expression numbers.", icon: Sparkles, color: "from-[#ef4444] to-[#f59e0b]" },
  { href: "/panchang", label: "Daily Panchang", desc: "Check Tithi, Vara, Nakshatra divisions.", icon: CalendarDays, color: "from-[#10b981] to-[#3b82f6]" },
];

export default function DashboardPage() {
  const router = useRouter();
  const moonPhase = getMoonPhase();
  const zodiacSeason = getCurrentZodiacSeason();
  const [userName, setUserName] = useState("Seeker");
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const name = user.user_metadata?.name || user.email?.split("@")[0] || "Seeker";
          setUserName(name);
        }
      } catch (err) {
        console.error("Error fetching user session:", err);
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Banner */}
        <div className="glass rounded-2xl p-6 sm:p-8 border border-white/5 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 100% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)" }} />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{ background: "var(--gradient-cosmic)", color: "var(--bg-primary)" }}>
                <User className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>
                  Welcome, {loadingUser ? "..." : userName}
                </h1>
                <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>Your cosmic blueprint is ready for exploration.</p>
              </div>
            </div>
            
            {/* Quick stats / info / logout */}
            <div className="flex items-center gap-4 shrink-0 flex-wrap">
              <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-center">
                <span className="text-[10px] uppercase font-bold block" style={{ color: "var(--text-muted)" }}>Sun Sign</span>
                <span className="text-xs sm:text-sm font-semibold text-white">{zodiacSeason}</span>
              </div>
              <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-center">
                <span className="text-[10px] uppercase font-bold block" style={{ color: "var(--text-muted)" }}>Moon Phase</span>
                <span className="text-xs sm:text-sm font-semibold text-white">{moonPhase}</span>
              </div>
              <Button onClick={handleSignOut} variant="outline" className="text-xs gap-1.5 h-10 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-500 cursor-pointer">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Dynamic Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Moon Phase Widget */}
          <div className="glass rounded-2xl p-6 border border-white/5 flex flex-col justify-between h-48 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 0% 100%, rgba(124, 58, 237, 0.05) 0%, transparent 50%)" }} />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Lunar Aspect</span>
              <Moon className="w-5 h-5" style={{ color: "var(--gold)" }} />
            </div>
            <div className="my-3 relative z-10">
              <h2 className="text-2xl font-bold text-white mb-1">{moonPhase}</h2>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>The Moon is currently transiting through its cyclical phase, affecting emotional currents.</p>
            </div>
            <Link href="/panchang" className="text-xs font-semibold inline-flex items-center gap-1 hover:underline relative z-10" style={{ color: "var(--gold-light)" }}>
              View full Panchang data <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Active Transits Widget */}
          <div className="glass rounded-2xl p-6 border border-white/5 flex flex-col justify-between h-48 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 100% 100%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)" }} />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Zodiac Transit</span>
              <Orbit className="w-5 h-5" style={{ color: "var(--purple-light)" }} />
            </div>
            <div className="my-3 relative z-10">
              <h2 className="text-2xl font-bold text-white mb-1">{zodiacSeason} Season</h2>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Planetary transits align with {zodiacSeason}. Optimal energy for initiating projects and setting intentions.</p>
            </div>
            <Link href="/transit" className="text-xs font-semibold inline-flex items-center gap-1 hover:underline relative z-10" style={{ color: "var(--gold-light)" }}>
              Open Transit Map <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Daily Guidance Widget */}
          <div className="glass rounded-2xl p-6 border border-white/5 flex flex-col justify-between h-48 relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Guidance Indicator</span>
              <Sparkles className="w-5 h-5" style={{ color: "var(--gold)" }} />
            </div>
            <div className="my-3 relative z-10">
              <h2 className="text-lg font-semibold text-white mb-1">Focus on self-reflection</h2>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Take time today to meditate, journal, and align with your spiritual intentions. Avoid impulsive reactions.</p>
            </div>
            <Link href="/remedies" className="text-xs font-semibold inline-flex items-center gap-1 hover:underline relative z-10" style={{ color: "var(--gold-light)" }}>
              Recommended Remedies <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Tools Grid */}
        <h2 className="text-lg font-bold mb-6 text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>Cosmic Tools & Explorers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DASHBOARD_TOOLS.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link href={tool.href} key={tool.label} className="block group">
                <AnimatedCard
                  delay={index * 0.05}
                  glowColor={index % 2 === 0 ? "gold" : "purple"}
                  className="p-6 h-full flex flex-col justify-between border-white/5 group-hover:border-gold/30"
                >
                  <div>
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-gradient-to-br text-white", tool.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold mb-1 text-white group-hover:text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>{tool.label}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{tool.desc}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-white/50 group-hover:text-gold-light transition-colors">Launch Tool</span>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-gold-light group-hover:translate-x-1 transition-all" />
                  </div>
                </AnimatedCard>
              </Link>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}
