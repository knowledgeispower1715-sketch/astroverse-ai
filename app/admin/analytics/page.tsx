import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Analytics | AstroVerse AI",
};

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-primary)" }}>
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(212, 175, 55, 0.1)" }}>
          <Sparkles className="w-8 h-8" style={{ color: "var(--gold)" }} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>
          Analytics
        </h1>
        <p className="text-sm sm:text-base mb-2" style={{ color: "var(--text-secondary)" }}>
          Track usage metrics, engagement, and growth.
        </p>
        <p className="text-xs mb-8" style={{ color: "var(--text-muted)" }}>
          Coming soon — the stars are still aligning.
        </p>
        <Button asChild variant="outline" className="rounded-full px-6 gap-2" style={{ borderColor: "rgba(212,175,55,0.3)", color: "var(--gold-light)" }}>
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
