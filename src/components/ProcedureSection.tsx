import SectionHeading from "./SectionHeading";

const steps = [
  {
    title: "Pastikan nama Anda ada di e-RDKK",
    body: "Petani harus tergabung dalam kelompok tani dan tercatat dalam e-RDKK. Tanyakan ke ketua kelompok tani atau penyuluh (PPL) jika belum yakin.",
  },
  {
    title: "Bawa e-KTP asli ke kios resmi",
    body: "Datang ke kios pupuk resmi di desa atau kecamatan Anda. Kios resmi memasang papan nama dan daftar HET.",
  },
  {
    title: "Petugas kios memeriksa alokasi Anda",
    body: "Petugas memindai NIK di aplikasi i-Pubers dan melihat sisa jatah pupuk Anda untuk musim ini.",
  },
  {
    title: "Bayar sesuai HET",
    body: "Bayar tidak lebih dari HET. Tidak ada biaya administrasi dan tidak ada kewajiban membeli produk lain.",
  },
  {
    title: "Terima pupuk dan bukti transaksi",
    body: "Periksa kemasan masih bersegel. Petugas akan memotret Anda bersama pupuk sebagai bukti penebusan.",
  },
];

export default function ProcedureSection() {
  return (
    <section id="cara-tebus" aria-labelledby="cara-judul" className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:gap-16 lg:py-28">
        <div>
          <SectionHeading id="cara-judul" index="04" title="Cara menebus pupuk bersubsidi" />
          <ol className="mt-10">
            {steps.map((s, i) => (
              <li key={s.title} className="relative flex gap-5 pb-9 last:pb-0">
                {i < steps.length - 1 && (
                  <span className="absolute left-[1.15rem] top-11 bottom-1 w-0.5 bg-line" aria-hidden="true" />
                )}
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-ink font-heading text-xl font-bold text-ink"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <div className="pt-1">
                  <h3 className="text-xl font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1.5 text-ink-soft">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside className="self-start rounded-lg border-2 border-ink p-6 lg:sticky lg:top-24 lg:mt-24">
          <h3 className="font-heading text-2xl font-bold italic text-ink">Yang perlu dibawa</h3>
          <ul className="mt-4 space-y-3 text-ink-soft">
            <li>
              <strong className="text-ink">e-KTP asli</strong> milik petani yang terdaftar.
            </li>
            <li>
              Jika diwakilkan anggota keluarga: <strong className="text-ink">surat kuasa</strong> dan{" "}
              <strong className="text-ink">Kartu Keluarga</strong>.
            </li>
            <li>Uang sesuai HET. Hitung dulu di kalkulator di atas.</li>
          </ul>
          <p className="mt-5 border-t border-line pt-4 text-ink-soft">
            Nama tidak muncul atau jatah tidak sesuai? Hubungi penyuluh pertanian (PPL) di BPP kecamatan, atau{" "}
            <a href="#kontak" className="font-semibold text-sas-red underline underline-offset-4">
              tanyakan ke kami
            </a>
            .
          </p>
        </aside>
      </div>
    </section>
  );
}
