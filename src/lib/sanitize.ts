import sanitizeHtml from "sanitize-html";

/**
 * Sanitasi HTML body berita sebelum dirender di halaman publik.
 * Konten berasal dari rich text editor di panel admin, tetap dianggap
 * tidak tepercaya: script/event handler/iframe dibuang di sini.
 * Izinkan hanya tag dari toolbar Tiptap (p, h2-h3, ul/ol/li, strong, em,
 * a, br) ditag struktural dasar.
 *
 * sanitize-html dipilih alih-alih DOMPurify: murni Node tanpa DOM browser,
 * jadi aman dimuat di runtime serverless Vercel (jsdom gagal di sana).
 */
export function sanitizeNewsHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["p", "h2", "h3", "ul", "ol", "li", "strong", "em", "a", "br", "blockquote"],
    allowedAttributes: { a: ["href", "rel", "target"] },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { a: ["http", "https", "mailto"] },
    // Tiptap menulis entity aman; biarkan lolos tanpa escape ganda.
    disallowedTagsMode: "discard",
  });
}
