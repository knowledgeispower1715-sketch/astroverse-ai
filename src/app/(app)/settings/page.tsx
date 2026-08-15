"use client";

import { useEffect, useState } from "react";
import { User, ShieldAlert, Bell, Globe, CheckCircle2, AlertCircle, Compass, Calendar, Clock } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { GlobalLocationPicker } from "@/components/location/global-location-picker";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [astrologySystem, setAstrologySystem] = useState("vedic");
  const [timezone, setTimezone] = useState("UTC");
  const [notifications, setNotifications] = useState({ daily: true, transits: false });

  // Birth Details state
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("12:00");
  const [birthPlace, setBirthPlace] = useState("");
  const [country, setCountry] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "saved" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setName(user.user_metadata?.name || "");
          setEmail(user.email || "");
          setAstrologySystem(user.user_metadata?.astrologySystem || "vedic");
          setTimezone(user.user_metadata?.timezone || "UTC");
          setNotifications(user.user_metadata?.notifications || { daily: true, transits: false });

          // Load birth profile
          const { data: profile } = await supabase
            .from("birth_profiles")
            .select("*")
            .eq("user_id", user.id)
            .order("is_primary", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (profile) {
            setBirthDate(profile.date_of_birth || "");
            setBirthTime(profile.time_of_birth ? profile.time_of_birth.slice(0, 5) : "12:00");
            setBirthPlace(profile.birth_place || "");
            setCountry(profile.country || "");
            setLatitude(Number(profile.latitude) || 0);
            setLongitude(Number(profile.longitude) || 0);
            setTimezone(profile.timezone || "UTC");
          }

          setStatus("idle");
        } else {
          setStatus("error");
          setErrorMessage("Failed to load user profile. Please log in again.");
        }
      } catch (err) {
        console.error("Error loading user data:", err);
        setStatus("error");
        setErrorMessage("An unexpected error occurred loading your profile.");
      }
    }
    loadUserData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setStatus("error");
      setErrorMessage("Please enter a valid display name.");
      return;
    }

    setStatus("saving");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("Unauthorized");

      // 1. Update Auth user metadata
      await supabase.auth.updateUser({
        data: {
          name,
          astrologySystem,
          timezone,
          notifications,
        },
      });

      // 2. Update profiles table
      await supabase.from("profiles").upsert({
        user_id: user.id,
        email: user.email,
        display_name: name,
        full_name: name,
        updated_at: new Date().toISOString(),
      });

      // 3. Update birth_profiles table if birth details entered
      if (birthDate && birthPlace) {
        await supabase.from("birth_profiles").upsert({
          user_id: user.id,
          name,
          date_of_birth: birthDate,
          time_of_birth: `${birthTime}:00`,
          birth_place: birthPlace,
          country,
          latitude,
          longitude,
          timezone,
          is_primary: true,
          updated_at: new Date().toISOString(),
        });
      }

      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      console.error("Settings save error:", err);
      setStatus("error");
      setErrorMessage("An error occurred while saving your preferences.");
    }
  };

  return (
    <PageWrapper title="Settings & Profile | AstroVerse AI" description="Manage your personal details and calculations preferences.">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gradient-gold mb-2" style={{ fontFamily: "var(--font-outfit)" }}>Settings & Profile</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Manage your personal identity, worldwide birth coordinates, preferred calculation systems, and notifications.
          </p>
        </div>

        {status === "loading" ? (
          <div className="text-center py-10" style={{ color: "var(--text-secondary)" }}>
            Loading settings data...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar info */}
            <div className="md:col-span-1 space-y-2">
              <div className="glass rounded-xl p-4 border border-white/5 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider block mb-2 px-3" style={{ color: "var(--text-muted)" }}>Control Center</span>
                <div className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 text-gold-light flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  Account & Birth Profile
                </div>
                <div className="w-full text-left px-3 py-2 rounded-lg text-xs text-white/60 flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5" />
                  Global Coordinates
                </div>
              </div>
            </div>

            {/* Form container */}
            <div className="md:col-span-2 space-y-6 animate-fade-in">
              <form onSubmit={handleSave} className="glass rounded-2xl p-6 sm:p-8 border border-white/5 space-y-6">
                {/* Account details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider pb-2 border-b border-white/5 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                    <User className="w-4 h-4 text-gold" />
                    Account Identity
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Display Name</label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-10 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
                        disabled={status === "saving"}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Email Address</label>
                      <Input
                        type="email"
                        value={email}
                        disabled
                        className="h-10 bg-white/5 border-white/10 text-white/50 rounded-lg cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Birth Details & Global Location */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider pb-2 border-b border-white/5 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                    <Compass className="w-4 h-4 text-gold" />
                    Primary Birth Blueprint
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold block text-white/70 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gold" />
                        Date of Birth
                      </label>
                      <Input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="h-10 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
                        disabled={status === "saving"}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold block text-white/70 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gold" />
                        Time of Birth
                      </label>
                      <Input
                        type="time"
                        value={birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        className="h-10 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
                        disabled={status === "saving"}
                      />
                    </div>
                  </div>

                  <GlobalLocationPicker
                    value={{
                      birthPlace,
                      country,
                      latitude,
                      longitude,
                      timezone,
                    }}
                    onChange={(loc) => {
                      setBirthPlace(loc.birthPlace);
                      setCountry(loc.country);
                      setLatitude(loc.latitude);
                      setLongitude(loc.longitude);
                      setTimezone(loc.timezone);
                    }}
                  />
                </div>

                {/* Calculations Preferences */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider pb-2 border-b border-white/5 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                    <Globe className="w-4 h-4 text-purple-light" />
                    Astrology Preferences
                  </h3>
                  <div className="space-y-1 text-xs">
                    <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Preferred Calculation Methodology</label>
                    <select
                      value={astrologySystem}
                      onChange={(e) => setAstrologySystem(e.target.value)}
                      className="w-full h-10 bg-white/5 border border-white/10 text-white rounded-lg px-2 focus:outline-none focus:border-gold/50"
                      disabled={status === "saving"}
                    >
                      <option value="vedic" className="bg-black text-white">Vedic (Jyotish) • Lahiri Ayanamsa</option>
                      <option value="western" className="bg-black text-white">Western • Tropical Zodiac</option>
                      <option value="chinese" className="bg-black text-white">Chinese Lunar Astrology</option>
                    </select>
                  </div>
                </div>

                {/* Notifications */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider pb-2 border-b border-white/5 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                    <Bell className="w-4 h-4 text-gold" />
                    Notifications
                  </h3>
                  <div className="space-y-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-white/80">
                      <input
                        type="checkbox"
                        checked={notifications.daily}
                        onChange={(e) => setNotifications({ ...notifications, daily: e.target.checked })}
                        className="rounded border-white/20 bg-white/5 accent-gold"
                        disabled={status === "saving"}
                      />
                      Receive daily Moon sign transit updates
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-white/80">
                      <input
                        type="checkbox"
                        checked={notifications.transits}
                        onChange={(e) => setNotifications({ ...notifications, transits: e.target.checked })}
                        className="rounded border-white/20 bg-white/5 accent-gold"
                        disabled={status === "saving"}
                      />
                      Alert for major Mahadasha transitions & retrogrades
                    </label>
                  </div>
                </div>

                {/* Status messages */}
                {status === "error" && (
                  <div className="flex items-center gap-2 text-xs text-red-500 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {status === "saved" && (
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Settings & birth blueprint successfully updated.</span>
                  </div>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={status === "saving"}
                  className="w-full h-11 rounded-lg text-xs font-semibold gap-2 cursor-pointer"
                  style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
                >
                  {status === "saving" ? "Saving..." : "Save Preferences"}
                </Button>
              </form>

              {/* Danger zone */}
              <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  Account Security
                </h4>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Row-level security ensures your birth profiles, chart records, and Tarot readings are strictly private to your account.
                </p>
                {deleteConfirm ? (
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      onClick={() => setDeleteConfirm(false)}
                      variant="destructive"
                      size="sm"
                      className="text-xs cursor-pointer"
                    >
                      Confirm Data Wipe
                    </Button>
                    <Button
                      onClick={() => setDeleteConfirm(false)}
                      variant="ghost"
                      size="sm"
                      className="text-xs text-white/60 cursor-pointer"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="text-xs text-red-400/80 hover:text-red-400 hover:underline pt-1 font-medium"
                  >
                    Delete Account and Saved Charts
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
