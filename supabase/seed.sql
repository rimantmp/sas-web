-- ============================================================
-- Web SAS - data awal
-- Data diambil dari src/lib/company.ts dan konstanta komponen
-- pada saat CMS dibangun. Bisa diubah lewat admin nanti.
-- ============================================================

-- Info perusahaan. Placeholder pemilik ([...]) dipertahankan supaya
-- tampilan "belum diisi" konsisten dengan isFilled() di komponen.
insert into public.company_info (id, name, short, address, whatsapp, phone, email, hours, area)
values (
  1,
  'CV Subur Anugerah Sejahtera',
  'SAS',
  '[ALAMAT KANTOR / GUDANG]',
  '[NOMOR WHATSAPP]',
  '[NOMOR TELEPON]',
  '[EMAIL]',
  '[JAM LAYANAN]',
  '[WILAYAH KERJA]'
)
on conflict (id) do nothing;

-- Pupuk. Harga per Kepmentan saat CMS dibangun; cek Kepmentan terbaru
-- sebelum dipublikasikan ulang.
insert into public.fertilizers (slug, name, short, price_per_kg, bag_kg, content, usage, sort_order, is_active) values
  ('urea', 'Urea bersubsidi', 'Urea', 1800, 50,
   'Nitrogen (N) 46%. Butiran berwarna merah muda sebagai penanda subsidi.',
   'Pemupukan susulan untuk pertumbuhan daun dan anakan.', 1, true),
  ('npk', 'NPK Phonska bersubsidi', 'NPK Phonska', 1840, 50,
   'N 15%, P₂O₅ 10%, K₂O 12%. Pupuk majemuk dalam satu butir.',
   'Pemupukan dasar untuk akar, batang, dan pengisian bulir.', 2, true)
on conflict (slug) do nothing;

-- Prosedur penebusan (5 langkah).
insert into public.procedures (step_number, title, body) values
  (1, 'Pastikan nama Anda ada di e-RDKK',
   'Petani harus tergabung dalam kelompok tani dan tercatat dalam e-RDKK. Tanyakan ke ketua kelompok tani atau penyuluh (PPL) jika belum yakin.'),
  (2, 'Bawa e-KTP asli ke kios resmi',
   'Datang ke kios pupuk resmi di desa atau kecamatan Anda. Kios resmi memasang papan nama dan daftar HET.'),
  (3, 'Petugas kios memeriksa alokasi Anda',
   'Petugas memindai NIK di aplikasi i-Pubers dan melihat sisa jatah pupuk Anda untuk musim ini.'),
  (4, 'Bayar sesuai HET',
   'Bayar tidak lebih dari HET. Tidak ada biaya administrasi dan tidak ada kewajiban membeli produk lain.'),
  (5, 'Terima pupuk dan bukti transaksi',
   'Periksa kemasan masih bersegel. Petugas akan memotret Anda bersama pupuk sebagai bukti penebusan.')
on conflict (step_number) do nothing;

-- FAQ (5 butir).
insert into public.faqs (question, answer, sort_order) values
  ('Siapa yang berhak menebus pupuk bersubsidi?',
   'Petani yang tergabung dalam kelompok tani, tercatat di e-RDKK, dan menanam komoditas yang ditetapkan pemerintah, dengan batas luas lahan sesuai aturan yang berlaku. Jatah setiap petani tercatat dalam alokasi e-RDKK.', 1),
  ('Apakah cukup membawa e-KTP?',
   'Ya. Petugas kios memindai NIK di aplikasi i-Pubers untuk melihat jatah Anda. Jika diwakilkan, bawa surat kuasa dan Kartu Keluarga.', 2),
  ('Kios meminta biaya tambahan atau menyuruh membeli produk lain. Bolehkah?',
   'Tidak boleh. HET sudah mencakup semua biaya sampai di kios. Biaya tambahan, harga di atas HET, atau paket wajib adalah pelanggaran. Laporkan nama kios, tanggal, dan bukti transaksi kepada kami.', 3),
  ('Nama saya tidak muncul di i-Pubers. Apa yang harus dilakukan?',
   'Hubungi ketua kelompok tani dan penyuluh pertanian (PPL) di BPP kecamatan untuk memeriksa data e-RDKK Anda. Distributor dan kios tidak bisa menambah nama ke e-RDKK.', 4),
  ('Pupuk di kios kosong saat musim pemupukan. Ke mana melapor?',
   'Sampaikan kepada kami lewat formulir kontak di bawah, sebutkan nama kios dan desa. Kami akan memeriksa jadwal pengiriman ke kios tersebut.', 5)
