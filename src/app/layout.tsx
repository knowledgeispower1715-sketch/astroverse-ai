import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://astroverse.ai"),
  title: {
    default: "AstroVerse AI — Unlock the Secrets of the Cosmos",
    template: "%s | AstroVerse AI",
  },
  description:
    "Discover your cosmic blueprint with AI-powered birth charts, personalized horoscopes, compatibility analysis, and transit predictions across Western, Vedic, and Chinese astrology systems.",
  keywords: [
    "astrology",
    "horoscope",
    "birth chart",
    "zodiac",
    "AI astrology",
    "compatibility",
    "transit",
    "tarot",
    "vedic astrology",
    "natal chart",
    "cosmic insights",
  ],
  authors: [{ name: "AstroVerse AI Team" }],
  creator: "AstroVerse AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://astroverse.ai",
    siteName: "AstroVerse AI",
    title: "AstroVerse AI — Unlock the Secrets of the Cosmos",
    description:
      "AI-powered astrology for birth charts, horoscopes, compatibility, and transit predictions.",
    images: [
      {
        url: "https://astroverse.ai/og.jpg",
        width: 1200,
        height: 630,
        alt: "AstroVerse AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AstroVerse AI — Unlock the Secrets of the Cosmos",
    description:
      "AI-powered astrology for birth charts, horoscopes, compatibility, and transit predictions.",
    images: ["https://astroverse.ai/og.jpg"],
    creator: "@astroverse_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a1a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans" style={{ fontFamily: "var(--font-inter)" }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
