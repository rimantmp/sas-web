"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAdmin } from "@/lib/actions/auth-actions";

const inputClass =
  "mt-1.5 block w-full min-h-12 rounded-md border border-input bg-white px-3.5 text-base text-ink placeholder:text-ink-soft/80";

export function SignupForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, fd: FormData) => signUpAdmin(fd),
    undefined,
  );

  return (
    <div className="w-full max-w-md rounded-lg border border-line bg-white p-6 sm:p-8">
      <span className="skew-tag inline-block bg-sas-red px-2 py-0.5" aria-hidden="true">
        <span className="font-heading text-sm font-bold text-white">SAS</span>
      </span>
      <h1 className="display mt-4 text-4xl text-ink">Daftar admin</h1>
      <p className="mt-2 text-ink-soft">Buat akun admin pertama. Butuh kode pendaftaran dari pemilik situs.</p>

      <form action={formAction} className="mt-8 space-y-5">
        <div>
          <label htmlFor="su-key" className="font-semibold text-ink">Kode pendaftaran</label>
          <input id="su-key" name="key" type="password" required placeholder="ADMIN_SIGNUP_KEY di .env" className={inputClass} />
        </div>
        <div>
          <label htmlFor="su-email" className="font-semibold text-ink">Email</label>
          <input id="su-email" name="email" type="email" required autoComplete="username" className={inputClass} />
        </div>
        <div>
          <label htmlFor="su-password" className="font-semibold text-ink">Kata sandi</label>
          <input id="su-password" name="password" type="password" required autoComplete="new-password" minLength={8} className={inputClass} />
        </div>

        {state?.error && (
          <p role="alert" className="text-destructive text-sm">{state.error}</p>
        )}

        <button type="submit" disabled={pending}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-sas-red px-6 font-semibold text-white transition-colors hover:bg-sas-red-dark disabled:opacity-60">
          {pending ? "Mendaftar..." : "Buat akun"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-soft">
        Sudah punya akun?{" "}
        <Link href="/admin/login" className="font-semibold text-sas-red underline underline-offset-4">
          Masuk
        </Link>
      </p>
    </div>
  );
}

export function SignupClosed() {
  return (
    <div className="w-full max-w-md rounded-lg border border-line bg-white p-6 sm:p-8">
      <span className="skew-tag inline-block bg-sas-red px-2 py-0.5" aria-hidden="true">
        <span className="font-heading text-sm font-bold text-white">SAS</span>
      </span>
      <h1 className="display mt-4 text-4xl text-ink">Pendaftaran ditutup</h1>
      <p className="mt-2 text-ink-soft">
        Pendaftaran admin sudah dimatikan. Hubungi pemilik situs bila perlu akun baru.{" "}
        <Link href="/admin/login" className="font-semibold text-sas-red underline underline-offset-4">
          Kembali ke masuk
        </Link>
      </p>
    </div>
  );
}
