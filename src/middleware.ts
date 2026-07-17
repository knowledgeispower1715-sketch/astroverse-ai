import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // Paths requiring authentication
  const isPrivateRoute = [
    "/dashboard",
    "/birth-chart",
    "/horoscope",
    "/compatibility",
    "/transit",
    "/tarot",
    "/settings",
    "/kundli",
    "/panchang",
    "/numerology",
    "/remedies",
    "/gemstones",
    "/admin",
  ].some((route) => pathname === route || pathname.startsWith(route + "/"));

  // Paths representing login/register screens
  const isAuthRoute = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ].some((route) => pathname === route || pathname.startsWith(route + "/"));

  if (isPrivateRoute) {
    if (!user) {
      // Redirect unauthenticated user to login screen
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Role-based verification for /admin path names
    if (pathname.startsWith("/admin")) {
      const role = user.app_metadata?.role || user.user_metadata?.role;
      if (role !== "admin") {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/dashboard";
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  if (isAuthRoute && user) {
    // Redirect authenticated users away from login/register to dashboard
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, SVGs)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
