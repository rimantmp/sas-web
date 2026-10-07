"use client";

// Form teks situs. Satu form per seksi accordion: admin menyimpan
// beberapa field sekaligus dengan satu tombol, tanpa reload. Metadata
// (label, helper, tipe) menjaga key DB tetap di belakang layar.

import { useActionState, useEffect, useRef, useState } from "react";
import { updateSiteTexts } from "@/lib/actions/extra-actions";
import { errOf } from "@/lib/types";

type FieldType = "text" | "textarea" | "json";

type FieldMeta = {
  key: string;
  label: string;
  helper?: string;
  type?: FieldType;
  // Field pendek yang berpasangan diletakkan sebaris dalam grid 2 kolom.
  half?: boolean;
};

type Section = {
  group: string;
  fields: FieldMeta[];
};

const SECTIONS: Section[] = [
  {
    group: "Hero",
    fields: [
      { key: "hero_title", label: "Judul utama", helper: "Kalimat besar di bagian paling atas landing page.", type: "textarea" },
      { key: "hero_sub", label: "Sub-judul", helper: "Paragraf penjelas di bawah judul utama.", type: "textarea" },
      { key: "hero_cta_primary", label: "Tombol utama (label)", half: true },
      { key: "hero_cta_primary_href", label: "Tombol utama (tujuan)", helper: "Contoh: /#kalkulator", half: true },
      { key: "hero_cta_secondary", label: "Tombol kedua (label)", half: true },
      { key: "hero_cta_secondary_href", label: "Tombol kedua (tujuan)", helper: "Contoh: /#cara-tebus", half: true },
      { key: "hero_board_title", label: "Papan HET: judul", half: true },
      { key: "hero_board_caption", label: "Papan HET: keterangan", helper: "Teks kecil di samping judul papan.", half: true },
      { key: "hero_board_foot", label: "Papan HET: catatan kaki", type: "textarea" },
    ],
  },
  {
    group: "Tentang",
    fields: [
      { key: "about_title", label: "Judul bagian", type: "textarea" },
      { key: "about_p1", label: "Paragraf 1", type: "textarea" },
      { key: "about_p2", label: "Paragraf 2", type: "textarea" },
      { key: "about_label_area", label: "Label wilayah kerja", half: true },
      { key: "about_label_address", label: "Label kantor dan gudang", half: true },
      { key: "principles_heading", label: "Judul Enam Tepat", type: "textarea" },
      { key: "principles_intro", label: "Pengantar Enam Tepat", type: "textarea" },
    ],
  },
  {
    group: "Produk & HET",
    fields: [
      { key: "pricing_title", label: "Judul bagian", type: "textarea" },
      { key: "pricing_intro", label: "Deskripsi bagian", type: "textarea" },
      { key: "pricing_foot", label: "Catatan kaki bagian", type: "textarea" },
    ],
  },
  {
    group: "Kalkulator",
    fields: [
      { key: "calculator_title", label: "Judul bagian", type: "textarea" },
      { key: "calculator_intro", label: "Deskripsi bagian", type: "textarea" },
      { key: "calculator_result_label", label: "Label hasil hitungan", helper: "Teks di atas angka total biaya.", half: true },
    ],
  },
  {
    group: "Prosedur",
    fields: [
      { key: "procedure_title", label: "Judul bagian", type: "textarea" },
      { key: "procedure_aside_title", label: "Judul kotak samping", helper: "Bagian “Yang perlu dibawa”.", half: true },
      { key: "procedure_aside_note", label: "Catatan kotak samping", type: "textarea" },
      { key: "procedure_aside_items", label: "Daftar bawaan (JSON)", helper: "Format: [{\"t\":\"judul\",\"d\":\"keterangan\"}]. Jangan ubah struktur.", type: "json" },
    ],
  },
  {
    group: "FAQ & Kontak",
    fields: [
      { key: "faq_title", label: "Judul FAQ", type: "textarea" },
      { key: "contact_title", label: "Judul kontak", type: "textarea" },
      { key: "contact_intro", label: "Deskripsi kontak", type: "textarea" },
      { key: "contact_label_address", label: "Label alamat", half: true },
      { key: "contact_label_phone", label: "Label telepon", half: true },
      { key: "contact_label_email", label: "Label email", half: true },
      { key: "contact_label_hours", label: "Label jam layanan", half: true },
    ],
  },
  {
    group: "Peta lokasi",
    fields: [
      { key: "map_lat", label: "Latitude", helper: "Garis lintang titik kantor. Contoh: -2.988156", half: true },
      { key: "map_lng", label: "Longitude", helper: "Garis bujur titik kantor. Contoh: 119.940889", half: true },
      { key: "map_zoom", label: "Zoom peta", helper: "1 (dunia) sampai 20 (terdekat). Disarankan 14-16.", half: true },
      { key: "map_label", label: "Keterangan lokasi", helper: "Teks di atas peta, mis. nama kantor.", half: true },
    ],
  },
  {
    group: "Footer",
    fields: [
      { key: "footer_about", label: "Paragraf tentang perusahaan", type: "textarea" },
      { key: "footer_nav_title", label: "Judul kolom navigasi", half: true },
      { key: "footer_contact_label", label: "Label kontak layanan", half: true },
      { key: "footer_watch_title", label: "Judul pengawasan & aturan", type: "textarea" },
      { key: "footer_watch_text", label: "Isi pengawasan & aturan", type: "textarea" },
    ],
  },
  {
    group: "Navigasi & tautan",
    fields: [
      { key: "nav_links", label: "Tautan navbar (JSON)", helper: "Format: [{\"label\":\"...\",\"href\":\"...\"}].", type: "json" },
      { key: "footer_links", label: "Tautan footer (JSON)", helper: "Format sama dengan navbar.", type: "json" },
      { key: "nav_cta", label: "Tombol navbar (label)", half: true },
      { key: "nav_cta_href", label: "Tombol navbar (tujuan)", half: true },
    ],
  },
];

