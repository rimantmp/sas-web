"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createFertilizer,
  updateFertilizer,
  deleteFertilizer,
} from "@/lib/actions/content-actions";
import { formatRupiah, errOf } from "@/lib/types";
import type { Fertilizer } from "@/lib/types";

type ActionResult = { ok?: boolean; error?: string } | undefined;

const inputClass =
  "mt-1 block w-full min-h-11 rounded-md border border-input bg-white px-3 text-base text-ink placeholder:text-ink-soft/80";

export function FertilizerManager({ initial }: { initial: Fertilizer[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Fertilizer[]>(initial);
  const [editing, setEditing] = useState<Fertilizer | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const run = async (fn: (fd: FormData) => Promise<ActionResult>, e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.target as HTMLFormElement);
    const res = await fn(fd);
    const err = errOf(res);
    if (err) {
      setError(err);
      setPending(false);
      return;
    }
    setPending(false);
    setCreating(false);
    setEditing(null);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    setPending(true);
    setError(null);
    const fd = new FormData();
    fd.set("id", id);
    const res = await deleteFertilizer(fd);
    const err = errOf(res);
    if (err) {
      setError(err);
      setPending(false);
      return;
    }
    setPending(false);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {error && (
        <p role="alert" className="rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Daftar */}
      <div className="overflow-hidden rounded-lg border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-semibold">Pupuk</th>
              <th className="px-4 py-3 text-right font-semibold">HET/kg</th>
              <th className="px-4 py-3 text-right font-semibold">HET/sak</th>
              <th className="px-4 py-3 text-center font-semibold">Tampil</th>
              <th className="px-4 py-3 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-ink-soft">Belum ada pupuk.</td></tr>
            )}
            {rows.map((f) => (
              <tr key={f.id} className="border-t border-line align-top">
                <td className="px-4 py-3">
                  <span className="font-semibold text-ink">{f.name}</span>
                  <div className="text-ink-soft">{f.slug}</div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink">{formatRupiah(Number(f.price_per_kg))}/{f.bag_kg}kg</td>
                <td className="px-4 py-3 text-right">
                  <span className="font-semibold text-sas-red tabular-nums">{formatRupiah(Number(f.price_per_kg) * Number(f.bag_kg))}</span>
                </td>
                <td className="px-4 py-3 text-center">{f.is_active ? "Ya" : "Tidak"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { setEditing(f); setCreating(false); }}
                      className="rounded-md bg-paper px-2.5 py-1.5 text-sm font-semibold text-ink hover:bg-line/70">
                      Ubah
                    </button>
                    <button type="button" onClick={() => handleDelete(f.id)} disabled={pending}
                      className="rounded-md bg-destructive/10 px-2.5 py-1.5 text-sm font-semibold text-destructive hover:bg-destructive/20 disabled:opacity-60">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!creating && !editing && (
        <button type="button" onClick={() => { setCreating(true); setEditing(null); }}
          className="inline-flex min-h-11 items-center rounded-md bg-sas-red px-4 text-sm font-semibold text-white hover:bg-sas-red-dark">
          Tambah pupuk
        </button>
      )}

      {(creating || editing) && (
        <form
          onSubmit={(e) => run(creating ? createFertilizer : updateFertilizer, e)}
          className="space-y-5 rounded-lg border border-line bg-white p-5 sm:p-7"
        >
          <h2 className="font-heading text-xl font-bold text-ink">
            {creating ? "Tambah pupuk baru" : `Ubah ${editing?.name ?? ""}`}
          </h2>
          {editing && <input type="hidden" name="id" value={editing.id} />}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="f-name" className="font-semibold text-ink">Nama lengkap</label>
              <input id="f-name" name="name" defaultValue={editing?.name} required className={inputClass} />
            </div>
            <div>
              <label htmlFor="f-short" className="font-semibold text-ink">Nama singkat (di kalkulator)</label>
              <input id="f-short" name="short" defaultValue={editing?.short} className={inputClass} />
            </div>
            <div>
              <label htmlFor="f-slug" className="font-semibold text-ink">Slug (mis. urea)</label>
              <input id="f-slug" name="slug" defaultValue={editing?.slug} required className={inputClass} />
            </div>
            <div>
              <label htmlFor="f-price" className="font-semibold text-ink">Harga per kg (Rp)</label>
              <input id="f-price" name="price_per_kg" type="number" step="1" min="1" defaultValue={editing?.price_per_kg} required className={inputClass} />
            </div>
            <div>
              <label htmlFor="f-bag" className="font-semibold text-ink">Ukuran sak (kg)</label>
              <input id="f-bag" name="bag_kg" type="number" step="1" min="1" defaultValue={editing?.bag_kg} required className={inputClass} />
            </div>
            <div>
              <label htmlFor="f-sort" className="font-semibold text-ink">Urutan</label>
              <input id="f-sort" name="sort_order" type="number" step="1" defaultValue={editing?.sort_order ?? 0} className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="f-content" className="font-semibold text-ink">Kandungan</label>
            <textarea id="f-content" name="content" defaultValue={editing?.content ?? ""} rows={2} className={inputClass} />
          </div>
          <div>
            <label htmlFor="f-usage" className="font-semibold text-ink">Kegunaan</label>
            <textarea id="f-usage" name="usage" defaultValue={editing?.usage ?? ""} rows={2} className={inputClass} />
          </div>

          <label className="flex items-center gap-2 font-semibold text-ink">
            <input type="checkbox" name="is_active" defaultChecked={editing ? editing.is_active : true} />
            Tampil di situs
          </label>

          <div className="flex gap-3">
            <button type="submit" disabled={pending}
              className="inline-flex min-h-11 items-center rounded-md bg-sas-red px-5 text-sm font-semibold text-white hover:bg-sas-red-dark disabled:opacity-60">
              {creating ? "Tambahkan" : "Simpan perubahan"}
            </button>
            <button type="button" onClick={() => { setCreating(false); setEditing(null); }}
              className="inline-flex min-h-11 items-center rounded-md border border-line bg-paper px-5 text-sm font-semibold text-ink hover:bg-line/70">
              Batal
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
