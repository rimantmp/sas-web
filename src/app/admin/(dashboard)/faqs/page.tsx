import { getFaqs } from "@/lib/data";
import { FaqManager } from "@/components/admin/FaqManager";

export const metadata = { title: "FAQ | SAS Admin" };

export const dynamic = "force-dynamic";

export default async function FaqsPage() {
  const faqs = await getFaqs();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="display text-4xl text-ink">Tanya jawab</h1>
        <p className="mt-1 text-ink-soft">Kelola daftar pertanyaan dan jawaban di bagian FAQ.</p>
      </div>
      <FaqManager initial={faqs} />
    </div>
  );
}
