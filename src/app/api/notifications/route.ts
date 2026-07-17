import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AstrologyService } from "@/lib/db/services/astrology-service";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const astroService = new AstrologyService(supabase);
  const { data, error } = await astroService.getNotifications(user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, data });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const astroService = new AstrologyService(supabase);
    const { data, error } = await astroService.markNotificationRead(body.id, user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid payload body" }, { status: 400 });
  }
}
