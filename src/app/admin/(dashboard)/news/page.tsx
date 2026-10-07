import { getNews } from "@/lib/data";
import { NewsManager } from "@/components/admin/NewsManager";

export const metadata = { title: "Berita | SAS Admin" };

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const news = await getNews();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="display text-4xl text-ink">Berita</h1>
        <p className="mt-1 text-ink-soft">Kelola berita dan pengumuman di halaman publik /berita.</p>
      </div>
      <NewsManager initial={news} />
    </div>
  );
}
