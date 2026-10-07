import { createClient } from "./supabase/server";
import { redirect } from "next/navigation";

/**
 * Otorisasi admin.
 * - requireAdmin(): untuk layout / server component. Redirect ke login
 *   bila tidak berhak.
 * - getAdminOrNull(): untuk server action. Null bila bukan admin, supaya
 *   action bisa menolak dengan error yang bisa ditampilkan.
 */

async function currentUserIsAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;

  const { data: row } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  return row ? data.user : null;
}

/** Redirect ke /admin/login bila belum login; tampilkan pesan bila
 * login tapi tidak tercatat di tabel admins. Redirect balik ke login
 * saat sudah punya sesi akan memicu loop (proxy melempar user login
 * di halaman auth kembali ke /admin). */
export async function requireAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/admin/login");

  const admin = await currentUserIsAdmin();
  if (!admin) {
    throw new Error(
      "Akun ini tidak terdaftar sebagai admin. Hubungi pemilik situs.",
    );
  }
  return admin;
}

/** Null bila bukan admin (untuk server action). */
export async function getAdminOrNull() {
  return currentUserIsAdmin();
}
