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
  MessageSquare, 
  Phone, 
  Star, 
  Search, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { AnimatedCard } from "@/components/shared/animated-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ServiceItem {
  id: string;
  title: string;
  category: "charts" | "forecasts" | "oracles" | "synastry" | "remedies" | "consultations";
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
    title: "Vedic Kundli & D9 Navamsa",
    category: "charts",
    description: "Authentic Vedic horoscope calculation with planetary positions, Lagna chart, divisional charts, and Vimshottari Dashas.",
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
    description: "Compare Vedic (Sidereal / Lahiri) and Western (Tropical) natal charts with whole-sign and Placidus house cusps.",
    href: "/birth-chart",
    badge: "FREE",
    calcTime: "Instant · ~0.2s",
    icon: Orbit,
    color: "from-[#38bdf8] to-[#3b82f6]",
  },
  {
    id: "horoscope",
    title: "Personalized Moon Forecasts",
    category: "forecasts",
    description: "Deterministic daily, hourly, weekly, and yearly astrological forecasts calibrated to your exact natal Moon sign.",
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
    description: "Authentic daily Tithi, Vara, Nakshatra, Yoga, Karana, Rahu Kalam, and auspicious Muhurat timings for any worldwide city.",
    href: "/panchang",
    badge: "FREE",
    calcTime: "Dynamic",
    icon: CalendarDays,
    color: "from-[#10b981] to-[#3b82f6]",
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
    id: "transit",
    title: "Real-Time Gochara Transits",
    category: "forecasts",
    description: "Real-time ephemeris transits analyzed against your natal Lagna and Moon placements with benefic and malefic aspect matrices.",
    href: "/transit",
    badge: "FREE",
    calcTime: "Live Ephemeris",
    icon: Orbit,
    color: "from-[#7c3aed] to-[#a855f7]",
  },
  {
    id: "remedies",
    title: "Traditional Vedic Remedies",
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

interface AstrologerPreview {
  id: string;
  name: string;
  specialties: string[];
  languages: string[];
  experience: number;
  rating: number;
  reviews: number;
  pricePerMin: number;
  isOnline: boolean;
  avatar: string;
}

const FEATURED_ASTROLOGERS: AstrologerPreview[] = [
  {
    id: "ast-1",
    name: "Dr. K. Sharma (Vedic Master)",
    specialties: ["Vedic Astrology", "Kundli Dasha", "Career & Finance"],
    languages: ["English", "Hindi", "Sanskrit"],
    experience: 22,
    rating: 4.96,
    reviews: 1420,
    pricePerMin: 25,
    isOnline: true,
    avatar: "KS",
  },
  {
    id: "ast-2",
    name: "Elena Rostova (Tarot & Synastry)",
    specialties: ["Tarot Oracle", "Relationship Synastry", "Life Path"],
    languages: ["English", "French"],
    experience: 14,
    rating: 4.92,
    reviews: 890,
    pricePerMin: 20,
    isOnline: true,
    avatar: "ER",
  },
  {
    id: "ast-3",
    name: "Acharya V. Raman",
    specialties: ["Muhurat", "Vedic Remedies", "Gemstone Therapy"],
    languages: ["English", "Hindi", "Tamil"],
    experience: 18,
    rating: 4.89,
    reviews: 1150,
    pricePerMin: 22,
    isOnline: false,
    avatar: "VR",
  },
];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [consultModalAstrologer, setConsultModalAstrologer] = useState<AstrologerPreview | null>(null);

  const categories = [
    { id: "all", label: "All Services" },
    { id: "charts", label: "Charts & Kundli" },
    { id: "forecasts", label: "Forecasts & Horoscopes" },
    { id: "oracles", label: "Tarot & Numerology" },
    { id: "synastry", label: "Synastry & Compatibility" },
    { id: "remedies", label: "Remedies & Gemstones" },
    { id: "consultations", label: "Expert Consultations" },
  ];

  const filteredServices = SERVICES.filter((s) => {
    const matchesCategory = selectedCategory === "all" || s.category === selectedCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageWrapper title="Explore Astrology Services | AstroVerse AI" description="Discover our comprehensive suite of Vedic, Western, and Oracle astrological engines.">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-gold/10 border border-gold/20 text-gold-light">
            <Sparkles className="w-3.5 h-3.5" />
            Comprehensive Astrology Catalog
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>
            Explore Cosmic Services
          </h1>
          <p className="text-sm sm:text-base text-white/60">
            Every calculation is powered by high-precision astronomical ephemeris and personalized to your authenticated birth profile.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search services (e.g. Kundli, Tarot, Transits, Compatibility)..."
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
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  selectedCategory === c.id
                    ? "bg-gold text-black border-gold shadow-lg shadow-gold/20 font-bold"
                    : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:border-white/20"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {(selectedCategory === "all" || selectedCategory !== "consultations") && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                Computational Astrology Engines
              </h2>
              <span className="text-xs text-white/40">{filteredServices.length} tools available</span>
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
        )}

        {/* Astrologer Consultations Marketplace Section */}
        {(selectedCategory === "all" || selectedCategory === "consultations") && (
          <div className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-white/10 pt-8">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-outfit)" }}>
                  <MessageSquare className="w-5 h-5 text-gold" />
                  Live Astrologer Consultation Network
                </h2>
                <p className="text-xs text-white/60 mt-0.5">
                  Connect with verified Vedic masters and Tarot scholars for 1-on-1 personalized guidance.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-gold/10 text-gold-light border border-gold/20 font-semibold self-start sm:self-auto">
                Verified Practitioners
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURED_ASTROLOGERS.map((ast) => (
                <div key={ast.id} className="glass rounded-2xl p-6 border border-white/5 flex flex-col justify-between space-y-4 hover:border-gold/30 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-br from-gold/30 to-purple/40 border border-gold/30 text-white">
                          {ast.avatar}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{ast.name}</h4>
                          <p className="text-[11px] text-white/50">{ast.experience} yrs exp • {ast.languages.join(", ")}</p>
                        </div>
                      </div>
                      <span className={cn(
                        "w-2.5 h-2.5 rounded-full",
                        ast.isOnline ? "bg-emerald-400 shadow-lg shadow-emerald-400/50" : "bg-white/20"
                      )} />
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {ast.specialties.map((sp) => (
                        <span key={sp} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/70 border border-white/5">
                          {sp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-gold">
                        <Star className="w-3.5 h-3.5 fill-gold" />
                        <span className="font-bold text-white">{ast.rating.toFixed(2)}</span>
                        <span className="text-white/40">({ast.reviews})</span>
                      </div>
                      <span className="font-bold text-white font-mono">
                        ${(ast.pricePerMin / 100).toFixed(2)}<span className="text-[10px] text-white/40">/min</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        onClick={() => setConsultModalAstrologer(ast)}
                        className="w-full text-xs font-semibold rounded-lg gap-1 cursor-pointer"
                        style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Chat
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setConsultModalAstrologer(ast)}
                        className="w-full text-xs font-semibold rounded-lg gap-1 border-white/10 hover:border-gold/30 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-gold" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Consultation Booking Modal Preview */}
        {consultModalAstrologer && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="glass-strong rounded-2xl p-6 sm:p-8 max-w-md w-full border border-gold/30 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Book Consultation</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{consultModalAstrologer.name}</h3>
                  <p className="text-xs text-white/60 font-mono">${(consultModalAstrologer.pricePerMin / 100).toFixed(2)} per minute</p>
                </div>
                <button
                  type="button"
                  onClick={() => setConsultModalAstrologer(null)}
                  className="text-white/50 hover:text-white text-sm px-2 py-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 text-xs text-white/70">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Authenticated Session Guarantee
                </p>
                <p className="text-[11px] leading-relaxed">
                  Your selected birth chart and astrological context will be securely attached to the session so the practitioner has immediate astronomical data for your reading.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/70 block">Select Consultation Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {["15 Mins", "30 Mins", "60 Mins"].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      className="py-2.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 hover:border-gold/50 text-white transition-all cursor-pointer"
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setConsultModalAstrologer(null)}
                  className="w-1/3 border-white/10 text-white/70 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    alert("Consultation booking queue initialized. Practitioner will join your secure channel.");
                    setConsultModalAstrologer(null);
                  }}
                  className="flex-1 font-semibold text-xs rounded-lg cursor-pointer"
                  style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
                >
                  Confirm &amp; Start Session
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </PageWrapper>
  );
}
