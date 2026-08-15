"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Layers, 
  RefreshCw, 
  Bookmark, 
  CheckCircle2, 
  Flame, 
  Droplet, 
  Wind, 
  Mountain, 
  Compass, 
  Clock,
  History,
  Info
} from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedCard } from "@/components/shared/animated-card";
import { SPREADS, TarotReading } from "@/modules/tarot-engine";

interface SavedReadingRow {
  id: string;
  spread_id: string;
  question: string | null;
  drawn_cards: TarotReading["drawnCards"];
  cosmic_context: string;
  created_at: string;
}

const SPREAD_OPTIONS = [
  { id: "single", name: "Single Card", count: 1, desc: "Quick daily guidance or yes/no clarity." },
  { id: "three-card", name: "Three Card", count: 3, desc: "Past, Present, and Future trajectory." },
  { id: "relationship", name: "Relationship", count: 6, desc: "Synastry, shared connection & potential." },
  { id: "celtic-cross", name: "Celtic Cross", count: 10, desc: "Comprehensive 10-position deep dive." },
];

function getElementIcon(element: string | null) {
  switch (element) {
    case "fire": return <Flame className="w-3.5 h-3.5 text-amber-400" />;
    case "water": return <Droplet className="w-3.5 h-3.5 text-blue-400" />;
    case "air": return <Wind className="w-3.5 h-3.5 text-emerald-400" />;
    case "earth": return <Mountain className="w-3.5 h-3.5 text-amber-600" />;
    default: return <Compass className="w-3.5 h-3.5 text-purple-400" />;
  }
}

