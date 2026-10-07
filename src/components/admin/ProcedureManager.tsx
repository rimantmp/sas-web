"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createProcedure,
  updateProcedure,
  deleteProcedure,
} from "@/lib/actions/content-actions";
import { errOf } from "@/lib/types";
import type { Procedure } from "@/lib/types";

type ActionResult = { ok?: boolean; error?: string } | undefined;

const inputClass =
  "mt-1 block w-full min-h-11 rounded-md border border-input bg-white px-3 text-base text-ink placeholder:text-ink-soft/80";

export function ProcedureManager({ initial }: { initial: Procedure[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Procedure | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleDelete = async (id: string) => {
    setPending(true);
    setError(null);
    const fd = new FormData();
    fd.set("id", id);
    const res = await deleteProcedure(fd);
    if (errOf(res)) {
      setError(errOf(res));
      setPending(false);
      return;
    }
    setPending(false);
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    if (editing) fd.set("id", editing.id);
    const res = editing ? await updateProcedure(fd) : await createProcedure(fd);
    if (errOf(res)) {
      setError(errOf(res));
      setPending(false);
      return;
    }
    setPending(false);
    setCreating(false);
    setEditing(null);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {error && (
        <p role="alert" className="rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <ol className="space-y-3">
        {initial.length === 0 && (
          <p className="rounded-md border border-dashed border-line bg-white px-4 py-10 text-center text-ink-soft">
            Belum ada langkah. Tambahkan langkah pertama.
          </p>
        )}
        {initial.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-white px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 border-ink font-heading text-lg font-bold text-ink">
              {p.step_number}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">{p.title}</p>
              <p className="truncate text-sm text-ink-soft">{p.body}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditing(p);
                setCreating(false);
              }}
              className="rounded-md bg-paper px-2.5 py-1.5 text-sm font-semibold text-ink hover:bg-line/70"
            >
              Ubah
            </button>
            <button
              type="button"
              onClick={() => handleDelete(p.id)}
              disabled={pending}
              className="rounded-md bg-destructive/10 px-2.5 py-1.5 text-sm font-semibold text-destructive hover:bg-destructive/20 disabled:opacity-60"
            >
              Hapus
            </button>
          </li>
        ))}
      </ol>

      {!creating && !editing && (
        <button
          type="button"
          onClick={() => {
            setCreating(true);
            setEditing(null);
          }}
          className="inline-flex min-h-11 items-center rounded-md bg-sas-red px-4 text-sm font-semibold text-white hover:bg-sas-red-dark"
        >
          Tambah langkah
        </button>
      )}

      {(creating || editing) && (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-line bg-white p-5 sm:p-7">
          <h2 className="font-heading text-xl font-bold text-ink">
            {creating ? "Langkah baru" : `Ubah langkah ${editing?.step_number ?? ""}`}
          </h2>
          <div className="grid gap-5 sm:grid-cols-[8rem_1fr]">
            <div>
              <label htmlFor="p-step" className="font-semibold text-ink">Nomor</label>
              <input
                id="p-step"
                name="step_number"
                type="number"
                min={1}
                step={1}
                defaultValue={editing?.step_number ?? initial.length + 1}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="p-title" className="font-semibold text-ink">Judul langkah</label>
              <input id="p-title" name="title" defaultValue={editing?.title} required className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="p-body" className="font-semibold text-ink">Penjelasan</label>
            <textarea id="p-body" name="body" defaultValue={editing?.body ?? ""} rows={3} className={inputClass} />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-11 items-center rounded-md bg-sas-red px-5 text-sm font-semibold text-white hover:bg-sas-red-dark disabled:opacity-60"
            >
              {creating ? "Tambahkan" : "Simpan perubahan"}
            </button>
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
              className="inline-flex min-h-11 items-center rounded-md border border-line bg-paper px-5 text-sm font-semibold text-ink hover:bg-line/70"
            >
              Batal
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
