import { requireAdmin } from "@/lib/auth";
import { supabaseConfigured } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!supabaseConfigured()) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24">
        <h1 className="display text-4xl text-ink">Konfigurasi belum lengkap</h1>
        <p className="mt-3 text-ink-soft">
          Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local
          (lihat .env.example), lalu jalankan ulang server.
        </p>
      </div>
    );
  }

  await requireAdmin();

  return <AdminShell>{children}</AdminShell>;
}
