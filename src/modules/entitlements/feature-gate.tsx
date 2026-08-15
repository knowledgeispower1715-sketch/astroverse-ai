"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureKey } from "./types";
import { EntitlementService } from "./entitlement-service";

interface FeatureGateProps {
  feature: FeatureKey;
  children: ReactNode;
  fallback?: ReactNode;
  userTier?: "free" | "premium" | "pro";
}

export function FeatureGate({
  feature,
  children,
  fallback,
  userTier = "free",
}: FeatureGateProps) {
  const service = new EntitlementService(userTier);
  const isAllowed = service.canAccess(feature);

  if (isAllowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="glass rounded-2xl p-8 border border-gold/30 text-center space-y-4 max-w-md mx-auto my-6 shadow-2xl">
      <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-gold/10 text-gold border border-gold/20">
        <Lock className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
          Premium Feature Gate
        </h4>
        <p className="text-xs text-white/60">
          This advanced calculation is part of our upcoming premium tier.
        </p>
      </div>
      <Link href="/pricing" className="inline-block">
        <Button size="sm" className="font-semibold text-xs rounded-full px-6 gap-1.5 cursor-pointer" style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}>
          <Sparkles className="w-3.5 h-3.5" />
          View Plans & Entitlements
        </Button>
      </Link>
    </div>
  );
}