export default function TarotPage() {
  const [selectedSpread, setSelectedSpread] = useState<string>("three-card");
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<"idle" | "drawing" | "drawn">("idle");
  const [reading, setReading] = useState<TarotReading | null>(null);
  const [savedStatus, setSavedStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [history, setHistory] = useState<TarotReading[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3" style={{ background: "var(--gradient-gold)" }}>
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gradient-gold mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
            Celestial Tarot Oracle
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Draw from the complete 78-card deck. Archetypal wisdom aligned with elemental, zodiac, and planetary currents.
          </p>

          <div className="mt-4 flex justify-center gap-3">
            {history.length > 0 && (
              <Button
                onClick={() => setShowHistory(!showHistory)}
                variant="outline"
                className="text-xs h-8 gap-1.5 border-white/10 text-white/70 hover:text-white"
              >
                <History className="w-3.5 h-3.5 text-gold" />
                {showHistory ? "Hide Past Readings" : `Past Readings (${history.length})`}
              </Button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 max-w-xl mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* History Modal / Drawer */}
        {showHistory && (
          <div className="mb-10 glass rounded-2xl p-6 border border-gold/20 animate-fade-in">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
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

        {/* Controls / Spread Selection */}
        {status === "idle" && (
          <div className="space-y-8 animate-fade-in">
            {/* Spread Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SPREAD_OPTIONS.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setSelectedSpread(opt.id)}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 ${
                    selectedSpread === opt.id
                      ? "glass-strong border-gold/60 shadow-lg shadow-gold/5 ring-1 ring-gold/30 scale-[1.02]"
                      : "glass border-white/5 hover:border-white/20 hover:scale-[1.01]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gold-light">
                      {opt.count} {opt.count === 1 ? "Card" : "Cards"}
                    </span>
                    <Layers className="w-4 h-4 text-white/40" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1" style={{ fontFamily: "var(--font-outfit)" }}>
                    {opt.name}
                  </h3>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {opt.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Question Input & Action */}
            <div className="max-w-xl mx-auto glass rounded-2xl p-6 sm:p-8 border border-white/5 space-y-5 text-center">
              <div className="space-y-2">
                <label className="text-xs font-semibold block text-white/80">
                  Focus Your Intention or Question <span className="text-white/40">(optional)</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g., What energy should I focus on this week?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="h-11 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50 placeholder:text-white/20 text-center text-sm"
                />
              </div>

              <Button
                onClick={handleDraw}
                className="w-full sm:w-auto h-12 px-10 text-sm font-bold rounded-lg cursor-pointer transition-all hover:scale-105"
                style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Shuffle & Draw {SPREADS[selectedSpread]?.cardCount || 3} Cards
              </Button>
            </div>
          </div>
        )}

        {/* Drawing Spinner Animation */}
        {status === "drawing" && (
          <div className="text-center py-20 space-y-4 animate-fade-in">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-gold/20 animate-ping" />
              <div className="w-16 h-16 rounded-2xl border border-gold/40 flex items-center justify-center animate-spin" style={{ background: "var(--gradient-cosmic)" }}>
                <Sparkles className="w-8 h-8 text-gold" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
              Aligning with the Cosmic Deck...
            </h3>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Shuffling 78 archetypes and tuning to your energetic signature.
            </p>
          </div>
        )}

        {/* Drawn Spread View */}
        {status === "drawn" && reading && (
          <div className="space-y-10 animate-fade-in">
            {/* Header / Query Recap */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl glass border border-white/5">
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
                      Saved
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

            {/* Cards Grid */}
            <div className={`grid gap-6 ${
              reading.drawnCards.length === 1
                ? "max-w-md mx-auto grid-cols-1"
                : reading.drawnCards.length <= 3
                ? "grid-cols-1 md:grid-cols-3"
                : reading.drawnCards.length <= 6
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
            }`}>
              {reading.drawnCards.map((drawn, idx) => (
                <div
                  key={idx}
                  className="flex flex-col h-full perspective-1000"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <AnimatedCard
                    delay={idx * 0.08}
                    className="p-5 flex flex-col justify-between h-full border-white/10 hover:border-gold/40 transition-all duration-300"
                  >
                    {/* Position Title */}
                    <div className="text-center mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider block text-gold">
                        {drawn.position.name}
                      </span>
                      <span className="text-[10px] text-white/40 block leading-tight">
                        {drawn.position.description}
                      </span>
                    </div>

                    {/* 3D Card Visual */}
                    <div
                      className="relative w-full aspect-[2/3] max-h-64 rounded-xl border border-gold/30 mb-4 p-4 flex flex-col items-center justify-between shadow-lg overflow-hidden group transition-transform duration-300 hover:scale-[1.02]"
                      style={{ background: "radial-gradient(circle at 50% 30%, #1c1c38 0%, #0c0c1a 100%)" }}
                    >
                      {/* Inner card border frame */}
                      <div className="absolute inset-1.5 rounded-lg border border-gold/20 pointer-events-none" />

                      {/* Top indicator: Arcana / Suit */}
                      <div className="w-full flex items-center justify-between text-[9px] font-mono uppercase text-white/50 relative z-10">
                        <span>{drawn.card.arcana}</span>
                        <span className="flex items-center gap-1">
                          {getElementIcon(drawn.card.element)}
                          {drawn.card.element}
                        </span>
                      </div>

                      {/* Card Center Graphic */}
                      <div className="my-auto text-center relative z-10 space-y-2">
                        <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center mx-auto bg-black/40 group-hover:border-gold/60 transition-colors">
                          <Sparkles className="w-6 h-6 text-gold" />
                        </div>
                        <h4 className="text-sm font-bold text-white px-2" style={{ fontFamily: "var(--font-outfit)" }}>
                          {drawn.card.name}
                        </h4>
                        {drawn.isReversed && (
                          <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/30">
                            REVERSED
                          </span>
                        )}
                      </div>

                      {/* Bottom Astrological Info */}
                      <div className="w-full text-center text-[9px] text-white/40 relative z-10 truncate">
                        {drawn.card.zodiacCorrespondence || "Universal Archetype"}
                      </div>
                    </div>

                    {/* Keywords */}
                    <div className="flex flex-wrap gap-1 justify-center mb-3">
                      {drawn.card.keywords.slice(0, 3).map((kw, kIdx) => (
                        <span
                          key={kIdx}
                          className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-white/70 border border-white/5"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>

                    {/* Card Meaning / Interpretation */}
                    <div className="text-xs leading-relaxed text-white/80 pt-3 border-t border-white/5">
                      <p>{drawn.interpretation}</p>
                    </div>
                  </AnimatedCard>
                </div>
              ))}
            </div>

            {/* Cosmic Context Summary Box */}
            <div className="glass-strong rounded-2xl p-6 sm:p-8 border border-gold/20 space-y-3">
              <div className="flex items-center gap-2 text-gold">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-base font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-outfit)" }}>
                  Cosmic Synthesis & Planetary Alignment
                </h3>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {reading.cosmicContext}
              </p>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
