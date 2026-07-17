"use client";

import { motion } from "motion/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeader } from "@/components/shared/section-header";
import { faqItems } from "@/utils/constants";

export function FAQSection() {
  return (
    <section id="faq" className="relative py-20 sm:py-24 lg:py-32" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about AstroVerse AI and how it can illuminate your cosmic journey."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, index) => (
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
        </motion.div>
      </div>
    </section>
  );
}
