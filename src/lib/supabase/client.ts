import { createBrowserClient } from "@supabase/ssr";

/** Klien Supabase browser (anon key). Jangan pernah taruh service_role key di sini. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
