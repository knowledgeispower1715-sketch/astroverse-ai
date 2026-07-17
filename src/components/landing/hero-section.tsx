"use client";

import { motion } from "motion/react";
import { ArrowRight, Telescope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarField } from "@/components/shared/star-field";

const ZODIAC_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      <StarField />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(124, 58, 237, 0.12) 0%, transparent 60%)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 70%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)" }}
      />

      {/* Floating zodiac symbols */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {ZODIAC_SYMBOLS.map((symbol, i) => (
          <motion.div
            key={symbol}
            className="absolute text-2xl sm:text-3xl select-none"
            style={{
              color: i % 2 === 0 ? "rgba(212, 175, 55, 0.12)" : "rgba(124, 58, 237, 0.12)",
              left: `${10 + (i * 7) % 80}%`,
              top: `${15 + (i * 11) % 70}%`,
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 5 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-sm font-medium"
            style={{
              background: "rgba(212, 175, 55, 0.1)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              color: "var(--gold-light)",
            }}
          >
            <Telescope className="w-4 h-4" />
            AI-Powered Cosmic Insights
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
            style={{ fontFamily: "var(--font-outfit)", lineHeight: 1.1 }}
          >
            <span style={{ color: "var(--text-primary)" }}>Unlock the Secrets</span>
            <br />
            <span className="text-gradient-cosmic">of the Cosmos</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10"
            style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
          >
            Discover your cosmic blueprint with AI-powered birth charts, personalized
            horoscopes, compatibility analysis, and real-time transit predictions across
            Western, Vedic, and Chinese astrology systems.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="text-base font-semibold rounded-full px-8 h-12 sm:h-14 gap-2 group"
              style={{
                background: "var(--gradient-gold)",
                color: "var(--bg-primary)",
              }}
            >
              Explore Your Chart
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base font-semibold rounded-full px-8 h-12 sm:h-14"
              style={{
                borderColor: "rgba(212, 175, 55, 0.3)",
                color: "var(--gold-light)",
                background: "transparent",
              }}
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--bg-primary), transparent)" }}
      />
    </section>
  );
}
