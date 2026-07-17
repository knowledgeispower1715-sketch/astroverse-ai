import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BlogService } from "@/lib/db/services/blog-service";

export async function GET() {
  const supabase = await createClient();
  const blogService = new BlogService(supabase);
  const { data, error } = await blogService.getBlogsList();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const blogService = new BlogService(supabase);
    const { data, error } = await blogService.createBlog(body);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid payload body" }, { status: 400 });
  }
}
