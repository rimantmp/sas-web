"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/lib/actions/auth-actions";

const inputClass =
  "mt-1.5 block w-full min-h-12 rounded-md border border-input bg-white px-3.5 text-base text-ink placeholder:text-ink-soft/80";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, fd: FormData) => login(fd),
    undefined,
  );

  return (
    <div className="w-full max-w-md rounded-lg border border-line bg-white p-6 sm:p-8">
      <span className="skew-tag inline-block bg-sas-red px-2 py-0.5" aria-hidden="true">
        <span className="font-heading text-sm font-bold text-white">SAS</span>
      </span>
      <h1 className="display mt-4 text-4xl text-ink">Masuk admin</h1>
      <p className="mt-2 text-ink-soft">Pakai akun email yang terdaftar sebagai admin.</p>

      <form action={formAction} className="mt-8 space-y-5">
        <div>
          <label htmlFor="login-email" className="font-semibold text-ink">Email</label>
          <input id="login-email" name="email" type="email" required autoComplete="username" placeholder="nama@perusahaan.com" className={inputClass} />
        </div>
        <div>
          <label htmlFor="login-password" className="font-semibold text-ink">Kata sandi</label>
          <input id="login-password" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" className={inputClass} />
        </div>

        <input type="hidden" name="next" defaultValue="/admin" />

        {state?.error && (
          <p role="alert" className="text-destructive text-sm">{state.error}</p>
        )}

        <button type="submit" disabled={pending}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-sas-red px-6 font-semibold text-white transition-colors hover:bg-sas-red-dark disabled:opacity-60">
          {pending ? "Memeriksa..." : "Masuk"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-soft">
        Belum ada akun admin?{" "}
        <Link href="/admin/signup" className="font-semibold text-sas-red underline underline-offset-4">
          Daftar
        </Link>
      </p>
    </div>
  );
}
