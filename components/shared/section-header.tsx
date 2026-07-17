"use client";

import { motion } from "motion/react";
import { fadeInUp } from "@/design-system";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  gradient?: boolean;
}

export function SectionHeader({ title, subtitle, align = "center", gradient = true }: SectionHeaderProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={`mb-12 sm:mb-16 ${alignClass}`}
    >
      <h2
        className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 ${
          gradient ? "text-gradient-gold" : ""
        }`}
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
