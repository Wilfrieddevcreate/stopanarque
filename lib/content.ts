/**
 * Converts a content string to safe HTML for rendering.
 * - If it's already HTML (from RichEditor), returns it as-is.
 * - If it's legacy plain text (old articles with \n\n paragraphs), wraps in <p> tags.
 */
export function contentToHtml(str: string): string {
  if (!str) return "";
  if (str.trimStart().startsWith("<")) return str;
  return str
    .split(/\n\n+/)
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
}

/**
 * Strips all HTML tags and returns plain text.
 * Used for excerpts/titles displayed as text (not rendered HTML).
 */
export function stripHtml(str: string): string {
  if (!str) return "";
  return str.replace(/<[^>]*>/g, "").trim();
}
