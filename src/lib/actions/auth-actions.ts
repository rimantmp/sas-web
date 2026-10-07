"use server";

import { createClient } from "../supabase/server";
import { getServiceRoleClient } from "../supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

/**
 * Sign up admin pertama. Dilindungi env ADMIN_SIGNUP_KEY supaya halaman
 * /admin/signup tidak terbuka untuk umum. Setelah admin pertama dibuat,
 * value ADMIN_SIGNUP_KEY bisa dihapus dari .env sehingga signup mati.
 */
export async function signUpAdmin(formData: FormData) {
  const envKey = process.env.ADMIN_SIGNUP_KEY;
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const key = String(formData.get("key") ?? "");

  if (!envKey) {
    return { error: "Pendaftaran admin ditutup. Hubungi pemilik situs." };
  }
  if (key !== envKey) {
    return { error: "Kode pendaftaran salah." };
  }
  if (!email || password.length < 8) {
    return { error: "Email dan password minimal 8 karakter wajib diisi." };
  }

  // Daftarkan user ke auth.users lewat klien anon (cookie sesi).
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error?.message) return { error: error.message };
  if (!data.user) return { error: "Pendaftaran gagal." };

  // Catat sebagai admin.
  const adminDb = getServiceRoleClient();
  const { error: insErr } = await adminDb
    .from("admins")
    .insert({ user_id: data.user.id });
  if (insErr) return { error: "Gagal mencatat admin: " + insErr.message };

  redirect("/admin");
}

/** Login memakai email/password. */
export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email atau password salah." };
  redirect(next.startsWith("/admin") ? next : "/admin");
}

/** Logout: cabut sesi. */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
