-- ============================================================
-- Web SAS - init schema
-- CV Subur Anugerah Sejahtera - admin CMS
-- Apply di Supabase SQL editor (atau: supabase db push).
-- ============================================================

-- Semua konten publik + data admin di sini. RLS: anon bisa SELECT
-- konten yang di-publish, mutasi hanya lewat server action dengan
-- service_role key (BYPASSRLS). Tidak ada grant tulis untuk anon.

-- ------------------------------------------------------------
-- 1. Tabel konten
-- ------------------------------------------------------------

-- Info perusahaan: satu baris (singleton), id wajib = 1.
create table public.company_info (
  id         int primary key default 1 check (id = 1),
  name       text not null,
  short      text,
  address    text,
  phone      text,
  email      text,
  hours      text,
  area       text,
  whatsapp   text,
  updated_at timestamptz default now()
);

-- Pupuk yang disalurkan + HET.
create table public.fertilizers (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  short        text,
  price_per_kg numeric(12,2) not null,
  bag_kg       numeric(12,2) not null,
  content      text,
  usage        text,  -- kolom "usage", bukan "use" (bentrok keyword JSX)
  sort_order   int default 0,
  is_active    boolean default true,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Prosedur penebusan: daftar terurut.
create table public.procedures (
  id           uuid primary key default gen_random_uuid(),
  step_number  int not null unique,
  title        text not null,
  body         text,
  created_at   timestamptz default now()
);

-- FAQ.
create table public.faqs (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  answer      text,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- Berita.
create table public.news_articles (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  body         text,
  image_url    text,
  author       text default '',
  is_published boolean default true,
  created_at   timestamptz default now()
);

-- Kios resmi binaan/cabang.
create table public.kios (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  address    text,
  village    text,
  district   text,
  phone      text,
  is_active  boolean default true,
  created_at timestamptz default now()
);

-- Statistik kunjungan per path. Karena page = primary key, cukup upsert.
create table public.page_views (
  page         text primary key,
  views        bigint not null default 0,
  last_updated timestamptz default now()
);

-- Prinsip "Enam tepat" (AboutSection).
create table public.principles (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  body       text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Topik pilihan di form kontak.
create table public.contact_topics (
  id         uuid primary key default gen_random_uuid(),
  label      text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Teks publik yang bisa diedit dari admin: navbar, footer, heading,
-- intro section, dan kalimat kecil lain di landing page.
-- key = identifier stabil, value = teks Indonesia yang tampil.
create table public.site_texts (
  key        text primary key,
  value      text,
  updated_at timestamptz default now()
);

-- Tabel admin: siapa yang berhak mutasi konten. Diisi saat signup.
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 2. Indeks
-- ------------------------------------------------------------

create index fertilizers_sort_idx on public.fertilizers (sort_order);
create index fertilizers_active_idx on public.fertilizers (is_active);
create index faqs_sort_idx on public.faqs (sort_order);
create index principles_sort_idx on public.principles (sort_order);
create index contact_topics_sort_idx on public.contact_topics (sort_order);
create index kios_active_idx on public.kios (is_active);
create index news_articles_created_idx on public.news_articles (created_at desc);
create index news_articles_published_idx on public.news_articles (is_published);
create index page_views_updated_idx on public.page_views (last_updated);

-- ------------------------------------------------------------
-- 3. Row Level Security
-- ------------------------------------------------------------

alter table public.company_info     enable row level security;
alter table public.fertilizers      enable row level security;
alter table public.procedures       enable row level security;
alter table public.faqs             enable row level security;
alter table public.news_articles    enable row level security;
alter table public.kios             enable row level security;
alter table public.page_views       enable row level security;
alter table public.principles       enable row level security;
alter table public.contact_topics   enable row level security;
alter table public.site_texts       enable row level security;
alter table public.admins           enable row level security;

-- Pengunjung (anon) dan user login (authenticated) bisa membaca konten publik.
-- Mutasi tidak: anon/authenticated TIDAK diberi grant insert/update/delete.
do $$
declare t text;
begin
  foreach t in array array[
    'company_info', 'fertilizers', 'procedures', 'faqs', 'news_articles',
    'kios', 'page_views', 'principles', 'contact_topics', 'site_texts'
  ]
  loop
    execute format('create policy "baca publik" on public.%I for select to anon, authenticated using (true);', t);
  end loop;
end
$$;

-- page_views: anon hanya boleh baca, tidak boleh menambah/view. Mutasi
-- (increment) dilakukan server action/route handler dengan service_role.

-- admins: tidak boleh dibaca anon sama sekali; hanya user login melihat
-- baris miliknya sendiri.
create policy "baca admin sendiri" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- ------------------------------------------------------------
-- 4. Grants
-- ------------------------------------------------------------
-- anon + authenticated: SELECT konten publik (grant select).
-- service_role: semua operasi (BYPASSRLS, otoritas penuh).

grant select on table public.company_info, public.fertilizers, public.procedures,
  public.faqs, public.news_articles, public.kios, public.page_views,
  public.principles, public.contact_topics, public.site_texts
  to anon, authenticated;

grant select on table public.admins to authenticated;

grant all on table public.company_info, public.fertilizers, public.procedures,
  public.faqs, public.news_articles, public.kios, public.page_views,
  public.principles, public.contact_topics, public.site_texts, public.admins
  to service_role;

-- ------------------------------------------------------------
-- 5. Storage bucket
-- ------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('news-images', 'news-images', true),
       ('kios-images', 'kios-images', true)
on conflict (id) do nothing;

-- Upload/delete gambar hanya lewat service_role (server action). Anon boleh
-- baca objek (bucket public).
grant select on storage.objects to anon, authenticated;
grant all on storage.objects to service_role;

-- ------------------------------------------------------------
-- 6. Fungsi (RPC) untuk analytics
-- ------------------------------------------------------------

-- Tambah 1 ke page_views untuk halaman. Pakai lock untuk mencegah
-- kehilangan kenaikan (race). Dipanggil server action di api/views.
create or replace function public.track_page_view(p_page text)
  returns void
  language sql
  security definer
  set search_path = public
as $$
  insert into public.page_views (page, views, last_updated)
  values (p_page, 1, now())
  on conflict (page) do update
    set views = page_views.views + 1,
        last_updated = now();
$$;

grant execute on function public.track_page_view(text) to service_role;

