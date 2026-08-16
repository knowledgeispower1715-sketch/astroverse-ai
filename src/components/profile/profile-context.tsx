"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

export interface BirthProfileItem {
  id: string;
  user_id?: string;
  name: string;
  profile_name?: string;
  relationship?: string;
  date_of_birth: string;
  time_of_birth?: string;
  birth_time_precision?: "exact" | "approximate" | "unknown";
  birth_place: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  is_primary?: boolean;
}

interface ProfileContextType {
  profiles: BirthProfileItem[];
  activeProfile: BirthProfileItem | null;
  activeProfileId: string;
  setActiveProfileId: (id: string) => void;
  saveProfile: (profile: Partial<BirthProfileItem>) => Promise<BirthProfileItem | null>;
  loading: boolean;
  hasProfile: boolean;
  reloadProfiles: () => Promise<void>;
}

const STORAGE_ACTIVE_ID = "astroverse_active_profile_id";
const STORAGE_LOCAL_PROFILES = "astroverse_saved_birth_profiles";

const ProfileContext = createContext<ProfileContextType>({
  profiles: [],
  activeProfile: null,
  activeProfileId: "",
  setActiveProfileId: () => {},
  saveProfile: async () => null,
  loading: true,
  hasProfile: false,
  reloadProfiles: async () => {},
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<BirthProfileItem[]>([]);
  const [activeProfileId, setActiveProfileIdState] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Synchronize active profile selection with persistence
  const setActiveProfileId = useCallback((id: string) => {
    setActiveProfileIdState(id);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_ACTIVE_ID, id);
      } catch (err) {
        console.warn("Could not persist active profile ID:", err);
      }
    }
  }, []);

  const fetchProfiles = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      let loadedProfiles: BirthProfileItem[] = [];

      if (user) {
        // Authenticated user: Load from Supabase birth_profiles table
        const { data: raw } = await supabase
          .from("birth_profiles")
          .select("*")
          .eq("user_id", user.id)
          .order("is_primary", { ascending: false });

        if (raw && Array.isArray(raw) && raw.length > 0) {
          loadedProfiles = raw.map((p) => ({
            id: p.id,
            user_id: p.user_id,
            name: p.name || p.profile_name || "Birth Chart",
            profile_name: p.profile_name || "My Chart",
            relationship: p.relationship || (p.is_primary ? "Self" : "Family"),
            date_of_birth: p.date_of_birth,
            time_of_birth: p.time_of_birth,
            birth_time_precision: p.birth_time_precision || "exact",
            birth_place: p.birth_place,
            country: p.country,
            latitude: Number(p.latitude) || 0,
            longitude: Number(p.longitude) || 0,
            timezone: p.timezone || "UTC",
            is_primary: p.is_primary,
          }));
        }
      }

      // If no remote profiles found (or guest mode), check local storage fallback
      if (loadedProfiles.length === 0 && typeof window !== "undefined") {
        try {
          const localStored = localStorage.getItem(STORAGE_LOCAL_PROFILES);
          if (localStored) {
            const parsed = JSON.parse(localStored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              loadedProfiles = parsed;
            }
          }
        } catch (err) {
          console.warn("Could not read local stored profiles:", err);
        }
      }

      setProfiles(loadedProfiles);

      if (loadedProfiles.length > 0) {
        let storedId = "";
        if (typeof window !== "undefined") {
          try {
            storedId = localStorage.getItem(STORAGE_ACTIVE_ID) || "";
          } catch {}
        }
        if (storedId && loadedProfiles.some((p) => p.id === storedId)) {
          setActiveProfileIdState(storedId);
        } else {
          setActiveProfileIdState(loadedProfiles[0].id);
        }
      } else {
        setActiveProfileIdState("");
      }
    } catch (err) {
      console.error("ProfileContext fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProfile = useCallback(async (data: Partial<BirthProfileItem>): Promise<BirthProfileItem | null> => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const profilePayload: BirthProfileItem = {
        id: data.id || `profile-${Date.now()}`,
        user_id: user?.id,
        name: data.name || "My Chart",
        profile_name: data.profile_name || data.name || "My Chart",
        relationship: data.relationship || "Self",
        date_of_birth: data.date_of_birth || new Date().toISOString().slice(0, 10),
        time_of_birth: data.time_of_birth || "12:00:00",
        birth_time_precision: data.birth_time_precision || "exact",
        birth_place: data.birth_place || "Global",
        country: data.country,
        latitude: Number(data.latitude) || 0,
        longitude: Number(data.longitude) || 0,
        timezone: data.timezone || "UTC",
        is_primary: data.is_primary ?? true,
      };

      if (user) {
        await supabase.from("birth_profiles").upsert(profilePayload);
      }

      // Persist locally
      if (typeof window !== "undefined") {
        try {
          const current = [...profiles.filter((p) => p.id !== profilePayload.id), profilePayload];
          localStorage.setItem(STORAGE_LOCAL_PROFILES, JSON.stringify(current));
          localStorage.setItem(STORAGE_ACTIVE_ID, profilePayload.id);
        } catch {}
      }

      setProfiles((prev) => [...prev.filter((p) => p.id !== profilePayload.id), profilePayload]);
      setActiveProfileId(profilePayload.id);
      return profilePayload;
    } catch (err) {
      console.error("Error saving profile in ProfileContext:", err);
      return null;
    }
  }, [profiles, setActiveProfileId]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (isMounted) {
        await fetchProfiles();
      }
    };
    void load();
    return () => {
      isMounted = false;
    };
  }, [fetchProfiles]);

  const activeProfile = useMemo(() => {
    return profiles.find((p) => p.id === activeProfileId) || profiles[0] || null;
  }, [profiles, activeProfileId]);

  const hasProfile = Boolean(activeProfile && activeProfile.date_of_birth && activeProfile.birth_place);

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        activeProfile,
        activeProfileId,
        setActiveProfileId,
        saveProfile,
        loading,
        hasProfile,
        reloadProfiles: fetchProfiles,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
