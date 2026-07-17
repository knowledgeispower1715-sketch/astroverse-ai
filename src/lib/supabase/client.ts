import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

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

class MockBrowserClient {
  get auth() {
    return {
      getUser: async () => {
        const hasSession = typeof document !== "undefined" && document.cookie.includes("sb-mock-session=active");
        if (hasSession) {
          return { data: { user: MOCK_USER }, error: null };
        }
        return { data: { user: null }, error: null };
      },
      signInWithPassword: async ({ email }: { email: string }) => {
        if (typeof document !== "undefined") {
          document.cookie = "sb-mock-session=active; path=/;";
        }
        const user = { ...MOCK_USER, email };
        return { data: { user }, error: null };
      },
      signUp: async ({ email, options }: { email: string; options?: { data?: { name?: string } } }) => {
        if (typeof document !== "undefined") {
          document.cookie = "sb-mock-session=active; path=/;";
        }
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
        if (typeof document !== "undefined") {
          document.cookie = "sb-mock-session=; path=/; max-age=0;";
        }
        return { error: null };
      }
    };
  }

  from() {
    return {
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          single: () => Promise.resolve({ data: {}, error: null })
        }),
        order: () => Promise.resolve({ data: [], error: null })
      })
    };
  }
}

export function createClient() {
  if (supabaseUrl.includes("placeholder-url") || supabaseAnonKey.includes("placeholder")) {
    return new MockBrowserClient() as unknown as ReturnType<typeof createBrowserClient>;
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
