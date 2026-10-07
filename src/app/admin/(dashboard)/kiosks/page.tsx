import { getKiosks } from "@/lib/data";
import { KioskManager } from "@/components/admin/KioskManager";

export const metadata = { title: "Kios | SAS Admin" };

export const dynamic = "force-dynamic";

export default async function KiosksPage() {
  const kiosks = await getKiosks();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="display text-4xl text-ink">Kios resmi</h1>
        <p className="mt-1 text-ink-soft">Kelola daftar kios resmi yang tampil di halaman publik /kios.</p>
      </div>
      <KioskManager initial={kiosks} />
    </div>
  );
}
