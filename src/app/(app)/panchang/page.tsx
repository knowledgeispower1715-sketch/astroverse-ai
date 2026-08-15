"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Loader2, AlertCircle, RefreshCw, Compass, Sun, Moon } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlobalLocationPicker } from "@/components/location/global-location-picker";
import { createClient } from "@/lib/supabase/client";
import { getTimezoneOffsetHours } from "@/modules/location-engine/timezone";
import type { PanchangData } from "@/modules/prediction-engine";

export default function PanchangPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [locationName, setLocationName] = useState("Jabalpur, Madhya Pradesh, India");
  const [country, setCountry] = useState("India");
  const [lat, setLat] = useState(23.1815);
  const [lon, setLon] = useState(79.9864);
  const [tz, setTz] = useState("Asia/Kolkata");
  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-prefill from user's primary birth profile
  useEffect(() => {
    async function loadPrimaryProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("birth_profiles")
            .select("*")
            .eq("user_id", user.id)
            .order("is_primary", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (profile && profile.birth_place) {
            setLocationName(profile.birth_place);
            setCountry(profile.country || "");
            setLat(Number(profile.latitude) || 23.1815);
            setLon(Number(profile.longitude) || 79.9864);
            setTz(profile.timezone || "Asia/Kolkata");
          }
        }
      } catch (err) {
        console.error("Error loading primary profile for panchang:", err);
      }
    }
    loadPrimaryProfile();
  }, []);

  useEffect(() => {
    let isCurrent = true;
    async function loadPanchang() {
      try {
        const tzOffset = getTimezoneOffsetHours(tz, new Date(date));
        const res = await fetch(`/api/panchang?date=${date}&lat=${lat}&lon=${lon}&tz=${tzOffset}`);
        const json = await res.json() as { data?: PanchangData; error?: string };
        if (!isCurrent) return;
        setLoading(false);
        if (json.data) {
          setPanchang(json.data);
        } else {
          setError(json.error ?? "Failed to compute Panchang");
        }
      } catch {
        if (!isCurrent) return;
        setLoading(false);
        setError("Network error. Please try again.");
      }
    }
    loadPanchang();
    return () => { isCurrent = false; };
  }, [date, lat, lon, tz]);

  const handleRecalculate = () => {
    setLoading(true);
    const tzOffset = getTimezoneOffsetHours(tz, new Date(date));
    fetch(`/api/panchang?date=${date}&lat=${lat}&lon=${lon}&tz=${tzOffset}`)
      .then(r => r.json())
      .then(json => {
        setLoading(false);
        if (json.data) setPanchang(json.data);
        else setError(json.error ?? "Failed to compute Panchang");
      })
      .catch(() => {
        setLoading(false);
        setError("Network error. Please try again.");
      });
  };

  const qualityColor = (q: string) =>
    q === "auspicious" ? "text-emerald-400" : q === "inauspicious" ? "text-rose-400" : "text-white/70";

  return (
    <PageWrapper title="Vedic Panchang | AstroVerse AI" description="Real-time location-aware Tithi, Vara, Nakshatra, Yoga, and Karana auspicious timings.">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-gold/10 border border-gold/20 text-gold-light">
            <Compass className="w-3.5 h-3.5" />
            Location-Aware Jyotish Ephemeris
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>
            Daily Vedic Panchang
          </h1>
          <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto">
            Accurate Five Limbs of Time (Pancha Anga) calculated specifically for your geographic coordinates and local sunrise/sunset.
          </p>
        </div>

        {/* Location & Date Controls Card */}
        <div className="glass rounded-2xl p-6 sm:p-8 border border-white/5 space-y-6 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-1">
              <label className="text-xs font-semibold block text-white/70">Panchang Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-12 pl-10 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
                />
              </div>
            </div>

            <GlobalLocationPicker
              value={{
                birthPlace: locationName,
                country: country,
                latitude: lat,
                longitude: lon,
                timezone: tz,
              }}
              onChange={(loc) => {
                setLocationName(loc.birthPlace);
                setCountry(loc.country);
                setLat(loc.latitude);
                setLon(loc.longitude);
                setTz(loc.timezone);
              }}
            />
          </div>

          <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-white/50">
            <div className="flex items-center gap-2 font-mono">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              <span>{locationName}</span>
              <span>•</span>
              <span>{lat.toFixed(4)}°N, {lon.toFixed(4)}°E</span>
              <span>•</span>
              <span>{tz}</span>
            </div>
            <Button
              onClick={handleRecalculate}
              disabled={loading}
              size="sm"
              className="text-xs font-semibold px-4 gap-1.5 cursor-pointer"
              style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Recalculate Panchang
            </Button>
          </div>
        </div>

        {/* Results Area */}
        {loading ? (
          <div className="glass rounded-2xl p-16 border border-white/5 text-center space-y-4">
            <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" />
            <p className="text-sm font-semibold text-white">Computing astronomical muhurtas for {locationName}...</p>
          </div>
        ) : error ? (
          <div className="glass rounded-2xl p-8 border border-red-500/20 text-center space-y-3 bg-red-500/5">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        ) : panchang ? (
          <div className="space-y-6 animate-fade-in">
            {/* Sunrise / Sunset & Celestial Events */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass rounded-xl p-4 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-white/40 flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Sunrise
                </span>
                <p className="text-lg font-bold text-white">{panchang.sunrise || "06:05 AM"}</p>
              </div>
              <div className="glass rounded-xl p-4 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-white/40 flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-orange-400" />
                  Sunset
                </span>
                <p className="text-lg font-bold text-white">{panchang.sunset || "06:42 PM"}</p>
              </div>
              <div className="glass rounded-xl p-4 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-white/40 flex items-center gap-1">
                  <Moon className="w-3.5 h-3.5 text-purple-light" />
                  Moon Phase
                </span>
                <p className="text-lg font-bold text-white">{panchang.tithiPaksha} Paksha</p>
              </div>
              <div className="glass rounded-xl p-4 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-white/40 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Vara (Day)
                </span>
                <p className="text-lg font-bold text-white">{panchang.vara}</p>
              </div>
            </div>

            {/* 5 Core Limbs of Panchang */}
            <div className="glass rounded-2xl p-6 sm:p-8 border border-white/5 space-y-6">
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                The Five Elements of Time (Pancha Anga)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tithi */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-gold-light">1. Tithi (Lunar Day)</span>
                    <span className="text-[10px] font-bold uppercase text-emerald-400">
                      {panchang.tithiPaksha}
                    </span>
                  </div>
                  <p className="text-base font-bold text-white">{panchang.tithi}</p>
                  <p className="text-xs text-white/50">Lunar Phase: {panchang.tithiPaksha} Paksha</p>
                </div>

                {/* Nakshatra */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-gold-light">2. Nakshatra (Lunar Mansion)</span>
                    <span className="text-[10px] font-bold uppercase text-gold-light">
                      Lord {panchang.nakshatraRuler}
                    </span>
                  </div>
                  <p className="text-base font-bold text-white">{panchang.nakshatra}</p>
                  <p className="text-xs text-white/50">Planetary Ruler: {panchang.nakshatraRuler}</p>
                </div>

                {/* Yoga */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-gold-light">3. Yoga (Solar-Lunar Angle)</span>
                    <span className={`text-[10px] font-bold uppercase ${qualityColor(panchang.yogaQuality || "neutral")}`}>
                      {panchang.yogaQuality}
                    </span>
                  </div>
                  <p className="text-base font-bold text-white">{panchang.yoga}</p>
                  <p className="text-xs text-white/50">Nature: {panchang.yogaQuality === "auspicious" ? "Favorable for major undertakings" : "Standard cosmic rhythm"}</p>
                </div>

                {/* Karana */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-gold-light">4. Karana (Half-Tithi)</span>
                    <span className="text-[10px] font-bold uppercase text-white/60">
                      Half Tithi
                    </span>
                  </div>
                  <p className="text-base font-bold text-white">{panchang.karana}</p>
                  <p className="text-xs text-white/50">Cosmic Segment of Day</p>
                </div>
              </div>
            </div>

            {/* Inauspicious & Auspicious Muhurtas */}
            <div className="glass rounded-2xl p-6 sm:p-8 border border-white/5 space-y-4">
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                Daily Muhurta & Kaala Timings
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-red-400 block">Rahu Kalam</span>
                  <p className="text-sm font-bold text-white font-mono">{panchang.rahuKalam}</p>
                  <p className="text-[10px] text-white/40">Inauspicious for initiating contracts</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block">Yamaganda</span>
                  <p className="text-sm font-bold text-white font-mono">{panchang.yamaganda}</p>
                  <p className="text-[10px] text-white/40">Avoid travel or significant expenditures</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-blue-400 block">Gulika Kalam</span>
                  <p className="text-sm font-bold text-white font-mono">{panchang.gulikaKalam}</p>
                  <p className="text-[10px] text-white/40">Saturn&apos;s segment of the day</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </PageWrapper>
  );
}
