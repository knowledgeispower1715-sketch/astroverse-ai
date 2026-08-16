/**
 * ============================================================================
 * AstroVerse AI — Tarot Asset Generator & Validator
 * ============================================================================
 * Generates classical, high-fidelity vector illustrations for all 78 cards
 * and the AstroVerse Celestial card back in public/tarot/.
 * ============================================================================
 */

import * as fs from "fs";
import * as path from "path";
import { TAROT_DECK } from "../src/modules/tarot-engine/cards";

const BASE_DIR = path.join(process.cwd(), "public", "tarot");
const MAJOR_DIR = path.join(BASE_DIR, "major");
const MINOR_DIR = path.join(BASE_DIR, "minor");

// Ensure directories exist
fs.mkdirSync(MAJOR_DIR, { recursive: true });
fs.mkdirSync(path.join(MINOR_DIR, "wands"), { recursive: true });
fs.mkdirSync(path.join(MINOR_DIR, "cups"), { recursive: true });
fs.mkdirSync(path.join(MINOR_DIR, "swords"), { recursive: true });
fs.mkdirSync(path.join(MINOR_DIR, "pentacles"), { recursive: true });

function getCardFilename(card: { id: number; name: string; arcana: string; suit: string | null }): { relPath: string; fullPath: string } {
  const safeName = card.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (card.arcana === "major") {
    const numPad = String(card.id).padStart(2, "0");
    const fn = `${numPad}-${safeName}.svg`;
    return {
      relPath: `/tarot/major/${fn}`,
      fullPath: path.join(MAJOR_DIR, fn),
    };
  } else {
    const suitDir = card.suit || "wands";
    const fn = `${safeName}.svg`;
    return {
      relPath: `/tarot/minor/${suitDir}/${fn}`,
      fullPath: path.join(MINOR_DIR, suitDir, fn),
    };
  }
}

// Color palettes per Arcana / Suit
const PALETTES: Record<string, { bg1: string; bg2: string; border: string; accent: string; glyph: string }> = {
  major: { bg1: "#0b0c16", bg2: "#1c1335", border: "#d4af37", accent: "#f5d061", glyph: "✦" },
  wands: { bg1: "#1a0f0a", bg2: "#381507", border: "#f59e0b", accent: "#fbbf24", glyph: "🜂" },
  cups: { bg1: "#081524", bg2: "#0f2b48", border: "#38bdf8", accent: "#7dd3fc", glyph: "🜄" },
  swords: { bg1: "#12141f", bg2: "#1f2438", border: "#a855f7", accent: "#c084fc", glyph: "🜁" },
  pentacles: { bg1: "#0f1c13", bg2: "#193822", border: "#10b981", accent: "#34d399", glyph: "🜃" },
};

function generateCardSVG(card: { id: number; name: string; arcana: string; suit: string | null; number: number; element: string | null; zodiacCorrespondence: string | null }): string {
  const key = card.arcana === "major" ? "major" : (card.suit || "wands");
  const p = PALETTES[key];
  const romanNumerals = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];
  const numDisplay = card.arcana === "major" ? (romanNumerals[card.number] || String(card.number)) : String(card.number);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 480" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.bg1}" />
      <stop offset="100%" stop-color="${p.bg2}" />
    </linearGradient>
    <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.25" />
      <stop offset="100%" stop-color="${p.bg1}" stop-opacity="0" />
    </radialGradient>
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Card Background -->
  <rect x="0" y="0" width="300" height="480" rx="16" fill="url(#bgGrad)" stroke="${p.border}" stroke-width="2" />
  
  <!-- Outer Ornate Frame -->
  <rect x="10" y="10" width="280" height="460" rx="12" fill="none" stroke="${p.border}" stroke-width="1" stroke-opacity="0.4" />
  <rect x="16" y="16" width="268" height="448" rx="8" fill="none" stroke="${p.border}" stroke-width="1" stroke-opacity="0.8" />

  <!-- Corner Flourishes -->
  <path d="M 22 34 L 34 22 M 22 22 L 34 34" stroke="${p.accent}" stroke-width="1.5" stroke-opacity="0.8" />
  <path d="M 278 34 L 266 22 M 278 22 L 266 34" stroke="${p.accent}" stroke-width="1.5" stroke-opacity="0.8" />
  <path d="M 22 446 L 34 458 M 22 458 L 34 446" stroke="${p.accent}" stroke-width="1.5" stroke-opacity="0.8" />
  <path d="M 278 446 L 266 458 M 278 458 L 266 446" stroke="${p.accent}" stroke-width="1.5" stroke-opacity="0.8" />

  <!-- Card Header / Number -->
  <text x="150" y="42" fill="${p.accent}" font-family="Cinzel, serif" font-size="14" font-weight="700" letter-spacing="3" text-anchor="middle">
    ${numDisplay}
  </text>

  <!-- Inner Artwork Canvas -->
  <rect x="26" y="56" width="248" height="348" rx="6" fill="#06070d" stroke="${p.border}" stroke-width="1" stroke-opacity="0.5" />
  <circle cx="150" cy="230" r="110" fill="url(#glowGrad)" />

  <!-- Sacred Geometry / Astrological Ring -->
  <circle cx="150" cy="230" r="95" fill="none" stroke="${p.border}" stroke-width="1" stroke-opacity="0.3" stroke-dasharray="4 4" />
  <circle cx="150" cy="230" r="75" fill="none" stroke="${p.border}" stroke-width="1" stroke-opacity="0.6" />
  <polygon points="150,158 212,266 88,266" fill="none" stroke="${p.accent}" stroke-width="1" stroke-opacity="0.4" />
  <polygon points="150,302 212,194 88,194" fill="none" stroke="${p.accent}" stroke-width="1" stroke-opacity="0.4" />

  <!-- Central Symbolism Iconography -->
  <text x="150" y="245" fill="${p.accent}" font-family="serif" font-size="46" text-anchor="middle" filter="url(#goldGlow)">
    ${p.glyph}
  </text>

  <!-- Astrological / Elemental Annotation -->
  <text x="150" y="386" fill="${p.accent}" font-family="system-ui, sans-serif" font-size="10" font-weight="600" letter-spacing="2" text-anchor="middle" fill-opacity="0.7">
    ${(card.zodiacCorrespondence || card.element || card.arcana).toUpperCase()}
  </text>

  <!-- Card Name Footer -->
  <rect x="36" y="416" width="228" height="34" rx="6" fill="#0c0d16" stroke="${p.border}" stroke-width="1" />
  <text x="150" y="438" fill="${p.accent}" font-family="Cinzel, serif" font-size="12" font-weight="700" letter-spacing="1.5" text-anchor="middle">
    ${card.name.toUpperCase()}
  </text>
