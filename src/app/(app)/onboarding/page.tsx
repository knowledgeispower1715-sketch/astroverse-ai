"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, User, Sparkles, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { GlobalLocationPicker } from "@/components/location/global-location-picker";
import { WORLD_CITIES } from "@/modules/location-engine";

interface FormData {
  displayName: string;
  birthDate: string;
  birthTime: string;
  timePrecision: "exact" | "approximate" | "unknown";
  birthPlace: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState<FormData>({
    displayName: "",
    birthDate: "",
    birthTime: "12:00",
    timePrecision: "exact",
    birthPlace: "",
    country: "",
    latitude: 0,
    longitude: 0,
    timezone: "UTC",
  });

  const handleSubmit = async () => {
    if (!form.displayName.trim() || !form.birthDate || !form.birthPlace) {
      setStatus("error");
      setErrorMessage("Please fill in all required fields before continuing.");
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

      // Resolve coordinates if missing
      let lat = form.latitude;
      let lng = form.longitude;
      let tz = form.timezone || "UTC";
      let ctry = form.country || "";

      if (!lat && !lng && form.birthPlace) {
        const queryLower = form.birthPlace.toLowerCase();
        const found = WORLD_CITIES.find(
          (c) =>
            queryLower.includes(c.name.toLowerCase()) ||
            c.formattedAddress.toLowerCase().includes(queryLower)
        );
        if (found) {
          lat = found.latitude;
          lng = found.longitude;
          tz = found.timezone;
          ctry = found.country;
        }
      }

      // 1. Update or create user profile
      await supabase.from("profiles").upsert({
        user_id: user.id,
        email: user.email,
        display_name: form.displayName,
        full_name: form.displayName,
        updated_at: new Date().toISOString(),
      });

      // 2. Persist primary birth profile
      const { error: birthError } = await supabase.from("birth_profiles").upsert({
        user_id: user.id,
        name: form.displayName,
        date_of_birth: form.birthDate,
        time_of_birth: form.timePrecision === "unknown" ? "12:00:00" : `${form.birthTime}:00`,
        birth_place: form.birthPlace,
        country: ctry,
        latitude: lat,
        longitude: lng,
        timezone: tz,
        is_primary: true,
        is_approximate_time: form.timePrecision === "approximate",
        is_unknown_time: form.timePrecision === "unknown",
        updated_at: new Date().toISOString(),
      });

      if (birthError) {
        console.error("Birth profile save warning:", birthError.message);
      }

      setStatus("saved");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Onboarding error:", err);
      setStatus("error");
      setErrorMessage("Failed to save birth details. Please try again.");
    }
  };

  return (
    <PageWrapper title="Cosmic Onboarding | AstroVerse AI" description="Configure your authentic birth details.">
      <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-gold/10 border border-gold/20 text-gold-light">
            <Sparkles className="w-3.5 h-3.5" />
            Step {step} of 3 — Cosmic Blueprint
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>
            Welcome to AstroVerse AI
          </h1>
          <p className="text-sm text-white/60">
            Let us align the planets with your exact moment and location of birth.
          </p>
        </div>

        {/* Multi-step Card */}
        <div className="glass rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
          {/* Progress Indicators */}
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  s <= step ? "bg-gradient-to-r from-gold to-purple-light" : "bg-white/10"
                }`}
              />
            ))}
          </div>

          {/* STEP 1: Identity */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-gold" />
                  Your Astrological Name
                </h3>
                <p className="text-xs text-white/50">
                  How would you like our celestial engine to address you?
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/70 block">Full or Preferred Name</label>
                <Input
                  type="text"
                  placeholder="e.g. User Name"
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  className="h-12 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50 text-base"
                />
              </div>

              <Button
                type="button"
                disabled={!form.displayName.trim()}
                onClick={() => setStep(2)}
                className="w-full h-12 rounded-lg font-semibold gap-2 cursor-pointer mt-4"
                style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
              >
                Continue to Birth Date & Time
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* STEP 2: Birth Date & Time */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gold" />
                  Date & Time of Birth
                </h3>
                <p className="text-xs text-white/50">
                  Used to determine your Sun, Moon, Ascendant (Lagna), and planetary degrees.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/70 block">Date of Birth</label>
                <Input
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                  className="h-12 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
                />
              </div>

              {/* Time Precision Toggle */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/70 block">Time Precision</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["exact", "approximate", "unknown"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setForm({ ...form, timePrecision: mode })}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer capitalize ${
                        form.timePrecision === mode
                          ? "bg-gold/20 border-gold text-gold-light"
                          : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {form.timePrecision !== "unknown" ? (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/70 block flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gold" />
                    Exact Birth Time (24h or AM/PM)
                  </label>
                  <Input
                    type="time"
                    value={form.birthTime}
                    onChange={(e) => setForm({ ...form, birthTime: e.target.value })}
                    className="h-12 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
                  />
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    When birth time is unknown, standard midday (12:00 PM) is used for Moon sign and planetary placements. Ascendant (Lagna) and exact house divisions will be approximated.
                  </span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-1/3 h-12 border-white/10 text-white/70 hover:text-white cursor-pointer"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  disabled={!form.birthDate}
                  onClick={() => setStep(3)}
                  className="flex-1 h-12 rounded-lg font-semibold gap-2 cursor-pointer"
                  style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
                >
                  Continue to Location
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Global Location */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  Birth Location & Timezone
                </h3>
                <p className="text-xs text-white/50">
                  Calculates local sidereal time, geographical horizon, and exact Ascendant.
                </p>
              </div>

              {/* Worldwide Location Picker */}
              <GlobalLocationPicker
                value={{
                  birthPlace: form.birthPlace,
                  country: form.country,
                  latitude: form.latitude,
                  longitude: form.longitude,
                  timezone: form.timezone,
                }}
                onChange={(loc) => {
                  setForm((prev) => ({
                    ...prev,
                    birthPlace: loc.birthPlace,
                    country: loc.country,
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    timezone: loc.timezone,
                  }));
                }}
              />

              {status === "error" && (
                <p className="text-xs text-red-400 font-semibold">{errorMessage}</p>
              )}

              {status === "saved" && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Your Cosmic Blueprint is ready! Entering dashboard...</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  disabled={status === "saving" || status === "saved"}
                  className="w-1/3 h-12 border-white/10 text-white/70 hover:text-white cursor-pointer"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  disabled={!form.birthPlace || status === "saving" || status === "saved"}
                  onClick={handleSubmit}
                  className="flex-1 h-12 rounded-lg font-semibold gap-2 cursor-pointer"
                  style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
                >
                  {status === "saving" ? "Aligning Stars..." : "Activate Cosmic Account"}
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
