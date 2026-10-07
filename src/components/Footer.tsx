import Image from "next/image";
import { company, isFilled } from "@/lib/company";
import { Placeholder } from "./SectionHeading";

const links = [
  { label: "Tentang kami", href: "#tentang" },
  { label: "Produk & HET", href: "#harga" },
  { label: "Kalkulator tebus", href: "#kalkulator" },
  { label: "Cara menebus pupuk", href: "#cara-tebus" },
  { label: "Tanya jawab", href: "#faq" },
  { label: "Kontak", href: "#kontak" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr] lg:gap-14 pb-12 border-b border-line">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/logo-sas.png" alt="" width={46} height={36} className="h-9 w-auto" />
              <div>
                <p className="font-heading text-xl font-bold leading-none text-ink">
                  {company.name}
                </p>
                <p className="mt-1 text-sm font-semibold text-sas-red">
                  Distributor pupuk bersubsidi
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-ink-soft leading-relaxed max-w-sm">
              Menyalurkan pupuk bersubsidi pemerintah kepada kios pupuk resmi untuk melayani petani terdaftar e-RDKK dengan prinsip enam tepat.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-lg font-bold text-ink mb-4">Navigasi</h3>
            <ul className="space-y-2.5 text-sm">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-ink-soft hover:text-sas-red transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-bold text-ink mb-4">Pengawasan & Aturan</h3>
            <p className="text-sm text-ink-soft leading-relaxed">
              Pupuk bersubsidi adalah barang dalam pengawasan. Penjualan di atas HET atau penyelewengan alokasi merupakan pelanggaran hukum yang diawasi oleh KP3 dan dinas terkait.
            </p>
            <div className="mt-4 text-sm">
              <span className="font-semibold text-ink block">Kontak layanan:</span>
              {isFilled(company.phoneDisplay) ? (
                <a href={`tel:${company.phoneDisplay.replace(/\s|-/g, "")}`} className="text-sas-red font-medium">
                  {company.phoneDisplay}
                </a>
              ) : (
                <Placeholder>{company.phoneDisplay}</Placeholder>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-soft">
          <p>
            (c) {new Date().getFullYear()} {company.name}. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <a href="#top" className="font-semibold text-ink hover:text-sas-red transition-colors">
            Kembali ke atas
          </a>
        </div>
      </div>
    </footer>
  );
}
