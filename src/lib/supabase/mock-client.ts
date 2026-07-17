// Mock Supabase Client for offline development and local previews
import { cookies } from "next/headers";

const MOCK_USER = {
  id: "mock-user-uuid-12345",
  email: "testseeker@astroverse.ai",
  user_metadata: {
    name: "Cosmic Seeker",
    role: "user",
  },
  app_metadata: {
    role: "user"
  },
  aud: "authenticated",
  created_at: new Date().toISOString()
};

export class MockSupabaseClient {
  private cookieStore: { 
    get: (name: string) => { value: string } | undefined; 
    set: (name: string, value: string, options?: Record<string, unknown>) => void; 
  };

  constructor(cookieStore: unknown) {
    this.cookieStore = cookieStore as typeof this.cookieStore;
  }

  get auth() {
    return {
      getUser: async () => {
        const hasSession = this.cookieStore.get("sb-mock-session");
        if (hasSession) {
          return { data: { user: MOCK_USER }, error: null };
        }
        return { data: { user: null }, error: null };
      },
      signInWithPassword: async ({ email }: { email: string }) => {
        this.cookieStore.set("sb-mock-session", "active", { path: "/" });
        const user = { ...MOCK_USER, email };
        return { data: { user }, error: null };
      },
      signUp: async ({ email, options }: { email: string; options?: { data?: { name?: string } } }) => {
        this.cookieStore.set("sb-mock-session", "active", { path: "/" });
        const user = { 
          ...MOCK_USER, 
          email, 
          user_metadata: { 
            name: options?.data?.name || "Cosmic Seeker", 
            role: "user" 
          } 
        };
        return { data: { user }, error: null };
      },
      signOut: async () => {
        this.cookieStore.set("sb-mock-session", "", { path: "/", maxAge: 0 });
        return { error: null };
      },
      resetPasswordForEmail: async () => {
        return { error: null };
      },
      updateUser: async () => {
        return { error: null };
      }
    };
  }

  from(table: string) {
    return {
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          single: () => Promise.resolve({ data: this.getMockTableRecord(table), error: null }),
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
          select: () => Promise.resolve({ data: [], error: null })
        }),
        order: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: this.getMockTableRecord(table), error: null })
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: this.getMockTableRecord(table), error: null })
        })
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: this.getMockTableRecord(table), error: null })
          })
        })
      }),
      delete: () => ({
        eq: () => ({
          eq: () => ({
            select: () => Promise.resolve({ data: [], error: null })
          })
        })
      })
    };
  }

  private getMockTableRecord(table: string) {
    if (table === "profiles") {
      return { id: MOCK_USER.id, name: "Cosmic Seeker", email: MOCK_USER.email };
    }
    if (table === "settings") {
      return { 
        user_id: MOCK_USER.id, 
        astrology_system: "vedic", 
        house_system: "whole-sign", 
        theme: "dark",
        daily_horoscope_alert: true,
        transits_alert: true,
        newsletters_alert: false,
        timezone: "Asia/Kolkata",
        locale: "en-US"
      };
    }
    return {};
  }
}

export async function createMockClient() {
  const cookieStore = await cookies();
  return new MockSupabaseClient(cookieStore);
}
