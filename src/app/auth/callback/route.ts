import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // Check if user has birth profile; if not, redirect to onboarding
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("birth_profiles")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle();

          if (!profile) {
            return NextResponse.redirect(new URL("/onboarding", request.url));
          }
        }
        return NextResponse.redirect(new URL(next, request.url));
      }
    } catch (err) {
      console.error("Auth callback error:", err);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(new URL("/login?error=oauth_callback_failed", request.url));
}
