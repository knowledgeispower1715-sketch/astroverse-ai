import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-primary)" }}>
      <div className="text-center max-w-md">
        <p
          className="text-7xl sm:text-8xl font-extrabold mb-4 text-gradient-cosmic"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          404
        </p>
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-outfit)" }}
        >
          Lost in the Cosmos
        </h1>
        <p className="text-sm sm:text-base mb-8" style={{ color: "var(--text-secondary)" }}>
          The celestial page you seek has drifted beyond our constellation map. Let us guide you back.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild className="rounded-full px-6 gap-2" style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}>
            <Link href="/">
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-6 gap-2" style={{ borderColor: "rgba(212,175,55,0.3)", color: "var(--gold-light)" }}>
            <Link href="/blog">
              <Search className="w-4 h-4" />
              Explore Blog
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
