"use client";

import { motion } from "motion/react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StarField } from "@/components/shared/star-field";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { pageTransition } from "@/design-system";

interface PageWrapperProps {
  children: React.ReactNode;
  showStarField?: boolean;
}

export function PageWrapper({ children, showStarField = true }: PageWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen relative" style={{ background: "var(--bg-primary)" }}>
      {/* Background Starfield */}
      {showStarField && <StarField />}

      {/* Global Navbar */}
      <Navbar />

      {/* Main animated page container */}
      <motion.div
        {...pageTransition}
        className="flex-grow flex flex-col pt-20 sm:pt-24 relative z-10"
      >
        {/* Breadcrumb navigation trail */}
        <Breadcrumbs />
        
        {/* Actual page body content */}
        <div className="flex-grow">
          {children}
        </div>
      </motion.div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
