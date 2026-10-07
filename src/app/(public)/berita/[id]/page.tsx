import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sanitizeNewsHtml } from "@/lib/sanitize";
import type { NewsArticle } from "@/lib/types";

export const dynamic = "force-dynamic";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

export default async function BeritaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("news_articles")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  const article = data as unknown as NewsArticle | null;
  if (!article) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link href="/berita" className="text-sm font-semibold text-sas-red underline underline-offset-4 hover:text-sas-red-dark">
        Kembali ke berita
      </Link>

      <p className="mt-8 text-ink-soft">{fmtDate(article.created_at)}</p>
      <h1 className="display mt-1 text-5xl text-ink">{article.title}</h1>
      {article.author && <p className="mt-3 text-ink-soft">Oleh {article.author}</p>}

      {article.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.image_url} alt="" className="mt-8 w-full rounded-lg object-cover" />
      )}

      {article.body && article.body.trim() !== "" && (
        article.body.trim().startsWith("<") ? (
          // Body dari rich text editor (HTML): sudah disanitasi di server.
          <div
            className="mt-8 space-y-4 text-lg leading-relaxed text-ink-soft [&_h2]:font-heading [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-ink [&_h3]:font-heading [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-ink [&_p]:my-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-sas-red [&_a]:underline [&_a]:underline-offset-4"
            dangerouslySetInnerHTML={{ __html: sanitizeNewsHtml(article.body) }}
          />
        ) : (
          // Body polos dari entri lama (plain text): render apa adanya.
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-ink-soft whitespace-pre-wrap">
            {article.body}
          </div>
        )
      )}
    </main>
  );
}
