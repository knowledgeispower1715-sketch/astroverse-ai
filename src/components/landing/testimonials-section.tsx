"use client";

import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { AnimatedCard } from "@/components/shared/animated-card";
import { testimonials } from "@/utils/constants";

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="relative py-20 sm:py-24 lg:py-32"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="What the Stars Say About Us"
          subtitle="Hear from astrologers and cosmic seekers who have transformed their practice with AstroVerse AI."
        />

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <AnimatedCard
              key={testimonial.id}
              delay={index * 0.15}
              glowColor={index % 2 === 0 ? "gold" : "purple"}
              className="p-6 sm:p-8 flex flex-col"
            >
              <Quote className="w-8 h-8 mb-4" style={{ color: "rgba(212, 175, 55, 0.3)" }} />

              <p className="text-sm sm:text-base leading-relaxed mb-6 flex-1" style={{ color: "var(--text-secondary)" }}>
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4"
                    style={{
                      color: i < testimonial.rating ? "var(--gold)" : "var(--text-muted)",
                      fill: i < testimonial.rating ? "var(--gold)" : "transparent",
                    }}
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: "var(--gradient-cosmic)", color: "var(--bg-primary)" }}
                >
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {testimonial.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
