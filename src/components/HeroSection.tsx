import { rupiah } from "@/lib/types";
import type { Company, Fertilizer } from "@/lib/types";
import { Placeholder } from "./SectionHeading";
import DotField from "./DotField";

type Props = {
  company: Company;
  fertilizers: Fertilizer[];
  texts: Record<string, string>;
};

export default function HeroSection({ company, fertilizers, texts }: Props) {
  return (
    <section id="top" className="relative border-b border-line bg-paper">
      {/* Latar titik interaktif: identitas visual hero (permintaan pemilik),
          palet SAS. aria-hidden: murni dekoratif. */}
      <div className="absolute inset-0" aria-hidden="true">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={0}
          sparkle={false}
          waveAmplitude={0}
        />
      </div>
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14 lg:pb-24 lg:pt-20">
        <div>
          <p className="font-semibold text-sas-red">{company.name}, distributor pupuk bersubsidi</p>
          <h1 className="display mt-3 text-[2.6rem] text-ink sm:text-6xl lg:text-[4.25rem]">
            {texts.hero_title || "Pupuk bersubsidi sampai di kios, dengan harga sesuai HET."}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-soft">
            {texts.hero_sub ||
              "Kami menyalurkan pupuk Urea dan NPK Phonska bersubsidi dari produsen ke kios pupuk resmi, supaya petani yang terdaftar di e-RDKK bisa menebus tepat waktu dengan e-KTP."}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={texts.hero_cta_primary_href || "#kalkulator"}
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-sas-red px-6 text-base font-semibold text-white transition-colors hover:bg-sas-red-dark"
            >
              {texts.hero_cta_primary || "Hitung biaya tebus"}
            </a>
            <a
              href={texts.hero_cta_secondary_href || "#cara-tebus"}
              className="inline-flex min-h-12 items-center justify-center rounded-md border-2 border-ink px-6 text-base font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
            >
              {texts.hero_cta_secondary || "Cara menebus pupuk"}
            </a>
          </div>
        </div>

        {/* Focal point of the first screen: the official price board. One shadow marks it as the raised element. */}
        <div className="relative rounded-lg border border-line bg-white/85 p-5 shadow-[0_12px_32px_-16px_rgba(19,33,43,0.35)] backdrop-blur-sm sm:p-7">
          <div className="flex items-baseline justify-between gap-4 border-b-2 border-ink pb-3">
            <h2 className="font-heading text-2xl font-bold italic text-ink">
              {texts.hero_board_title || "HET per sak"}
            </h2>
            <span className="text-sm text-ink-soft">
              {texts.hero_board_caption || "Harga eceran tertinggi"}
            </span>
          </div>
          <ul>
            {fertilizers.length === 0 && (
              <li className="border-b border-line py-3.5 text-sm text-ink-soft">
                <Placeholder>Daftar pupuk belum diisi.</Placeholder>
              </li>
            )}
            {fertilizers.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-4 border-b border-line py-3.5 last:border-0">
                <div>
                  <p className="font-semibold text-ink">{f.short || f.name}</p>
                  <p className="text-sm text-ink-soft">
                    Sak {f.bag_kg} kg, {rupiah(Number(f.price_per_kg))}/kg
                  </p>
                </div>
                <span className="skew-tag shrink-0 bg-sas-red px-3 py-1">
                  <span className="font-heading text-xl font-bold text-white tabular-nums">
                    {rupiah(Number(f.price_per_kg) * Number(f.bag_kg))}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-soft">
            {texts.hero_board_foot ||
              "Acuan: Keputusan Menteri Pertanian tentang HET pupuk bersubsidi. Kios tidak boleh menjual di atas harga ini."}
          </p>
        </div>
      </div>
    </section>
  );
}
