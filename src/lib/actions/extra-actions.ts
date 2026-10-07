"use server";

import { revalidatePath } from "next/cache";
import { getAdminOrNull } from "../auth";
import { getServiceRoleClient } from "../supabase/admin";
import { randomUUID } from "crypto";

const db = () => getServiceRoleClient();

function unauthorized() {
  return { error: "Anda tidak berhak melakukan perubahan ini." };
}

// ------------------------------------------------------------
// Berita
// ------------------------------------------------------------

export async function createNews(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  if (!title) return { error: "Judul berita wajib diisi." };
  const { error } = await db().from("news_articles").insert({
    title,
    author,
    body: String(formData.get("body") ?? "").trim(),
    image_url: String(formData.get("image_url") ?? "").trim() || null,
    is_published: formData.get("is_published") === "on",
  });
  if (error) return { error: error.message };
  revalidatePath("/berita");
  revalidatePath("/");
  return { ok: true };
}

export async function updateNews(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "ID berita tidak ditemukan." };
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Judul berita wajib diisi." };
  const { error } = await db()
    .from("news_articles")
    .update({
      title,
      body: String(formData.get("body") ?? "").trim(),
      author: String(formData.get("author") ?? "").trim(),
      image_url: String(formData.get("image_url") ?? "").trim() || null,
      is_published: formData.get("is_published") === "on",
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/berita");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteNews(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "ID berita tidak ditemukan." };
  const { error } = await db().from("news_articles").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/berita");
  revalidatePath("/");
  return { ok: true };
}

// ------------------------------------------------------------
// Kios
// ------------------------------------------------------------

export async function createKiosk(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Nama kios wajib diisi." };
  const { error } = await db().from("kios").insert({
    name,
    address: String(formData.get("address") ?? "").trim() || null,
    village: String(formData.get("village") ?? "").trim() || null,
    district: String(formData.get("district") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    is_active: formData.get("is_active") === "on",
  });
  if (error) return { error: error.message };
  revalidatePath("/kios");
  return { ok: true };
}

export async function updateKiosk(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return { error: "Data kios tidak lengkap." };
  const { error } = await db()
    .from("kios")
    .update({
      name,
      address: String(formData.get("address") ?? "").trim() || null,
      village: String(formData.get("village") ?? "").trim() || null,
      district: String(formData.get("district") ?? "").trim() || null,
      phone: String(formData.get("phone") ?? "").trim() || null,
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/kios");
  return { ok: true };
}

export async function deleteKiosk(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "ID kios tidak ditemukan." };
  const { error } = await db().from("kios").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/kios");
  return { ok: true };
}

// ------------------------------------------------------------
// Prinsip (Enam Tepat)
// ------------------------------------------------------------

export async function createPrinciple(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Judul prinsip wajib diisi." };
  const { error } = await db().from("principles").insert({
    title,
    body: String(formData.get("body") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  if (error) return { error: error.message };
  revalidatePath("/");
  return { ok: true };
}

export async function updatePrinciple(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!id || !title) return { error: "Data prinsip tidak lengkap." };
  const { error } = await db()
    .from("principles")
    .update({
      title,
      body: String(formData.get("body") ?? "").trim(),
      sort_order: Number(formData.get("sort_order") ?? 0),
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { ok: true };
}

export async function deletePrinciple(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  const id = String(formData.get("id") ?? "");
  const { error } = await db().from("principles").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { ok: true };
}

// ------------------------------------------------------------
// Topik kontak
// ------------------------------------------------------------

export async function createContactTopic(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  const label = String(formData.get("label") ?? "").trim();
  if (!label) return { error: "Label topik wajib diisi." };
  const { error } = await db().from("contact_topics").insert({
    label,
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  if (error) return { error: error.message };
  revalidatePath("/");
  return { ok: true };
}

export async function deleteContactTopic(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  const id = String(formData.get("id") ?? "");
  const { error } = await db().from("contact_topics").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { ok: true };
}

// ------------------------------------------------------------
// Teks situs (navbar, hero, heading, footer, dll)
// ------------------------------------------------------------

/**
 * Simpan banyak teks situs sekaligus dari form per-seksi. `payload` diirim
 * lewat hidden input "entries" berformat JSON {key: value} supaya form
 * bisa memakai action server biasa (bukan JSON argument).
 */
export async function updateSiteTexts(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  let entries: Record<string, string>;
  try {
    entries = JSON.parse(String(formData.get("entries") ?? "{}"));
  } catch {
    return { error: "Data form tidak valid." };
  }
  const rows = Object.entries(entries).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));
  if (rows.length === 0) return { error: "Tidak ada perubahan." };
  const { error } = await db().from("site_texts").upsert(rows);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/berita");
  revalidatePath("/kios");
  return { ok: true };
}

// ------------------------------------------------------------
// Upload gambar ke storage
// ------------------------------------------------------------

export async function uploadImage(formData: FormData) {
  const user = await getAdminOrNull();
  if (!user) return { error: "Anda tidak berhak melakukan ini." };

  const file = formData.get("file");
  const kind = String(formData.get("kind") ?? "news");
  if (!(file instanceof File) || !file.size) {
    return { error: "Pilih file gambar dulu." };
  }
  const allowed = kind === "kios" ? ["kios-images"] : ["news-images"];
  const bucket = allowed[0];

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const path = `${kind === "kios" ? "kios" : "articles"}/${year}/${month}/${randomUUID()}.${ext}`;

  const { error } = await db().storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return { error: error.message };

  const { data: pub } = db().storage.from(bucket).getPublicUrl(path);
  return { url: pub.publicUrl, path };
}
