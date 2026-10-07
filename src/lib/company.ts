// Single source for company facts. Values wrapped in [ ] are placeholders the
// owner still has to supply; isFilled() lets the UI show them honestly.
export const company = {
  name: "CV Subur Anugerah Sejahtera",
  short: "SAS",
  address: "[ALAMAT KANTOR / GUDANG]",
  // Digits only with country code, e.g. 6281234567890. Used for wa.me links.
  whatsapp: "[NOMOR WHATSAPP]",
  phoneDisplay: "[NOMOR TELEPON]",
  email: "[EMAIL]",
  hours: "[JAM LAYANAN]",
  area: "[WILAYAH KERJA]",
};

export function isFilled(value: string) {
  return value.trim() !== "" && !value.startsWith("[");
}

export type Fertilizer = {
  id: string;
  name: string;
  short: string;
  pricePerKg: number;
  bagKg: number;
  content: string;
  use: string;
};

// HET pupuk bersubsidi per Keputusan Menteri Pertanian yang berlaku.
// Verify against the latest Kepmentan before publishing; prices change by decree.
export const fertilizers: Fertilizer[] = [
  {
    id: "urea",
    name: "Urea bersubsidi",
    short: "Urea",
    pricePerKg: 1800,
    bagKg: 50,
    content: "Nitrogen (N) 46%. Butiran berwarna merah muda sebagai penanda subsidi.",
    use: "Pemupukan susulan untuk pertumbuhan daun dan anakan.",
  },
  {
    id: "npk",
    name: "NPK Phonska bersubsidi",
    short: "NPK Phonska",
    pricePerKg: 1840,
    bagKg: 50,
    content: "N 15%, P₂O₅ 10%, K₂O 12%. Pupuk majemuk dalam satu butir.",
    use: "Pemupukan dasar untuk akar, batang, dan pengisian bulir.",
  },
];

export const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");
