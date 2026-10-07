import Link from "next/link";
import { getNews } from "@/lib/data";

export const metadata = { title: "Berita | CV Subur Anugerah Sejahtera" };
export const dynamic = "force-dynamic";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

export default async function BeritaPage() {
  const news = await getNews();

  return (
    <>
      <section id="top" className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <p className="font-semibold text-sas-red">CV Subur Anugerah Sejahtera, distributor pupuk bersubsidi</p>
          <h1 className="display mt-3 max-w-2xl text-5xl text-ink sm:text-6xl">
            Berita dan pengumuman
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-soft">
            Pengumuman resmi tentang penyaluran pupuk, jadwal kiriman ke kios, dan kabar penting lain untuk petani serta kios resmi.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {news.length === 0 && (
            <p className="md:col-span-2 rounded-lg border border-dashed border-line bg-paper px-4 py-10 text-center text-ink-soft">
              Belum ada berita. Cek kembali nanti.
            </p>
          )}
          {news.map((n) => (
            <Link
              key={n.id}
              href={`/berita/${n.id}`}
              className="group rounded-lg border border-line bg-white p-5 transition-colors hover:border-sas-red"
            >
              {n.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={n.image_url}
                  alt=""
                  className="mb-4 h-44 w-full rounded-md object-cover"
                />
              )}
              <p className="text-sm text-ink-soft">{fmtDate(n.created_at)}</p>
              <h2 className="font-heading text-2xl font-bold text-ink group-hover:text-sas-red">
                {n.title}
              </h2>
              {n.body && <p className="mt-2 line-clamp-3 text-ink-soft">{n.body}</p>}
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
