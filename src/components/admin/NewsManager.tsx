"use client";

// Manajemen berita: tabel ringkas + pencarian + filter status + modal form.
// Form tidak lagi mengganti halaman: dibuka sebagai dialog di atas daftar,
// supaya konteks (cari mana yang sudah dibuka) tetap terlihat.

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, Search, X } from "lucide-react";
import { createNews, updateNews, deleteNews, uploadImage } from "@/lib/actions/extra-actions";
import type { NewsArticle } from "@/lib/types";
import { errOf } from "@/lib/types";
import RichTextEditor from "./RichTextEditor";

type ActionResult = { ok?: boolean; error?: string } | undefined;
type UploadResult = ActionResult & { url?: string; path?: string };

const inputClass =
  "mt-1 block w-full min-h-11 rounded-md border border-input bg-white px-3 text-base text-ink placeholder:text-ink-soft/80";

const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
};

// Status filter: semua | terbit | draft.
type StatusFilter = "all" | "published" | "draft";

export function NewsManager({ initial }: { initial: NewsArticle[] }) {
  const router = useRouter();
  const [modal, setModal] = useState<{ mode: "create" } | { mode: "edit"; article: NewsArticle } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<NewsArticle | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initial.filter((n) => {
      if (status === "published" && !n.is_published) return false;
      if (status === "draft" && n.is_published) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        (n.author ?? "").toLowerCase().includes(q)
      );
    });
  }, [initial, query, status]);

  const handleDelete = async (n: NewsArticle) => {
    setPendingId(n.id);
    setError(null);
    const fd = new FormData();
    fd.set("id", n.id);
    const res = await deleteNews(fd);
    if (errOf(res)) setError(errOf(res));
    setPendingId(null);
    setConfirmDelete(null);
    router.refresh();
  };

  const dateCell = (n: NewsArticle) => (
    <td className="px-4 py-3 text-sm text-ink-soft whitespace-nowrap">{fmtDate(n.created_at)}</td>
  );

  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Bar atas: cari + filter + tombol tambah. */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul atau penulis…"
            aria-label="Cari berita"
            className="block w-full min-h-11 rounded-md border border-input bg-white pl-9 pr-3 text-base text-ink placeholder:text-ink-soft/80"
          />
        </div>

        <div role="group" aria-label="Filter status" className="flex rounded-md border border-input bg-white p-0.5">
          {([
            ["all", "Semua"],
            ["published", "Terbit"],
            ["draft", "Draft"],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setStatus(id)}
              aria-pressed={status === id}
              className={
                "min-h-9 rounded-[5px] px-3 text-sm font-semibold transition-colors " +
                (status === id ? "bg-ink text-white" : "text-ink-soft hover:text-ink")
              }
            >
              {label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setModal({ mode: "create" })}
          className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-md bg-sas-red px-4 text-sm font-semibold text-white transition-colors hover:bg-sas-red-dark"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tambah Berita
        </button>
      </div>

      {/* Daftar berita: tabel ringkas. Kolom gambar hanya bila ada gambar. */}
      <div className="overflow-x-auto rounded-lg border border-line bg-white">
        <table className="w-full min-w-[40rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-paper">
              {initial.some((n) => n.image_url) && (
                <th scope="col" className="px-4 py-3 text-sm font-semibold text-ink-soft">Sampul</th>
              )}
              <th scope="col" className="px-4 py-3 text-sm font-semibold text-ink-soft">Judul</th>
              <th scope="col" className="px-4 py-3 text-sm font-semibold text-ink-soft">Penulis</th>
              <th scope="col" className="px-4 py-3 text-sm font-semibold text-ink-soft">Tanggal</th>
              <th scope="col" className="px-4 py-3 text-sm font-semibold text-ink-soft">Status</th>
              <th scope="col" className="px-4 py-3 text-sm font-semibold text-ink-soft">
                <span className="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink-soft">
                  {initial.length === 0
                    ? "Belum ada berita. Klik Tambah Berita untuk menulis yang pertama."
                    : "Tidak ada yang cocok dengan pencarian atau filter."}
                </td>
              </tr>
            )}
            {filtered.map((n) => (
              <tr key={n.id} className="border-b border-line/70 last:border-0 hover:bg-paper/60">
                {initial.some((x) => x.image_url) && (
                  <td className="px-4 py-3">
                    {n.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={n.image_url} alt="" className="h-10 w-16 rounded-md object-cover" />
                    ) : (
                      <span className="block h-10 w-16 rounded-md bg-paper" aria-hidden="true" />
                    )}
                  </td>
                )}
                <td className="max-w-md px-4 py-3">
                  <p className="font-semibold text-ink">{n.title}</p>
                </td>
                <td className="px-4 py-3 text-sm text-ink-soft whitespace-nowrap">{n.author || "—"}</td>
                {dateCell(n)}
                <td className="px-4 py-3">
                  <span
                    className={
                      "inline-block rounded-[5px] px-2 py-0.5 text-xs font-semibold " +
                      (n.is_published ? "bg-ink text-white" : "bg-paper text-destructive")
                    }
                  >
                    {n.is_published ? "Terbit" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setModal({ mode: "edit", article: n })}
                      aria-label={`Ubah berita: ${n.title}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-paper hover:text-ink"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(n)}
                      disabled={pendingId === n.id}
                      aria-label={`Hapus berita: ${n.title}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-ink-soft">
        {filtered.length} dari {initial.length} berita
      </p>

      {modal && <NewsModal modal={modal} onClose={() => setModal(null)} onError={setError} />}

      {confirmDelete && (
        <ConfirmDelete
          article={confirmDelete}
          pending={pendingId === confirmDelete.id}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => handleDelete(confirmDelete)}
        />
      )}
    </div>
  );
}

