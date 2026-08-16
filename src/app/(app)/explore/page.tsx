"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  Sun, 
  CalendarDays, 
  Layers, 
  Heart, 
  Sparkles, 
  Orbit, 
  ShieldAlert, 
  Gem, 
  Clock, 
  Search, 
  ArrowRight,
  Activity,
  Cpu,
  Target
} from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { AnimatedCard } from "@/components/shared/animated-card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ServiceItem {
  id: string;
  title: string;
  category: "charts" | "forecasts" | "oracles" | "synastry" | "remedies" | "advanced";
  description: string;
  href: string;
  badge: "FREE" | "PREMIUM";
  calcTime: string;
  icon: typeof FileText;
  color: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: "kundli",
    title: "Vedic Kundli & Shodashvargas (D1–D60)",
    category: "charts",
    description: "Authentic Vedic horoscope calculation with planetary positions, Lagna chart, all 16 divisional charts, and Vimshottari Dashas.",
    href: "/kundli",
    badge: "FREE",
    calcTime: "Instant · ~0.3s",
    icon: FileText,
    color: "from-[#f5d061] to-[#d4af37]",
  },
  {
    id: "birth-chart",
    title: "Dual-System Birth Chart",
    category: "charts",
    description: "Compare Vedic (Sidereal / Lahiri) and Western (Tropical) natal charts with whole-sign, equal, and Placidus house cusps.",
    href: "/birth-chart",
    badge: "FREE",
    calcTime: "Instant · ~0.2s",
    icon: Orbit,
    color: "from-[#38bdf8] to-[#3b82f6]",
  },
  {
    id: "transit",
    title: "Gochara Transits & 7-Horizon Timing",
    category: "forecasts",
    description: "Real-time ephemeris transits analyzed across Past, Today, 7D, 30D, 3M, 6M, and 12M horizons against natal Lagna and Moon.",
    href: "/transit",
    badge: "FREE",
    calcTime: "Live Ephemeris",
    icon: Activity,
    color: "from-[#7c3aed] to-[#a855f7]",
  },
  {
    id: "horoscope",
    title: "Personalized Moon Forecasts",
    category: "forecasts",
    description: "Deterministic daily, hourly, weekly, and yearly astrological forecasts calibrated to your exact natal Moon sign and active Dasha.",
    href: "/horoscope",
    badge: "FREE",
    calcTime: "Real-time",
    icon: Sun,
    color: "from-[#f59e0b] to-[#ec4899]",
  },
  {
    id: "panchang",
    title: "Location-Aware Vedic Panchang",
    category: "forecasts",
    description: "Authentic daily Tithi, Vara, Nakshatra, Yoga, Karana, Rahu Kalam, Yamaganda, Gulika, and Choghadiya Muhurat timings worldwide.",
    href: "/panchang",
    badge: "FREE",
    calcTime: "Dynamic",
    icon: CalendarDays,
    color: "from-[#10b981] to-[#3b82f6]",
  },
  {
    id: "compatibility",
    title: "Ashtakoota 36-Guna Milan",
    category: "synastry",
    description: "Comprehensive 8-fold compatibility evaluation (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi) between two charts.",
    href: "/compatibility",
    badge: "FREE",
    calcTime: "Dual Chart",
    icon: Heart,
    color: "from-[#ec4899] to-[#f43f5e]",
  },
  {
    id: "tarot",
    title: "78-Card Tarot Oracle",
    category: "oracles",
    description: "Genuine Rider-Waite-Smith 78-card archetypes with Single Card, 3-Card Timeline, and Celtic Cross spreads.",
    href: "/tarot",
    badge: "FREE",
    calcTime: "Interactive",
    icon: Layers,
    color: "from-[#8b5cf6] to-[#6366f1]",
  },
  {
    id: "numerology",
    title: "Pythagorean Numerology Matrix",
    category: "oracles",
    description: "Calculate Life Path, Destiny, Expression, Soul Urge, and Birthday numbers from full name and date of birth.",
    href: "/numerology",
    badge: "FREE",
    calcTime: "Instant",
    icon: Sparkles,
    color: "from-[#f59e0b] to-[#10b981]",
  },
  {
    id: "remedies",
    title: "Cause-Based Vedic Remedies",
    category: "remedies",
    description: "Prescribed mantras, fasting guidelines, and behavioral remedies based on planetary afflictions and Sade Sati cycles.",
    href: "/remedies",
    badge: "PREMIUM",
    calcTime: "Personalized",
    icon: ShieldAlert,
    color: "from-[#f43f5e] to-[#fb7185]",
  },
  {
    id: "gemstones",
    title: "Gemstone Recommendations",
    category: "remedies",
    description: "Auspicious gemstone prescriptions tailored to planetary strengths, auspicious metals, and wearing rituals.",
    href: "/gemstones",
    badge: "PREMIUM",
    calcTime: "Personalized",
    icon: Gem,
    color: "from-[#d4af37] to-[#f5d061]",
  },
];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "All Computational Tools" },
    { id: "charts", label: "Charts & Kundli" },
    { id: "forecasts", label: "Forecasts & Transits" },
    { id: "oracles", label: "Tarot & Numerology" },
    { id: "synastry", label: "Synastry & Compatibility" },
    { id: "remedies", label: "Remedies & Gemstones" },
  ];

  const filteredServices = SERVICES.filter((s) => {
    const matchesCategory = selectedCategory === "all" || s.category === selectedCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageWrapper title="Explore Astrology Services | AstroVerse AI" description="Discover our comprehensive suite of automated Vedic, Western, and Oracle astrological engines.">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-gold/10 border border-gold/20 text-gold-light">
            <Cpu className="w-3.5 h-3.5" />
            Automated Computational Astrology Suite
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>
            Explore Cosmic Engines
          </h1>
          <p className="text-sm sm:text-base text-white/60">
            Every calculation is computed from high-precision astronomical ephemeris and personalized to your authenticated birth profile.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search tools (e.g. Kundli, Transits, Ashtakavarga, Panchang, Tarot)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-10 pr-4 bg-white/5 border-white/10 text-white rounded-xl focus:border-gold/50 text-sm"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border",
                  selectedCategory === c.id
                    ? "bg-gold text-black border-gold shadow-lg shadow-gold/20 font-bold"
                    : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:border-white/20"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
              Automated Calculation &amp; Intelligence Engines
            </h2>
            <span className="text-xs text-white/40">{filteredServices.length} engines available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, idx) => {
              const Icon = service.icon;
              return (
                <Link href={service.href} key={service.id} className="block group">
                  <AnimatedCard delay={idx * 0.04} className="p-6 h-full cursor-pointer transition-all duration-300 group-hover:border-gold/40 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-md", service.color)}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className={cn(
                          "text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border",
                          service.badge === "FREE"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold"
                            : "bg-gold/10 text-gold border-gold/20 font-bold"
                        )}>
                          {service.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-gold transition-colors mb-1.5" style={{ fontFamily: "var(--font-outfit)" }}>
                          {service.title}
                        </h3>
                        <p className="text-xs text-white/60 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40 mt-4">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3 h-3 text-gold/60" />
                        {service.calcTime}
                      </span>
                      <span className="flex items-center gap-1 text-gold-light group-hover:translate-x-1 transition-transform font-semibold text-[11px]">
                        Launch Tool <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </AnimatedCard>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Feature Highlights Banner */}
        <div className="glass rounded-2xl p-6 sm:p-8 border border-gold/20 space-y-4">
          <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider">
            <Target className="w-4 h-4" />
            Deterministic Astrological Architecture
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
            Astronomical Precision Meets Classical Parashari Rule Intelligence
          </h3>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-4xl">
            AstroVerse AI functions as a unified computation pipeline: Your validated birth moment resolves to exact IANA timezone coordinates, computes planetary positions via high-accuracy ephemeris, constructs natal and divisional charts (D1–D60), computes Vimshottari &amp; Yogini Dashas, Ashtakavarga matrices, KP sub-lords, and Gochara transits to synthesize evidence-backed personalized interpretations without guesswork.
          </p>
        </div>

      </div>
    </PageWrapper>
  );
}
