"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────────────

interface SecurityEvent {
  id: string;
  ip: string;
  threatType: string;
  severity: string;
  path: string;
  detail: string;
  userAgent: string;
  createdAt: string;
}

interface SecurityBan {
  id: string;
  ip: string;
  reason: string;
  bannedAt: string;
  expiresAt: string;
  autoban: boolean;
}

interface ThreatBreakdown {
  type: string;
  count: number;
}

interface TopAttacker {
  ip: string;
  count: number;
}

interface SecurityData {
  summary: { total24h: number; critical: number; activeBans: number };
  events: SecurityEvent[];
  bans: SecurityBan[];
  threatBreakdown: ThreatBreakdown[];
  topAttackers: TopAttacker[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const THREAT_LABELS: Record<string, string> = {
  sql_injection:    "SQLi",
  xss:              "XSS",
  path_traversal:   "Path traversal",
  rfi:              "RFI",
  brute_force:      "Brute force",
  suspicious_input: "Input suspect",
  scanner:          "Scanner",
  rate_limit:       "Rate limit",
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-100 text-red-700 border border-red-200",
  high:     "bg-orange-100 text-orange-700 border border-orange-200",
  medium:   "bg-yellow-100 text-yellow-700 border border-yellow-200",
  low:      "bg-gray-100 text-gray-600 border border-gray-200",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}min`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}j`;
}

function expiresIn(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return "Expiré";
  const s = Math.floor(diff / 1000);
  if (s < 3600) return `${Math.floor(s / 60)}min`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}j`;
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function SecuritePage() {
  const router = useRouter();
  const [data, setData] = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [removingBan, setRemovingBan] = useState<string | null>(null);
  const [tab, setTab] = useState<"events" | "bans">("events");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/security");
      if (res.status === 401) { router.push("/admin/login"); return; }
      setData(await res.json());
    } catch {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 30_000);
    return () => clearInterval(id);
  }, [fetchData]);

  async function removeBan(banId: string) {
    setRemovingBan(banId);
    await fetch(`/api/admin/security?banId=${banId}`, { method: "DELETE" });
    await fetchData();
    setRemovingBan(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <svg className="w-6 h-6 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!data) return null;

  const maxCount = Math.max(...data.threatBreakdown.map((t) => t.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">Sécurité</h1>
          <p className="text-sm text-muted mt-0.5">Détection automatique des menaces · Mis à jour toutes les 30s</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 text-sm text-muted hover:text-foreground bg-white border border-border rounded-xl px-4 py-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-border p-5">
          <p className="text-xs text-muted font-medium uppercase tracking-wide">Événements (24h)</p>
          <p className="text-3xl font-bold text-foreground mt-2">{data.summary.total24h}</p>
        </div>
        <div className={`rounded-2xl border p-5 ${data.summary.critical > 0 ? "bg-red-50 border-red-200" : "bg-white border-border"}`}>
          <p className="text-xs text-muted font-medium uppercase tracking-wide">Critiques (24h)</p>
          <p className={`text-3xl font-bold mt-2 ${data.summary.critical > 0 ? "text-red-600" : "text-foreground"}`}>
            {data.summary.critical}
          </p>
          {data.summary.critical > 0 && (
            <p className="text-xs text-red-500 mt-1">SQLi · XSS · Path traversal</p>
          )}
        </div>
        <div className={`rounded-2xl border p-5 ${data.summary.activeBans > 0 ? "bg-orange-50 border-orange-200" : "bg-white border-border"}`}>
          <p className="text-xs text-muted font-medium uppercase tracking-wide">Bans actifs</p>
          <p className={`text-3xl font-bold mt-2 ${data.summary.activeBans > 0 ? "text-orange-600" : "text-foreground"}`}>
            {data.summary.activeBans}
          </p>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Threat breakdown (left) */}
        <div className="bg-white rounded-2xl border border-border p-5 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Menaces (7 derniers jours)</h2>
          {data.threatBreakdown.length === 0 ? (
            <p className="text-sm text-muted py-4 text-center">Aucune menace détectée</p>
          ) : (
            data.threatBreakdown.map((t) => (
              <div key={t.type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">
                    {THREAT_LABELS[t.type] ?? t.type}
                  </span>
                  <span className="text-xs text-muted">{t.count}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(t.count / maxCount) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            ))
          )}

          {/* Top attackers */}
          {data.topAttackers.length > 0 && (
            <div className="pt-3 border-t border-border">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Top IPs (7j)</h3>
              <div className="space-y-1.5">
                {data.topAttackers.slice(0, 5).map((a) => (
                  <div key={a.ip} className="flex items-center justify-between">
                    <code className="text-xs text-foreground font-mono truncate max-w-[130px]">{a.ip}</code>
                    <span className="text-xs font-semibold text-red-600 shrink-0">{a.count} evt</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Events / Bans tabs (right) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border">
            {(["events", "bans"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3.5 text-sm font-medium transition-colors ${
                  tab === t
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {t === "events" ? `Événements récents (${data.events.length})` : `Bans actifs (${data.bans.length})`}
              </button>
            ))}
          </div>

          <div className="overflow-auto max-h-[480px]">
            <AnimatePresence mode="wait">
              {tab === "events" ? (
                <motion.div key="events" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  {data.events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <p className="text-sm text-muted font-medium">Aucun événement dans les 24 dernières heures</p>
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">IP</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Menace</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide hidden sm:table-cell">Chemin</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Il y a</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {data.events.map((ev) => (
                          <tr key={ev.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-3">
                              <code className="text-xs font-mono text-foreground">{ev.ip}</code>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${SEVERITY_COLORS[ev.severity] ?? SEVERITY_COLORS.low}`}>
                                {THREAT_LABELS[ev.threatType] ?? ev.threatType}
                              </span>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <span className="text-xs text-muted font-mono truncate block max-w-[220px]" title={ev.path}>
                                {ev.path}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-xs text-muted">{timeAgo(ev.createdAt)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </motion.div>
              ) : (
                <motion.div key="bans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  {data.bans.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <p className="text-sm text-muted font-medium">Aucun ban actif</p>
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">IP bannie</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Raison</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide hidden sm:table-cell">Expire dans</th>
                          <th className="px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {data.bans.map((ban) => (
                          <tr key={ban.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-3">
                              <code className="text-xs font-mono text-foreground">{ban.ip}</code>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                ["sql_injection","xss","path_traversal","rfi"].includes(ban.reason)
                                  ? SEVERITY_COLORS.critical
                                  : SEVERITY_COLORS.high
                              }`}>
                                {THREAT_LABELS[ban.reason] ?? ban.reason}
                              </span>
                              {ban.autoban && (
                                <span className="ml-1.5 text-xs text-muted">auto</span>
                              )}
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <span className="text-xs text-muted">{expiresIn(ban.expiresAt)}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => removeBan(ban.id)}
                                disabled={removingBan === ban.id}
                                className="text-xs text-red-500 hover:text-red-700 hover:underline disabled:opacity-50 transition-colors font-medium"
                              >
                                {removingBan === ban.id ? "..." : "Débannir"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── MFA Setup Section ─────────────────────────────────────────────────────────

export function MfaSetup() {
  const [step, setStep] = useState<"idle" | "scan" | "done">("idle");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [disabling, setDisabling] = useState(false);

  useEffect(() => {
    fetch("/api/admin/me").then(r => r.json()).then(d => {
      if (d.mfaEnabled) setMfaEnabled(true);
    }).catch(() => {});
  }, []);

  async function startSetup() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/mfa");
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setQrDataUrl(data.qrDataUrl);
      setSecret(data.secret);
      setStep("scan");
    } catch {
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  }

  async function activate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "activate", token }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setToken(""); return; }
      setStep("done");
      setMfaEnabled(true);
    } catch {
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  }

  async function disable() {
    setDisabling(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/mfa", { method: "DELETE" });
      if (res.ok) { setMfaEnabled(false); setStep("idle"); }
    } catch {
      setError("Erreur serveur");
    } finally {
      setDisabling(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">Double authentification (MFA)</h3>
          <p className="text-xs text-muted mt-0.5">Protège votre compte même si votre mot de passe est compromis.</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${mfaEnabled ? "bg-success/10 text-success" : "bg-gray-100 text-gray-500"}`}>
          {mfaEnabled ? "Activée" : "Désactivée"}
        </span>
      </div>

      {error && <p className="text-xs text-danger mb-4">{error}</p>}

      {step === "idle" && !mfaEnabled && (
        <button
          onClick={startSetup}
          disabled={loading}
          className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          {loading ? "Chargement..." : "Configurer la MFA"}
        </button>
      )}

      {step === "scan" && qrDataUrl && (
        <div className="space-y-4">
          <p className="text-sm text-muted">Scannez ce QR code avec Google Authenticator, Authy ou toute appli TOTP.</p>
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QR code MFA" className="w-48 h-48 rounded-xl border border-border" />
          </div>
          {secret && (
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-muted mb-1">Ou entrez ce code manuellement</p>
              <p className="font-mono text-sm font-semibold tracking-widest select-all">{secret}</p>
            </div>
          )}
          <form onSubmit={activate} className="flex gap-3">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="flex-1 px-4 py-2.5 rounded-xl border border-border text-center font-mono tracking-widest text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <button
              type="submit"
              disabled={loading || token.length !== 6}
              className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              {loading ? "..." : "Activer"}
            </button>
          </form>
        </div>
      )}

      {(step === "done" || (step === "idle" && mfaEnabled)) && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-success font-medium">✓ MFA active sur votre compte</p>
          <button
            onClick={disable}
            disabled={disabling}
            className="text-xs text-danger hover:underline disabled:opacity-50 transition-colors"
          >
            {disabling ? "..." : "Désactiver"}
          </button>
        </div>
      )}
    </div>
  );
}
