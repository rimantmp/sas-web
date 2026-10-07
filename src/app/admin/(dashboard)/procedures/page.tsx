import { getProcedures } from "@/lib/data";
import { ProcedureManager } from "@/components/admin/ProcedureManager";

export const metadata = { title: "Prosedur | SAS Admin" };

export const dynamic = "force-dynamic";

export default async function ProceduresPage() {
  const procedures = await getProcedures();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="display text-4xl text-ink">Prosedur penebusan</h1>
        <p className="mt-1 text-ink-soft">Urutan langkah cara menebus pupuk, tampil di bagian "Cara menebus".</p>
      </div>
      <ProcedureManager initial={procedures} />
    </div>
  );
}
