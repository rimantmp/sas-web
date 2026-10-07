"use client";

import { useId, useState } from "react";
import SectionHeading from "./SectionHeading";
import { rupiah } from "@/lib/types";
import type { Fertilizer } from "@/lib/types";

type Props = {
  fertilizers: Fertilizer[];
  texts: Record<string, string>;
};

const MAX_BAGS = 200;

export default function HetCalculator({ fertilizers, texts }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bagsInput, setBagsInput] = useState("2");
  const qtyId = useId();
  const errId = useId();

  // Kalkulator terlihat bila ada minimal satu pupuk aktif.
  if (fertilizers.length === 0) return null;

  const selected = fertilizers.find((x) => x.id === selectedId) ?? fertilizers[0];
  const f = selected;
  const bags = Number(bagsInput);
  const error =
    bagsInput.trim() === ""
      ? "Isi jumlah sak terlebih dahulu."
      : !Number.isInteger(bags) || bags < 1
        ? "Jumlah sak harus bilangan bulat, minimal 1."
        : bags > MAX_BAGS
          ? `Maksimal ${MAX_BAGS} sak per hitungan.`
          : null;

  const pricePerBag = Number(f.price_per_kg) * Number(f.bag_kg);
  const total = error ? null : bags * pricePerBag;

  const step = (delta: number) => {
    const current = Number.isInteger(bags) && bags > 0 ? bags : 0;
    setBagsInput(String(Math.min(MAX_BAGS, Math.max(1, current + delta))));
  };

  return (
    <section id="kalkulator" aria-labelledby="kalkulator-judul" className="bg-ink text-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <SectionHeading
          id="kalkulator-judul"
          index="04"
          tone="dark"
          title={texts.calculator_title || "Hitung biaya tebus sebelum ke kios"}
          intro={
            texts.calculator_intro ||
            "Pilih pupuk dan jumlah sak. Angka yang keluar adalah batas tertinggi yang boleh Anda bayar."
          }
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            <fieldset>
              <legend className="mb-3 font-semibold">Jenis pupuk</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {fertilizers.map((item) => (
                  <label
                    key={item.id}
                    className="flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-md border border-white/30 px-4 py-3 transition-colors hover:border-white has-[:checked]:border-white has-[:checked]:bg-white has-[:checked]:text-ink has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-sas-cyan"
                  >
                    <input
                      type="radio"
                      name="pupuk"
                      value={item.id}
                      checked={selectedId === item.id}
                      onChange={() => setSelectedId(item.id)}
                      className="sr-only"
                    />
                    <span className="font-semibold">{item.short || item.name}</span>
                    <span className="text-sm tabular-nums opacity-80">{rupiah(Number(item.price_per_kg))}/kg</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor={qtyId} className="mb-3 block font-semibold">
                Jumlah sak ({f.bag_kg} kg per sak)
              </label>
              <div className="flex items-stretch gap-2">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Kurangi satu sak"
                  className="h-12 w-12 rounded-md border border-white/40 text-2xl font-semibold hover:bg-white/10 focus-visible:outline-sas-cyan"
                >
                  −
                </button>
                <input
                  id={qtyId}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={MAX_BAGS}
                  value={bagsInput}
                  onChange={(e) => setBagsInput(e.target.value)}
                  aria-invalid={!!error}
                  aria-describedby={error ? errId : undefined}
                  className="h-12 w-28 rounded-md border border-white/40 bg-transparent text-center text-xl font-semibold tabular-nums text-white focus-visible:outline-sas-cyan aria-[invalid=true]:border-[#ff8a8f]"
                />
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Tambah satu sak"
                  className="h-12 w-12 rounded-md border border-white/40 text-2xl font-semibold hover:bg-white/10 focus-visible:outline-sas-cyan"
                >
                  +
                </button>
              </div>
              {error && (
                <p id={errId} role="alert" className="mt-2 text-[#ffb3b6]">
                  {error}
                </p>
              )}
            </div>
          </form>

          <div aria-live="polite" className="self-start">
            <dl className="space-y-3 border-b border-white/25 pb-5">
              <div className="flex justify-between gap-4">
                <dt className="text-white/80">Pupuk</dt>
                <dd className="text-right font-semibold">{f.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-white/80">HET per sak</dt>
                <dd className="tabular-nums">{rupiah(pricePerBag)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-white/80">Jumlah</dt>
                <dd className="tabular-nums">{error ? "-" : `${bags} sak (${bags * Number(f.bag_kg)} kg)`}</dd>
              </div>
            </dl>

            {/* The page's single cyan moment: the number the farmer takes to the kiosk. */}
            <div className="mt-6 rounded-md bg-sas-cyan p-5 text-ink">
              <p className="font-semibold">{texts.calculator_result_label || "Paling banyak Anda bayar"}</p>
              {total === null ? (
                <p className="mt-1 font-heading text-3xl font-bold">Lengkapi jumlah sak</p>
              ) : (
                <p
                  key={total}
                  className="display mt-1 text-5xl tabular-nums animate-in fade-in slide-in-from-bottom-1 duration-200"
                >
                  {rupiah(total)}
                </p>
              )}
            </div>
            <p className="mt-4 text-white/80">
              Diminta lebih dari angka ini, atau disuruh membeli barang lain? Itu pelanggaran.{" "}
              <a href="#kontak" className="font-semibold text-white underline underline-offset-4 focus-visible:outline-sas-cyan">
                Laporkan ke kami
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