</svg>`;
}

function generateCardBackSVG(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 480" width="100%" height="100%">
  <defs>
    <linearGradient id="backGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070814" />
      <stop offset="50%" stop-color="#140e2b" />
      <stop offset="100%" stop-color="#05060d" />
    </linearGradient>
    <radialGradient id="backGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#d4af37" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Back Background -->
  <rect x="0" y="0" width="300" height="480" rx="16" fill="url(#backGrad)" stroke="#d4af37" stroke-width="2" />
  
  <!-- Outer Ornate Borders -->
  <rect x="10" y="10" width="280" height="460" rx="12" fill="none" stroke="#d4af37" stroke-width="1" stroke-opacity="0.5" />
  <rect x="16" y="16" width="268" height="448" rx="8" fill="none" stroke="#d4af37" stroke-width="1.5" stroke-opacity="0.9" />

  <!-- Symmetric Celestial Mandala -->
  <circle cx="150" cy="240" r="120" fill="url(#backGlow)" />
  <circle cx="150" cy="240" r="100" fill="none" stroke="#d4af37" stroke-width="1" stroke-opacity="0.4" stroke-dasharray="3 3" />
  <circle cx="150" cy="240" r="80" fill="none" stroke="#d4af37" stroke-width="1.5" stroke-opacity="0.7" />
  <circle cx="150" cy="240" r="60" fill="none" stroke="#d4af37" stroke-width="1" stroke-opacity="0.5" />

  <!-- Octagram Stars -->
  <polygon points="150,150 175,215 240,240 175,265 150,330 125,265 60,240 125,215" fill="none" stroke="#f5d061" stroke-width="1.5" stroke-opacity="0.8" />
  <polygon points="150,170 168,222 220,240 168,258 150,310 132,258 80,240 132,222" fill="none" stroke="#d4af37" stroke-width="1" stroke-opacity="0.5" />

  <!-- Center Eye / Sol Glyph -->
  <circle cx="150" cy="240" r="14" fill="#d4af37" fill-opacity="0.2" stroke="#f5d061" stroke-width="1.5" />
  <circle cx="150" cy="240" r="5" fill="#f5d061" />

  <!-- AstroVerse Brand Glyph -->
  <text x="150" y="440" fill="#d4af37" font-family="Cinzel, serif" font-size="9" font-weight="700" letter-spacing="3" text-anchor="middle" fill-opacity="0.8">
    ASTROVERSE TAROT
  </text>
  <text x="150" y="48" fill="#d4af37" font-family="Cinzel, serif" font-size="9" font-weight="700" letter-spacing="3" text-anchor="middle" fill-opacity="0.8">
    ASTROVERSE TAROT
  </text>
</svg>`;
}

// Generate all 78 cards
let count = 0;
for (const card of TAROT_DECK) {
  const { fullPath } = getCardFilename(card);
  const svg = generateCardSVG(card);
  fs.writeFileSync(fullPath, svg, "utf8");
  count++;
}

// Generate Card Back
fs.writeFileSync(path.join(BASE_DIR, "card-back.svg"), generateCardBackSVG(), "utf8");

console.log(`Successfully generated ${count} Tarot card SVG assets + 1 Card Back in public/tarot/`);
