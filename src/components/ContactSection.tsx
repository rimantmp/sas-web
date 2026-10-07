"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import SectionHeading, { Placeholder } from "./SectionHeading";
import type { Company } from "@/lib/types";
import { isFilled } from "@/lib/types";

type Props = {
  company: Company;
  texts: Record<string, string>;
};

export default function ContactSection({ company, texts }: Props) {
  const lat = Number(texts.map_lat);
  const lng = Number(texts.map_lng);
  const zoom = Number(texts.map_zoom) || 14;
  const mapLabel = texts.map_label || "Lokasi kantor";
  const mapReady = Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0 && lng !== 0;
  // Embed Google Maps tanpa API key: q= menandai titik, z= zoom, output=embed.
  const embedSrc = mapReady
    ? `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed&hl=id`
    : null;
  const bigMapUrl = mapReady ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` : null;

  return (
    <section id="kontak" aria-labelledby="kontak-judul" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <SectionHeading
          id="kontak-judul"
          index="07"
          title={texts.contact_title || "Hubungi kantor distributor"}
          intro={
            texts.contact_intro ||
            "Untuk petani, kios, dan penyuluh: tanya stok, minta bantuan soal i-Pubers, atau laporkan kios yang menjual di atas HET."
          }
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          {/* Icons kept only where the glyph tells the reader what kind of contact it is. */}
          <ul className="space-y-6 text-ink-soft">
            <li className="flex gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-sas-red" aria-hidden="true" />
              <div>
                <p className="font-semibold text-ink">{texts.contact_label_address || "Kantor dan gudang"}</p>
                <Placeholder>{company.address}</Placeholder>
              </div>
            </li>
            <li className="flex gap-4">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-sas-red" aria-hidden="true" />
              <div>
                <p className="font-semibold text-ink">{texts.contact_label_phone || "Telepon"}</p>
                {isFilled(company.phone) ? (
                  <a href={`tel:${company.phone.replace(/\s|-/g, "")}`} className="underline underline-offset-4">
                    {company.phone}
                  </a>
                ) : (
                  <Placeholder>{company.phone}</Placeholder>
                )}
              </div>
            </li>
            <li className="flex gap-4">
              <Mail className="mt-1 h-5 w-5 shrink-0 text-sas-red" aria-hidden="true" />
              <div>
                <p className="font-semibold text-ink">{texts.contact_label_email || "Email"}</p>
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
                <p className="font-semibold text-ink">{texts.contact_label_hours || "Jam layanan"}</p>
                <Placeholder>{company.hours}</Placeholder>
              </div>
            </li>
          </ul>

          <div>
            <h3 className="font-heading text-2xl font-bold italic text-ink">Lokasi kantor</h3>
            <p className="mt-1 text-ink-soft">{mapLabel}</p>
            {embedSrc ? (
              <>
                <div className="mt-4 overflow-hidden rounded-lg border border-line">
                  <iframe
                    src={embedSrc}
                    title={`Peta lokasi: ${mapLabel}`}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    className="block h-72 w-full sm:h-80"
                  />
                </div>
                {bigMapUrl && (
                  <a
                    href={bigMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex min-h-11 items-center rounded-md bg-sas-red px-5 text-sm font-semibold text-white transition-colors hover:bg-sas-red-dark"
                  >
                    Buka di Google Maps
                  </a>
                )}
              </>
            ) : (
              <p className="mt-4 rounded-lg border border-dashed border-line bg-paper px-4 py-10 text-center text-ink-soft">
                Titik lokasi belum diatur di panel admin.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
