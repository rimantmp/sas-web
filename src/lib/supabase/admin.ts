import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseDb } from "../types";

let cached:
  | ReturnType<typeof createSupabaseClient<SupabaseDb>>
  | undefined;

/**
 * Klien service_role untuk mutasi data dari server action.
 * BYPASSRLS. Setiap pemakai wajib memanggil getAdminOrNull() dulu.
 * Tidak pernah dipakai di browser.
 */
export function getServiceRoleClient() {
  if (!cached) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("Env Supabase service role belum diisi. Lihat .env.example.");
    }
    cached = createSupabaseClient<SupabaseDb>(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return cached;
}
