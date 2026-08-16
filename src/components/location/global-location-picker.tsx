"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { MapPin, Search, CheckCircle2, Globe, Clock, ChevronDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { LocationResult } from "@/modules/location-engine/types";

interface GlobalLocationPickerProps {
  value: {
    birthPlace: string;
    country?: string;
    latitude: number;
    longitude: number;
    timezone: string;
    locationId?: string;
    geonameId?: number;
  };
  onChange: (loc: {
    birthPlace: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
    locationId?: string;
    geonameId?: number;
    adminRegion?: string;
  }) => void;
  label?: string;
  placeholder?: string;
}

export function GlobalLocationPicker({
  value,
  onChange,
  label = "Birth City / Locality (Worldwide)",
  placeholder = "Search worldwide city, town, village or region...",
}: GlobalLocationPickerProps) {
  const [query, setQuery] = useState(value.birthPlace || "");
  const [prevBirthPlace, setPrevBirthPlace] = useState(value.birthPlace || "");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state when birthPlace prop changes from outside (standard React pattern)
  if (value.birthPlace !== prevBirthPlace) {
    setPrevBirthPlace(value.birthPlace || "");
    setQuery(value.birthPlace || "");
  }

  // Derive confirmed location card from current props
  const selectedLocation = useMemo<LocationResult | null>(() => {
    if (value.birthPlace && value.latitude && value.longitude) {
      return {
        id: value.locationId || "selected",
        geonameId: value.geonameId,
        name: value.birthPlace.split(",")[0].trim(),
        country: value.country || "",
        countryCode: "",
        latitude: value.latitude,
        longitude: value.longitude,
        timezone: value.timezone || "UTC",
        formattedAddress: value.birthPlace,
      };
    }
    return null;
  }, [value.birthPlace, value.latitude, value.longitude, value.timezone, value.locationId, value.geonameId, value.country]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced server-side search
  const handleQueryChange = (text: string) => {
    setQuery(text);
    setIsOpen(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!text.trim() || text.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/locations/search?q=${encodeURIComponent(text.trim())}&limit=12`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setResults(json.data);
          }
        }
      } catch (err) {
        console.error("Location search query error:", err);
      } finally {
        setLoading(false);
      }
    }, 280);
  };

  const handleSelect = (loc: LocationResult) => {
    setQuery(loc.formattedAddress);
    setPrevBirthPlace(loc.formattedAddress);
    setIsOpen(false);
    onChange({
      birthPlace: loc.formattedAddress,
      country: loc.country,
      latitude: loc.latitude,
      longitude: loc.longitude,
      timezone: loc.timezone,
      locationId: loc.id,
      geonameId: loc.geonameId,
      adminRegion: loc.adminRegion,
    });
  };

  const formatCoord = (val: number, isLat: boolean) => {
    const dir = isLat ? (val >= 0 ? "N" : "S") : (val >= 0 ? "E" : "W");
    return `${Math.abs(val).toFixed(4)}° ${dir}`;
  };

  return (
    <div ref={wrapperRef} className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <label className="text-xs font-semibold block text-white/70 mb-1">
          {label} *
        </label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => {
              if (results.length > 0 || query.length >= 2) setIsOpen(true);
            }}
            className="h-12 pl-10 pr-10 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
            {loading ? (
              <Loader2 className="w-4 h-4 text-gold animate-spin" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/40" />
            )}
          </div>
        </div>

        {/* Dropdown Results */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 max-h-72 overflow-y-auto rounded-xl glass-strong border border-white/10 shadow-2xl z-50 py-1 bg-black/90 backdrop-blur-xl">
            {loading && results.length === 0 ? (
              <div className="p-4 text-center text-xs text-white/50 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-gold" />
                <span>Searching global gazetteer...</span>
              </div>
            ) : results.length > 0 ? (
              results.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelect(loc)}
                  className="w-full text-left px-4 py-3 hover:bg-white/10 flex items-start justify-between gap-3 transition-colors border-b border-white/5 last:border-0 cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-gold transition-colors">
                        {loc.name}
                      </p>
                      <p className="text-xs text-white/60">
                        {[loc.adminRegion, loc.country].filter(Boolean).join(", ")}
                      </p>
                      <p className="text-[10px] text-white/40 font-mono mt-0.5">
                        {formatCoord(loc.latitude, true)} · {formatCoord(loc.longitude, false)}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
                      {loc.timezone}
                    </span>
                  </div>
                </button>
              ))
            ) : query.trim().length >= 2 && !loading ? (
              <div className="p-4 text-center">
                <p className="text-xs text-white/60">No matching place found in global gazetteer.</p>
                <p className="text-[10px] text-white/40 mt-1">Try entering city, district, state or country name.</p>
              </div>
            ) : (
              <div className="p-3 text-center text-xs text-white/40">
                Type at least 2 characters to search worldwide locations.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Card (Section 25) */}
      {selectedLocation && selectedLocation.latitude && selectedLocation.longitude && (
        <div className="p-4 rounded-xl glass border border-gold/30 bg-gold/5 flex items-start justify-between gap-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-gold uppercase tracking-wider">
                  Birth Location Confirmed
                </span>
              </div>
              <p className="text-sm font-semibold text-white">
                {selectedLocation.formattedAddress}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/60 font-mono pt-1">
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-gold/70" />
                  {formatCoord(selectedLocation.latitude, true)}, {formatCoord(selectedLocation.longitude, false)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-white/80">
                  <Clock className="w-3 h-3 text-gold/70" />
                  {selectedLocation.timezone}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
