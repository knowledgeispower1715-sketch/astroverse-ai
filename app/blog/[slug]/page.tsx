import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Calendar, User, BookOpen } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";

export const metadata: Metadata = {
  title: "Blog Post | AstroVerse AI",
  description: "Read in-depth cosmic articles and guides.",
};

const BLOG_DETAILS: Record<string, { title: string; date: string; author: string; category: string; content: string[] }> = {
  "understanding-saturn-return": {
    title: "Understanding Your Saturn Return",
    date: "Jul 15, 2026",
    author: "Aria Nightshade",
    category: "Transit",
    content: [
      "The Saturn return is one of the most critical landmarks in a person's astrological development. Occurring roughly every 29.5 years, it marks the moment Saturn returns to the exact degree and sign it occupied at the time of your birth.",
      "Astrologically, Saturn represents discipline, structural limits, responsibility, and boundaries. When it returns to its natal coordinate, it acts as a cosmic auditor, demanding that you assess your foundations, career paths, and relationship parameters.",
      "Many experience major life transitions during this period—such as career shifts, marriage, relocation, or structural self-realizations. While it can bring challenges, navigating it with structure and patience paves the way for emotional maturity and long-term stability."
    ]
  },
  "introduction-to-nakshatras": {
    title: "Introduction to the 27 Nakshatras",
    date: "Jul 10, 2026",
    author: "Marcus Chen",
    category: "Vedic",
    content: [
      "While Western tropical astrology divides the sky into 12 signs based on the sun's equinox path, Vedic sidereal astrology integrates the Moon's daily progression through 27 distinct sectors called Nakshatras (lunar mansions).",
      "Spanning 13°20' each, every Nakshatra has a ruling planet, a deity, and a primary element. Your birth Moon's Nakshatra offers a deep mapping of your emotional responses, subconscious patterns, and life tendencies.",
      "Studying Nakshatras helps seekers identify their ruling Vimshottari Dasha cycles and understand Nakshatra-level compatibility (Koota scoring) for relationships."
    ]
  },
  "mercury-retrograde-survival-guide": {
    title: "Mercury Retrograde Survival Guide",
    date: "Jul 05, 2026",
    author: "Luna Silveira",
    category: "Guide",
    content: [
      "Few astrological phenomena cause as much anxiety as Mercury Retrograde. Occurring 3 to 4 times a year, it is the apparent backward motion of the planet governing intellect, communication, and devices.",
      "During these 3-week cycles, standard communication flows can experience friction. Emails go missing, flights get delayed, and contracts signed under retrogrades are prone to revisions later.",
      "The key to surviving this transit is simple: review, reflect, and revise. Avoid launching unverified projects, back up your databases, double-check travel schedules, and speak with extra patience."
    ]
  },
  "synastry-vs-composite-charts": {
    title: "Synastry vs. Composite Charts",
    date: "Jun 28, 2026",
    author: "Aria Nightshade",
    category: "Western",
    content: [
      "When assessing relationships, astrologers use two distinct tools: Synastry (chart comparison) and Composite Charts (relationship midpoint charts).",
      "Synastry maps planet placements of Chart A onto Chart B. This reveals daily relationship chemistry—how you trigger, support, or spark each other's natal houses.",
      "Composite charts, on the other hand, compute mathematical midpoints between planetary coordinates to create a single new chart. This chart represents the relationship itself as an independent third entity—its life path, shared destiny, and structural purpose."
    ]
  }
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_DETAILS[slug] || {
    title: "Celestial Chronicles",
    date: "Unknown Date",
    author: "AstroVerse Writer",
    category: "Astrology",
    content: [
      "This cosmic guide is being prepared by our editorial team. Please check back soon for detailed transits, aspect grids, and remedies.",
      "Our team is continuously updating our knowledge base to reflect the latest ephemeris coordinates."
    ]
  };

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs hover:underline mb-8" style={{ color: "var(--text-muted)" }}>
          <ChevronLeft className="w-4 h-4" />
          Back to Articles
        </Link>

        {/* Article Meta */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between text-[10px] font-bold">
            <span style={{ color: "var(--gold)" }}>{post.category}</span>
            <div className="flex items-center gap-3" style={{ color: "var(--text-muted)" }}>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {post.author}
              </span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient-gold leading-tight" style={{ fontFamily: "var(--font-outfit)" }}>
            {post.title}
          </h1>
        </div>

        {/* Content */}
        <div className="glass rounded-2xl p-8 border border-white/5 space-y-6 text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {post.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
