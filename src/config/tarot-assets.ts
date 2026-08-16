/**
 * ============================================================================
 * AstroVerse AI — Tarot Deck Asset Attribution & License Metadata
 * ============================================================================
 * Deck: Rider-Waite-Smith (1909)
 * Original Concept: Arthur Edward Waite (1857–1942)
 * Original Artwork: Pamela Colman Smith (1878–1951)
 * Original Publisher: William Rider & Son, London (1909)
 * Legal Status: Public Domain (Published prior to 1928, worldwide public domain)
 * Digital Adaptation & Vector Styling: AstroVerse AI Celestial Studio
 * ============================================================================
 */

export interface TarotAssetAttribution {
  deckTitle: string;
  creatorAuthor: string;
  creatorArtist: string;
  originalPublicationYear: number;
  originalPublisher: string;
  copyrightStatus: string;
  license: string;
  attributionNotice: string;
  totalCards: number;
  cardBackPath: string;
}

export const TAROT_DECK_METADATA: TarotAssetAttribution = {
  deckTitle: "Rider-Waite-Smith Tarot Deck",
  creatorAuthor: "Arthur Edward Waite",
  creatorArtist: "Pamela Colman Smith",
  originalPublicationYear: 1909,
  originalPublisher: "William Rider & Son, London",
  copyrightStatus: "Public Domain (Worldwide)",
  license: "Public Domain (CC0 / PD-1923 equivalent for classical publications)",
  attributionNotice:
    "The iconography and archetypes of the Rider-Waite-Smith Tarot (1909) are in the public domain globally. Visual presentation engineered by AstroVerse AI with celestial vector enhancements.",
  totalCards: 78,
  cardBackPath: "/tarot/card-back.svg",
};
