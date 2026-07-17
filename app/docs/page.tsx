import type { Metadata } from "next";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation | AstroVerse AI",
  description: "Learn how to use AstroVerse AI and configure calculations.",
};

export default function DocsPage() {
  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: "rgba(212, 175, 55, 0.1)", color: "var(--gold)" }}>
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>
          Product Documentation
        </h1>
        <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
          Our complete guides, formulas breakdowns, house division systems explanation, and FAQs are currently being compiled.
        </p>
      </div>
    </PageWrapper>
  );
}
