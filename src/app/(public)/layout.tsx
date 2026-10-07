import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCompany, getSiteTexts } from "@/lib/data";
import type { Company } from "@/lib/types";

export const dynamic = "force-dynamic";

const FALLBACK_COMPANY: Company = {
  id: 1,
  name: "CV Subur Anugerah Sejahtera",
  short: "SAS",
  address: "[ALAMAT KANTOR / GUDANG]",
  phone: "[NOMOR TELEPON]",
  email: "[EMAIL]",
  hours: "[JAM LAYANAN]",
  area: "[WILAYAH KERJA]",
  whatsapp: "[NOMOR WHATSAPP]",
  updated_at: "",
};

/**
 * Cangkang halaman publik: Navbar + Footer untuk /berita, /berita/[id],
 * dan /kios. Landing page (src/app/page.tsx) menyusun Navbar/Footer-nya
 * sendiri karena menyisipkan section di antara keduanya.
 */
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [company, texts] = await Promise.all([getCompany(), getSiteTexts()]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar company={company ?? FALLBACK_COMPANY} texts={texts} />
      <main className="flex-1">{children}</main>
      <Footer company={company ?? FALLBACK_COMPANY} texts={texts} />
    </div>
  );
}
