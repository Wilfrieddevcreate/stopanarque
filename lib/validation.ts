/**
 * Validation and sanitisation helpers used across all API routes.
 * Single source of truth — add rules here, reference them everywhere.
 */

// ── String helpers ─────────────────────────────────────────────────────────────

export function str(v: unknown, max = 500): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

export function optStr(v: unknown, max = 500): string | null {
  const s = str(v, max);
  return s === "" ? null : s;
}

// ── Phone number ───────────────────────────────────────────────────────────────

// Accepts digits + optional leading +, spaces, dashes, parentheses. 6–20 chars after strip.
const PHONE_RE = /^\+?[\d\s\-().]{6,20}$/;

export function normalizePhone(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const stripped = raw.replace(/[\s\-().]/g, "");
  if (!PHONE_RE.test(raw) || stripped.length < 6 || stripped.length > 20) return null;
  return stripped;
}

// ── Enum allowlist ─────────────────────────────────────────────────────────────

export const SCAM_TYPES = [
  "Arnaque Mobile Money",
  "Arnaque bancaire",
  "Phishing / Hameçonnage",
  "Faux vendeur en ligne",
  "Faux emploi",
  "Arnaque à l'investissement",
  "Faux prêt",
  "Loterie / Faux gain",
  "Usurpation d'identité",
  "Arnaque aux sentiments",
  "Sextorsion / Chantage intime",
  "Faux agent immobilier",
  "Arnaque aux bourses / visa",
  "Faux médicament / guérisseur",
  "Faux support technique",
  "Appel frauduleux",
  "SMS frauduleux",
  "Autre",
] as const;

export const PLATFORMS = [
  "WhatsApp",
  "Appel téléphonique",
  "SMS",
  "Facebook",
  "Instagram",
  "Telegram",
  "Email",
  "Autre",
] as const;

export const CATEGORIES = ["Alerte", "Conseil", "Actualité", "Communiqué"] as const;
export const REPORT_STATUSES = ["EN_ATTENTE", "EN_ANALYSE", "CONFIRME", "REJETE"] as const;
export const ADMIN_ACTIONS = ["validate", "reject", "analyze"] as const;

export function allowedEnum<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  if (typeof value !== "string") return null;
  return (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

// ── Upload ─────────────────────────────────────────────────────────────────────

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
export const ALLOWED_EVIDENCE_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "application/pdf",
] as const;

// Magic bytes for the types we accept (first 4 bytes)
const MAGIC: Record<string, readonly number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png":  [[0x89, 0x50, 0x4e, 0x47]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF....WEBP — partial check
  "image/gif":  [[0x47, 0x49, 0x46, 0x38]],
  "application/pdf": [[0x25, 0x50, 0x44, 0x46]],
};

export async function verifyMagicBytes(file: File, declaredType: string): Promise<boolean> {
  const signatures = MAGIC[declaredType];
  if (!signatures) return false;
  const header = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  return signatures.some((sig) => sig.every((byte, i) => header[i] === byte));
}

export function safeFilename(original: string): string {
  const ext = original.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "bin";
  // Only keep alphanumeric and a safe subset; generate random base to prevent enumeration
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
}

// ── CSV injection prevention ───────────────────────────────────────────────────

// Prefixes that trigger formula execution in Excel / LibreOffice
const CSV_FORMULA_RE = /^[=+\-@\t\r]/;

export function csvCell(value: string): string {
  const s = value.replace(/"/g, '""'); // escape double-quotes
  if (CSV_FORMULA_RE.test(s)) return `"'${s}"`; // prepend single-quote to neutralise formula
  return `"${s}"`;
}

// ── IP extraction ──────────────────────────────────────────────────────────────

/**
 * Returns the most-trustworthy client IP available.
 * Prefers CF-Connecting-IP (Cloudflare) > X-Real-IP > first entry of X-Forwarded-For.
 * Never returns "unknown" as a rate-limit key — falls back to a hash of the UA string.
 */
export function clientIp(request: { headers: { get: (k: string) => string | null } }): string {
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded;
  // Fallback: use user-agent hash to avoid shared "unknown" bucket
  const ua = request.headers.get("user-agent") ?? "noua";
  let h = 0;
  for (let i = 0; i < ua.length; i++) h = ((h << 5) - h + ua.charCodeAt(i)) | 0;
  return `ua-${(h >>> 0).toString(16)}`;
}

// ── Redirect safety ────────────────────────────────────────────────────────────

/** Ensures a redirect target is a relative internal path, not an external URL. */
export function safeRedirectPath(raw: string | null, fallback = "/admin"): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return fallback;
  try {
    // If it parses as an absolute URL, reject it
    new URL(raw, "http://localhost");
    if (raw.includes("://")) return fallback;
  } catch {
    return fallback;
  }
  return raw;
}
