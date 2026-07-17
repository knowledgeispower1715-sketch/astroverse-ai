import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FAQSection } from "@/components/landing/faq-section";
import { NewsletterSection } from "@/components/landing/newsletter-section";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <FAQSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
