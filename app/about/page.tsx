import type { Metadata } from "next";
import { Sparkles, Users, Award, ShieldCheck } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { AnimatedCard } from "@/components/shared/animated-card";

export const metadata: Metadata = {
  title: "About Us | AstroVerse AI",
  description: "Learn about the mission, vision, and team behind AstroVerse AI.",
};

const VALUES = [
  {
    icon: Sparkles,
    title: "Celestial Accuracy",
    description: "Combining ancient mathematical formulas with modern computation to map planetary degrees down to the exact arc-minute.",
  },
  {
    icon: Users,
    title: "Empowering Insights",
    description: "We don't believe in absolute determinism. We believe in providing coordinates for self-discovery and conscious decision-making.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description: "Your birth parameters, coordinates, and questions are yours alone. We encrypt all charts and personal profiles.",
  },
];

export default function AboutPage() {
  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Intro */}
        <div className="text-center mb-16">
          <h1
            className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-6"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Our Celestial Mission
          </h1>
          <p
            className="text-base sm:text-lg max-w-3xl mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            AstroVerse AI was founded to bridge the gap between ancient planetary wisdom and modern computing. By digitizing traditional Vedic, Western, and Chinese calculation engines, we offer seekers a precise and secure dashboard to align their lives with the rhythms of the cosmos.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {VALUES.map((val, idx) => {
            const Icon = val.icon;
            return (
              <AnimatedCard key={idx} delay={idx * 0.1} className="p-6">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: "rgba(212, 175, 55, 0.1)", color: "var(--gold)" }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>
                  {val.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {val.description}
                </p>
              </AnimatedCard>
            );
          })}
        </div>

        {/* Details Card */}
        <div className="glass rounded-2xl p-8 sm:p-10 border border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124, 58, 237, 0.08) 0%, transparent 60%)" }} />
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gradient-gold mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
              Guided by the Stars
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
              Whether you are mapping transits, seeking compatibility reports, or studying Nakshatra elements, our platform brings structural clarity to the complex variables of the universe.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold" style={{ background: "rgba(212, 175, 55, 0.05)", border: "1px solid rgba(212, 175, 55, 0.15)", color: "var(--gold-light)" }}>
              <Award className="w-4 h-4" />
              Trusted by 500,000+ Cosmic Seekers
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
