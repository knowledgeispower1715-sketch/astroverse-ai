import type { Metadata } from "next";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Cosmic Community | AstroVerse AI",
  description: "Join the AstroVerse community to discuss transits and alignments.",
};

export default function CommunityPage() {
  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: "rgba(212, 175, 55, 0.1)", color: "var(--gold)" }}>
          <MessageSquare className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>
          Cosmic Community
        </h1>
        <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
          Connect with other seekers, discuss planetary ingresses, and share chart readings. Our community forums are opening soon.
        </p>
      </div>
    </PageWrapper>
  );
}
