"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import type { Company } from "@/lib/types";

type Link = { label: string; href: string };

function parseLinks(raw: string | undefined): Link[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x) => x && typeof x.href === "string" && typeof x.label === "string")
      : [];
  } catch {
    return [];
  }
}

type Props = {
  company: Company;
  texts: Record<string, string>;
};

export default function Navbar({ company, texts }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = parseLinks(texts.nav_links);
  const defaultLinks: Link[] = [
    { label: "Tentang", href: "/#tentang" },
    { label: "Berita", href: "/berita" },
    { label: "Produk & HET", href: "/#harga" },
    { label: "Kalkulator", href: "/#kalkulator" },
    { label: "Cara menebus", href: "/#cara-tebus" },
    { label: "Tanya jawab", href: "/#faq" },
    { label: "Kontak", href: "/#kontak" },
  ];
  const navLinks = links.length ? links : defaultLinks;
  const ctaHref = texts.nav_cta_href || "/#kalkulator";
  const ctaLabel = texts.nav_cta || "Hitung biaya tebus";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="/" className="flex items-center gap-3" aria-label={`${company.name}, ke halaman utama`}>
          <Image src="/logo-sas.png" alt="" width={51} height={40} priority className="h-10 w-auto" />
          <span className="hidden font-heading text-lg font-bold leading-tight text-ink sm:block">
            Subur Anugerah Sejahtera
          </span>
        </a>

        <nav aria-label="Navigasi utama" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.href + l.label}>
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
            href={ctaHref}
            className="hidden min-h-11 items-center rounded-md bg-sas-red px-4 text-[0.95rem] font-semibold text-white transition-colors hover:bg-sas-red-dark sm:inline-flex"
          >
            {ctaLabel}
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
            {navLinks.map((l) => (
              <li key={l.href + l.label}>
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
                href={ctaHref}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-center rounded-md bg-sas-red font-semibold text-white"
              >
                {ctaLabel}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
