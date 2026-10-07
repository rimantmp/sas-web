"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import SectionHeading, { Placeholder } from "./SectionHeading";
import { company, isFilled } from "@/lib/company";

const topics = [
  "Tanya jadwal kirim atau stok di kios",
  "Nama tidak muncul di i-Pubers",
  "Lapor harga di atas HET atau paket wajib",
  "Pengajuan menjadi kios resmi",
  "Lainnya",
];

type Errors = Partial<Record<"name" | "village" | "message", string>>;
type Status = "idle" | "opened" | "blocked" | "unconfigured";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", village: "", topic: topics[0], message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [waUrl, setWaUrl] = useState("");
  const waReady = isFilled(company.whatsapp);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [key]: e.target.value });
    setErrors({ ...errors, [key]: undefined });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Isi nama Anda.";
    if (!form.village.trim()) next.village = "Isi desa dan kecamatan.";
    if (form.message.trim().length < 10) next.message = "Ceritakan keperluan Anda, minimal 10 huruf.";
    setErrors(next);
    if (Object.keys(next).length) return;

    if (!waReady) {
      setStatus("unconfigured");
      return;
    }
    const text = `Halo ${company.name}.\nNama: ${form.name}\nDesa/Kecamatan: ${form.village}\nKeperluan: ${form.topic}\n\n${form.message}`;
    const url = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`;
    setWaUrl(url);
    const win = window.open(url, "_blank", "noopener");
    setStatus(win ? "opened" : "blocked");
  };

  const field =
    "mt-1.5 block w-full min-h-12 rounded-md border border-input bg-white px-3.5 text-base text-ink placeholder:text-ink-soft/80 aria-[invalid=true]:border-destructive";

  return (
    <section id="kontak" aria-labelledby="kontak-judul" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <SectionHeading
          id="kontak-judul"
          index="06"
          title="Hubungi kantor distributor"
          intro="Untuk petani, kios, dan penyuluh: tanya stok, minta bantuan soal i-Pubers, atau laporkan kios yang menjual di atas HET."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          {/* Icons kept only where the glyph tells the reader what kind of contact it is. */}
          <ul className="space-y-6 text-ink-soft">
            <li className="flex gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-sas-red" aria-hidden="true" />
              <div>
                <p className="font-semibold text-ink">Kantor dan gudang</p>
                <Placeholder>{company.address}</Placeholder>
              </div>
            </li>
            <li className="flex gap-4">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-sas-red" aria-hidden="true" />
              <div>
                <p className="font-semibold text-ink">Telepon</p>
                {isFilled(company.phoneDisplay) ? (
                  <a href={`tel:${company.phoneDisplay.replace(/\s|-/g, "")}`} className="underline underline-offset-4">
                    {company.phoneDisplay}
                  </a>
                ) : (
                  <Placeholder>{company.phoneDisplay}</Placeholder>
                )}
              </div>
            </li>
            <li className="flex gap-4">
              <Mail className="mt-1 h-5 w-5 shrink-0 text-sas-red" aria-hidden="true" />
              <div>
                <p className="font-semibold text-ink">Email</p>
                {isFilled(company.email) ? (
                  <a href={`mailto:${company.email}`} className="underline underline-offset-4">
                    {company.email}
                  </a>
                ) : (
                  <Placeholder>{company.email}</Placeholder>
                )}
              </div>
            </li>
            <li className="flex gap-4">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-sas-red" aria-hidden="true" />
              <div>
                <p className="font-semibold text-ink">Jam layanan</p>
                <Placeholder>{company.hours}</Placeholder>
              </div>
            </li>
          </ul>

          <form onSubmit={submit} noValidate className="rounded-lg border border-line bg-paper p-5 sm:p-7">
            <p className="font-heading text-2xl font-bold italic text-ink">Kirim pesan lewat WhatsApp</p>
            <p className="mt-1 text-ink-soft">Pesan Anda disusun di sini, lalu dibuka di WhatsApp untuk dikirim.</p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="k-nama" className="font-semibold text-ink">Nama</label>
                <input id="k-nama" value={form.name} onChange={update("name")} placeholder="Nama Anda" autoComplete="name"
                  aria-invalid={!!errors.name} aria-describedby={errors.name ? "k-nama-err" : undefined} className={field} />
                {errors.name && <p id="k-nama-err" className="mt-1 text-sm text-destructive">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="k-desa" className="font-semibold text-ink">Desa dan kecamatan</label>
                <input id="k-desa" value={form.village} onChange={update("village")} placeholder="Desa, kecamatan"
                  aria-invalid={!!errors.village} aria-describedby={errors.village ? "k-desa-err" : undefined} className={field} />
                {errors.village && <p id="k-desa-err" className="mt-1 text-sm text-destructive">{errors.village}</p>}
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="k-topik" className="font-semibold text-ink">Keperluan</label>
              <select id="k-topik" value={form.topic} onChange={update("topic")} className={field}>
                {topics.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="mt-5">
              <label htmlFor="k-pesan" className="font-semibold text-ink">Pesan</label>
              <textarea id="k-pesan" rows={4} value={form.message} onChange={update("message")}
                placeholder="Tulis keperluan Anda. Untuk laporan, sebutkan nama kios, tanggal, dan harga yang diminta."
                aria-invalid={!!errors.message} aria-describedby={errors.message ? "k-pesan-err" : undefined}
                className={`${field} py-3`} />
              {errors.message && <p id="k-pesan-err" className="mt-1 text-sm text-destructive">{errors.message}</p>}
            </div>

            <button type="submit"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-sas-red px-6 font-semibold text-white transition-colors hover:bg-sas-red-dark sm:w-auto">
              Buka di WhatsApp
            </button>

            <div aria-live="polite" className="mt-4">
              {status === "opened" && (
                <p className="text-ink">WhatsApp sudah terbuka di tab baru. Tekan kirim di WhatsApp agar pesan sampai ke kantor.</p>
              )}
              {status === "blocked" && (
                <p className="text-ink">
                  Browser menahan tab baru.{" "}
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-sas-red underline underline-offset-4">
                    Buka WhatsApp di sini
                  </a>
                  .
                </p>
              )}
              {status === "unconfigured" && (
                <p role="alert" className="text-destructive">
                  Nomor WhatsApp kantor belum diisi, jadi pesan belum bisa dikirim. Isian Anda tetap tersimpan di formulir.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
