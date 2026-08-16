"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Layers, 
  RefreshCw, 
  Bookmark, 
  CheckCircle2, 
  Clock,
  History,
  Info,
  Search,
  BookOpen,
  ShieldAlert,
  X
} from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedCard } from "@/components/shared/animated-card";
import { SPREADS, TarotReading, TarotCard } from "@/modules/tarot-engine";
import { tarotCards } from "@/config/tarotCards";
import { TAROT_DECK_METADATA } from "@/config/tarot-assets";
import { cn } from "@/lib/utils";

interface SavedReadingRow {
  id: string;
  spread_id: string;
  question: string | null;
  drawn_cards: TarotReading["drawnCards"];
  cosmic_context: string;
  created_at: string;
}

const SPREAD_OPTIONS = [
  { id: "single", name: "Single Card", count: 1, desc: "Immediate daily focus & clear yes/no clarity." },
  { id: "three-card", name: "Three Card", count: 3, desc: "Past, Present, and Future trajectory." },
  { id: "career", name: "Career Path", count: 4, desc: "Opportunities, challenges & professional actions." },
  { id: "love", name: "Love & Romance", count: 4, desc: "Emotional dynamics & relationship evolution." },
  { id: "decision", name: "Decision Crossroads", count: 5, desc: "Choice A vs Choice B and underlying consequences." },
  { id: "relationship", name: "Relationship Synastry", count: 6, desc: "Deep mutual connection & long-term potential." },
  { id: "celtic-cross", name: "Celtic Cross", count: 10, desc: "Comprehensive 10-position deep archetypal dive." },
];

