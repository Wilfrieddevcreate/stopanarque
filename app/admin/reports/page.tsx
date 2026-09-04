"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
const swal = () => import("sweetalert2").then((m) => m.default);
import { STATUS_LABELS, STATUS_COLORS, type ReportStatus } from "@/lib/types";
import { FadeIn } from "@/components/MotionDiv";

interface Evidence {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
}

interface AdminActionItem {
  id: string;
  action: string;
  comment: string | null;
  createdAt: string;
  user: { name: string };
}

interface Report {
  id: string;
  trackingCode: string;
  phoneNumber: string;
  suspectName: string | null;
  suspectPlatform: string | null;
  suspectAccount: string | null;
  suspectUrl: string | null;
  description: string;
  scamType: string;
  amountLost: string | null;
  incidentDate: string | null;
  contactEmail: string | null;
  isAttemptOnly: boolean;
  status: ReportStatus;
  createdAt: string;
  evidences: Evidence[];
  actions: AdminActionItem[];
}

interface StatsReport {
  id: string;
  scamType: string;
  suspectPlatform: string | null;
  status: string;
}

type SortMode = "recent" | "frequent";

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [statsData, setStatsData] = useState<StatsReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [sort, setSort] = useState<SortMode>("recent");
  const [showFilters, setShowFilters] = useState(false);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/admin/reports?all=stats");
    if (res.status === 401) { router.push("/admin/login"); return; }
    if (!res.ok) return;
    const data = await res.json();
    setStatsData(data.stats ?? []);
  }, [router]);

  const fetchReports = useCallback(async (cursor?: string | null) => {
    const url = cursor ? `/api/admin/reports?cursor=${cursor}` : "/api/admin/reports";
    const res = await fetch(url);
    if (res.status === 401) { router.push("/admin/login"); return; }
    if (!res.ok) return;
    const data = await res.json();
    if (cursor) {
      setReports((prev) => [...prev, ...(data.reports ?? [])]);
    } else {
      setReports(data.reports ?? []);
    }
    setNextCursor(data.nextCursor ?? null);
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        await Promise.all([fetchStats(), fetchReports()]);
      } catch {
        // erreur réseau ou serveur — on sort du spinner quand même
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    init();
    return () => { cancelled = true; };
  }, [fetchStats, fetchReports]);

  useEffect(() => {
    if (!sentinelRef.current || !nextCursor) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextCursor && !loadingMore) {
        setLoadingMore(true);
        fetchReports(nextCursor).finally(() => setLoadingMore(false));
      }
    }, { rootMargin: "200px" });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [nextCursor, loadingMore, fetchReports]);

  async function refreshAll() {
    await Promise.all([fetchStats(), fetchReports()]);
  }

  const phoneFrequency = useMemo(() => {
    const map: Record<string, number> = {};
    for (const r of reports) map[r.phoneNumber] = (map[r.phoneNumber] || 0) + 1;
    return map;
  }, [reports]);

  const topSuspects = useMemo(() => {
    return Object.entries(phoneFrequency)
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [phoneFrequency]);

  const allTypes = useMemo(() => [...new Set(statsData.map((r) => r.scamType))].sort(), [statsData]);
  const allPlatforms = useMemo(
    () => [...new Set(statsData.map((r) => r.suspectPlatform).filter(Boolean))].sort() as string[],
    [statsData],
  );

  const stats = useMemo(() => ({
    total: statsData.length,
    enAttente: statsData.filter((r) => r.status === "EN_ATTENTE").length,
    enAnalyse: statsData.filter((r) => r.status === "EN_ANALYSE").length,
    confirme: statsData.filter((r) => r.status === "CONFIRME").length,
    rejete: statsData.filter((r) => r.status === "REJETE").length,
  }), [statsData]);

  const filteredReports = useMemo(() => {
    let list = reports;
    if (statusFilter) list = list.filter((r) => r.status === statusFilter);
    if (typeFilter) list = list.filter((r) => r.scamType === typeFilter);
    if (platformFilter) list = list.filter((r) => r.suspectPlatform === platformFilter);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((r) =>
        r.phoneNumber.toLowerCase().includes(q) ||
        r.suspectName?.toLowerCase().includes(q) ||
        r.suspectAccount?.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.scamType.toLowerCase().includes(q) ||
        r.trackingCode.toLowerCase().includes(q),
      );
    }
    if (sort === "frequent") {
      list = [...list].sort((a, b) => (phoneFrequency[b.phoneNumber] || 0) - (phoneFrequency[a.phoneNumber] || 0));
    }
    return list;
  }, [reports, statusFilter, typeFilter, platformFilter, search, sort, phoneFrequency]);

  const activeFilterCount =
    [statusFilter, typeFilter, platformFilter].filter(Boolean).length + (sort !== "recent" ? 1 : 0);

  function clearFilters() {
    setSearch(""); setStatusFilter(""); setTypeFilter(""); setPlatformFilter(""); setSort("recent");
  }

  async function handleAction(reportId: string, action: string, label: string) {
    const result = await (await swal()).fire({
      title: `${label} ce signalement ?`,
      input: "textarea",
      inputLabel: "Commentaire (optionnel)",
      inputPlaceholder: "Ajoutez un commentaire...",
      showCancelButton: true,
      confirmButtonColor: "#E8112D",
      cancelButtonText: "Annuler",
      confirmButtonText: "Confirmer",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, action, comment: result.value || "" }),
      });
      if (res.ok) {
        await refreshAll();
        setSelectedReport(null);
        await (await swal()).fire({ icon: "success", title: "Action effectuée", timer: 1500, showConfirmButton: false });
      }
    } catch {
      await (await swal()).fire({ icon: "error", title: "Erreur" });
    }
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Signalements</h1>
          <p className="text-muted mt-1">{stats.total} signalement{stats.total !== 1 ? "s" : ""} reçu{stats.total !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => {
            const params = new URLSearchParams();
            params.set("format", "csv");
            if (statusFilter) params.set("status", statusFilter);
            if (typeFilter) params.set("type", typeFilter);
            window.open(`/api/admin/export?${params.toString()}`);
          }}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors bg-white hover:bg-gray-50 border border-border px-3 py-1.5 rounded-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        {[
          { label: "Total", value: stats.total, color: "text-foreground", onClick: () => setStatusFilter("") },
          { label: "En attente", value: stats.enAttente, color: "text-yellow-600", onClick: () => setStatusFilter("EN_ATTENTE") },
          { label: "En analyse", value: stats.enAnalyse, color: "text-success", onClick: () => setStatusFilter("EN_ANALYSE") },
          { label: "Confirmés", value: stats.confirme, color: "text-primary", onClick: () => setStatusFilter("CONFIRME") },
          { label: "Rejetés", value: stats.rejete, color: "text-gray-500", onClick: () => setStatusFilter("REJETE") },
        ].map((s) => (
          <motion.button
            key={s.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={s.onClick}
            className="bg-white rounded-xl border border-border p-4 text-left hover:border-primary/30 transition-colors"
          >
            <p className="text-xs text-muted font-medium uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 font-heading ${s.color}`}>{s.value}</p>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main list */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search + filter bar */}
          <div className="bg-white rounded-2xl border border-border p-4 space-y-4 sticky top-[65px] z-30 shadow-sm">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher numéro, nom, compte, code de suivi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSort(sort === "recent" ? "frequent" : "recent")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors shrink-0 ${
                  sort === "frequent" ? "bg-primary text-white border-primary" : "bg-gray-50 text-gray-600 border-border hover:bg-gray-100"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                <span className="hidden sm:inline">{sort === "frequent" ? "Les + signalés" : "Récents"}</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors shrink-0 ${
                  showFilters || activeFilterCount > 0 ? "bg-primary text-white border-primary" : "bg-gray-50 text-gray-600 border-border hover:bg-gray-100"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="hidden sm:inline">Filtres</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-white/20 rounded-full text-xs flex items-center justify-center">{activeFilterCount}</span>
                )}
              </motion.button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-border space-y-4">
                    <FilterRow label="Statut">
                      {[
                        { label: "Tous", value: "" },
                        { label: "En attente", value: "EN_ATTENTE" },
                        { label: "En analyse", value: "EN_ANALYSE" },
                        { label: "Confirmés", value: "CONFIRME" },
                        { label: "Rejetés", value: "REJETE" },
                      ].map((f) => (
                        <Chip key={f.value} active={statusFilter === f.value} onClick={() => setStatusFilter(f.value)}>
                          {f.label}
                        </Chip>
                      ))}
                    </FilterRow>
                    <FilterRow label="Type d'arnaque">
                      <Chip active={!typeFilter} onClick={() => setTypeFilter("")}>Tous</Chip>
                      {allTypes.map((t) => (
                        <Chip key={t} active={typeFilter === t} onClick={() => setTypeFilter(typeFilter === t ? "" : t)}>{t}</Chip>
                      ))}
                    </FilterRow>
                    {allPlatforms.length > 0 && (
                      <FilterRow label="Plateforme">
                        <Chip active={!platformFilter} onClick={() => setPlatformFilter("")}>Toutes</Chip>
                        {allPlatforms.map((p) => (
                          <Chip key={p} active={platformFilter === p} onClick={() => setPlatformFilter(platformFilter === p ? "" : p)}>{p}</Chip>
                        ))}
                      </FilterRow>
                    )}
                    {activeFilterCount > 0 && (
                      <button onClick={clearFilters} className="text-xs text-primary font-medium hover:underline">
                        Réinitialiser tous les filtres
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between text-xs text-muted">
              <span>{filteredReports.length} résultat{filteredReports.length !== 1 ? "s" : ""}</span>
              {search && (
                <button onClick={() => setSearch("")} className="text-primary hover:underline">Effacer</button>
              )}
            </div>
          </div>

          {/* Reports list */}
          <div className="space-y-2">
            {filteredReports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
                className="bg-white rounded-xl border border-border p-4 cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono font-semibold text-foreground text-sm">{report.phoneNumber}</span>
                      {phoneFrequency[report.phoneNumber] >= 2 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold">
                          {phoneFrequency[report.phoneNumber]}x
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_COLORS[report.status]}`}>
                        {STATUS_LABELS[report.status]}
                      </span>
                    </div>
                    <p className="text-sm text-muted truncate">{report.description}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-400 flex-wrap">
                      <span>{report.scamType}</span>
                      {report.suspectName && <span>· {report.suspectName}</span>}
                      {report.suspectPlatform && <span>· {report.suspectPlatform}</span>}
                      <span>· {new Date(report.createdAt).toLocaleDateString("fr-FR")}</span>
                      {report.evidences.length > 0 && <span>· {report.evidences.length} preuve(s)</span>}
                      {report.amountLost && <span>· {report.amountLost} FCFA</span>}
                      <span className="font-mono text-gray-300">#{report.trackingCode}</span>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            ))}

            {filteredReports.length === 0 && !loadingMore && (
              <div className="text-center py-16 text-muted">Aucun signalement trouvé.</div>
            )}

            <div ref={sentinelRef} className="h-1" />

            {loadingMore && (
              <div className="flex justify-center py-6">
                <div className="flex items-center gap-3 text-sm text-muted">
                  <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
                  Chargement...
                </div>
              </div>
            )}

            {!nextCursor && reports.length > 0 && !loadingMore && (
              <p className="text-center text-xs text-gray-400 py-4">Tous les signalements ont été chargés.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-bold text-foreground text-sm mb-3">Accès rapide</h3>
            <div className="space-y-2">
              <QuickAction emoji="⏳" title="Urgents" desc="En attente, les + signalés"
                onClick={() => { clearFilters(); setStatusFilter("EN_ATTENTE"); setSort("frequent"); }}
                bg="bg-yellow-50 hover:bg-yellow-100" />
              <QuickAction emoji="🔥" title="Les + signalés" desc="Tous statuts confondus"
                onClick={() => { clearFilters(); setSort("frequent"); }}
                bg="bg-primary/5 hover:bg-primary/10" />
              <QuickAction emoji="🔍" title="En cours d'analyse" desc="Investigations en cours"
                onClick={() => { clearFilters(); setStatusFilter("EN_ANALYSE"); }}
                bg="bg-success/5 hover:bg-success/10" />
            </div>
          </div>

          {topSuspects.length > 0 && (
            <div className="bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h3 className="font-bold text-foreground text-sm">Numéros récurrents</h3>
              </div>
              <div className="space-y-2">
                {topSuspects.map(([phone, count]) => (
                  <motion.button
                    key={phone}
                    whileHover={{ x: 3 }}
                    onClick={() => setSearch(phone)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-primary/5 transition-colors text-left"
                  >
                    <p className="font-mono text-sm font-semibold text-foreground">{phone}</p>
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${count >= 5 ? "bg-primary/10 text-primary" : "bg-yellow-100 text-yellow-700"}`}>
                      {count}x
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedReport(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-foreground">Signalement</h2>
                      {phoneFrequency[selectedReport.phoneNumber] >= 2 && (
                        <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-bold">
                          {phoneFrequency[selectedReport.phoneNumber]}x signalé
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-primary text-lg mt-1">{selectedReport.phoneNumber}</p>
                    <p className="text-xs text-muted font-mono mt-0.5">#{selectedReport.trackingCode}</p>
                  </div>
                  <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-5">
                  <InfoRow label="Statut">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[selectedReport.status]}`}>
                      {STATUS_LABELS[selectedReport.status]}
                    </span>
                  </InfoRow>
                  <InfoRow label="Type d'arnaque">{selectedReport.scamType}</InfoRow>
                  {selectedReport.suspectName && <InfoRow label="Nom / pseudo">{selectedReport.suspectName}</InfoRow>}
                  {selectedReport.suspectPlatform && <InfoRow label="Plateforme">{selectedReport.suspectPlatform}</InfoRow>}
                  {selectedReport.suspectAccount && <InfoRow label="Compte / identifiant">{selectedReport.suspectAccount}</InfoRow>}
                  {selectedReport.suspectUrl && <InfoRow label="URL suspecte"><a href={selectedReport.suspectUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline break-all">{selectedReport.suspectUrl}</a></InfoRow>}
                  {selectedReport.amountLost && <InfoRow label="Montant perdu">{selectedReport.amountLost} FCFA</InfoRow>}
                  {selectedReport.incidentDate && <InfoRow label="Date de l'incident">{selectedReport.incidentDate}</InfoRow>}
                  {selectedReport.contactEmail && <InfoRow label="Email de contact">{selectedReport.contactEmail}</InfoRow>}
                  {selectedReport.isAttemptOnly && (
                    <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Tentative seulement — aucune perte financière
                    </div>
                  )}
                  <InfoRow label="Date de signalement">{new Date(selectedReport.createdAt).toLocaleString("fr-FR")}</InfoRow>
                  <InfoRow label="Description">
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{selectedReport.description}</p>
                  </InfoRow>
                  {selectedReport.evidences.length > 0 && (
                    <InfoRow label="Preuves">
                      <div className="space-y-2">
                        {selectedReport.evidences.map((ev) => (
                          <a key={ev.id} href={`/api/admin/files?path=${encodeURIComponent(ev.filePath)}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary hover:underline">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            {ev.fileName}
                          </a>
                        ))}
                      </div>
                    </InfoRow>
                  )}
                  {selectedReport.actions.length > 0 && (
                    <InfoRow label="Historique des actions">
                      <div className="space-y-2">
                        {selectedReport.actions.map((a) => (
                          <div key={a.id} className="text-sm bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{a.user.name}</span>
                              <span className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleString("fr-FR")}</span>
                            </div>
                            <p className="text-muted mt-0.5">Action : {a.action}</p>
                            {a.comment && <p className="text-muted mt-0.5">{a.comment}</p>}
                          </div>
                        ))}
                      </div>
                    </InfoRow>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Actions</p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleAction(selectedReport.id, "validate", "Confirmer")}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 text-success hover:bg-success/20 text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirmer
                    </button>
                    <button
                      onClick={() => handleAction(selectedReport.id, "analyze", "Mettre en analyse")}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      En analyse
                    </button>
                    <button
                      onClick={() => handleAction(selectedReport.id, "reject", "Rejeter")}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Rejeter
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </FadeIn>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${active ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
      {children}
    </button>
  );
}

function QuickAction({ emoji, title, desc, onClick, bg }: { emoji: string; title: string; desc: string; onClick: () => void; bg: string }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${bg}`}>
      <span className="w-8 h-8 bg-white/60 rounded-lg flex items-center justify-center text-sm">{emoji}</span>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-[11px] text-muted">{desc}</p>
      </div>
    </button>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <div className="text-foreground">{children}</div>
    </div>
  );
}
