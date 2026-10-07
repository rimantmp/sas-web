import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

// Barlow: road-sign grotesk, stays legible on small screens in bright light.
const body = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

// Barlow Condensed heavy italic echoes the slanted, heavy SAS logotype.
const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  style: ["italic", "normal"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CV Subur Anugerah Sejahtera | Distributor Pupuk Bersubsidi",
  description:
    "CV Subur Anugerah Sejahtera menyalurkan pupuk bersubsidi (Urea dan NPK Phonska) ke kios resmi untuk petani terdaftar e-RDKK, dengan harga sesuai HET pemerintah. Cek HET, hitung biaya tebus, dan pelajari cara menebus pupuk.",
  icons: { icon: "/logo-sas.png" },
  openGraph: {
    title: "CV Subur Anugerah Sejahtera | Distributor Pupuk Bersubsidi",
    description: "Cek HET pupuk bersubsidi, hitung biaya tebus, dan pelajari cara menebus pupuk dengan e-KTP.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${body.variable} ${display.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
