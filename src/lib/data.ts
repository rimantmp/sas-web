// Data Access Layer untuk halaman publik. Dipanggil dari Server Components.
// Data kosong tetap valid (array/objek fallback); error env akan throw.

import { createClient, supabaseConfigured } from "./supabase/server";
import type {
  Company,
  ContactTopic,
  Faq,
  Fertilizer,
  Kiosk,
  NewsArticle,
  PageVisit,
  Principle,
  Procedure,
} from "./types";

// Saat env Supabase belum diisi (dev awal), halaman tetap render dengan
// data kosong supaya tidak 500.
function dbReady() {
  return supabaseConfigured();
}

export async function getCompany(): Promise<Company | null> {
  if (!dbReady()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("company_info")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  return (data as unknown as Company | null) ?? null;
}

/** Pupuk aktif, urut sort_order. */
export async function getFertilizers(): Promise<Fertilizer[]> {
  if (!dbReady()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("fertilizers")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("slug", { ascending: true });
  return (data as unknown as Fertilizer[] | null) ?? [];
}

export async function getProcedures(): Promise<Procedure[]> {
  if (!dbReady()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("procedures")
    .select("*")
    .order("step_number", { ascending: true });
  return (data as unknown as Procedure[] | null) ?? [];
}

export async function getFaqs(): Promise<Faq[]> {
  if (!dbReady()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data as unknown as Faq[] | null) ?? [];
}

export async function getPrinciples(): Promise<Principle[]> {
  if (!dbReady()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("principles")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data as unknown as Principle[] | null) ?? [];
}

export async function getContactTopics(): Promise<ContactTopic[]> {
  if (!dbReady()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_topics")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data as unknown as ContactTopic[] | null) ?? [];
}

/** Berita terpublikasi, terbaru dulu. */
export async function getNews(): Promise<NewsArticle[]> {
  if (!dbReady()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("news_articles")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  return (data as unknown as NewsArticle[] | null) ?? [];
}

/** Kios aktif untuk halaman publik. */
export async function getKiosks(): Promise<Kiosk[]> {
  if (!dbReady()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("kios")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });
  return (data as unknown as Kiosk[] | null) ?? [];
}

/** Untuk /admin/analytics. */
export async function getPageViews(): Promise<PageVisit[]> {
  if (!dbReady()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_views")
    .select("*")
    .order("views", { ascending: false });
  return (data as unknown as PageVisit[] | null) ?? [];
}

export async function getSiteTexts(): Promise<Record<string, string>> {
  if (!dbReady()) return {};
  const supabase = await createClient();
  const { data } = await supabase.from("site_texts").select("key, value");
  const rows = (data ?? []) as unknown as { key: string; value: string }[];
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
