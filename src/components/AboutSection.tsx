import SectionHeading, { Placeholder } from "./SectionHeading";
import type { Company, Principle } from "@/lib/types";

type Props = {
  company: Company;
  principles: Principle[];
  texts: Record<string, string>;
};

export default function AboutSection({ company, principles, texts }: Props) {
  return (
    <section id="tentang" aria-labelledby="tentang-judul" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <SectionHeading id="tentang-judul" index="01" title={texts.about_title || "Tugas kami di rantai pupuk bersubsidi"} />
          <div className="space-y-5 text-lg text-ink-soft lg:pt-10">
            <p>
              {texts.about_p1 ||
                `Sebagai distributor, ${company.name} menerima pupuk bersubsidi dari produsen, menyimpannya di gudang, lalu mengirimkannya ke kios pupuk resmi di wilayah kerja kami. Dari kios itulah petani menebus pupuk.`}
            </p>
            <p>{texts.about_p2 || "Kami juga mencatat setiap penyaluran dan memastikan kios menjual sesuai HET."}</p>
            <dl className="grid gap-4 border-t border-line pt-5 text-base sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-ink">{texts.about_label_area || "Wilayah kerja"}</dt>
                <dd className="mt-1">
                  <Placeholder>{company.area}</Placeholder>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">{texts.about_label_address || "Kantor dan gudang"}</dt>
                <dd className="mt-1">
                  <Placeholder>{company.address}</Placeholder>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-20 border-t-2 border-ink pt-8">
          <h3 className="font-heading text-3xl font-bold italic text-ink">
            {texts.principles_heading || "Enam tepat yang kami pegang"}
          </h3>
          <p className="mt-2 max-w-2xl text-ink-soft">
            {texts.principles_intro ||
              "Prinsip penyaluran pupuk bersubsidi dari pemerintah. Kalau salah satunya tidak terpenuhi di kios, petani berhak melapor."}
          </p>
          <ol className="mt-8 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p, i) => (
              <li key={p.id} className="flex gap-4 border-b border-line py-5">
                <span className="display w-8 shrink-0 text-3xl text-sas-red tabular-nums" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-ink">{p.title}</p>
                  <p className="mt-1 text-ink-soft">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
