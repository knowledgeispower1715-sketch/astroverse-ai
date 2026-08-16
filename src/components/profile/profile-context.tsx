"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

export interface BirthProfileItem {
  id: string;
  user_id: string;
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
  loading: boolean;
  reloadProfiles: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType>({
  profiles: [],
  activeProfile: null,
  activeProfileId: "",
  setActiveProfileId: () => {},
  loading: true,
  reloadProfiles: async () => {},
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<BirthProfileItem[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchProfiles = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProfiles([]);
        setActiveProfileId("");
        setLoading(false);
        return;
      }

      const { data: raw } = await supabase
        .from("birth_profiles")
        .select("*")
        .eq("user_id", user.id)
        .order("is_primary", { ascending: false });

      if (raw && Array.isArray(raw) && raw.length > 0) {
        const mapped: BirthProfileItem[] = raw.map((p) => ({
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
        setProfiles(mapped);
        setActiveProfileId((prev) => (prev && mapped.some((m) => m.id === prev) ? prev : mapped[0].id));
      } else {
        setProfiles([]);
        setActiveProfileId("");
      }
    } catch (err) {
      console.error("ProfileContext fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

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

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        activeProfile,
        activeProfileId,
        setActiveProfileId,
        loading,
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
