"use client";

import Link from "next/link";
import { motion } from "motion/react";
import * as LucideIcons from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { AnimatedCard } from "@/components/shared/animated-card";
import { features } from "@/config/features";
import type { LucideIcon } from "lucide-react";

function getIcon(name: string): LucideIcon {
  return (LucideIcons as unknown as Record<string, LucideIcon>)[name] || LucideIcons.Star;
}

const featureHrefMap: Record<string, string> = {
  "birth-charts": "/birth-chart",
  "daily-horoscopes": "/horoscope",
  "compatibility": "/compatibility",
  "transit-predictions": "/transit",
  "tarot-integration": "/tarot",
  "cosmic-calendar": "/dashboard",
};

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 sm:py-24 lg:py-32" style={{ background: "var(--bg-primary)" }}>
      {/* Subtle background accent */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(124, 58, 237, 0.05) 0%, transparent 70%)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Cosmic Features"
          subtitle="Explore the full spectrum of astrological insights powered by advanced AI and centuries of celestial wisdom."
        />

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = getIcon(feature.icon);
            const href = featureHrefMap[feature.id] || "/dashboard";
            return (
              <Link href={href} key={feature.id} className="block group">
                <AnimatedCard delay={index * 0.1} className="p-6 sm:p-8 h-full cursor-pointer transition-all duration-300 group-hover:border-gold/30">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br ${feature.gradient}`}
                    style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3
                    className="text-lg sm:text-xl font-semibold mb-3 group-hover:text-gradient-gold"
                    style={{ color: "var(--text-primary)", fontFamily: "var(--font-outfit)" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {feature.description}
                  </p>
                </AnimatedCard>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
