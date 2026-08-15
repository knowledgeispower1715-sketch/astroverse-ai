"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Clock, User, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const POPULAR_CITIES = [
  { name: "New York, USA", lat: 40.7128, lng: -74.006, tz: "America/New_York" },
  { name: "London, UK", lat: 51.5074, lng: -0.1278, tz: "Europe/London" },
  { name: "Mumbai, India", lat: 19.076, lng: 72.8777, tz: "Asia/Kolkata" },
  { name: "Delhi, India", lat: 28.6139, lng: 77.209, tz: "Asia/Kolkata" },
  { name: "Tokyo, Japan", lat: 35.6762, lng: 139.6503, tz: "Asia/Tokyo" },
  { name: "Sydney, Australia", lat: -33.8688, lng: 151.2093, tz: "Australia/Sydney" },
  { name: "Los Angeles, USA", lat: 34.0522, lng: -118.2437, tz: "America/Los_Angeles" },
  { name: "Paris, France", lat: 48.8566, lng: 2.3522, tz: "Europe/Paris" },
  { name: "Dubai, UAE", lat: 25.2048, lng: 55.2708, tz: "Asia/Dubai" },
  { name: "Singapore", lat: 1.3521, lng: 103.8198, tz: "Asia/Singapore" },
  { name: "São Paulo, Brazil", lat: -23.5505, lng: -46.6333, tz: "America/Sao_Paulo" },
  { name: "Berlin, Germany", lat: 52.52, lng: 13.405, tz: "Europe/Berlin" },
];

