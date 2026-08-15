"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Check, Plus, Compass } from "lucide-react";

export interface ProfileOption {
  id: string;
  name: string;
  relationship: string;
  birthPlace: string;
  dateOfBirth: string;
  isPrimary?: boolean;
}

interface ProfileSwitcherProps {
  profiles: ProfileOption[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
}

export function ProfileSwitcher({
  profiles,
  activeProfileId,
  onSelectProfile,
}: ProfileSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  if (!profiles || profiles.length === 0) {
    return (
      <Link
        href="/onboarding"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold glass border border-gold/30 text-gold-light hover:bg-gold/10 transition-colors"
      >
        <Compass className="w-3.5 h-3.5" />
        Initialize Birth Chart
      </Link>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass border border-white/10 hover:border-gold/40 transition-all cursor-pointer text-xs"
      >
        <div className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] bg-gold/20 text-gold-light">
          <Users className="w-3 h-3" />
        </div>
        <div className="text-left">
          <span className="font-bold text-white block max-w-[120px] truncate leading-tight">
            {activeProfile?.name || "My Chart"}
          </span>
          <span className="text-[10px] text-white/50 capitalize block leading-tight">
            {activeProfile?.relationship || "Self"}
          </span>
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-64 rounded-xl glass-strong border border-white/10 shadow-2xl py-2 z-50 animate-fade-in"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="px-3 py-1.5 border-b border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
              Switch Birth Chart
            </span>
            <Link
              href="/onboarding"
              onClick={() => setIsOpen(false)}
              className="text-[10px] text-gold-light hover:underline flex items-center gap-1 font-semibold"
            >
              <Plus className="w-3 h-3" />
              New
            </Link>
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {profiles.map((p) => {
              const isSelected = p.id === activeProfileId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onSelectProfile(p.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer ${
                    isSelected ? "bg-gold/10 text-gold-light" : "text-white/80"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold truncate text-white">{p.name}</p>
                    <p className="text-[10px] text-white/50 truncate">
                      {p.relationship.toUpperCase()} • {p.birthPlace}
                    </p>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-gold shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
