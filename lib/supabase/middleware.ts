import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { MockSupabaseClient } from "./mock-client";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (supabaseUrl.includes("placeholder-url") || supabaseAnonKey.includes("placeholder")) {
    const mockClient = new MockSupabaseClient({
      get: (name: string) => request.cookies.get(name),
      set: (name: string, value: string, options?: Record<string, unknown>) => {
        request.cookies.set(name, value);
        supabaseResponse.cookies.set(name, value, options as any);
      }
    });
    const { data: { user } } = await mockClient.auth.getUser();
    return { supabaseResponse, user: user as any };
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh token session if required
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabaseResponse, user };
}
