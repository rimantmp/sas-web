"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createFaq,
  updateFaq,
  deleteFaq,
} from "@/lib/actions/content-actions";
import type { Faq } from "@/lib/types";
import { errOf } from "@/lib/types";

type ActionResult = { ok?: boolean; error?: string } | undefined;

const inputClass =
  "mt-1 block w-full min-h-11 rounded-md border border-input bg-white px-3 text-base text-ink placeholder:text-ink-soft/80";

type FormState = { editing: Faq | null; creating: boolean };

export function FaqManager({ initial }: { initial: Faq[] }) {
  const router = useRouter();
  const [edit, setEdit] = useState<FormState>({ editing: null, creating: false });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const run = async (fn: (fd: FormData) => Promise<ActionResult>, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    if (edit.editing) fd.set("id", edit.editing.id);
    const res = await fn(fd);
    if (errOf(res)) {
      setError(errOf(res));
      setPending(false);
      return;
    }
    setPending(false);
    setEdit({ creating: false, editing: null });
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
            Belum ada pertanyaan.
          </p>
        )}
        {initial.map((f) => (
          <div key={f.id} className="rounded-lg border border-line bg-white px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <p className="font-semibold text-ink">{f.question}</p>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setEdit({ editing: f, creating: false })}
                  className="rounded-md bg-paper px-2.5 py-1.5 text-sm font-semibold text-ink hover:bg-line/70"
                >
                  Ubah
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setPending(true);
                    setError(null);
                    const fd = new FormData();
                    fd.set("id", f.id);
                    const res = await deleteFaq(fd);
                    if (errOf(res)) setError(errOf(res));
                    setPending(false);
                    router.refresh();
                  }}
                  disabled={pending}
                  className="rounded-md bg-destructive/10 px-2.5 py-1.5 text-sm font-semibold text-destructive hover:bg-destructive/20 disabled:opacity-60"
                >
                  Hapus
                </button>
              </div>
            </div>
            <p className="mt-1 text-sm text-ink-soft">{f.answer}</p>
          </div>
        ))}
      </div>

      {!edit.creating && !edit.editing && (
        <button
          type="button"
          onClick={() => setEdit({ editing: null, creating: true })}
          className="inline-flex min-h-11 items-center rounded-md bg-sas-red px-4 text-sm font-semibold text-white hover:bg-sas-red-dark"
        >
          Tambah pertanyaan
        </button>
      )}

      {(edit.creating || edit.editing) && (
        <form
          onSubmit={(e) => run(edit.creating ? createFaq : updateFaq, e)}
          className="space-y-5 rounded-lg border border-line bg-white p-5 sm:p-7"
        >
          <h2 className="font-heading text-xl font-bold text-ink">
            {edit.creating ? "Pertanyaan baru" : "Ubah pertanyaan"}
          </h2>
          <div>
            <label htmlFor="faq-q" className="font-semibold text-ink">Pertanyaan</label>
            <input id="faq-q" name="question" defaultValue={edit.editing?.question} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="faq-a" className="font-semibold text-ink">Jawaban</label>
            <textarea id="faq-a" name="answer" defaultValue={edit.editing?.answer ?? ""} rows={4} className={inputClass} />
          </div>
          <div>
            <label htmlFor="faq-sort" className="font-semibold text-ink">Urutan</label>
            <input id="faq-sort" name="sort_order" type="number" min={0} defaultValue={edit.editing?.sort_order ?? 0} className={inputClass} />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={pending}
              className="inline-flex min-h-11 items-center rounded-md bg-sas-red px-5 text-sm font-semibold text-white hover:bg-sas-red-dark disabled:opacity-60">
              {edit.creating ? "Tambahkan" : "Simpan perubahan"}
            </button>
            <button
              type="button"
              onClick={() => setEdit({ editing: null, creating: false })}
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
