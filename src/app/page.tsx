import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProductSection from "@/components/ProductSection";
import HetCalculator from "@/components/HetCalculator";
import ProcedureSection from "@/components/ProcedureSection";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ProductSection />
        <HetCalculator />
        <ProcedureSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
