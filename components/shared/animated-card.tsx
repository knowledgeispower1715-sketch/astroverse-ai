"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "gold" | "purple";
  delay?: number;
}

export function AnimatedCard({ children, className, glowColor = "gold", delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay } },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={cn(
        "relative rounded-xl overflow-hidden",
        "glass",
        "transition-shadow duration-300",
        glowColor === "gold" ? "hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]" : "hover:shadow-[0_0_30px_rgba(124,58,237,0.15)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
