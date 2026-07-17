"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Calendar, User, ArrowRight, Search, BookOpen } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { AnimatedCard } from "@/components/shared/animated-card";
import { Input } from "@/components/ui/input";

const BLOG_POSTS = [
  { slug: "understanding-saturn-return", title: "Understanding Your Saturn Return", excerpt: "How to prepare for the major astrological milestone that defines your late twenties.", date: "Jul 15, 2026", author: "Aria Nightshade", category: "Transit" },
  { slug: "introduction-to-nakshatras", title: "Introduction to the 27 Nakshatras", excerpt: "Delve into the lunar mansions of Vedic astrology and their impact on your emotional blueprint.", date: "Jul 10, 2026", author: "Marcus Chen", category: "Vedic" },
  { slug: "mercury-retrograde-survival-guide", title: "Mercury Retrograde Survival Guide", excerpt: "Practical tips to manage communication, devices, and contracts during retrogrades.", date: "Jul 05, 2026", author: "Luna Silveira", category: "Guide" },
  { slug: "synastry-vs-composite-charts", title: "Synastry vs. Composite Charts", excerpt: "Understanding the difference between relationship chemistry and relationship destiny.", date: "Jun 28, 2026", author: "Aria Nightshade", category: "Western" },
];

const CATEGORIES = ["All", "Vedic", "Western", "Transit", "Guide"];

export default function BlogListingPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Cosmic Chronicles
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Explore guides, deep-dives, and transit analysis from our team of professional astrologers.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5">
          {/* Categories */}
          <div className="flex gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  activeCategory === cat ? "bg-gold text-black" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: "var(--text-muted)" }}>
              <Search className="w-4 h-4" />
            </span>
            <Input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-9 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
            />
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl border border-white/5" style={{ color: "var(--text-muted)" }}>
            <BookOpen className="w-10 h-10 mb-4 mx-auto text-gold" />
            <p className="text-sm">No articles found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post, idx) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="block group">
                <AnimatedCard
                  delay={idx * 0.05}
                  glowColor={idx % 2 === 0 ? "gold" : "purple"}
                  className="p-6 sm:p-8 flex flex-col justify-between h-full border-white/5 group-hover:border-gold/30"
                >
                  <div className="space-y-4">
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
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>{post.title}</h3>
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{post.excerpt}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold" style={{ color: "var(--gold-light)" }}>
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </AnimatedCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
