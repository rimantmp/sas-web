import { getPageViews } from "@/lib/data";

export const metadata = { title: "Statistik | SAS Admin" };

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const views = await getPageViews();
  const total = views.reduce((sum, v) => sum + v.views, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="display text-4xl text-ink">Statistik kunjungan</h1>
        <p className="mt-1 text-ink-soft">Jumlah kunjungan per halaman dalam 24 jam terakhir per pengunjung unik (cookie).</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-line bg-white p-5">
          <p className="text-sm font-medium text-ink-soft">Total kunjungan tercatat</p>
          <p className="display mt-1 text-4xl text-sas-red tabular-nums">{total}</p>
        </div>
        <div className="rounded-lg border border-line bg-white p-5">
          <p className="text-sm font-medium text-ink-soft">Jumlah halaman yang dipantau</p>
          <p className="display mt-1 text-4xl text-sas-red tabular-nums">{views.length}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-semibold">Halaman</th>
              <th className="px-4 py-3 text-right font-semibold">Kunjungan</th>
              <th className="px-4 py-3 text-right font-semibold">Terakhir dihitung</th>
            </tr>
          </thead>
          <tbody>
            {views.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-10 text-center text-ink-soft">Belum ada data kunjungan.</td></tr>
            )}
            {views.map((v) => (
              <tr key={v.page} className="border-t border-line">
                <td className="px-4 py-3 text-ink">{v.page === "/" ? "Beranda (/)" : v.page}</td>
                <td className="px-4 py-3 text-right tabular-nums text-ink">{v.views}</td>
                <td className="px-4 py-3 text-right text-ink-soft">
                  {new Date(v.last_updated).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
