"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createKiosk, updateKiosk, deleteKiosk, uploadImage } from "@/lib/actions/extra-actions";
import type { Kiosk } from "@/lib/types";
import { errOf } from "@/lib/types";

type ActionResult = { ok?: boolean; error?: string } | undefined;
type UploadResult = ActionResult & { url?: string };

const inputClass =
  "mt-1 block w-full min-h-11 rounded-md border border-input bg-white px-3 text-base text-ink placeholder:text-ink-soft/80";

export function KioskManager({ initial }: { initial: Kiosk[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Kiosk | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    if (editing) fd.set("id", editing.id);
    const res = editing ? await updateKiosk(fd) : await createKiosk(fd);
    if (errOf(res)) { setError(errOf(res)); setPending(false); return; }
    setPending(false);
    setEditing(null);
    setCreating(false);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {error && (
        <p role="alert" className="rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="space-y-3">
        {initial.length === 0 && (
          <p className="rounded-md border border-dashed border-line bg-white px-4 py-10 text-center text-ink-soft">
            Belum ada kios.
          </p>
        )}
        {initial.map((k) => (
          <div key={k.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-white px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">{k.name}</p>
              <p className="text-sm text-ink-soft">
                {[k.village, k.district].filter(Boolean).join(", ") || k.address || "Alamat belum diisi"}
              </p>
            </div>
            <span className={k.is_active ? "text-sm font-semibold text-ink" : "text-sm font-semibold text-ink-soft"}>
              {k.is_active ? "Aktif" : "Nonaktif"}
            </span>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setEditing(k); setCreating(false); }}
                className="rounded-md bg-paper px-2.5 py-1.5 text-sm font-semibold text-ink hover:bg-line/70">
                Ubah
              </button>
              <button type="button"
                onClick={async () => {
                  setPending(true); setError(null);
                  const fd = new FormData(); fd.set("id", k.id);
                  const res = await deleteKiosk(fd);
                  if (errOf(res)) setError(errOf(res));
                  setPending(false);
                  router.refresh();
                }}
                disabled={pending}
                className="rounded-md bg-destructive/10 px-2.5 py-1.5 text-sm font-semibold text-destructive hover:bg-destructive/20 disabled:opacity-60">
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {!creating && !editing && (
        <button type="button" onClick={() => { setCreating(true); setEditing(null); }}
          className="inline-flex min-h-11 items-center rounded-md bg-sas-red px-4 text-sm font-semibold text-white hover:bg-sas-red-dark">
          Tambah kios
        </button>
      )}

      {(creating || editing) && (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-line bg-white p-5 sm:p-7">
          <h2 className="font-heading text-xl font-bold text-ink">
            {creating ? "Tambah kios" : `Ubah ${editing?.name ?? "kios"}`}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="k-name" className="font-semibold text-ink">Nama kios</label>
              <input id="k-name" name="name" defaultValue={editing?.name} required className={inputClass} />
            </div>
            <div>
              <label htmlFor="k-phone" className="font-semibold text-ink">Telepon</label>
              <input id="k-phone" name="phone" defaultValue={editing?.phone ?? ""} className={inputClass} />
            </div>
            <div>
              <label htmlFor="k-village" className="font-semibold text-ink">Desa</label>
              <input id="k-village" name="village" defaultValue={editing?.village ?? ""} className={inputClass} />
            </div>
            <div>
              <label htmlFor="k-district" className="font-semibold text-ink">Kecamatan</label>
              <input id="k-district" name="district" defaultValue={editing?.district ?? ""} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="k-address" className="font-semibold text-ink">Alamat lengkap</label>
              <input id="k-address" name="address" defaultValue={editing?.address ?? ""} className={inputClass} />
            </div>
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
