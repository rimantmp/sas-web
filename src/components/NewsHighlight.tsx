import Link from "next/link";
import SectionHeading from "./SectionHeading";
import type { NewsArticle } from "@/lib/types";

type Props = {
  news: NewsArticle[];
  texts: Record<string, string>;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

// Tiga berita terbaru di landing, antara FAQ dan Kontak.
export default function NewsHighlight({ news, texts }: Props) {
  const items = news.slice(0, 3);
  if (items.length === 0) return null;

  return (
    <section id="berita" aria-labelledby="berita-judul" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="berita-judul"
            index="02"
            title="Berita terbaru"
            intro="Pengumuman resmi terkini dari kami."
          />
          <Link
            href="/berita"
            className="inline-flex min-h-11 items-center rounded-md border-2 border-ink px-5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
          >
            Lihat semua berita
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((n) => (
            <Link
              key={n.id}
              href={`/berita/${n.id}`}
              className="group flex flex-col rounded-lg border border-line bg-white p-5 transition-colors hover:border-sas-red"
            >
              {n.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={n.image_url} alt="" className="mb-4 h-36 w-full rounded-md object-cover" />
              )}
              <p className="text-sm text-ink-soft">{fmtDate(n.created_at)}</p>
              <h3 className="mt-1 font-heading text-xl font-bold text-ink group-hover:text-sas-red">
                {n.title}
              </h3>
              {n.body && <p className="mt-2 line-clamp-3 text-ink-soft">{n.body}</p>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
