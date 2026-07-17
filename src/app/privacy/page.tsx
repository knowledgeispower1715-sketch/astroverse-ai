import type { Metadata } from "next";
import { PageWrapper } from "@/components/shared/page-wrapper";

export const metadata: Metadata = {
  title: "Privacy Policy | AstroVerse AI",
  description: "Read our privacy guidelines regarding birth chart data and user parameters.",
};

export default function PrivacyPage() {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1
          className="text-3xl sm:text-4xl font-bold text-gradient-gold mb-8"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Privacy Policy
        </h1>
        <div className="glass rounded-xl p-8 border border-white/5 space-y-6 text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <p>
            Last Updated: July 18, 2026
          </p>
          <p>
            At AstroVerse AI, we take your privacy and the security of your birth information very seriously. This policy describes how we collect, store, and process your inputs when you use our website, calculations, and subscription services.
          </p>
          
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>1. Information We Collect</h2>
          <p>
            We collect information that you explicitly submit, including:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-2">
            <li>Account Details: Email, Name, and password.</li>
            <li>Birth Parameters: Birth date, exact birth time, and birth coordinates (location, latitude, longitude, and timezone) used to compute planetary ephemeris.</li>
          </ul>

          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>2. How We Use Your Data</h2>
          <p>
            Your parameters are passed to our calculations engines (such as the Swiss Ephemeris) to generate positions, charts, and forecasts. We do not sell, rent, or lease your birth information to third-party advertisers.
          </p>

          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>3. Security & Cookies</h2>
          <p>
            We utilize secure session cookies and database encryption to manage your profile and private charts. You can request deletion of your account and all associated birth records at any time.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
