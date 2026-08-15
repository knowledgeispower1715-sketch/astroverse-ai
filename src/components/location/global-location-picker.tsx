"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { MapPin, Search, CheckCircle2, Globe, Clock, ChevronDown, Sliders } from "lucide-react";
import { Input } from "@/components/ui/input";
import { WORLD_CITIES, type LocationResult, getDetailedTimezoneInfo } from "@/modules/location-engine";

interface GlobalLocationPickerProps {
  value: {
    birthPlace: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  onChange: (loc: {
    birthPlace: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }) => void;
}

export function GlobalLocationPicker({ value, onChange }: GlobalLocationPickerProps) {
  const [query, setQuery] = useState(value.birthPlace || "");
  const [isOpen, setIsOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  // Filter local dataset or query API via useMemo
  const results = useMemo<LocationResult[]>(() => {
    if (!query || query.length < 2) {
      return WORLD_CITIES.slice(0, 6);
    }

    const q = query.toLowerCase();
    return WORLD_CITIES.filter((city) =>
      city.name.toLowerCase().includes(q) ||
      (city.adminRegion && city.adminRegion.toLowerCase().includes(q)) ||
      city.country.toLowerCase().includes(q) ||
      city.formattedAddress.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelect = (city: LocationResult) => {
    setQuery(city.formattedAddress);
    onChange({
      birthPlace: city.formattedAddress,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
      timezone: city.timezone,
    });
    setIsOpen(false);
  };

  const tzInfo = value.timezone ? getDetailedTimezoneInfo(value.timezone) : null;

  return (
    <div ref={wrapperRef} className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <label className="text-xs font-semibold block text-white/70 mb-1">
          Birth City / Locality (Worldwide)
        </label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search worldwide city (e.g. Jabalpur, New York, London, Tokyo, Dubai)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="h-12 pl-10 pr-10 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
          />
          <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
        </div>

        {/* Dropdown Results */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 max-h-64 overflow-y-auto rounded-xl glass-strong border border-white/10 shadow-2xl z-50 py-1">
            {results.length > 0 ? (
              results.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleSelect(city)}
                  className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center justify-between transition-colors border-b border-white/5 last:border-0 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-gold shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white">{city.formattedAddress}</p>
                      <p className="text-[10px] text-white/40 font-mono">
                        {city.latitude > 0 ? `${city.latitude.toFixed(2)}°N` : `${Math.abs(city.latitude).toFixed(2)}°S`},{" "}
                        {city.longitude > 0 ? `${city.longitude.toFixed(2)}°E` : `${Math.abs(city.longitude).toFixed(2)}°W`}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">
                    {city.timezone}
                  </span>
                </button>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-xs text-white/50">No standard city matched.</p>
                <button
                  type="button"
                  onClick={() => {
                    setCustomMode(true);
                    setIsOpen(false);
                  }}
                  className="mt-2 text-xs text-gold-light hover:underline font-semibold"
                >
                  Enter Custom Coordinates Manually
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation & Coordinates Card */}
      {value.birthPlace && (
        <div className="p-4 rounded-xl glass border border-gold/20 bg-gold/5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-gold-light">
              <CheckCircle2 className="w-4 h-4 text-gold" />
              <span>Birth Location Confirmed</span>
            </div>
            <button
              type="button"
              onClick={() => setCustomMode(!customMode)}
              className="text-[10px] text-white/50 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Sliders className="w-3 h-3" />
              {customMode ? "Hide Coordinates" : "Adjust Coordinates"}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-white/80">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-white/40" />
              <span>Lat: {value.latitude.toFixed(4)}°</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-white/40" />
              <span>Lng: {value.longitude.toFixed(4)}°</span>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-white/40" />
              <span className="truncate">{tzInfo?.abbreviation || value.timezone}</span>
            </div>
          </div>
        </div>
      )}

      {/* Manual Fine-Tuning Drawer */}
      {customMode && (
        <div className="p-4 rounded-xl glass border border-white/10 space-y-3 bg-white/[0.02]">
          <p className="text-xs font-semibold text-white">Manual Coordinate & Timezone Adjustment</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-white/60 block mb-1">Latitude (°)</label>
              <Input
                type="number"
                step="any"
                value={value.latitude}
                onChange={(e) => onChange({ ...value, latitude: parseFloat(e.target.value) || 0 })}
                className="h-9 bg-white/5 border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/60 block mb-1">Longitude (°)</label>
              <Input
                type="number"
                step="any"
                value={value.longitude}
                onChange={(e) => onChange({ ...value, longitude: parseFloat(e.target.value) || 0 })}
                className="h-9 bg-white/5 border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/60 block mb-1">IANA Timezone</label>
              <Input
                type="text"
                value={value.timezone}
                onChange={(e) => onChange({ ...value, timezone: e.target.value })}
                className="h-9 bg-white/5 border-white/10 text-white text-xs font-mono"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
