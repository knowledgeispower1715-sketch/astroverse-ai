import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BlogService } from "@/lib/db/services/blog-service";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const blogService = new BlogService(supabase);
  const { data, error } = await blogService.getFavorites(user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const blogService = new BlogService(supabase);
    const { data, error } = await blogService.addFavorite(user.id, body.favorite_type, body.favorite_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid payload body" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const favoriteType = searchParams.get("favorite_type") as "chart" | "blog" | "prediction";
    const favoriteId = searchParams.get("favorite_id");

    if (!favoriteType || !favoriteId) {
      return NextResponse.json({ error: "Missing required search parameters" }, { status: 400 });
    }

    const blogService = new BlogService(supabase);
    const { data, error } = await blogService.removeFavorite(user.id, favoriteType, favoriteId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }
}
