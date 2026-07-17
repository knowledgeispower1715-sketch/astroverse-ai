import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { AnimatedCard } from "@/components/shared/animated-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pricing Plans | AstroVerse AI",
  description: "Explore our plans and subscription tiers for detailed reports.",
};

const PLANS = [
  {
    name: "Cosmic Seeker",
    price: "Free",
    desc: "Essential features for beginners to explore basic parameters.",
    features: [
      "Daily Sun sign horoscope",
      "Basic birth chart wheel plot",
      "Standard numerology calculations",
      "General transit outline",
    ],
    cta: "Start Free",
    href: "/register",
    popular: false,
  },
  {
    name: "Astro Premium",
    price: "$19/mo",
    desc: "Detailed Vedic & Western calculation reports with remedies.",
    features: [
      "Hourly Hora and Choghadiya timeline",
      "Full Vedic Kundli (D1 & D9 charts)",
      "Vimshottari Dasha calculations",
      "Planetary Yogas & Doshas detection",
      "Gemstone recommendations & remedies",
      "Multi-page PDF export reports",
    ],
    cta: "Go Premium",
    href: "/register",
    popular: true,
  },
];

export default function PricingPage() {
  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Celestial Memberships
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Choose a plan to align your daily flow and download detailed birth reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PLANS.map((plan, idx) => (
            <AnimatedCard
              key={plan.name}
              delay={idx * 0.1}
              glowColor={plan.popular ? "gold" : "purple"}
              className={`p-8 flex flex-col justify-between h-full border ${
                plan.popular ? "border-gold/30" : "border-white/5"
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>{plan.name}</h3>
                  {plan.popular && (
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                      Most Popular
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-gradient-gold">{plan.price}</span>
                  {plan.price !== "Free" && <span className="text-xs" style={{ color: "var(--text-muted)" }}>/month</span>}
                </div>
                <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{plan.desc}</p>
                
                <ul className="space-y-3 mb-8 text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                asChild
                className="w-full h-12 rounded-lg text-sm font-semibold cursor-pointer"
                style={{
                  background: plan.popular ? "var(--gradient-gold)" : "rgba(255,255,255,0.05)",
                  color: plan.popular ? "var(--bg-primary)" : "var(--text-primary)",
                  border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