on conflict (id) do nothing;

-- Enam Tepat (AboutSection).
insert into public.principles (title, body, sort_order) values
  ('Tepat jenis', 'Urea atau NPK Phonska sesuai yang dialokasikan untuk komoditas petani.', 1),
  ('Tepat jumlah', 'Volume sesuai alokasi e-RDKK, tidak dikurangi.', 2),
  ('Tepat harga', 'Ditebus sesuai HET, tanpa biaya tambahan atau paket wajib.', 3),
  ('Tepat tempat', 'Disalurkan ke kios resmi yang terdaftar dan dekat dengan petani.', 4),
  ('Tepat waktu', 'Stok tersedia di kios sebelum masa pemupukan.', 5),
  ('Tepat mutu', 'Kemasan utuh bersegel dari produsen, sesuai standar.', 6)
on conflict (id) do nothing;

-- Topik kontak.
insert into public.contact_topics (label, sort_order) values
  ('Tanya jadwal kirim atau stok di kios', 1),
  ('Nama tidak muncul di i-Pubers', 2),
  ('Lapor harga di atas HET atau paket wajib', 3),
  ('Pengajuan menjadi kios resmi', 4),
  ('Lainnya', 5)
on conflict (id) do nothing;

-- Teks situs yang dapat diedit. Key stabil; value default = teks saat CMS
-- dibangun. Jangan ubah key (kode tidak akan berubah) kecuali juga
-- mengubah const di kode.
-- Format: sebagian polos (kalimat), sebagian JSON (daftar/nav) agar
-- struktur seperti label+href tetap utuh.
insert into public.site_texts (key, value) values
  -- Hero
  ('hero_title', 'Pupuk bersubsidi sampai di kios, dengan harga sesuai HET.'),
  ('hero_sub', 'Kami menyalurkan pupuk Urea dan NPK Phonska bersubsidi dari produsen ke kios pupuk resmi, supaya petani yang terdaftar di e-RDKK bisa menebus tepat waktu dengan e-KTP.'),
  ('hero_cta_primary', 'Hitung biaya tebus'),
  ('hero_cta_primary_href', '#kalkulator'),
  ('hero_cta_secondary', 'Cara menebus pupuk'),
  ('hero_cta_secondary_href', '#cara-tebus'),
  ('hero_board_title', 'HET per sak'),
  ('hero_board_caption', 'Harga eceran tertinggi'),
  ('hero_board_foot', 'Acuan: Keputusan Menteri Pertanian tentang HET pupuk bersubsidi. Kios tidak boleh menjual di atas harga ini.'),
  -- Tentang
  ('about_title', 'Tugas kami di rantai pupuk bersubsidi'),
  ('about_p1', 'Sebagai distributor, kami menerima pupuk bersubsidi dari produsen, menyimpannya di gudang, lalu mengirimkannya ke kios pupuk resmi di wilayah kerja kami. Dari kios itulah petani menebus pupuk.'),
  ('about_p2', 'Kami juga mencatat setiap penyaluran dan memastikan kios menjual sesuai HET.'),
  ('about_label_area', 'Wilayah kerja'),
  ('about_label_address', 'Kantor dan gudang'),
  ('principles_heading', 'Enam tepat yang kami pegang'),
  ('principles_intro', 'Prinsip penyaluran pupuk bersubsidi dari pemerintah. Kalau salah satunya tidak terpenuhi di kios, petani berhak melapor.'),
  -- Produk & HET
  ('pricing_title', 'Pupuk yang kami salurkan'),
  ('pricing_intro', 'Semua pupuk berasal dari produsen resmi, dalam kemasan bersegel bertanda subsidi. Harga di bawah adalah batas tertinggi di kios.'),
  ('pricing_foot', 'Pupuk bersubsidi adalah barang dalam pengawasan pemerintah. Pupuk ini hanya boleh dijual kepada petani yang terdaftar di e-RDKK, sesuai alokasi masing-masing, dan tidak boleh dijual bebas.'),
  -- Kalkulator
  ('calculator_title', 'Hitung biaya tebus sebelum ke kios'),
  ('calculator_intro', 'Pilih pupuk dan jumlah sak. Angka yang keluar adalah batas tertinggi yang boleh Anda bayar.'),
  ('calculator_result_label', 'Paling banyak Anda bayar'),
  -- Prosedur
  ('procedure_title', 'Cara menebus pupuk bersubsidi'),
  ('procedure_aside_title', 'Yang perlu dibawa'),
  ('procedure_aside_items', '[{"t":"e-KTP asli","d":"milik petani yang terdaftar."},{"t":"surat kuasa dan Kartu Keluarga","d":"Jika diwakilkan anggota keluarga."},{"t":"Uang sesuai HET","d":"Hitung dulu di kalkulator di atas."}]'),
  ('procedure_aside_note', 'Nama tidak muncul atau jatah tidak sesuai? Hubungi penyuluh pertanian (PPL) di BPP kecamatan, atau tanyakan ke kami.'),
  -- FAQ
  ('faq_title', 'Pertanyaan yang sering kami terima'),
  -- Kontak
  ('contact_title', 'Hubungi kantor distributor'),
  ('contact_intro', 'Untuk petani, kios, dan penyuluh: tanya stok, minta bantuan soal i-Pubers, atau laporkan kios yang menjual di atas HET.'),
  ('contact_label_address', 'Kantor dan gudang'),
  ('contact_label_phone', 'Telepon'),
  ('contact_label_email', 'Email'),
  ('contact_label_hours', 'Jam layanan'),
  ('contact_form_title', 'Kirim pesan lewat WhatsApp'),
  ('contact_form_sub', 'Pesan Anda disusun di sini, lalu dibuka di WhatsApp untuk dikirim.'),
  -- Footer
  ('footer_about', 'Menyalurkan pupuk bersubsidi pemerintah kepada kios pupuk resmi untuk melayani petani terdaftar e-RDKK dengan prinsip enam tepat.'),
  ('footer_nav_title', 'Navigasi'),
  ('footer_watch_title', 'Pengawasan & Aturan'),
  ('footer_watch_text', 'Pupuk bersubsidi adalah barang dalam pengawasan. Penjualan di atas HET atau penyelewengan alokasi merupakan pelanggaran hukum yang diawasi oleh KP3 dan dinas terkait.'),
  ('footer_contact_label', 'Kontak layanan:'),
  -- Navigasi (navbar + footer). JSON: [{"label":"...","href":"..."}].
  -- href menunjuk ke section/halaman yang BENAR-BENAR ada (R-24).
  ('nav_links', '[{"label":"Tentang","href":"#tentang"},{"label":"Berita","href":"/berita"},{"label":"Produk & HET","href":"#harga"},{"label":"Kalkulator","href":"#kalkulator"},{"label":"Cara menebus","href":"#cara-tebus"},{"label":"Tanya jawab","href":"#faq"},{"label":"Kontak","href":"#kontak"}]'),
  ('nav_cta', 'Hitung biaya tebus'),
  ('nav_cta_href', '#kalkulator'),
  ('footer_links', '[{"label":"Tentang kami","href":"#tentang"},{"label":"Berita","href":"/berita"},{"label":"Produk & HET","href":"#harga"},{"label":"Kalkulator tebus","href":"#kalkulator"},{"label":"Cara menebus pupuk","href":"#cara-tebus"},{"label":"Tanya jawab","href":"#faq"},{"label":"Kios resmi","href":"/kios"},{"label":"Kontak","href":"#kontak"}]')
on conflict (key) do nothing;
