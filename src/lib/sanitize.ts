import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitasi HTML body berita sebelum dirender di halaman publik.
 * Konten berasal dari rich text editor di panel admin, tetap dianggap
 * tidak tepercaya: script/event handler/iframe dibuang di sini.
 * Izinkan hanya tag dari toolbar Tiptap (p, h2-h3, ul/ol/li, strong, em,
 * a, br) ditag struktural dasar.
 */
const ALLOWED_TAGS = [
  "p", "h2", "h3", "ul", "ol", "li", "strong", "em", "a", "br", "blockquote",
];

export function sanitizeNewsHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ["href", "rel", "target"],
    ALLOW_DATA_ATTR: false,
  });
}
