import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { faqItems } from "@/utils/constants";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | AstroVerse AI",
  description: "Get answers to common questions about AstroVerse AI, astrology charts, and billing.",
};

const EXTRA_FAQ = [
  {
    question: "Can I generate charts in local timezones?",
    answer: "Yes. Our calculation engine automatically maps coordinates and resolves local daylight saving offsets based on the exact latitude, longitude, and historical time databases.",
  },
  {
    question: "Do you offer premium astrological reports?",
    answer: "Yes, premium subscribers can generate and download extensive PDF analysis reports detailing birth charts, Vimshottari Dashas, current transits, and customized planetary remedies.",
  },
  {
    question: "How do I upgrade or cancel my plan?",
    answer: "You can upgrade or cancel your plan at any time through your Profile Settings dashboard. Cancellation will take effect at the end of your current billing period.",
  },
];

export default function FAQPage() {
  const allFaqs = [...faqItems, ...EXTRA_FAQ];

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1
            className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-4"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Cosmic Knowledge Base
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Explore answers to frequently asked questions about astrology configurations, accuracy, data security, and memberships.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {allFaqs.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="glass rounded-xl px-6 border-none"
            >
              <AccordionTrigger
                className="text-left text-sm sm:text-base font-medium py-5 hover:no-underline"
                style={{ color: "var(--text-primary)" }}
              >
                {item.question}
              </AccordionTrigger>
              <AccordionContent
                className="text-sm sm:text-base leading-relaxed pb-5"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </PageWrapper>
  );
}
