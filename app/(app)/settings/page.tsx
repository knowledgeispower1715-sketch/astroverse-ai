"use client";

import { useEffect, useState } from "react";
import { Sparkles, User, Settings, ShieldAlert, Bell, Globe, CheckCircle2, AlertCircle } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [astrologySystem, setAstrologySystem] = useState("western");
  const [timezone, setTimezone] = useState("UTC");
  const [notifications, setNotifications] = useState({ daily: true, transits: false });

  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "saved" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setName(user.user_metadata?.name || "");
          setEmail(user.email || "");
          setAstrologySystem(user.user_metadata?.astrologySystem || "western");
          setTimezone(user.user_metadata?.timezone || "UTC");
          setNotifications(user.user_metadata?.notifications || { daily: true, transits: false });
          setStatus("idle");
        } else {
          setStatus("error");
          setErrorMessage("Failed to load user profile. Please log in again.");
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
        setStatus("error");
        setErrorMessage("An unexpected error occurred loading your profile.");
      }
    }
    loadUserProfile();
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
      const { error } = await supabase.auth.updateUser({
        data: {
          name,
          astrologySystem,
          timezone,
          notifications,
        },
      });

      if (error) {
        setStatus("error");
        setErrorMessage(error.message);
      } else {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      }
    } catch {
      setStatus("error");
      setErrorMessage("An error occurred while saving your preferences.");
    }
  };

  const handleDelete = async () => {
    alert("Account deletion would be handled here via Supabase database cascade triggers.");
    setDeleteConfirm(false);
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gradient-gold mb-2" style={{ fontFamily: "var(--font-outfit)" }}>Settings & Profile</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Manage your personal details, preferred calculations systems, timezone offsets, and notification options.
          </p>
        </div>

        {status === "loading" ? (
          <div className="text-center py-10" style={{ color: "var(--text-secondary)" }}>
            Loading settings data...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Menu links / sidebar */}
            <div className="md:col-span-1 space-y-2">
              <div className="glass rounded-xl p-4 border border-white/5 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider block mb-2 px-3" style={{ color: "var(--text-muted)" }}>Control Panel</span>
                <button className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 text-gold-light">Profile Settings</button>
                <button onClick={() => alert("Billing portal would open here.")} className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-white/60 hover:bg-white/5 hover:text-white">Billing & Plans</button>
              </div>
            </div>

            {/* Form container */}
            <div className="md:col-span-2 space-y-6 animate-fade-in">
              <form onSubmit={handleSave} className="glass rounded-2xl p-6 sm:p-8 border border-white/5 space-y-6">
                {/* Account details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider pb-2 border-b border-white/5 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                    <User className="w-4 h-4 text-gold" />
                    Account Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Name</label>
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

                {/* Calculations Preferences */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider pb-2 border-b border-white/5 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                    <Globe className="w-4 h-4 text-purple-light" />
                    Preferences
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Preferred System</label>
                      <select
                        value={astrologySystem}
                        onChange={(e) => setAstrologySystem(e.target.value)}
                        className="w-full h-10 bg-white/5 border border-white/10 text-white rounded-lg px-2 focus:outline-none focus:border-gold/50"
                        disabled={status === "saving"}
                      >
                        <option value="western" className="bg-black text-white">Western Tropical</option>
                        <option value="vedic" className="bg-black text-white">Vedic (Jyotish)</option>
                        <option value="chinese" className="bg-black text-white">Chinese Lunar</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Timezone</label>
                      <Input
                        type="text"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="h-10 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
                        disabled={status === "saving"}
                      />
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider pb-2 border-b border-white/5 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                    <Bell className="w-4 h-4 text-gold" />
                    Notification Channels
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
                      Receive daily horoscope email alerts
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-white/80">
                      <input
                        type="checkbox"
                        checked={notifications.transits}
                        onChange={(e) => setNotifications({ ...notifications, transits: e.target.checked })}
                        className="rounded border-white/20 bg-white/5 accent-gold"
                        disabled={status === "saving"}
                      />
                      Alert me for significant planetary retrogrades
                    </label>
                  </div>
                </div>

                {/* Status and submit */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                  {status === "saved" && (
                    <div className="flex items-center gap-1.5 text-xs text-green-500 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Preferences saved!</span>
                    </div>
                  )}
                  {status === "error" && (
                    <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                  <div className="flex-grow" />
                  <Button type="submit" disabled={status === "saving"} className="h-10 rounded-lg px-6 text-xs font-bold cursor-pointer" style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}>
                    {status === "saving" ? "Saving..." : "Save Preferences"}
                  </Button>
                </div>
              </form>

              {/* Danger Zone */}
              <div className="glass rounded-2xl p-6 border border-red-500/10 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider pb-2 border-b border-red-500/10 flex items-center gap-1.5 text-red-500">
                  <ShieldAlert className="w-4 h-4" />
                  Danger Zone
                </h3>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Deleting your account is permanent. All saved birth records, charts, and forecasts will be removed.</p>
                {deleteConfirm ? (
                  <div className="flex gap-2">
                    <Button onClick={handleDelete} className="text-xs h-9 bg-red-600 hover:bg-red-700 text-white rounded-lg">Confirm Delete</Button>
                    <Button onClick={() => setDeleteConfirm(false)} variant="ghost" className="text-xs h-9 text-white/50">Cancel</Button>
                  </div>
                ) : (
                  <Button onClick={() => setDeleteConfirm(true)} variant="outline" className="text-xs h-9 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-500">Delete Account</Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