function NewsModal({
  modal,
  onClose,
  onError,
}: {
  modal: { mode: "create" } | { mode: "edit"; article: NewsArticle };
  onClose: () => void;
  onError: (msg: string | null) => void;
}) {
  const initial = modal.mode === "edit" ? modal.article : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/50 p-4 sm:p-8" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={initial ? "Ubah berita" : "Tulis berita baru"}
        className="w-full max-w-2xl rounded-lg border border-line bg-white shadow-[0_24px_64px_-24px_rgba(19,33,43,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-7">
          <h2 className="font-heading text-xl font-bold text-ink">{initial ? "Ubah berita" : "Tulis berita baru"}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-paper hover:text-ink"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="px-5 py-5 sm:px-7">
          <NewsForm initial={initial} onDone={onClose} onError={onError} />
        </div>
      </div>
    </div>
  );
}

function ConfirmDelete({
  article,
  pending,
  onCancel,
  onConfirm,
}: {
  article: NewsArticle;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4" onClick={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="Konfirmasi hapus"
        className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-[0_24px_64px_-24px_rgba(19,33,43,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-heading text-xl font-bold text-ink">Hapus berita?</h2>
        <p className="mt-2 text-ink-soft">
          “{article.title}” akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-11 items-center rounded-md border border-line bg-paper px-5 text-sm font-semibold text-ink hover:bg-line/70"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="inline-flex min-h-11 items-center rounded-md bg-destructive px-5 text-sm font-semibold text-white hover:bg-destructive/80 disabled:opacity-60"
          >
            {pending ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

function NewsForm({
  initial,
  onDone,
  onError,
}: {
  initial: NewsArticle | null;
  onDone: () => void;
  onError: (msg: string | null) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("kind", "news");
    const res = (await uploadImage(fd)) as UploadResult;
    if (res?.url) setImageUrl(res.url);
    else setError(errOf(res) ?? "Gagal mengunggah gambar.");
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    if (initial) fd.set("id", initial.id);
    fd.set("image_url", imageUrl);
    const res = initial ? await updateNews(fd) : await createNews(fd);
    if (errOf(res)) {
      setError(errOf(res));
      setPending(false);
      return;
    }
    onError(null);
    setPending(false);
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5">
        <div>
          <label htmlFor="n-title" className="font-semibold text-ink">Judul</label>
          <input id="n-title" name="title" defaultValue={initial?.title} required className={inputClass} />
        </div>
        <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
          <div>
            <label htmlFor="n-author" className="font-semibold text-ink">Penulis</label>
            <input id="n-author" name="author" defaultValue={initial?.author} className={inputClass} />
          </div>
          <label className="flex items-end gap-2 pb-2 font-semibold text-ink">
            <input type="checkbox" name="is_published" defaultChecked={initial ? initial.is_published : true} />
            Terbit
          </label>
        </div>
        <div>
          <label className="font-semibold text-ink">Gambar sampul</label>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" className="h-20 w-32 rounded-md object-cover" />
            )}
            <label className="cursor-pointer rounded-md border border-line bg-paper px-3 py-2 text-sm font-semibold text-ink hover:bg-line/70">
              {uploading ? "Mengunggah..." : "Pilih gambar"}
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </label>
            {imageUrl && (
              <button type="button" onClick={() => setImageUrl("")} className="text-sm text-destructive underline underline-offset-4">
                Hapus gambar
              </button>
            )}
          </div>
          <input type="hidden" name="image_url" value={imageUrl} />
        </div>
        <div>
          <label htmlFor="n-body" className="font-semibold text-ink">Isi berita</label>
          <RichTextEditor value={body} onChange={setBody} />
          <input type="hidden" name="body" value={body} />
        </div>
      </div>

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-3 border-t border-line pt-5">
        <button type="button" onClick={onDone}
          className="inline-flex min-h-11 items-center rounded-md border border-line bg-paper px-5 text-sm font-semibold text-ink hover:bg-line/70">
          Batal
        </button>
        <button type="submit" disabled={pending || uploading}
          className="inline-flex min-h-11 items-center rounded-md bg-sas-red px-5 text-sm font-semibold text-white hover:bg-sas-red-dark disabled:opacity-60">
          {pending || uploading ? "Menyimpan..." : initial ? "Simpan perubahan" : "Terbitkan"}
        </button>
      </div>
    </form>
  );
}
