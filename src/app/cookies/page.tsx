import type { Metadata } from "next";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy | AstroVerse AI",
  description: "Learn how we utilize browser cookies and active sessions.",
};

export default function CookiesPage() {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gradient-gold mb-8" style={{ fontFamily: "var(--font-outfit)" }}>
          Cookie Policy
        </h1>
        <div className="glass rounded-xl p-8 border border-white/5 space-y-6 text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <p>
            Last Updated: July 18, 2026
          </p>
          <p>
            AstroVerse AI utilizes standard HTTP cookies and local storage tokens to preserve your active sessions, keep you authenticated on dashboard pages, and remember your configurations (such as preferred astrology systems).
          </p>
          
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>1. Essential Session Cookies</h2>
          <p>
            These are strictly required to manage your login profile, prevent security cross-site forgery, and load the dashboard. Disabling these cookies in your browser settings will prevent correct authentication functions.
          </p>

          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>2. Preferences Cookies</h2>
          <p>
            We use persistent local storage to remember whether you selected Western Tropical or Sidereal Vedic systems, your timezone offsets, and your dark mode theme options.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
