"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { mainNavItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isScrolled } = useScrollPosition();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "glass-strong shadow-lg shadow-black/10"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-300" style={{ color: "var(--gold)" }} />
              <div className="absolute inset-0 blur-md opacity-50" style={{ color: "var(--gold)" }}>
                <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
            </div>
            <span
              className="text-lg sm:text-xl font-bold text-gradient-gold"
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

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
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
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] border-l"
              style={{ background: "var(--bg-secondary)", borderColor: "rgba(212, 175, 55, 0.1)" }}
            >
              <SheetTitle className="text-gradient-gold text-lg font-bold mb-6"
                style={{ fontFamily: "var(--font-outfit)" }}>
                AstroVerse AI
              </SheetTitle>
              <div className="flex flex-col gap-2">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 hover:bg-white/5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4 pt-4 flex flex-col gap-2" style={{ borderTop: "1px solid rgba(212, 175, 55, 0.1)" }}>
                  <Button asChild variant="ghost" className="justify-start text-base cursor-pointer" style={{ color: "var(--text-secondary)" }} onClick={() => setMobileOpen(false)}>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="text-base font-semibold rounded-full cursor-pointer"
                    style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href="/register">Get Started</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
}
