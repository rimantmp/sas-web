import SectionHeading from "./SectionHeading";
import { fertilizers, rupiah } from "@/lib/company";

export default function ProductSection() {
  return (
    <section id="harga" aria-labelledby="harga-judul" className="border-t border-line bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <SectionHeading
          id="harga-judul"
          index="02"
          title="Pupuk yang kami salurkan"
          intro="Semua pupuk berasal dari produsen resmi, dalam kemasan bersegel bertanda subsidi. Harga di bawah adalah batas tertinggi di kios."
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
              {fertilizers.map((f) => (
                <tr key={f.id} className="border-t border-line align-top">
                  <th scope="row" className="px-5 py-5">
                    <span className="block font-heading text-xl font-bold text-ink">{f.name}</span>
                    <span className="text-sm font-normal text-ink-soft">Sak {f.bagKg} kg</span>
                  </th>
                  <td className="max-w-md px-5 py-5 text-ink-soft">
                    <p>{f.content}</p>
                    <p className="mt-1">{f.use}</p>
                  </td>
                  <td className="px-5 py-5 text-right tabular-nums text-ink">{rupiah(f.pricePerKg)}</td>
                  <td className="px-5 py-5 text-right">
                    <span className="font-heading text-2xl font-bold text-sas-red tabular-nums">
                      {rupiah(f.pricePerKg * f.bagKg)}
                    </span>
                  </td>
                </tr>
              ))}
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
                  {rupiah(f.pricePerKg * f.bagKg)}
                </span>
              </div>
              <p className="text-sm text-ink-soft">
                Sak {f.bagKg} kg, {rupiah(f.pricePerKg)}/kg
              </p>
              <p className="mt-2 text-ink-soft">{f.content}</p>
              <p className="mt-1 text-ink-soft">{f.use}</p>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-3xl text-ink-soft">
          Pupuk bersubsidi adalah barang dalam pengawasan pemerintah. Pupuk ini hanya boleh dijual kepada petani yang
          terdaftar di e-RDKK, sesuai alokasi masing-masing, dan tidak boleh dijual bebas.
        </p>
      </div>
    </section>
  );
}
