import type { Metadata } from "next";
import { PageWrapper } from "@/components/shared/page-wrapper";

export const metadata: Metadata = {
  title: "Terms of Service | AstroVerse AI",
  description: "Review terms and conditions for utilizing the AstroVerse calculations engines.",
};

export default function TermsPage() {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1
          className="text-3xl sm:text-4xl font-bold text-gradient-gold mb-8"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Terms of Service
        </h1>
        <div className="glass rounded-xl p-8 border border-white/5 space-y-6 text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <p>
            Last Updated: July 18, 2026
          </p>
          <p>
            Welcome to AstroVerse AI. By accessing or using our websites, calculation engines, and tools, you agree to comply with and be bound by the following terms of use.
          </p>

          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>1. Service Scope</h2>
          <p>
            AstroVerse AI offers mathematical computations of planetary configurations, divisional charts, Vimshottari Dashas, and custom interpretation scoring based on traditional methods. These calculations are offered for educational and self-reflection purposes only.
          </p>

          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>2. Account Use & Registration</h2>
          <p>
            You must provide accurate birth parameters (Date, Time, and Location) to ensure accurate calculations. You are responsible for maintaining the confidentiality of your session credentials.
          </p>

          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>3. Limitation of Liability</h2>
          <p>
            AstroVerse AI does not guarantee specific life outcomes, counseling directives, or financial advice. All predictions are rule-based calculations representing classical astrological configurations.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
