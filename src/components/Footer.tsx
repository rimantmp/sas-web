import Image from "next/image";
import type { Company } from "@/lib/types";
import { isFilled } from "@/lib/types";
import { Placeholder } from "./SectionHeading";

type Link = { label: string; href: string };

function parseLinks(raw: string | undefined): Link[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => x && typeof x.href === "string") : [];
  } catch {
    return [];
  }
}

type Props = {
  company: Company;
  texts: Record<string, string>;
};

export default function Footer({ company, texts }: Props) {
  const footerLinks = parseLinks(texts.footer_links);
  const defaultFooterLinks: Link[] = [
    { label: "Tentang kami", href: "/#tentang" },
    { label: "Berita", href: "/berita" },
    { label: "Produk & HET", href: "/#harga" },
    { label: "Kalkulator tebus", href: "/#kalkulator" },
    { label: "Cara menebus pupuk", href: "/#cara-tebus" },
    { label: "Tanya jawab", href: "/#faq" },
    { label: "Kios resmi", href: "/kios" },
    { label: "Kontak", href: "/#kontak" },
  ];
  const links = footerLinks.length ? footerLinks : defaultFooterLinks;

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
              {texts.footer_about ||
                "Menyalurkan pupuk bersubsidi pemerintah kepada kios pupuk resmi untuk melayani petani terdaftar e-RDKK dengan prinsip enam tepat."}
            </p>
          </div>

          <div>
            <h3 className="font-heading text-lg font-bold text-ink mb-4">
              {texts.footer_nav_title || "Navigasi"}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {links.map((l) => (
                <li key={l.href + l.label}>
                  <a href={l.href} className="text-ink-soft hover:text-sas-red transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-bold text-ink mb-4">
              {texts.footer_watch_title || "Pengawasan & Aturan"}
            </h3>
            <p className="text-sm text-ink-soft leading-relaxed">
              {texts.footer_watch_text ||
                "Pupuk bersubsidi adalah barang dalam pengawasan. Penjualan di atas HET atau penyelewengan alokasi merupakan pelanggaran hukum yang diawasi oleh KP3 dan dinas terkait."}
            </p>
            <div className="mt-4 text-sm">
              <span className="font-semibold text-ink block">{texts.footer_contact_label || "Kontak layanan:"}</span>
              {isFilled(company.phone) ? (
                <a href={`tel:${company.phone.replace(/\s|-/g, "")}`} className="text-sas-red font-medium">
                  {company.phone}
                </a>
              ) : (
                <Placeholder>{company.phone}</Placeholder>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-soft">
          <p>
            (c) {new Date().getFullYear()} {company.name}. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <a href="/#top" className="font-semibold text-ink hover:text-sas-red transition-colors">
            Kembali ke atas
          </a>
        </div>
      </div>
    </footer>
  );
}
