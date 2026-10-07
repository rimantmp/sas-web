"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionHeading from "./SectionHeading";
import type { Faq } from "@/lib/types";

type Props = {
  faqs: Faq[];
  texts: Record<string, string>;
};

export default function FaqSection({ faqs, texts }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" aria-labelledby="faq-judul" className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:gap-16 lg:py-28">
        <SectionHeading id="faq-judul" index="06" title={texts.faq_title || "Pertanyaan yang sering kami terima"} />
        {faqs.length === 0 ? (
          <p className="text-ink-soft">Belum ada tanya jawab. Pertanyaan bisa diajukan lewat formulir kontak.</p>
        ) : (
          <ul className="border-t-2 border-ink">
            {faqs.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.id} className="border-b border-line">
                  <h3>
                    <button
                      type="button"
                      id={`faq-q-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left text-lg font-semibold text-ink hover:text-sas-red"
                    >
                      {item.question}
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
                    {item.answer}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
