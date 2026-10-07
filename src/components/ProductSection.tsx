import SectionHeading from "./SectionHeading";
import { rupiah } from "@/lib/types";
import type { Fertilizer } from "@/lib/types";

type Props = {
  fertilizers: Fertilizer[];
  texts: Record<string, string>;
};

export default function ProductSection({ fertilizers, texts }: Props) {
  return (
    <section id="harga" aria-labelledby="harga-judul" className="border-t border-line bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <SectionHeading
          id="harga-judul"
          index="03"
          title={texts.pricing_title || "Pupuk yang kami salurkan"}
          intro={
            texts.pricing_intro ||
            "Semua pupuk berasal dari produsen resmi, dalam kemasan bersegel bertanda subsidi. Harga di bawah adalah batas tertinggi di kios."
          }
        />

        {/* Desktop: a real table, because farmers compare rows by price and pack size. */}
        <div className="mt-12 hidden overflow-hidden rounded-lg border border-line bg-white md:block">
          <table className="w-full text-left">
            <caption className="sr-only">Daftar pupuk bersubsidi dan harga eceran tertinggi</caption>
            <thead className="bg-ink text-white">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-semibold">Pupuk</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Kandungan dan kegunaan</th>
                <th scope="col" className="px-5 py-3.5 text-right font-semibold">HET per kg</th>
                <th scope="col" className="px-5 py-3.5 text-right font-semibold">HET per sak</th>
              </tr>
            </thead>
            <tbody>
              {fertilizers.length === 0 && (
                <tr className="border-t border-line">
                  <td colSpan={4} className="px-5 py-5 text-sm text-ink-soft">
                    Daftar pupuk belum diisi. Isi lewat panel admin.
                  </td>
                </tr>
              )}
              {fertilizers.map((f) => {
                const pricePerBag = Number(f.price_per_kg) * Number(f.bag_kg);
                return (
                  <tr key={f.id} className="border-t border-line align-top">
                    <th scope="row" className="px-5 py-5">
                      <span className="block font-heading text-xl font-bold text-ink">{f.name}</span>
                      <span className="text-sm font-normal text-ink-soft">Sak {f.bag_kg} kg</span>
                    </th>
                    <td className="max-w-md px-5 py-5 text-ink-soft">
                      <p>{f.content}</p>
                      <p className="mt-1">{f.usage}</p>
                    </td>
                    <td className="px-5 py-5 text-right tabular-nums text-ink">{rupiah(Number(f.price_per_kg))}</td>
                    <td className="px-5 py-5 text-right">
                      <span className="font-heading text-2xl font-bold text-sas-red tabular-nums">{rupiah(pricePerBag)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile: the same rows stacked, price first in each row. */}
        <ul className="mt-10 divide-y divide-line border-y border-line md:hidden">
          {fertilizers.map((f) => (
            <li key={f.id} className="py-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-heading text-xl font-bold text-ink">{f.name}</h3>
                <span className="font-heading text-xl font-bold text-sas-red tabular-nums">
                  {rupiah(Number(f.price_per_kg) * Number(f.bag_kg))}
                </span>
              </div>
              <p className="text-sm text-ink-soft">
                Sak {f.bag_kg} kg, {rupiah(Number(f.price_per_kg))}/kg
              </p>
              <p className="mt-2 text-ink-soft">{f.content}</p>
              <p className="mt-1 text-ink-soft">{f.usage}</p>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-3xl text-ink-soft">
          {texts.pricing_foot ||
            "Pupuk bersubsidi adalah barang dalam pengawasan pemerintah. Pupuk ini hanya boleh dijual kepada petani yang terdaftar di e-RDKK, sesuai alokasi masing-masing, dan tidak boleh dijual bebas."}
        </p>
      </div>
    </section>
  );
}
