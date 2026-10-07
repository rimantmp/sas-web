// Tipe entitas content yang disimpan di Supabase (public schema).

export type Company = {
  id: 1;
  name: string;
  short: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  area: string;
  whatsapp: string;
  updated_at: string;
};

export type Fertilizer = {
  id: string;
  slug: string;
  name: string;
  short: string;
  price_per_kg: number;
  bag_kg: number;
  content: string | null;
  usage: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Procedure = {
  id: string;
  step_number: number;
  title: string;
  body: string | null;
};

export type Faq = {
  id: string;
  question: string;
  answer: string | null;
  sort_order: number;
};

export type Principle = {
  id: string;
  title: string;
  body: string;
  sort_order: number;
};

export type ContactTopic = {
  id: string;
  label: string;
  sort_order: number;
};

export type NewsArticle = {
  id: string;
  title: string;
  body: string | null;
  image_url: string | null;
  author: string;
  is_published: boolean;
  created_at: string;
};

export type Kiosk = {
  id: string;
  name: string;
  address: string | null;
  village: string | null;
  district: string | null;
  phone: string | null;
  is_active: boolean;
};

export type PageVisit = {
  page: string;
  views: number;
  last_updated: string;
};

export type SiteTexts = Record<string, string>;

// Hasil seragam dari server actions. Pakai di komponen untuk menampilkan
// error (mis. "Isi nama terlebih dahulu").
export type ActionResult = { ok?: boolean; error?: string };

export function errOf(res: ActionResult | null | undefined): string | null {
  if (res && "error" in res && res.error) return res.error;
  return null;
}

// Schema longgar untuk klien Supabase tanpa generated types.
// .from("nama_tabel") jadi valid untuk semua tabel proyek ini.
export type SupabaseDb = {
  public: {
    Tables: Record<string, any>;
    Views: Record<string, any>;
    Functions: Record<string, any>;
  };
};

export function isFilled(value: string): boolean {
  return value.trim() !== "" && !value.startsWith("[");
}

export const formatRupiah = (n: number | string) =>
  "Rp" + Number(n).toLocaleString("id-ID");

/** Alias lama, komponen memakainya dengan nama pendek. */
export const rupiah = formatRupiah;
