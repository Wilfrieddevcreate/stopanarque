import crypto from "crypto";
import QRCode from "qrcode";
import bcrypt from "bcryptjs";

const APP_NAME = "StopAnarque";
const PERIOD = 30;
const DIGITS = 6;

// Base32 alphabet (RFC 4648)
const BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Decode(encoded: string): Buffer {
  const s = encoded.replace(/=+$/, "").toUpperCase();
  let bits = 0;
  let value = 0;
  let index = 0;
  const output = Buffer.alloc(Math.ceil((s.length * 5) / 8));
  for (const char of s) {
    const idx = BASE32_CHARS.indexOf(char);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      output[index++] = (value >>> (bits - 8)) & 0xff;
      bits -= 8;
    }
  }
  return output.subarray(0, index);
}

function base32Encode(buf: Buffer): string {
  let result = "";
  let bits = 0;
  let value = 0;
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      result += BASE32_CHARS[(value >>> (bits - 5)) & 0x1f];
      bits -= 5;
    }
  }
  if (bits > 0) result += BASE32_CHARS[(value << (5 - bits)) & 0x1f];
  return result;
}

/** Generate a random base32 TOTP secret (20 bytes = 160 bits). */
export function generateTotpSecret(): string {
  return base32Encode(crypto.randomBytes(20));
}

/** Build the otpauth:// URI for QR scanning. */
export function buildOtpauthUrl(email: string, secret: string): string {
  const label = encodeURIComponent(`${APP_NAME}:${email}`);
  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(APP_NAME)}&algorithm=SHA1&digits=${DIGITS}&period=${PERIOD}`;
}

/** Render an otpauth URL as a base64 PNG data URI. */
export async function generateQrDataUrl(otpauthUrl: string): Promise<string> {
  return QRCode.toDataURL(otpauthUrl);
}

/** Compute the TOTP token for a given counter step. */
function hotp(secret: string, counter: number): string {
  const key = base32Decode(secret);
  const buf = Buffer.alloc(8);
  buf.writeUInt32BE(Math.floor(counter / 2 ** 32), 0);
  buf.writeUInt32BE(counter >>> 0, 4);
  const hmac = crypto.createHmac("sha1", key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = ((hmac[offset] & 0x7f) << 24 |
    hmac[offset + 1] << 16 |
    hmac[offset + 2] << 8 |
    hmac[offset + 3]) % 10 ** DIGITS;
  return String(code).padStart(DIGITS, "0");
}

/** Verify a 6-digit TOTP token (±1 step tolerance for clock drift). */
export function verifyTotp(token: string, secret: string): boolean {
  if (!/^\d{6}$/.test(token)) return false;
  const step = Math.floor(Date.now() / 1000 / PERIOD);
  for (const offset of [-1, 0, 1]) {
    if (crypto.timingSafeEqual(
      Buffer.from(hotp(secret, step + offset)),
      Buffer.from(token)
    )) return true;
  }
  return false;
}

/** Generate a setup object (for testing / admin setup). */
export function generateTotpSetup(email: string): { secret: string; otpauthUrl: string } {
  const secret = generateTotpSecret();
  const otpauthUrl = buildOtpauthUrl(email, secret);
  return { secret, otpauthUrl };
}

// ── Backup codes ─────────────────────────────────────────────────────────────

const BACKUP_CODE_COUNT = 8;

/** Generate plaintext backup codes + their bcrypt hashes (for storage). */
export async function generateBackupCodes(): Promise<{
  plainCodes: string[];
  hashedCodes: string[];
}> {
  const plainCodes = Array.from({ length: BACKUP_CODE_COUNT }, () =>
    crypto.randomBytes(5).toString("hex").toUpperCase() // e.g. "A1B2C3D4E5"
  );
  const hashedCodes = await Promise.all(
    plainCodes.map((c) => bcrypt.hash(c, 10))
  );
  return { plainCodes, hashedCodes };
}

/**
 * Try to consume a backup code. Returns true and removes the code if valid.
 * storedJson is the JSON array of bcrypt hashes stored in the DB.
 * Returns { valid, remaining } — persist `remaining` if valid.
 */
export async function consumeBackupCode(
  inputCode: string,
  storedJson: string
): Promise<{ valid: boolean; remaining: string[] }> {
  let hashes: string[] = [];
  try { hashes = JSON.parse(storedJson); } catch { return { valid: false, remaining: [] }; }

  const upper = inputCode.replace(/\s/g, "").toUpperCase();
  for (let i = 0; i < hashes.length; i++) {
    if (await bcrypt.compare(upper, hashes[i])) {
      const remaining = [...hashes.slice(0, i), ...hashes.slice(i + 1)];
      return { valid: true, remaining };
    }
  }
  return { valid: false, remaining: hashes };
}