const inputClass =
  "mt-1.5 block w-full min-h-12 rounded-md border border-input bg-white px-3.5 text-base text-ink placeholder:text-ink-soft/80";
const areaClass =
  "mt-1.5 block w-full rounded-md border border-input bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-ink-soft/80 field-sizing-content";

// Field pendek (judul, label) dipasangkan lewat grid; narasi satu kolom.
function fieldWrap(f: FieldMeta): string {
  return f.half ? "" : "sm:col-span-2";
}

function preview(texts: Record<string, string>, fields: FieldMeta[]): string {
  const first = fields[0];
  const value = texts[first.key] ?? "";
  const flat = value.replace(/\s+/g, " ").trim();
  return flat.length > 60 ? flat.slice(0, 60) + "…" : flat || "(belum diisi)";
}

export function SiteTextsForm({ texts }: { texts: Record<string, string> }) {
  const [open, setOpen] = useState<string | null>(null);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const showToast = (kind: "ok" | "err", msg: string) => {
    setToast({ kind, msg });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3000);
  };

  return (
    <section className="rounded-lg border border-line bg-white p-5 sm:p-7">
      <h2 className="font-heading text-2xl font-bold text-ink">Teks situs</h2>
      <p className="mt-1 text-ink-soft">
        Ubah teks landing page per bagian. Buka satu bagian, ubah beberapa kolom sekaligus, lalu simpan sekali.
      </p>

      <div className="mt-6 space-y-3">
        {SECTIONS.map((s) => {
          const isOpen = open === s.group;
          return (
            <div key={s.group} className="rounded-md border border-line">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : s.group)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 rounded-md px-4 py-3 text-left transition-colors hover:bg-paper"
              >
                <span className="min-w-0">
                  <span className="block font-semibold text-ink">{s.group}</span>
                  {!isOpen && (
                    <span className="mt-0.5 block truncate text-sm text-ink-soft">
                      {preview(texts, s.fields)}
                    </span>
                  )}
                </span>
                <span aria-hidden="true" className="shrink-0 text-ink-soft">{isOpen ? "−" : "+"}</span>
              </button>

              {isOpen && (
                <SectionForm
                  key={s.group}
                  section={s}
                  texts={texts}
                  onSaved={(ok, msg) => showToast(ok ? "ok" : "err", msg)}
                />
              )}
            </div>
          );
        })}
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={
            "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-md px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(19,33,43,0.5)] " +
            (toast.kind === "ok" ? "bg-ink" : "bg-destructive")
          }
        >
          {toast.msg}
        </div>
      )}
    </section>
  );
}

function SectionForm({
  section,
  texts,
  onSaved,
}: {
  section: Section;
  texts: Record<string, string>;
  onSaved: (ok: boolean, msg: string) => void;
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, fd: FormData) => {
      // Kumpulkan nilai field seksi ini ke hidden entries JSON sebelum submit.
      const entries: Record<string, string> = {};
      for (const f of section.fields) {
        const el = document.getElementById(`st-${f.key}`) as
          | HTMLInputElement
          | HTMLTextAreaElement
          | null;
        if (el) entries[f.key] = el.value;
      }
      fd.set("entries", JSON.stringify(entries));
      return updateSiteTexts(fd);
    },
    undefined,
  );

  useEffect(() => {
    if (errOf(state)) onSaved(false, "Gagal menyimpan: " + errOf(state));
    else if (state && "ok" in state && state.ok) onSaved(true, "Perubahan tersimpan.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="border-t border-line px-4 py-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {section.fields.map((f) => {
          const type = f.type ?? "text";
          const value = texts[f.key] ?? "";
          return (
            <div key={f.key} className={fieldWrap(f)}>
              <label htmlFor={`st-${f.key}`} className="font-semibold text-ink">
                {f.label}
              </label>
              {type === "text" && (
                <input id={`st-${f.key}`} name={f.key} defaultValue={value} className={inputClass} />
              )}
              {type === "textarea" && (
                <textarea id={`st-${f.key}`} name={f.key} defaultValue={value} rows={3} className={`${areaClass} min-h-24`} />
              )}
              {type === "json" && (
                <textarea
                  id={`st-${f.key}`}
                  name={f.key}
                  defaultValue={value}
                  rows={5}
                  spellCheck={false}
                  className={`${areaClass} font-mono text-sm`}
                />
              )}
              {f.helper && <p className="mt-1 text-sm text-ink-soft">{f.helper}</p>}
            </div>
          );
        })}
      </div>

      {errOf(state) && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {errOf(state)}
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-sas-red px-6 font-semibold text-white transition-colors hover:bg-sas-red-dark disabled:opacity-60"
        >
          {pending ? "Menyimpan..." : "Simpan perubahan"}
        </button>
      </div>
    </form>
  );
}
