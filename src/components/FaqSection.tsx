"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionHeading from "./SectionHeading";

const faqs = [
  {
    q: "Siapa yang berhak menebus pupuk bersubsidi?",
    a: "Petani yang tergabung dalam kelompok tani, tercatat di e-RDKK, dan menanam komoditas yang ditetapkan pemerintah, dengan batas luas lahan sesuai aturan yang berlaku. Jatah setiap petani tercatat dalam alokasi e-RDKK.",
  },
  {
    q: "Apakah cukup membawa e-KTP?",
    a: "Ya. Petugas kios memindai NIK di aplikasi i-Pubers untuk melihat jatah Anda. Jika diwakilkan, bawa surat kuasa dan Kartu Keluarga.",
  },
  {
    q: "Kios meminta biaya tambahan atau menyuruh membeli produk lain. Bolehkah?",
    a: "Tidak boleh. HET sudah mencakup semua biaya sampai di kios. Biaya tambahan, harga di atas HET, atau paket wajib adalah pelanggaran. Laporkan nama kios, tanggal, dan bukti transaksi kepada kami.",
  },
  {
    q: "Nama saya tidak muncul di i-Pubers. Apa yang harus dilakukan?",
    a: "Hubungi ketua kelompok tani dan penyuluh pertanian (PPL) di BPP kecamatan untuk memeriksa data e-RDKK Anda. Distributor dan kios tidak bisa menambah nama ke e-RDKK.",
  },
  {
    q: "Pupuk di kios kosong saat musim pemupukan. Ke mana melapor?",
    a: "Sampaikan kepada kami lewat formulir kontak di bawah, sebutkan nama kios dan desa. Kami akan memeriksa jadwal pengiriman ke kios tersebut.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" aria-labelledby="faq-judul" className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:gap-16 lg:py-28">
        <SectionHeading id="faq-judul" index="05" title="Pertanyaan yang sering kami terima" />
        <ul className="border-t-2 border-ink">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left text-lg font-semibold text-ink hover:text-sas-red"
                  >
                    {item.q}
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-5 w-5 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  hidden={!isOpen}
                  className="pb-5 pr-8 text-ink-soft"
                >
                  {item.a}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
