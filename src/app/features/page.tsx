import type { Metadata } from "next";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { AnimatedCard } from "@/components/shared/animated-card";
import { features } from "@/config/features";
import type { LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Features & Tools | AstroVerse AI",
  description: "Explore the comprehensive set of AI-powered astrology calculation tools and engines available.",
};

const EXTRA_FEATURES = [
  {
    id: "kundli",
    title: "Vedic Kundli Generator",
    description: "Generate traditional North and South Indian style Kundli charts with precise planet degrees and sub-divisional charts.",
    icon: "FileText",
    gradient: "from-[#ec4899] to-[#8b5cf6]",
    href: "/kundli",
  },
  {
    id: "panchang",
    title: "Daily Panchang",
    description: "Access the dynamic Hindu calendar detailing Tithi, Vara, Nakshatra, Yoga, and Karana for exact locations.",
    icon: "Calendar",
    gradient: "from-[#10b981] to-[#3b82f6]",
    href: "/panchang",
  },
  {
    id: "numerology",
    title: "Numerology Calculators",
    description: "Calculate your Destiny number, Life Path number, and Soul Urge values directly from your name and birth date.",
    icon: "Hash",
    gradient: "from-[#ef4444] to-[#f59e0b]",
    href: "/numerology",
  },
  {
    id: "remedies",
    title: "Astrological Remedies",
    description: "Identify planetary doshas and receive specific remedies including mantras, donations, and fasting recommendations.",
    icon: "ShieldAlert",
    gradient: "from-[#a855f7] to-[#ec4899]",
    href: "/remedies",
  },
  {
    id: "gemstones",
    title: "Gemstone Advisor",
    description: "Discover life-path gems and sub-gemstone recommendations based on planetary lord strengths.",
    icon: "Gem",
    gradient: "from-[#06b6d4] to-[#10b981]",
    href: "/gemstones",
  },
];

const featureHrefMap: Record<string, string> = {
  "birth-charts": "/birth-chart",
  "daily-horoscopes": "/horoscope",
  "compatibility": "/compatibility",
  "transit-predictions": "/transit",
  "tarot-integration": "/tarot",
  "cosmic-calendar": "/dashboard",
};

function getIcon(name: string): LucideIcon {
  return (LucideIcons as unknown as Record<string, LucideIcon>)[name] || LucideIcons.Star;
}

export default function FeaturesPage() {
  const allFeatures = [
    ...features.map((f) => ({
      ...f,
      href: featureHrefMap[f.id] || "/dashboard",
    })),
    ...EXTRA_FEATURES,
  ];

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1
            className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-4"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Cosmic Tools Explorer
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Unlock cosmic alignment. Browse our suite of Vedic and Western calculation tools, chart creators, and prediction engines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allFeatures.map((item, index) => {
            const Icon = getIcon(item.icon);
            return (
              <Link href={item.href} key={item.id} className="block group">
                <AnimatedCard
                  delay={index * 0.05}
                  glowColor={index % 2 === 0 ? "gold" : "purple"}
                  className="p-6 sm:p-8 h-full cursor-pointer transition-all duration-300 group-hover:border-gold/30"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br ${item.gradient}`}
                    style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3
                    className="text-lg sm:text-xl font-semibold mb-3 group-hover:text-gradient-gold"
                    style={{ color: "var(--text-primary)", fontFamily: "var(--font-outfit)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {item.description}
                  </p>
                </AnimatedCard>
              </Link>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}
