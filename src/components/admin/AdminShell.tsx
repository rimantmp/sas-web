"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Sprout, ListOrdered, HelpCircle, Newspaper, Store, BarChart3, LogOut } from "lucide-react";
import { logout } from "@/lib/actions/auth-actions";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
  { href: "/admin/fertilizers", label: "Pupuk & HET", icon: Sprout },
  { href: "/admin/procedures", label: "Prosedur", icon: ListOrdered },
  { href: "/admin/faqs", label: "FAQ", icon: HelpCircle },
  { href: "/admin/news", label: "Berita", icon: Newspaper },
  { href: "/admin/kiosks", label: "Kios", icon: Store },
  { href: "/admin/analytics", label: "Statistik", icon: BarChart3 },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="skew-tag bg-sas-red px-1.5 py-0.5">
              <span className="font-heading text-sm font-bold text-white">SAS</span>
            </span>
            <span className="font-heading text-lg font-bold">Panel Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className="text-sm text-ink-soft hover:text-ink hover:underline">
              Lihat situs
            </Link>
            <form action={logout}>
              <button type="submit" className="ml-1 inline-flex items-center gap-2 rounded-md bg-paper px-3 py-2 text-sm font-semibold text-ink hover:bg-line/70">
                Keluar <LogOut className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <nav aria-label="Menu admin" className="flex gap-1 overflow-x-auto lg:flex-col">
              {nav.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors " +
                      (active
                        ? "bg-sas-red text-white"
                        : "text-ink-soft hover:bg-paper hover:text-ink")
                    }
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
