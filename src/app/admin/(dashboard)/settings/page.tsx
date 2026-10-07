import { getCompany, getSiteTexts } from "@/lib/data";
import { CompanyForm } from "@/components/admin/CompanyForm";
import { SiteTextsForm } from "@/components/admin/SiteTextsForm";

export const metadata = { title: "Pengaturan | SAS Admin" };

export const dynamic = "force-dynamic";

const TABS = [
  { id: "perusahaan", label: "Data perusahaan" },
  { id: "teks", label: "Teks situs" },
] as const;

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const active = TABS.some((t) => t.id === tab) ? tab! : "perusahaan";
  const [company, texts] = await Promise.all([getCompany(), getSiteTexts()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="display text-4xl text-ink">Pengaturan</h1>
        <p className="mt-1 text-ink-soft">Data perusahaan dan teks situs yang tampil di halaman publik.</p>
      </div>

      <nav aria-label="Sub menu pengaturan" className="flex gap-1 border-b border-line">
        {TABS.map((t) => {
          const isActive = t.id === active;
          return (
            <a
              key={t.id}
              href={`/admin/settings?tab=${t.id}`}
              aria-current={isActive ? "page" : undefined}
              className={
                "-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors " +
                (isActive
                  ? "border-sas-red text-ink"
                  : "border-transparent text-ink-soft hover:border-line hover:text-ink")
              }
            >
              {t.label}
            </a>
          );
        })}
      </nav>

      {active === "teks" ? <SiteTextsForm texts={texts} /> : <CompanyForm company={company} />}
    </div>
  );
}
