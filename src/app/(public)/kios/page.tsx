import { getKiosks } from "@/lib/data";
import { MapPin, Phone } from "lucide-react";

export const metadata = { title: "Kios Resmi | CV Subur Anugerah Sejahtera" };
export const dynamic = "force-dynamic";

export default async function KiosPage() {
  const kiosks = await getKiosks();

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="display text-5xl text-ink">Kios pupuk resmi</h1>
      <p className="mt-2 text-ink-soft">
        Daftar kios yang terdaftar di wilayah kerja kami.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {kiosks.length === 0 && (
          <p className="md:col-span-2 rounded-lg border border-dashed border-line bg-paper px-4 py-10 text-center text-ink-soft">
            Daftar kios sedang diperbarui.
          </p>
        )}
        {kiosks.map((k) => (
          <div key={k.id} className="rounded-lg border border-line bg-white p-5">
            <h2 className="font-heading text-xl font-bold text-ink">{k.name}</h2>
            <dl className="mt-4 space-y-2 text-ink-soft">
              {k.address && (
                <div className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sas-red" aria-hidden="true" />
                  <span>{[k.address, k.village, k.district].filter(Boolean).join(", ")}</span>
                </div>
              )}
              {k.phone && (
                <div className="flex gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sas-red" aria-hidden="true" />
                  <a href={`tel:${k.phone.replace(/\s|-/g, "")}`} className="underline underline-offset-4">
                    {k.phone}
                  </a>
                </div>
              )}
            </dl>
          </div>
        ))}
      </div>
    </main>
  );
}
