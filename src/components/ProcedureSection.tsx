import SectionHeading from "./SectionHeading";
import type { Procedure } from "@/lib/types";

type AsideItem = { t: string; d: string };

function parseAsideItems(raw: string | undefined): AsideItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

type Props = {
  procedures: Procedure[];
  texts: Record<string, string>;
};

export default function ProcedureSection({ procedures, texts }: Props) {
  const asideItems = parseAsideItems(texts.procedure_aside_items);
  const defaultAside: AsideItem[] = [
    { t: "e-KTP asli", d: "milik petani yang terdaftar." },
    { t: "surat kuasa dan Kartu Keluarga", d: "Jika diwakilkan anggota keluarga." },
    { t: "Uang sesuai HET", d: "Hitung dulu di kalkulator di atas." },
  ];

  return (
    <section id="cara-tebus" aria-labelledby="cara-judul" className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:gap-16 lg:py-28">
        <div>
          <SectionHeading id="cara-judul" index="05" title={texts.procedure_title || "Cara menebus pupuk bersubsidi"} />
          <ol className="mt-10">
            {procedures.length === 0 && (
              <p className="text-ink-soft">Langkah belum diisi. Isi lewat panel admin.</p>
            )}
            {procedures.map((s, i) => (
              <li key={s.step_number} className="relative flex gap-5 pb-9 last:pb-0">
                {i < procedures.length - 1 && (
                  <span className="absolute left-[1.15rem] top-11 bottom-1 w-0.5 bg-line" aria-hidden="true" />
                )}
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-ink font-heading text-xl font-bold text-ink"
                  aria-hidden="true"
                >
                  {s.step_number}
                </span>
                <div className="pt-1">
                  <h3 className="text-xl font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1.5 text-ink-soft">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside className="self-start rounded-lg border-2 border-ink p-6 lg:sticky lg:top-24 lg:mt-24">
          <h3 className="font-heading text-2xl font-bold italic text-ink">
            {texts.procedure_aside_title || "Yang perlu dibawa"}
          </h3>
          <ul className="mt-4 space-y-3 text-ink-soft">
            {(asideItems.length ? asideItems : defaultAside).map((item) => (
              <li key={item.t}>
                <strong className="text-ink">{item.t}</strong> {item.d}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-line pt-4 text-ink-soft">
            {texts.procedure_aside_note ||
              "Nama tidak muncul atau jatah tidak sesuai? Hubungi penyuluh pertanian (PPL) di BPP kecamatan, atau "}
            <a href="#kontak" className="font-semibold text-sas-red underline underline-offset-4">
              tanyakan ke kami
            </a>
          </p>
        </aside>
      </div>
    </section>
  );
}
