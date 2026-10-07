"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { company } from "@/lib/company";

const links = [
  { label: "Tentang", href: "#tentang" },
  { label: "Produk & HET", href: "#harga" },
  { label: "Kalkulator", href: "#kalkulator" },
  { label: "Cara menebus", href: "#cara-tebus" },
  { label: "Tanya jawab", href: "#faq" },
  { label: "Kontak", href: "#kontak" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-3" aria-label={`${company.name}, ke atas halaman`}>
          <Image src="/logo-sas.png" alt="" width={51} height={40} priority className="h-10 w-auto" />
          <span className="hidden font-heading text-lg font-bold leading-tight text-ink sm:block">
            Subur Anugerah Sejahtera
          </span>
        </a>

        <nav aria-label="Navigasi utama" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-md px-3 py-2 text-[0.95rem] font-medium text-ink-soft transition-colors hover:bg-paper hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#kalkulator"
            className="hidden min-h-11 items-center rounded-md bg-sas-red px-4 text-[0.95rem] font-semibold text-white transition-colors hover:bg-sas-red-dark sm:inline-flex"
          >
            Hitung biaya tebus
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-hp"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink hover:bg-paper lg:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-hp" aria-label="Navigasi utama" className="border-t border-line bg-white lg:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center border-b border-line/70 text-base font-medium text-ink last:border-0"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="py-3 sm:hidden">
              <a
                href="#kalkulator"
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-center rounded-md bg-sas-red font-semibold text-white"
              >
                Hitung biaya tebus
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