interface FormData {
  displayName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number | null;
  longitude: number | null;
  timezoneId: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showCityList, setShowCityList] = useState(false);

  const [form, setForm] = useState<FormData>({
    displayName: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    latitude: null,
    longitude: null,
    timezoneId: "UTC",
  });

  const selectCity = (city: typeof POPULAR_CITIES[0]) => {
    setForm((prev) => ({
      ...prev,
      birthPlace: city.name,
      latitude: city.lat,
      longitude: city.lng,
      timezoneId: city.tz,
    }));
    setShowCityList(false);
  };

  const handleSubmit = async () => {
    if (!form.displayName.trim() || !form.birthDate || !form.birthPlace) {
      setStatus("error");
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setStatus("saving");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setStatus("error");
        setErrorMessage("You must be logged in to complete onboarding.");
        return;
      }

      // Save birth profile
      const { error } = await supabase.from("birth_profiles").insert({
        user_id: user.id,
        display_name: form.displayName,
        birth_date: form.birthDate,
        birth_time: form.birthTime || null,
        birth_place: form.birthPlace,
        latitude: form.latitude,
        longitude: form.longitude,
        timezone_id: form.timezoneId,
      }).select().single();

      if (error) {
        // If profile already exists, update it
        if (error.code === "23505") {
          const { error: updateError } = await supabase
            .from("birth_profiles")
            .update({
              display_name: form.displayName,
              birth_date: form.birthDate,
              birth_time: form.birthTime || null,
              birth_place: form.birthPlace,
              latitude: form.latitude,
              longitude: form.longitude,
              timezone_id: form.timezoneId,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", user.id);

          if (updateError) {
            console.error("Update error:", updateError);
            setStatus("error");
            setErrorMessage("Failed to update your birth profile. Please try again.");
            return;
          }
        } else {
          console.error("Insert error:", error);
          setStatus("error");
          setErrorMessage("Failed to save your birth profile. Please try again.");
          return;
        }
      }

      setStatus("saved");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      console.error("Onboarding error:", err);
      setStatus("error");
      setErrorMessage("An unexpected error occurred.");
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: "var(--gradient-gold)" }}>
            <Sparkles className="w-7 h-7" style={{ color: "var(--bg-primary)" }} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gradient-gold mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
            Welcome to AstroVerse
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
            Tell us about yourself so we can personalise your cosmic readings and astrological forecasts.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: step >= s ? "3rem" : "1.5rem",
                background: step >= s ? "var(--gradient-gold)" : "rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>

        {/* Step 1: Identity */}
        {step === 1 && (
          <div className="glass rounded-2xl p-6 sm:p-8 border border-white/5 space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>Your Identity</h2>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Display Name *</label>
              <Input
                type="text"
                placeholder="Enter your name"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                className="h-11 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50 placeholder:text-white/20"
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  if (!form.displayName.trim()) { setStatus("error"); setErrorMessage("Please enter your name."); return; }
                  setStatus("idle"); setErrorMessage(""); setStep(2);
                }}
                className="h-11 px-8 text-sm font-semibold rounded-lg gap-1.5 cursor-pointer"
                style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Birth Details */}
        {step === 2 && (
          <div className="glass rounded-2xl p-6 sm:p-8 border border-white/5 space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>Birth Details</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Date of Birth *</label>
                <Input
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                  className="h-11 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
                  <Clock className="w-3 h-3" /> Birth Time <span className="text-white/30">(optional)</span>
                </label>
                <Input
                  type="time"
                  value={form.birthTime}
                  onChange={(e) => setForm({ ...form, birthTime: e.target.value })}
                  className="h-11 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button onClick={() => setStep(1)} variant="ghost" className="text-xs text-white/50 cursor-pointer">Back</Button>
              <Button
                onClick={() => {
                  if (!form.birthDate) { setStatus("error"); setErrorMessage("Please enter your birth date."); return; }
                  setStatus("idle"); setErrorMessage(""); setStep(3);
                }}
                className="h-11 px-8 text-sm font-semibold rounded-lg gap-1.5 cursor-pointer"
                style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Birth Place */}
        {step === 3 && (
          <div className="glass rounded-2xl p-6 sm:p-8 border border-white/5 space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>Birth Location</h2>
            </div>
            <div className="space-y-1 relative">
              <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>City of Birth *</label>
              <Input
                type="text"
                placeholder="Start typing or select from list"
                value={form.birthPlace}
                onChange={(e) => {
                  setForm({ ...form, birthPlace: e.target.value, latitude: null, longitude: null });
                  setShowCityList(true);
                }}
                onFocus={() => setShowCityList(true)}
                className="h-11 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50 placeholder:text-white/20"
              />
              {showCityList && (
                <div className="absolute z-20 top-full left-0 right-0 mt-1 glass rounded-xl border border-white/10 max-h-52 overflow-y-auto">
                  {POPULAR_CITIES
                    .filter((c) => !form.birthPlace || c.name.toLowerCase().includes(form.birthPlace.toLowerCase()))
                    .map((city) => (
                      <button
                        key={city.name}
                        onClick={() => selectCity(city)}
                        className="w-full text-left px-4 py-2.5 text-xs text-white/80 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                      >
                        <MapPin className="w-3 h-3 text-gold/50 shrink-0" />
                        {city.name}
                      </button>
                    ))}
                </div>
              )}
            </div>
            {form.latitude && form.longitude && (
              <p className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                Coordinates: {form.latitude.toFixed(4)}°, {form.longitude.toFixed(4)}° · TZ: {form.timezoneId}
              </p>
            )}

            {/* Error display */}
            {status === "error" && (
              <p className="text-xs text-red-400">{errorMessage}</p>
            )}

            {/* Success display */}
            {status === "saved" && (
              <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5" />
                Profile saved! Redirecting to dashboard...
              </div>
            )}

            <div className="flex justify-between">
              <Button onClick={() => setStep(2)} variant="ghost" className="text-xs text-white/50 cursor-pointer">Back</Button>
              <Button
                onClick={handleSubmit}
                disabled={status === "saving" || status === "saved"}
                className="h-11 px-8 text-sm font-semibold rounded-lg gap-1.5 cursor-pointer"
                style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
              >
                {status === "saving" ? "Saving..." : status === "saved" ? "Done!" : "Complete Setup"}
                {status === "idle" && <Sparkles className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
