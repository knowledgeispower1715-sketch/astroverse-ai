"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-primary)" }}>
      <div className="text-center max-w-md">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(239, 68, 68, 0.1)" }}
        >
          <AlertTriangle className="w-8 h-8" style={{ color: "#ef4444" }} />
        </div>
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-outfit)" }}
        >
          Cosmic Disruption
        </h1>
        <p className="text-sm sm:text-base mb-8" style={{ color: "var(--text-secondary)" }}>
          The stars have momentarily misaligned. Our cosmic engineers are working to restore harmony.
        </p>
        <Button
          onClick={reset}
          className="rounded-full px-6 gap-2"
          style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
        >
          <RotateCcw className="w-4 h-4" />
          Realign the Stars
        </Button>
      </div>
    </div>
  );
}
