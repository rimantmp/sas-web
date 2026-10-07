import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 jam

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { page?: string };
  const page = typeof body.page === "string" ? body.page : "/";

  const cookieStore = await cookies();

  // Dedup 24 jam per halaman lewat cookie.
  let visited: string[] = [];
  try {
    const raw = cookieStore.get("sas_visited")?.value;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) visited = parsed;
    }
  } catch {
    visited = [];
  }
  if (visited.includes(page)) {
    return NextResponse.json({ ok: true, counted: false });
  }
  try {
    cookieStore.set("sas_visited", JSON.stringify([...visited, page]), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
  } catch {
    // Cookie tidak bisa ditulis di lingkungan ini; tetap lanjut mencatat.
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ ok: true, counted: false });
  }

  try {
    const supabase = createServiceClient(url, key, { auth: { persistSession: false } });
    await supabase.rpc("track_page_view", { p_page: page });
    return NextResponse.json({ ok: true, counted: true });
  } catch {
    return NextResponse.json({ ok: true, counted: false });
  }
}
