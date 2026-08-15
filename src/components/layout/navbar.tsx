"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { 
  Sparkles, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  FileText, 
  Layers, 
  Compass,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { mainNavItems, dashboardNavItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/(auth)/actions";

export function Navbar() {
  const router = useRouter();
  const { isScrolled } = useScrollPosition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email?: string; initial: string } | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const name = authUser.user_metadata?.name || authUser.email?.split("@")[0] || "Seeker";
          const initial = name.charAt(0).toUpperCase();
          setUser({ name, email: authUser.email, initial });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error checking auth status:", err);
      }
    }
    checkAuth();
  }, []);

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setUserDropdownOpen(false);
    setMobileOpen(false);
    router.push("/login");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full max-w-[100vw] overflow-x-clip",
        isScrolled
          ? "glass-strong shadow-lg shadow-black/10"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 sm:h-20 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group min-w-0 shrink-0">
            <div className="relative shrink-0">
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-300" style={{ color: "var(--gold)" }} />
              <div className="absolute inset-0 blur-md opacity-50" style={{ color: "var(--gold)" }}>
                <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
            </div>
            <span
              className="text-lg sm:text-xl font-bold text-gradient-gold truncate"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              AstroVerse AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-white/5"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop User Section / CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full glass border border-white/10 hover:border-gold/40 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}>
                    {user.initial}
                  </div>
                  <span className="text-xs font-semibold text-white max-w-[120px] truncate">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-52 rounded-xl glass-strong border border-white/10 shadow-2xl py-2 z-50 animate-fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-white/5">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-white/50 truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-gold" />
                      Dashboard
                    </Link>
                    <Link
                      href="/onboarding"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5 text-gold" />
                      Birth Blueprint
                    </Link>
                    <Link
                      href="/kundli"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-purple-light" />
                      Kundli Charts
                    </Link>
                    <Link
                      href="/tarot"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5 text-gold" />
                      Tarot Readings
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-white/60" />
                      Settings
                    </Link>

                    <div className="border-t border-white/5 mt-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="text-sm cursor-pointer"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="text-sm font-semibold rounded-full px-6 cursor-pointer"
                  style={{
                    background: "var(--gradient-gold)",
                    color: "var(--bg-primary)",
                  }}
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}>
                {user.initial}
              </div>
            )}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Toggle Navigation Menu">
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] max-w-[85vw] border-l overflow-y-auto flex flex-col justify-between p-6"
                style={{ background: "var(--bg-secondary)", borderColor: "rgba(212, 175, 55, 0.1)" }}
              >
                <div className="space-y-6">
                  <div>
                    <SheetTitle
                      className="text-gradient-gold text-lg font-bold"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      AstroVerse AI
                    </SheetTitle>
                    <SheetDescription className="text-xs text-white/50 mt-1">
                      {user ? `Logged in as ${user.name}` : "Celestial intelligence & astrology"}
                    </SheetDescription>
                  </div>

                  {user ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold-light px-4 mb-1">
                        Cosmic Explorers
                      </span>
                      {dashboardNavItems.slice(0, 6).map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-white/5 text-white/80"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {mainNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="px-4 py-2.5 text-sm sm:text-base font-medium rounded-lg transition-colors duration-200 hover:bg-white/5"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 flex flex-col gap-2 border-t border-white/10 shrink-0">
                  {user ? (
                    <>
                      <Link
                        href="/settings"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white"
                      >
                        <User className="w-4 h-4" /> Account Settings
                      </Link>
                      <Button
                        onClick={handleSignOut}
                        variant="outline"
                        className="w-full text-xs border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 mr-1" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="ghost" className="justify-start text-sm sm:text-base cursor-pointer" style={{ color: "var(--text-secondary)" }} onClick={() => setMobileOpen(false)}>
                        <Link href="/login">Sign In</Link>
                      </Button>
                      <Button
                        asChild
                        className="text-sm sm:text-base font-semibold rounded-full cursor-pointer w-full"
                        style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
                        onClick={() => setMobileOpen(false)}
                      >
                        <Link href="/register">Get Started</Link>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
