"use client";

import { useActionState } from "react";
import { updateCompanyInfo } from "@/lib/actions/content-actions";
import { errOf } from "@/lib/types";
import type { Company } from "@/lib/types";

const inputClass =
  "mt-1.5 block w-full min-h-12 rounded-md border border-input bg-white px-3.5 text-base text-ink placeholder:text-ink-soft/80";

const FALLBACK_COMPANY: Company = {
  id: 1,
  name: "",
  short: "SAS",
  address: "",
  phone: "",
  email: "",
  hours: "",
  area: "",
  whatsapp: "",
  updated_at: "",
};

export function CompanyForm({ company }: { company: Company | null }) {
  const c = company ?? FALLBACK_COMPANY;
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, fd: FormData) => updateCompanyInfo(fd),
    undefined,
  );

  return (
    <section className="rounded-lg border border-line bg-white p-5 sm:p-7">
      <h2 className="font-heading text-2xl font-bold text-ink">Data perusahaan</h2>
      <p className="mt-1 text-ink-soft">Tampil di hero, bagian tentang, kontak, dan footer.</p>

      <form action={formAction} className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="co-name" className="font-semibold text-ink">Nama perusahaan</label>
          <input id="co-name" name="name" defaultValue={c.name} className={inputClass} />
        </div>
        <div>
          <label htmlFor="co-short" className="font-semibold text-ink">Nama singkat</label>
          <input id="co-short" name="short" defaultValue={c.short} className={inputClass} />
        </div>
        <div>
          <label htmlFor="co-area" className="font-semibold text-ink">Wilayah kerja</label>
          <input id="co-area" name="area" defaultValue={c.area} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="co-address" className="font-semibold text-ink">Alamat kantor / gudang</label>
          <input id="co-address" name="address" defaultValue={c.address} className={inputClass} />
        </div>
        <div>
          <label htmlFor="co-phone" className="font-semibold text-ink">Telepon (tampilan)</label>
          <input id="co-phone" name="phone" defaultValue={c.phone} placeholder="(021) 123-4567" className={inputClass} />
        </div>
        <div>
          <label htmlFor="co-whatsapp" className="font-semibold text-ink">WhatsApp (angka saja, 0812 menjadi 62812)</label>
          <input id="co-whatsapp" name="whatsapp" defaultValue={c.whatsapp} placeholder="6281234567890" className={inputClass} />
        </div>
        <div>
          <label htmlFor="co-email" className="font-semibold text-ink">Email</label>
          <input id="co-email" name="email" type="email" defaultValue={c.email} className={inputClass} />
        </div>
        <div>
          <label htmlFor="co-hours" className="font-semibold text-ink">Jam layanan</label>
          <input id="co-hours" name="hours" defaultValue={c.hours} className={inputClass} />
        </div>

        {errOf(state) && (
          <p role="alert" className="text-destructive text-sm sm:col-span-2">{errOf(state)}</p>
        )}

        <div className="sm:col-span-2">
          <button type="submit" disabled={pending}
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-sas-red px-6 font-semibold text-white transition-colors hover:bg-sas-red-dark disabled:opacity-60">
            {pending ? "Menyimpan..." : "Simpan perusahaan"}
          </button>
        </div>
      </form>
    </section>
  );
}
