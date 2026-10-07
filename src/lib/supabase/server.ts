import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseDb } from "../types";

function env(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY"): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Env ${name} belum diisi. Lihat .env.example.`);
  }
  return value;
}

/** True bila env publik Supabase sudah diisi (dev tanpa DB tetap jalan). */
export function supabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * Klien SSR dengan cookies sesi: dipakai di proxy.ts, layout admin,
 * server component publik, dan server action untuk cek identitas user.
 * setAll menulis cookie saat event auth (SIGNED_IN, TOKEN_REFRESHED, ...)
 * supaya sesi dari server action login tersimpan di browser. Dalam server
 * component penulisan cookie ditolak Next.js: ditangkap try/catch, dan
 * proxy.ts menulis ulang cookie refresh di request navigasi berikutnya.
 */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<SupabaseDb>(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Dipanggil dari server component: biarkan proxy.ts menulis.
          }
        },
      },
    },
  );
}
