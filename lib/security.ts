/**
 * Threat detection, auto-ban, and security event logging.
 *
 * Seuils d'auto-ban (fenêtre glissante 10 min) :
 *   - sql_injection / xss / path_traversal / rfi : 1 occurrence → ban 24h
 *   - brute_force (login failed)                 : 5 occurrences → ban 1h
 *   - suspicious_input / scanner                 : 10 occurrences → ban 30min
 */

import { prisma } from "./prisma";

// ── Threat types ───────────────────────────────────────────────────────────────

export type ThreatType =
  | "sql_injection"
  | "xss"
  | "path_traversal"
  | "rfi"
  | "brute_force"
  | "suspicious_input"
  | "scanner"
  | "rate_limit";

export type Severity = "low" | "medium" | "high" | "critical";

const SEVERITY_MAP: Record<ThreatType, Severity> = {
  sql_injection:    "critical",
  xss:              "critical",
  path_traversal:   "critical",
  rfi:              "critical",
  brute_force:      "high",
  suspicious_input: "medium",
  scanner:          "medium",
  rate_limit:       "low",
};

// ── Auto-ban thresholds ────────────────────────────────────────────────────────

interface BanPolicy {
  windowMs: number;
  maxEvents: number;
  banDurationMs: number;
}

const BAN_POLICY: Record<ThreatType, BanPolicy> = {
  sql_injection:    { windowMs: 10 * 60_000, maxEvents: 1,  banDurationMs: 24 * 3600_000 },
  xss:              { windowMs: 10 * 60_000, maxEvents: 1,  banDurationMs: 24 * 3600_000 },
  path_traversal:   { windowMs: 10 * 60_000, maxEvents: 1,  banDurationMs: 24 * 3600_000 },
  rfi:              { windowMs: 10 * 60_000, maxEvents: 1,  banDurationMs: 24 * 3600_000 },
  brute_force:      { windowMs: 10 * 60_000, maxEvents: 5,  banDurationMs: 60 * 60_000   },
  suspicious_input: { windowMs: 10 * 60_000, maxEvents: 10, banDurationMs: 30 * 60_000   },
  scanner:          { windowMs: 10 * 60_000, maxEvents: 10, banDurationMs: 30 * 60_000   },
  rate_limit:       { windowMs: 10 * 60_000, maxEvents: 20, banDurationMs: 15 * 60_000   },
};

// ── Pattern detection ──────────────────────────────────────────────────────────

// SQL injection keywords / operators
const SQL_RE = /(\b(union|select|insert|update|delete|drop|alter|exec|execute|cast|convert|information_schema|pg_sleep|sleep|benchmark|load_file|outfile|into\s+dumpfile)\b|--|\/\*.*\*\/|'\s*(or|and)\s*'|\bor\s+\d+=\d+|xp_cmdshell)/i;

// XSS patterns
const XSS_RE = /<[^>]*script|javascript:|on\w+\s*=|<[^>]*(onerror|onload|onfocus|onmouseover)|eval\s*\(|document\s*\.|window\s*\.|alert\s*\(/i;

// Path traversal
const PATH_TRAVERSAL_RE = /(\.\.(\/|\\)|%2e%2e(%2f|%5c)|\.%2f|%2e\.)/i;

// Remote file inclusion
const RFI_RE = /https?:\/\//i;

// Scanner fingerprints (common vuln scanners)
const SCANNER_UA_RE = /nikto|sqlmap|masscan|nmap|dirbuster|gobuster|wfuzz|hydra|zgrab|nuclei|acunetix|burpsuite|nessus|openvas/i;

export interface DetectResult {
  threat: ThreatType;
  detail: string;
}

/** Scans URL + body snippet for known attack patterns. Returns first match found. */
export function detectThreat(
  url: string,
  userAgent: string,
  bodySnippet?: string,
): DetectResult | null {
  const target = [url, bodySnippet ?? ""].join(" ").slice(0, 4000);

  if (SCANNER_UA_RE.test(userAgent))
    return { threat: "scanner", detail: `UA: ${userAgent.slice(0, 120)}` };

  const decoded = (() => {
    try { return decodeURIComponent(target); } catch { return target; }
  })();

  if (PATH_TRAVERSAL_RE.test(decoded))
    return { threat: "path_traversal", detail: decoded.slice(0, 200) };
  if (SQL_RE.test(decoded))
    return { threat: "sql_injection", detail: decoded.slice(0, 200) };
  if (XSS_RE.test(decoded))
    return { threat: "xss", detail: decoded.slice(0, 200) };
  if (bodySnippet && RFI_RE.test(bodySnippet))
    return { threat: "rfi", detail: bodySnippet.slice(0, 200) };

  return null;
}

// ── Ban check ──────────────────────────────────────────────────────────────────

/** Returns true if the IP is currently banned. Expired bans are cleaned lazily. */
export async function checkBan(ip: string): Promise<boolean> {
  const ban = await prisma.securityBan.findUnique({ where: { ip } });
  if (!ban) return false;
  if (ban.expiresAt < new Date()) {
    await prisma.securityBan.delete({ where: { ip } }).catch(() => {});
    return false;
  }
  return true;
}

// ── Log + auto-ban ─────────────────────────────────────────────────────────────

interface LogThreatOptions {
  ip: string;
  threat: ThreatType;
  path: string;
  detail?: string;
  userAgent?: string;
}

/**
 * Records a security event and, if the threshold is exceeded within the policy
 * window, automatically bans the IP for the configured duration.
 * Returns true if the IP was (or already was) banned after this event.
 */
export async function logThreat(opts: LogThreatOptions): Promise<boolean> {
  const severity = SEVERITY_MAP[opts.threat];

  await prisma.securityEvent.create({
    data: {
      ip:         opts.ip,
      threatType: opts.threat,
      severity,
      path:       opts.path.slice(0, 500),
      detail:     (opts.detail ?? "").slice(0, 500),
      userAgent:  (opts.userAgent ?? "").slice(0, 300),
    },
  });

  const policy = BAN_POLICY[opts.threat];
  const since  = new Date(Date.now() - policy.windowMs);

  const count = await prisma.securityEvent.count({
    where: { ip: opts.ip, threatType: opts.threat, createdAt: { gte: since } },
  });

  if (count >= policy.maxEvents) {
    const expiresAt = new Date(Date.now() + policy.banDurationMs);
    await prisma.securityBan.upsert({
      where:  { ip: opts.ip },
      update: { expiresAt, reason: opts.threat, bannedAt: new Date() },
      create: { id: `ban-${opts.ip}-${Date.now()}`, ip: opts.ip, reason: opts.threat, expiresAt },
    });
    return true;
  }

  return false;
}

// ── Cleanup helpers (called lazily) ───────────────────────────────────────────

export async function pruneExpiredBans(): Promise<void> {
  await prisma.securityBan.deleteMany({ where: { expiresAt: { lt: new Date() } } });
}

/** Purge SecurityEvent and PageVisit records older than retentionDays (default 90). */
export async function pruneOldLogs(retentionDays = 90): Promise<void> {
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
  await Promise.all([
    prisma.securityEvent.deleteMany({ where: { createdAt: { lt: cutoff } } }),
    prisma.pageVisit.deleteMany({ where: { createdAt: { lt: cutoff } } }),
  ]);
}
