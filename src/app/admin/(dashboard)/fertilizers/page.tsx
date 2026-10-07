import { getFertilizers } from "@/lib/data";
import { FertilizerManager } from "@/components/admin/FertilizerManager";

export const metadata = { title: "Pupuk & HET | SAS Admin" };

export const dynamic = "force-dynamic";

export default async function FertilizersPage() {
  const fertilizers = await getFertilizers();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="display text-4xl text-ink">Pupuk & HET</h1>
        <p className="mt-1 text-ink-soft">Kelola daftar pupuk, harga per kg, dan ukuran sak.</p>
      </div>
      <FertilizerManager initial={fertilizers} />
    </div>
  );
}