export default function TarotPage() {
  const [activeView, setActiveView] = useState<"oracle" | "deck">("oracle");
  const [selectedSpread, setSelectedSpread] = useState<string>("three-card");
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<"idle" | "drawing" | "drawn">("idle");
  const [reading, setReading] = useState<TarotReading | null>(null);
  const [savedStatus, setSavedStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [history, setHistory] = useState<TarotReading[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  // Deck Browser State
  const [deckFilter, setDeckFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCardDetail, setSelectedCardDetail] = useState<TarotCard | null>(null);

  const drawTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load history on mount
  useEffect(() => {
    let isMounted = true;
    async function loadHistory() {
      try {
        const res = await fetch("/api/tarot");
        if (res.ok) {
          const data = await res.json();
          if (data.readings && isMounted) {
            setHistory(data.readings.map((r: SavedReadingRow) => ({
              id: r.id,
              spreadId: r.spread_id,
              question: r.question,
              drawnCards: r.drawn_cards,
              cosmicContext: r.cosmic_context,
              createdAt: r.created_at,
            })));
          }
        }
      } catch (err) {
        console.error("Failed to load reading history:", err);
      }
    }
    loadHistory();

    return () => {
      isMounted = false;
      if (drawTimerRef.current) clearTimeout(drawTimerRef.current);
    };
  }, []);

  const handleDraw = async () => {
    setStatus("drawing");
    setSavedStatus("idle");
    setErrorMessage(null);
    setFlippedCards({});

    try {
      const res = await fetch("/api/tarot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spreadId: selectedSpread, question: question.trim() || undefined }),
      });

      if (res.ok) {
        const data = await res.json();
        setReading(data.reading);
        drawTimerRef.current = setTimeout(() => {
          setStatus("drawn");
          // Reveal cards sequentially
          data.reading.drawnCards.forEach((_: unknown, i: number) => {
            setTimeout(() => {
              setFlippedCards((prev) => ({ ...prev, [i]: true }));
            }, i * 200);
          });
        }, 1200);
      } else {
        const errData = await res.json().catch(() => ({ error: "Failed to draw cards" }));
        setErrorMessage(errData.error || "Failed to draw cards.");
        setStatus("idle");
      }
    } catch (err) {
      console.error("Draw failed:", err);
      setErrorMessage("Network error while connecting to Tarot oracle.");
      setStatus("idle");
    }
  };

  const handleSave = async () => {
    if (!reading || savedStatus === "saved" || savedStatus === "saving") return;
    setSavedStatus("saving");
    try {
      const res = await fetch("/api/tarot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "save",
          reading,
        }),
      });
      if (res.ok) {
        setSavedStatus("saved");
        setHistory((prev) => [reading, ...prev.filter(h => h.id !== reading.id)]);
      } else {
        setSavedStatus("idle");
      }
    } catch {
      setSavedStatus("idle");
    }
  };

  const filteredCards = tarotCards.filter((c) => {
    const matchesFilter =
      deckFilter === "all" ||
      (deckFilter === "major" && c.arcana === "major") ||
      (deckFilter === "wands" && c.suit === "wands") ||
      (deckFilter === "cups" && c.suit === "cups") ||
      (deckFilter === "swords" && c.suit === "swords") ||
      (deckFilter === "pentacles" && c.suit === "pentacles");

    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <PageWrapper title="Celestial Tarot Oracle | AstroVerse AI" description="Authentic 78-card Rider-Waite-Smith Tarot Oracle with complete vector artwork, multi-card spreads, and archetypal interpretations.">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Header & Tabs */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-gold/10 border border-gold/20 text-gold-light">
            <Layers className="w-3.5 h-3.5" />
            Complete 78-Card Rider-Waite Archetypal Deck
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>
            Celestial Tarot Oracle
          </h1>
          <p className="text-xs sm:text-sm text-white/60">
            Draw archetypal guidance from the 22 Major Arcana and 56 Minor Arcana. Every card is rendered with authentic classical artwork and multi-dimensional meanings.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveView("oracle")}
              className={cn(
                "px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border",
                activeView === "oracle"
                  ? "bg-gold text-black border-gold shadow-lg shadow-gold/20"
                  : "bg-white/5 border-white/10 text-white/70 hover:text-white"
              )}
            >
              <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />
              Oracle Reading
            </button>
            <button
              type="button"
              onClick={() => setActiveView("deck")}
              className={cn(
                "px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border",
                activeView === "deck"
                  ? "bg-gold text-black border-gold shadow-lg shadow-gold/20"
                  : "bg-white/5 border-white/10 text-white/70 hover:text-white"
              )}
            >
              <BookOpen className="w-3.5 h-3.5 inline mr-1.5" />
              Browse 78-Card Deck
            </button>

            {history.length > 0 && activeView === "oracle" && (
              <Button
                onClick={() => setShowHistory(!showHistory)}
                variant="outline"
                className="text-xs h-9 gap-1.5 border-white/10 text-white/70 hover:text-white"
              >
                <History className="w-3.5 h-3.5 text-gold" />
                Journal ({history.length})
              </Button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="max-w-xl mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 1: ORACLE READING */}
        {/* =================================================================== */}
        {activeView === "oracle" && (
          <>
            {/* History Drawer */}
            {showHistory && (
              <div className="glass rounded-2xl p-6 border border-gold/20 animate-fade-in space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gold" /> Reading Journal
                  </h3>
                  <button 
                    onClick={() => setShowHistory(false)} 
                    className="text-xs text-white/50 hover:text-white"
                  >
                    Close
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {history.map((item, idx) => (
                    <div 
                      key={item.id || idx} 
                      className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 cursor-pointer hover:border-gold/30 transition-colors"
                      onClick={() => {
                        setReading(item);
                        setStatus("drawn");
                        setShowHistory(false);
                      }}
                    >
                      <div className="flex items-center justify-between text-[11px] text-white/50">
                        <span className="font-semibold text-gold-light uppercase">{item.spreadId}</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                      {item.question && (
                        <p className="text-xs text-white font-medium italic">&ldquo;{item.question}&rdquo;</p>
                      )}
                      <div className="text-[11px] text-white/60 truncate">
                        {item.drawnCards.map((c) => c.card.name).join(" · ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Spread Selection & Question Input */}
            {status === "idle" && (
              <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {SPREAD_OPTIONS.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedSpread(opt.id)}
                      className={cn(
                        "cursor-pointer rounded-2xl p-5 border transition-all duration-300",
                        selectedSpread === opt.id
                          ? "bg-white/15 border-gold shadow-lg shadow-gold/10 ring-1 ring-gold/40 scale-[1.02]"
                          : "glass border-white/5 hover:border-white/20 hover:scale-[1.01]"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-light">
                          {opt.count} {opt.count === 1 ? "Card" : "Cards"}
                        </span>
                        <Layers className="w-4 h-4 text-white/40" />
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1" style={{ fontFamily: "var(--font-outfit)" }}>
                        {opt.name}
                      </h3>
                      <p className="text-xs text-white/60 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="max-w-xl mx-auto glass rounded-2xl p-6 sm:p-8 border border-white/10 space-y-5 text-center">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold block text-white/80">
                      Focus Your Intention or Question <span className="text-white/40">(optional)</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. What guidance do the archetypes offer for my upcoming transition?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="h-11 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50 placeholder:text-white/30 text-center text-xs"
                    />
                  </div>

                  <Button
                    onClick={handleDraw}
                    className="w-full sm:w-auto h-12 px-10 text-xs font-bold rounded-xl bg-gold text-black hover:bg-gold-light cursor-pointer transition-all hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Shuffle &amp; Draw {SPREADS[selectedSpread]?.cardCount || 3} Cards
                  </Button>
                </div>
              </div>
            )}

            {/* Drawing Animation */}
            {status === "drawing" && (
              <div className="text-center py-20 space-y-4 animate-fade-in">
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-gold/20 animate-ping" />
                  <div className="w-16 h-16 rounded-2xl border border-gold/40 flex items-center justify-center animate-spin bg-gradient-to-br from-gold/20 to-purple-900/40">
                    <Sparkles className="w-8 h-8 text-gold" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                  Shuffling the 78-Card Celestial Deck...
                </h3>
                <p className="text-xs text-white/60">
                  Aligning archetypal resonances to your inquiry without duplicates.
                </p>
              </div>
            )}

            {/* Drawn Reading Results with 3D Flip Animation */}
            {status === "drawn" && reading && (
              <div className="space-y-10 animate-fade-in">
                {/* Query Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl glass border border-white/10">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-light">
                      {SPREADS[reading.spreadId]?.name || "Tarot"} Reading
                    </span>
                    {reading.question && (
                      <p className="text-sm font-medium text-white italic">&ldquo;{reading.question}&rdquo;</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      onClick={handleSave}
                      disabled={savedStatus === "saved" || savedStatus === "saving"}
                      variant="outline"
                      className="text-xs h-9 gap-1.5 border-white/10 text-white hover:border-gold/40 cursor-pointer"
                    >
                      {savedStatus === "saved" ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                          Saved to Journal
                        </>
                      ) : savedStatus === "saving" ? (
                        "Saving..."
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5 text-gold" />
                          Save Reading
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => { setStatus("idle"); setReading(null); }}
                      variant="ghost"
                      className="text-xs h-9 gap-1 text-white/60 hover:text-white cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      New Spread
                    </Button>
                  </div>
                </div>

                {/* Cards Visual Grid */}
                <div className={`grid gap-6 ${
                  reading.drawnCards.length === 1
                    ? "max-w-xs mx-auto grid-cols-1"
                    : reading.drawnCards.length <= 3
                    ? "grid-cols-1 md:grid-cols-3"
                    : reading.drawnCards.length <= 6
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                }`}>
                  {reading.drawnCards.map((drawn, idx) => {
                    const isFlipped = flippedCards[idx] ?? true;
                    return (
                      <AnimatedCard key={idx} delay={idx * 0.08} className="p-5 flex flex-col justify-between h-full border-white/10 hover:border-gold/40 transition-all duration-300">
                        {/* Position Title */}
                        <div className="text-center mb-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider block text-gold">
                            {drawn.position.name}
                          </span>
                          <span className="text-[10px] text-white/40 block leading-tight">
                            {drawn.position.description}
                          </span>
                        </div>

                        {/* Real Card Visual with 3D Flip */}
                        <div className="relative w-full aspect-[2/3] max-h-72 rounded-xl mb-4 overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                          <img
                            src={isFlipped ? drawn.card.image : "/tarot/card-back.svg"}
                            alt={drawn.card.name}
                            className={cn(
                              "w-full h-full object-contain rounded-xl transition-all duration-700",
                              drawn.isReversed && isFlipped ? "rotate-180" : ""
                            )}
                          />
                        </div>

                        {/* Name & Orientation Badge */}
                        <div className="text-center space-y-1 mb-2">
                          <h4 className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                            {drawn.card.name}
                          </h4>
                          {drawn.isReversed ? (
                            <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                              REVERSED
                            </span>
                          ) : (
                            <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                              UPRIGHT
                            </span>
                          )}
                        </div>

                        {/* Keywords */}
                        <div className="flex flex-wrap gap-1 justify-center mb-3">
                          {drawn.card.keywords.slice(0, 3).map((kw, kIdx) => (
                            <span key={kIdx} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-white/70 border border-white/5">
                              {kw}
                            </span>
                          ))}
                        </div>

                        {/* Interpretation */}
                        <div className="text-xs leading-relaxed text-white/80 pt-3 border-t border-white/5">
                          <p>{drawn.interpretation}</p>
                        </div>
                      </AnimatedCard>
                    );
                  })}
                </div>

                {/* Synthesis Box */}
                <div className="glass-strong rounded-2xl p-6 sm:p-8 border border-gold/20 space-y-3">
                  <div className="flex items-center gap-2 text-gold">
                    <Sparkles className="w-5 h-5" />
                    <h3 className="text-base font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-outfit)" }}>
                      Cosmic Synthesis &amp; Archetypal Guidance
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-white/80">
                    {reading.cosmicContext}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* =================================================================== */}
        {/* VIEW 2: 78-CARD DECK BROWSER */}
        {/* =================================================================== */}
        {activeView === "deck" && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: "all", label: "All 78 Cards" },
                  { id: "major", label: "Major Arcana (22)" },
                  { id: "wands", label: "Wands (14)" },
                  { id: "cups", label: "Cups (14)" },
                  { id: "swords", label: "Swords (14)" },
                  { id: "pentacles", label: "Pentacles (14)" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDeckFilter(tab.id)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border",
                      deckFilter === tab.id
                        ? "bg-gold text-black border-gold font-bold"
                        : "bg-white/5 border-white/10 text-white/70 hover:text-white"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <Input
                  type="text"
                  placeholder="Search card by name or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9 pr-3 text-xs bg-white/5 border-white/10 text-white rounded-lg"
                />
              </div>
            </div>

            {/* Deck Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedCardDetail(card)}
                  className="glass rounded-xl p-3 border border-white/10 hover:border-gold/40 cursor-pointer transition-all duration-300 hover:scale-[1.03] flex flex-col justify-between"
                >
                  <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden mb-2">
                    <img src={card.image} alt={card.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="text-center">
                    <span className="text-[9px] font-mono text-gold-light uppercase tracking-wider block">
                      {card.arcana === "major" ? "Major" : card.suit}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate" style={{ fontFamily: "var(--font-outfit)" }}>
                      {card.name}
                    </h4>
                  </div>
                </div>
              ))}
            </div>

            {/* Card Detail Modal */}
            {selectedCardDetail && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="relative max-w-2xl w-full glass-strong rounded-3xl p-6 sm:p-8 border border-gold/30 space-y-6 max-h-[90vh] overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedCardDetail(null)}
                    className="absolute top-4 right-4 text-white/60 hover:text-white p-1 rounded-full bg-white/10 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden border border-gold/30 shadow-2xl">
                      <img src={selectedCardDetail.image} alt={selectedCardDetail.name} className="w-full h-full object-contain" />
                    </div>

                    <div className="sm:col-span-2 space-y-4">
                      <div>
                        <span className="text-xs font-mono uppercase tracking-wider text-gold-light">
                          {selectedCardDetail.arcana.toUpperCase()} ARCANA {selectedDetailNumber(selectedCardDetail)}
                        </span>
                        <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                          {selectedCardDetail.name}
                        </h3>
                        <p className="text-xs text-white/50">
                          Element: {selectedCardDetail.element || "Universal"} · Correspondence: {selectedCardDetail.zodiacCorrespondence || "Archetypal"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {selectedCardDetail.keywords.map((kw, i) => (
                          <span key={i} className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gold-light">
                            {kw}
                          </span>
                        ))}
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">Upright Meaning</span>
                          <p className="text-white/80 leading-relaxed">{selectedCardDetail.uprightMeaning}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                          <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">Reversed Meaning</span>
                          <p className="text-white/80 leading-relaxed">{selectedCardDetail.reversedMeaning}</p>
                        </div>

                        {selectedCardDetail.love && (
                          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                            <span className="text-[10px] uppercase font-bold text-gold block mb-0.5">Love &amp; Relationships</span>
                            <p className="text-white/70 leading-relaxed">{selectedCardDetail.love}</p>
                          </div>
                        )}

                        {selectedCardDetail.career && (
                          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                            <span className="text-[10px] uppercase font-bold text-gold block mb-0.5">Career &amp; Vocation</span>
                            <p className="text-white/70 leading-relaxed">{selectedCardDetail.career}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Public Domain Attribution Section */}
        <div className="glass rounded-2xl p-6 border border-white/10 text-xs text-white/50 space-y-2">
          <div className="flex items-center gap-2 text-white/80 font-bold uppercase tracking-wider text-[11px]">
            <ShieldAlert className="w-4 h-4 text-gold" />
            Deck Attribution &amp; Licensing Notice
          </div>
          <p className="leading-relaxed">
            {TAROT_DECK_METADATA.attributionNotice} Original Concept by {TAROT_DECK_METADATA.creatorAuthor}, artwork by {TAROT_DECK_METADATA.creatorArtist} ({TAROT_DECK_METADATA.originalPublicationYear}). Published in the public domain worldwide.
          </p>
        </div>

      </div>
    </PageWrapper>
  );
}

function selectedDetailNumber(card: TarotCard): string {
  if (card.arcana === "major") return `· Card ${card.number}`;
  return `· ${card.suit ? card.suit.toUpperCase() : ""}`;
}
