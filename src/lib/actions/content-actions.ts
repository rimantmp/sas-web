"use server";

import { revalidatePath } from "next/cache";
import { getAdminOrNull } from "../auth";
import { getServiceRoleClient } from "../supabase/admin";

const db = () => getServiceRoleClient();

function unauthorized() {
  return { error: "Anda tidak berhak melakukan perubahan ini." };
}

// ------------------------------------------------------------
// Info perusahaan
// ------------------------------------------------------------

export async function updateCompanyInfo(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  const fields = [
    "name", "short", "address", "whatsapp", "phone", "email", "hours", "area",
  ] as const;
  const patch: Record<string, string> = {};
  for (const f of fields) patch[f] = String(formData.get(f) ?? "").trim();
  const { error } = await db()
    .from("company_info")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { ok: true };
}

// ------------------------------------------------------------
// Pupuk
// ------------------------------------------------------------

export async function createFertilizer(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  const row = {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    short: String(formData.get("short") ?? "").trim(),
    price_per_kg: Number(formData.get("price_per_kg")),
    bag_kg: Number(formData.get("bag_kg")),
    content: String(formData.get("content") ?? "").trim(),
    usage: String(formData.get("usage") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: formData.get("is_active") === "on",
  };
  if (!row.slug || !row.name || !(row.price_per_kg > 0) || !(row.bag_kg > 0)) {
    return { error: "Slug, nama, harga per kg, dan ukuran sak wajib diisi dengan benar." };
  }
  const { error } = await db().from("fertilizers").insert(row);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { ok: true };
}

export async function updateFertilizer(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "ID pupuk tidak ditemukan." };
  const slug = String(formData.get("slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const price_per_kg = Number(formData.get("price_per_kg"));
  const bag_kg = Number(formData.get("bag_kg"));
  if (!slug || !name || !(price_per_kg > 0) || !(bag_kg > 0)) {
    return { error: "Slug, nama, harga per kg, dan ukuran sak wajib diisi dengan benar." };
  }
  const { error } = await db()
    .from("fertilizers")
    .update({
      slug,
      name,
      short: String(formData.get("short") ?? "").trim(),
      price_per_kg,
      bag_kg,
      content: String(formData.get("content") ?? "").trim(),
      usage: String(formData.get("usage") ?? "").trim(),
      sort_order: Number(formData.get("sort_order") ?? 0),
      is_active: formData.get("is_active") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { ok: true };
}

export async function deleteFertilizer(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "ID pupuk tidak ditemukan." };
  const { error } = await db().from("fertilizers").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { ok: true };
}

// ------------------------------------------------------------
// FAQ
// ------------------------------------------------------------

export async function createFaq(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  const question = String(formData.get("question") ?? "").trim();
  if (!question) return { error: "Pertanyaan wajib diisi." };
  const { error } = await db().from("faqs").insert({
    question,
    answer: String(formData.get("answer") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  if (error) return { error: error.message };
  revalidatePath("/");
  return { ok: true };
}

export async function updateFaq(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  const id = String(formData.get("id") ?? "");
  const question = String(formData.get("question") ?? "").trim();
  if (!id || !question) return { error: "Data FAQ tidak lengkap." };
  const { error } = await db()
    .from("faqs")
    .update({
      question,
      answer: String(formData.get("answer") ?? "").trim(),
      sort_order: Number(formData.get("sort_order") ?? 0),
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { ok: true };
}

export async function deleteFaq(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  const id = String(formData.get("id") ?? "");
  const { error } = await db().from("faqs").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { ok: true };
}

// ------------------------------------------------------------
// Prosedur
// ------------------------------------------------------------

export async function createProcedure(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  const step_number = Number(formData.get("step_number"));
  const title = String(formData.get("title") ?? "").trim();
  if (!step_number || !title) return { error: "Nomor langkah dan judul wajib diisi." };
  const { error } = await db().from("procedures").insert({
    step_number,
    title,
    body: String(formData.get("body") ?? "").trim(),
  });
  if (error) return { error: error.message };
  revalidatePath("/");
  return { ok: true };
}

export async function updateProcedure(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  const id = String(formData.get("id") ?? "");
  const step_number = Number(formData.get("step_number"));
  const title = String(formData.get("title") ?? "").trim();
  if (!id || !step_number || !title) return { error: "Data langkah tidak lengkap." };
  const { error } = await db()
    .from("procedures")
    .update({ step_number, title, body: String(formData.get("body") ?? "").trim() })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { ok: true };
}

export async function deleteProcedure(formData: FormData) {
  if (!(await getAdminOrNull())) return unauthorized();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "ID langkah tidak ditemukan." };
  const { error } = await db().from("procedures").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { ok: true };
}
