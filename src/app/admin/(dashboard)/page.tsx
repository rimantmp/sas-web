import Link from "next/link";
import { getFertilizers, getNews, getKiosks } from "@/lib/data";

export const metadata = { title: "Dashboard | SAS Admin" };

export default async function DashboardPage() {
  const [fertilizers, news, kiosks] = await Promise.all([
    getFertilizers(),
    getNews(),
    getKiosks(),
  ]);

  const stats = [
    { label: "Pupuk aktif", value: String(fertilizers.length), href: "/admin/fertilizers" },
    { label: "Berita terbit", value: String(news.length), href: "/admin/news" },
    { label: "Kios aktif", value: String(kiosks.length), href: "/admin/kiosks" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="display text-4xl text-ink">Dashboard</h1>
        <p className="mt-1 text-ink-soft">Ringkasan isi situs. Pilih menu di kiri untuk mengubah konten.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.href} href={s.href}
            className="rounded-lg border border-line bg-white p-5 transition-colors hover:border-sas-red">
            <p className="text-sm font-medium text-ink-soft">{s.label}</p>
            <p className="display mt-1 text-4xl text-sas-red tabular-nums">{s.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
