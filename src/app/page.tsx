import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProductSection from "@/components/ProductSection";
import HetCalculator from "@/components/HetCalculator";
import ProcedureSection from "@/components/ProcedureSection";
import FaqSection from "@/components/FaqSection";
import NewsHighlight from "@/components/NewsHighlight";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import {
  getCompany,
  getFaqs,
  getFertilizers,
  getNews,
  getPrinciples,
  getProcedures,
  getSiteTexts,
} from "@/lib/data";
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

export default async function HomePage() {
  const [company, fertilizers, procedures, faqs, principles, news, texts] = await Promise.all([
    getCompany(),
    getFertilizers(),
    getProcedures(),
    getFaqs(),
    getPrinciples(),
    getNews(),
    getSiteTexts(),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar company={company ?? FALLBACK_COMPANY} texts={texts} />
      <main className="flex-1">
        <HeroSection company={company ?? FALLBACK_COMPANY} fertilizers={fertilizers} texts={texts} />
        <AboutSection company={company ?? FALLBACK_COMPANY} principles={principles} texts={texts} />
        <NewsHighlight news={news} texts={texts} />
        <ProductSection fertilizers={fertilizers} texts={texts} />
        <HetCalculator fertilizers={fertilizers} texts={texts} />
        <ProcedureSection procedures={procedures} texts={texts} />
        <FaqSection faqs={faqs} texts={texts} />
        <ContactSection company={company ?? FALLBACK_COMPANY} texts={texts} />
      </main>
      <Footer company={company ?? FALLBACK_COMPANY} texts={texts} />
    </div>
  );
}
