"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Tracker kunjungan (analytics). Client component, mencatat kunjungan
 * tiap halaman publik lewat POST /api/views.
 */
export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
