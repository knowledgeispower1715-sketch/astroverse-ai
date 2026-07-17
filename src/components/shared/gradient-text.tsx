import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  variant?: "gold" | "cosmic" | "purple";
}

export function GradientText({ children, className, variant = "gold" }: GradientTextProps) {
  const gradientClass = {
    gold: "text-gradient-gold",
    cosmic: "text-gradient-cosmic",
    purple: "bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent",
  }[variant];

  return <span className={cn(gradientClass, className)}>{children}</span>;
}
