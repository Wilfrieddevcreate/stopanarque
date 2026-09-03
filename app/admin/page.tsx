"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { STATUS_LABELS, STATUS_COLORS, type ReportStatus } from "@/lib/types";
import { FadeIn } from "@/components/MotionDiv";

interface VisitStats {
  totalVisits: number;
  visitsToday: number;
  popularPages: { page: string; count: number; avgDuration: number | null; durationSamples: number }[];
  dailyVisits: { day: string; count: number }[];
  topDurationPages: { page: string; avgDuration: number; samples: number }[];
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m${s}s` : `${m}m`;
}

const PAGE_NAMES: Record<string, string> = {
  "/": "Accueil",
  "/signaler": "Signaler",
  "/rechercher": "Rechercher",
  "/suivi": "Suivi",
  "/conseils": "Conseils",
  "/actualites": "Actualités",
  "/admin": "Admin",
  "/admin/login": "Login",
};

interface SuspectProfile {
  phoneNumber: string;
  internationalFormat: string;
  operator: { operator: string; type: string; region?: string; customerService?: string; momoService?: string } | null;
  totalReports: number;
  firstReported: string;
  lastReported: string;
  daysSinceFirst: number;
  daysSinceLast: number;
  namesUsed: string[];
  platformsUsed: string[];
  accountsUsed: string[];
  scamTypes: string[];
  totalAmountLost: number;
  statuses: { status: string; count: number }[];
  riskScore: number;
  riskLevel: "faible" | "moyen" | "élevé" | "critique";
  relatedPhones: string[];
  investigationLinks: { label: string; url: string; type: string }[];
  modusOperandi: { summary: string; patterns: string[]; recommendations: string[] };
  activityTimeline: { date: string; scamType: string; amount: string | null; status: string }[];
}

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
  phoneNumber: string;
  suspectName: string | null;
  suspectPlatform: string | null;
  suspectAccount: string | null;
  description: string;
  scamType: string;
  amountLost: string | null;
  status: ReportStatus;
  createdAt: string;
  evidences: Evidence[];
  actions: AdminActionItem[];
}

interface StatsReport {
  id: string;
  phoneNumber: string;
  scamType: string;
  suspectPlatform: string | null;
  status: string;
}

type SortMode = "recent" | "frequent";

export default function AdminDashboard() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [statsData, setStatsData] = useState<StatsReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [visits, setVisits] = useState<VisitStats | null>(null);
  const [suspectProfile, setSuspectProfile] = useState<SuspectProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [sort, setSort] = useState<SortMode>("recent");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch stats (lightweight, all records, no pagination)
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/reports?all=stats");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setStatsData(data.stats);
    } catch {
      router.push("/admin/login");
    }
  }, [router]);

  // Fetch paginated reports
  const fetchReports = useCallback(
    async (cursor?: string | null) => {
      try {
        const url = cursor
          ? `/api/admin/reports?cursor=${cursor}`
          : "/api/admin/reports";
        const res = await fetch(url);
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        const data = await res.json();
        if (cursor) {
          setReports((prev) => [...prev, ...data.reports]);
        } else {
          setReports(data.reports);
        }
        setNextCursor(data.nextCursor);
      } catch {
        router.push("/admin/login");
      }
    },
    [router],
  );

  // Initial load
  useEffect(() => {
    let cancelled = false;
    async function init() {
      await Promise.all([fetchStats(), fetchReports()]);
      fetch("/api/visits")
        .then((r) => r.json())
        .then(setVisits)
        .catch(() => {});
      if (!cancelled) setLoading(false);
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [fetchStats, fetchReports]);

  // Infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current || !nextCursor) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !loadingMore) {
          setLoadingMore(true);
          fetchReports(nextCursor).finally(() => setLoadingMore(false));
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [nextCursor, loadingMore, fetchReports]);

  // Refresh all after action
  async function refreshAll() {
    await Promise.all([fetchStats(), fetchReports()]);
  }

  // Phone frequency from stats
  const phoneFrequency = useMemo(() => {
    const map: Record<string, number> = {};
    for (const r of statsData)
      map[r.phoneNumber] = (map[r.phoneNumber] || 0) + 1;
    return map;
  }, [statsData]);

  const topSuspects = useMemo(() => {
    return Object.entries(phoneFrequency)
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1]);
  }, [phoneFrequency]);

  const allTypes = useMemo(
    () => [...new Set(statsData.map((r) => r.scamType))].sort(),
    [statsData],
  );
  const allPlatforms = useMemo(
    () =>
      [
        ...new Set(statsData.map((r) => r.suspectPlatform).filter(Boolean)),
      ].sort() as string[],
    [statsData],
  );

  // Stats
  const stats = useMemo(
    () => ({
      total: statsData.length,
      enAttente: statsData.filter((r) => r.status === "EN_ATTENTE").length,
      enAnalyse: statsData.filter((r) => r.status === "EN_ANALYSE").length,
      confirme: statsData.filter((r) => r.status === "CONFIRME").length,
      rejete: statsData.filter((r) => r.status === "REJETE").length,
    }),
    [statsData],
  );

  // Client-side filter & sort on loaded reports
  const filteredReports = useMemo(() => {
    let list = reports;
    if (statusFilter) list = list.filter((r) => r.status === statusFilter);
    if (typeFilter) list = list.filter((r) => r.scamType === typeFilter);
    if (platformFilter)
      list = list.filter((r) => r.suspectPlatform === platformFilter);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.phoneNumber.toLowerCase().includes(q) ||
          r.suspectName?.toLowerCase().includes(q) ||
          r.suspectAccount?.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.scamType.toLowerCase().includes(q),
      );
    }
    if (sort === "frequent") {
      list = [...list].sort(
        (a, b) =>
          (phoneFrequency[b.phoneNumber] || 0) -
          (phoneFrequency[a.phoneNumber] || 0),
      );
    }
    return list;
  }, [
    reports,
    statusFilter,
    typeFilter,
    platformFilter,
    search,
    sort,
    phoneFrequency,
  ]);

  const activeFilterCount =
    [statusFilter, typeFilter, platformFilter].filter(Boolean).length +
    (sort !== "recent" ? 1 : 0);

  function clearFilters() {
    setSearch("");
    setStatusFilter("");
    setTypeFilter("");
    setPlatformFilter("");
    setSort("recent");
  }

  async function loadSuspectProfile(phone: string) {
    setLoadingProfile(true);
    setSuspectProfile(null);
    try {
      const res = await fetch(`/api/admin/suspect-profile?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      setSuspectProfile(data.profile);
    } catch {}
    setLoadingProfile(false);
  }

  function closeModal() {
    setSelectedReport(null);
    setSuspectProfile(null);
  }

  async function handleAction(reportId: string, action: string, label: string) {
    const result = await Swal.fire({
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
        closeModal();
        await Swal.fire({
          icon: "success",
          title: "Action effectuée",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch {
      await Swal.fire({ icon: "error", title: "Erreur" });
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
    <div>
      <FadeIn>
          {/* Page header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Tableau de bord
              </h1>
              <p className="text-muted mt-1">
                {stats.total} signalement{stats.total !== 1 ? "s" : ""} au total
              </p>
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
              {
                label: "Total",
                value: stats.total,
                color: "text-foreground",
                onClick: () => setStatusFilter(""),
              },
              {
                label: "En attente",
                value: stats.enAttente,
                color: "text-yellow-600",
                onClick: () => setStatusFilter("EN_ATTENTE"),
              },
              {
                label: "En analyse",
                value: stats.enAnalyse,
                color: "text-success",
                onClick: () => setStatusFilter("EN_ANALYSE"),
              },
              {
                label: "Confirmés",
                value: stats.confirme,
                color: "text-primary",
                onClick: () => setStatusFilter("CONFIRME"),
              },
              {
                label: "Rejetés",
                value: stats.rejete,
                color: "text-gray-500",
                onClick: () => setStatusFilter("REJETE"),
              },
            ].map((s) => (
              <motion.button
                key={s.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={s.onClick}
                className="bg-white rounded-xl border border-border p-4 text-left hover:border-primary/30 transition-colors"
              >
                <p className="text-xs text-muted font-medium uppercase tracking-wider">
                  {s.label}
                </p>
                <p
                  className={`text-2xl font-bold mt-1 font-heading ${s.color}`}
                >
                  {s.value}
                </p>
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* ── LEFT: Main list ── */}
            <div className="lg:col-span-3 space-y-4">
              {/* Search + filter bar */}
              <div className="bg-white rounded-2xl border border-border p-4 space-y-4 sticky top-[65px] z-30 shadow-sm">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <svg
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Rechercher numéro, nom, compte..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    />
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setSort(sort === "recent" ? "frequent" : "recent")
                    }
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors shrink-0 ${
                      sort === "frequent"
                        ? "bg-primary text-white border-primary"
                        : "bg-gray-50 text-gray-600 border-border hover:bg-gray-100"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                      />
                    </svg>
                    <span className="hidden sm:inline">
                      {sort === "frequent" ? "Les + signalés" : "Récents"}
                    </span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors shrink-0 ${
                      showFilters || activeFilterCount > 0
                        ? "bg-primary text-white border-primary"
                        : "bg-gray-50 text-gray-600 border-border hover:bg-gray-100"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                    <span className="hidden sm:inline">Filtres</span>
                    {activeFilterCount > 0 && (
                      <span className="w-5 h-5 bg-white/20 rounded-full text-xs flex items-center justify-center">
                        {activeFilterCount}
                      </span>
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
                            <Chip
                              key={f.value}
                              active={statusFilter === f.value}
                              onClick={() => setStatusFilter(f.value)}
                            >
                              {f.label}
                            </Chip>
                          ))}
                        </FilterRow>
                        <FilterRow label="Type d'arnaque">
                          <Chip
                            active={!typeFilter}
                            onClick={() => setTypeFilter("")}
                          >
                            Tous
                          </Chip>
                          {allTypes.map((t) => (
                            <Chip
                              key={t}
                              active={typeFilter === t}
                              onClick={() =>
                                setTypeFilter(typeFilter === t ? "" : t)
                              }
                            >
                              {t}
                            </Chip>
                          ))}
                        </FilterRow>
                        {allPlatforms.length > 0 && (
                          <FilterRow label="Plateforme">
                            <Chip
                              active={!platformFilter}
                              onClick={() => setPlatformFilter("")}
                            >
                              Toutes
                            </Chip>
                            {allPlatforms.map((p) => (
                              <Chip
                                key={p}
                                active={platformFilter === p}
                                onClick={() =>
                                  setPlatformFilter(
                                    platformFilter === p ? "" : p,
                                  )
                                }
                              >
                                {p}
                              </Chip>
                            ))}
                          </FilterRow>
                        )}
                        {activeFilterCount > 0 && (
                          <button
                            onClick={clearFilters}
                            className="text-xs text-primary font-medium hover:underline"
                          >
                            Réinitialiser tous les filtres
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between text-xs text-muted">
                  <span>
                    {filteredReports.length} résultat
                    {filteredReports.length !== 1 ? "s" : ""}
                  </span>
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="text-primary hover:underline"
                    >
                      Effacer
                    </button>
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
                    transition={{
                      duration: 0.2,
                      delay: Math.min(i * 0.03, 0.3),
                    }}
                    className="bg-white rounded-xl border border-border p-4 cursor-pointer hover:border-primary/30 transition-colors"
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono font-semibold text-foreground text-sm">
                            {report.phoneNumber}
                          </span>
                          {phoneFrequency[report.phoneNumber] >= 2 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold">
                              {phoneFrequency[report.phoneNumber]}x
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_COLORS[report.status]}`}
                          >
                            {STATUS_LABELS[report.status]}
                          </span>
                        </div>
                        <p className="text-sm text-muted truncate">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-400 flex-wrap">
                          <span>{report.scamType}</span>
                          {report.suspectName && (
                            <span>· {report.suspectName}</span>
                          )}
                          {report.suspectPlatform && (
                            <span>· {report.suspectPlatform}</span>
                          )}
                          <span>
                            ·{" "}
                            {new Date(report.createdAt).toLocaleDateString(
                              "fr-FR",
                            )}
                          </span>
                          {report.evidences.length > 0 && (
                            <span>· {report.evidences.length} preuve(s)</span>
                          )}
                          {report.amountLost && (
                            <span>· {report.amountLost} FCFA</span>
                          )}
                        </div>
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-300 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </motion.div>
                ))}

                {filteredReports.length === 0 && !loadingMore && (
                  <div className="text-center py-16 text-muted">
                    Aucun signalement trouvé.
                  </div>
                )}

                {/* Infinite scroll sentinel */}
                <div ref={sentinelRef} className="h-1" />

                {/* Loading more indicator */}
                {loadingMore && (
                  <div className="flex justify-center py-6">
                    <div className="flex items-center gap-3 text-sm text-muted">
                      <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
                      Chargement...
                    </div>
                  </div>
                )}

                {!nextCursor && reports.length > 0 && !loadingMore && (
                  <p className="text-center text-xs text-gray-400 py-4">
                    Tous les signalements ont été chargés.
                  </p>
                )}
              </div>
            </div>

            {/* ── RIGHT: Sidebar ── */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-border p-5">
                <h3 className="font-bold text-foreground text-sm mb-3">
                  Accès rapide
                </h3>
                <div className="space-y-2">
                  <QuickAction
                    emoji="⏳"
                    title="Urgents"
                    desc="En attente, les + signalés"
                    onClick={() => {
                      clearFilters();
                      setStatusFilter("EN_ATTENTE");
                      setSort("frequent");
                    }}
                    bg="bg-yellow-50 hover:bg-yellow-100"
                  />
                  <QuickAction
                    emoji="🔥"
                    title="Les + signalés"
                    desc="Tous statuts confondus"
                    onClick={() => {
                      clearFilters();
                      setSort("frequent");
                    }}
                    bg="bg-primary/5 hover:bg-primary/10"
                  />
                  <QuickAction
                    emoji="🔍"
                    title="En cours d'analyse"
                    desc="Investigations en cours"
                    onClick={() => {
                      clearFilters();
                      setStatusFilter("EN_ANALYSE");
                    }}
                    bg="bg-success/5 hover:bg-success/10"
                  />
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-border p-5">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <h3 className="font-bold text-foreground text-sm">
                    Numéros récurrents
                  </h3>
                </div>
                {topSuspects.length > 0 ? (
                  <div className="space-y-2">
                    {topSuspects.map(([phone, count]) => (
                      <motion.button
                        key={phone}
                        whileHover={{ x: 3 }}
                        onClick={() => setSearch(phone)}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-primary/5 transition-colors text-left"
                      >
                        <div>
                          <p className="font-mono text-sm font-semibold text-foreground">
                            {phone}
                          </p>
                          <p className="text-[11px] text-muted">
                            {[
                              ...new Set(
                                statsData
                                  .filter((r) => r.phoneNumber === phone)
                                  .map((r) => r.scamType),
                              ),
                            ].join(", ")}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            count >= 5
                              ? "bg-primary/10 text-primary"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {count}x
                        </span>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted">Aucun numéro récurrent.</p>
                )}
              </div>

              {/* Visit analytics */}
              {visits && (
                <div className="bg-white rounded-2xl border border-border p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-5 h-5 text-success"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <h3 className="font-bold text-foreground text-sm">
                      Trafic du site
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-success/5 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-success font-heading">
                        {visits.totalVisits.toLocaleString("fr-FR")}
                      </p>
                      <p className="text-[11px] text-muted">Visites totales</p>
                    </div>
                    <div className="bg-success/5 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-success font-heading">
                        {visits.visitsToday.toLocaleString("fr-FR")}
                      </p>
                      <p className="text-[11px] text-muted">Aujourd&apos;hui</p>
                    </div>
                  </div>

                  {/* Mini sparkline - last 7 days */}
                  {visits.dailyVisits.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[11px] text-muted mb-2">
                        7 derniers jours
                      </p>
                      <div className="flex items-end gap-1 h-12">
                        {visits.dailyVisits.slice(-7).map((d, i) => {
                          const max = Math.max(
                            ...visits.dailyVisits.slice(-7).map((v) => v.count),
                            1,
                          );
                          const pct = (d.count / max) * 100;
                          return (
                            <div
                              key={i}
                              className="flex-1 bg-success/20 hover:bg-success/40 rounded-t transition-colors relative group"
                              style={{ height: `${Math.max(pct, 8)}%` }}
                            >
                              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                                {d.count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Popular pages */}
                  <p className="text-[11px] text-muted mb-2">
                    Pages populaires
                  </p>
                  <div className="space-y-2">
                    {visits.popularPages.slice(0, 5).map((p) => (
                      <div key={p.page} className="flex items-center justify-between gap-2">
                        <span className="text-sm text-foreground truncate flex-1">
                          {PAGE_NAMES[p.page] || p.page}
                        </span>
                        <span className="text-xs font-bold text-success shrink-0">{p.count}</span>
                        {p.avgDuration !== null && (
                          <span className="text-[10px] text-muted bg-gray-50 border border-border rounded px-1.5 py-0.5 shrink-0" title={`${p.durationSamples} mesures`}>
                            ⏱ {formatDuration(p.avgDuration)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Temps moyen par page */}
                  {visits.topDurationPages?.length > 0 && (
                    <>
                      <p className="text-[11px] text-muted mt-5 mb-2">
                        Temps moyen par page
                      </p>
                      <div className="space-y-2">
                        {visits.topDurationPages.slice(0, 5).map((p) => {
                          const maxDur = Math.max(...visits.topDurationPages.map(x => x.avgDuration));
                          const pct = Math.round((p.avgDuration / maxDur) * 100);
                          return (
                            <div key={p.page} className="space-y-0.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-foreground truncate">{PAGE_NAMES[p.page] || p.page}</span>
                                <span className="text-xs font-semibold text-primary ml-2">{formatDuration(p.avgDuration)}</span>
                              </div>
                              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-primary/50 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Detail modal */}
        <AnimatePresence>
          {selectedReport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-foreground">
                          Signalement
                        </h2>
                        {phoneFrequency[selectedReport.phoneNumber] >= 2 && (
                          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-bold">
                            {phoneFrequency[selectedReport.phoneNumber]}x
                            signalé
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-primary text-lg mt-1">
                        {selectedReport.phoneNumber}
                      </p>
                    </div>
                    <button
                      onClick={closeModal}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-5">
                    <InfoRow label="Statut">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[selectedReport.status]}`}
                      >
                        {STATUS_LABELS[selectedReport.status]}
                      </span>
                    </InfoRow>
                    <InfoRow label="Type d'arnaque">
                      {selectedReport.scamType}
                    </InfoRow>
                    {selectedReport.suspectName && (
                      <InfoRow label="Nom / pseudo du suspect">
                        {selectedReport.suspectName}
                      </InfoRow>
                    )}
                    {selectedReport.suspectPlatform && (
                      <InfoRow label="Plateforme">
                        {selectedReport.suspectPlatform}
                      </InfoRow>
                    )}
                    {selectedReport.suspectAccount && (
                      <InfoRow label="Compte / identifiant">
                        {selectedReport.suspectAccount}
                      </InfoRow>
                    )}
                    {selectedReport.amountLost && (
                      <InfoRow label="Montant perdu">
                        {selectedReport.amountLost} FCFA
                      </InfoRow>
                    )}
                    <InfoRow label="Date">
                      {new Date(selectedReport.createdAt).toLocaleString(
                        "fr-FR",
                      )}
                    </InfoRow>
                    <InfoRow label="Description">
                      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                        {selectedReport.description}
                      </p>
                    </InfoRow>
                    {selectedReport.evidences.length > 0 && (
                      <InfoRow label="Preuves">
                        <div className="space-y-2">
                          {selectedReport.evidences.map((ev) => (
                            <a
                              key={ev.id}
                              href={`/api/admin/files?path=${encodeURIComponent(ev.filePath)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-primary hover:underline"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                />
                              </svg>
                              {ev.fileName}
                            </a>
                          ))}
                        </div>
                      </InfoRow>
                    )}
                    {selectedReport.actions.length > 0 && (
                      <InfoRow label="Historique">
                        <div className="space-y-2">
                          {selectedReport.actions.map((a) => (
                            <div
                              key={a.id}
                              className="text-sm bg-gray-50 rounded-lg p-3"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">
                                  {a.user.name}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {new Date(a.createdAt).toLocaleString(
                                    "fr-FR",
                                  )}
                                </span>
                              </div>
                              <p className="text-muted mt-0.5">
                                Action: {a.action}
                              </p>
                              {a.comment && (
                                <p className="text-muted mt-0.5">{a.comment}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </InfoRow>
                    )}
                  </div>

                  {/* Suspect profile section */}
                  <div className="mt-6 pt-6 border-t border-border">
                    {!suspectProfile && !loadingProfile && (
                      <button
                        onClick={() => loadSuspectProfile(selectedReport.phoneNumber)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground font-medium text-sm transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                        Charger le profil suspect
                      </button>
                    )}
                    {loadingProfile && (
                      <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted">
                        <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                        Analyse en cours...
                      </div>
                    )}
                    {suspectProfile && (
                      <div className="space-y-5">
                        {/* ── Header: Risk ── */}
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-foreground flex items-center gap-2">
                            Profil suspect enrichi
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            suspectProfile.riskLevel === "critique" ? "bg-primary text-white" :
                            suspectProfile.riskLevel === "élevé" ? "bg-primary/10 text-primary" :
                            suspectProfile.riskLevel === "moyen" ? "bg-yellow-100 text-yellow-700" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            Risque {suspectProfile.riskLevel} — {suspectProfile.riskScore}/100
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${suspectProfile.riskScore}%` }}
                            transition={{ duration: 0.8 }}
                            className={`h-full rounded-full ${
                              suspectProfile.riskScore >= 75 ? "bg-primary" :
                              suspectProfile.riskScore >= 50 ? "bg-primary/70" :
                              suspectProfile.riskScore >= 25 ? "bg-yellow-400" :
                              "bg-gray-300"
                            }`}
                          />
                        </div>

                        {/* ── Analyse du mode opératoire ── */}
                        <div className="bg-foreground/5 rounded-xl p-4">
                          <p className="text-sm font-semibold text-foreground mb-2">Analyse automatique</p>
                          <p className="text-sm text-muted leading-relaxed">{suspectProfile.modusOperandi.summary}</p>
                          {suspectProfile.modusOperandi.patterns.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {suspectProfile.modusOperandi.patterns.map((p, i) => (
                                <li key={i} className="text-xs text-muted flex items-start gap-1.5">
                                  <span className="text-primary mt-0.5">•</span> {p}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* ── Infos opérateur ── */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-[11px] text-muted uppercase tracking-wider">Opérateur</p>
                            <p className="font-semibold text-foreground text-sm mt-0.5">
                              {suspectProfile.operator?.operator || "Inconnu"} ({suspectProfile.operator?.type || "?"})
                            </p>
                            {suspectProfile.operator?.region && (
                              <p className="text-xs text-muted">{suspectProfile.operator.region}</p>
                            )}
                            {suspectProfile.operator?.customerService && (
                              <p className="text-xs text-primary mt-1">Service client : {suspectProfile.operator.customerService}</p>
                            )}
                            {suspectProfile.operator?.momoService && (
                              <p className="text-xs text-muted">{suspectProfile.operator.momoService}</p>
                            )}
                          </div>
                          <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-[11px] text-muted uppercase tracking-wider">Format international</p>
                            <p className="font-mono font-semibold text-foreground text-sm mt-0.5">{suspectProfile.internationalFormat}</p>
                            <p className="text-xs text-muted mt-1">{suspectProfile.totalReports} signalement{suspectProfile.totalReports > 1 ? "s" : ""}</p>
                          </div>
                          {suspectProfile.totalAmountLost > 0 && (
                            <div className="bg-primary/5 rounded-xl p-3">
                              <p className="text-[11px] text-muted uppercase tracking-wider">Préjudice total</p>
                              <p className="font-bold text-primary text-lg mt-0.5">{suspectProfile.totalAmountLost.toLocaleString("fr-FR")} FCFA</p>
                            </div>
                          )}
                          <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-[11px] text-muted uppercase tracking-wider">Période d&apos;activité</p>
                            <p className="text-sm text-foreground mt-0.5">
                              {new Date(suspectProfile.firstReported).toLocaleDateString("fr-FR")} → {new Date(suspectProfile.lastReported).toLocaleDateString("fr-FR")}
                            </p>
                            <p className="text-xs text-muted mt-0.5">
                              Actif depuis {suspectProfile.daysSinceFirst}j · Dernier signalement il y a {suspectProfile.daysSinceLast}j
                            </p>
                          </div>
                        </div>

                        {/* ── Identités & comptes ── */}
                        <div className="space-y-3">
                          {suspectProfile.namesUsed.length > 0 && (
                            <div>
                              <p className="text-[11px] text-muted uppercase tracking-wider mb-1">Identités utilisées</p>
                              <div className="flex flex-wrap gap-1.5">
                                {suspectProfile.namesUsed.map((n) => (
                                  <span key={n} className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-medium text-foreground">{n}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {suspectProfile.accountsUsed.length > 0 && (
                            <div>
                              <p className="text-[11px] text-muted uppercase tracking-wider mb-1">Comptes / identifiants signalés</p>
                              <div className="flex flex-wrap gap-1.5">
                                {suspectProfile.accountsUsed.map((a) => (
                                  <span key={a} className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-mono text-foreground">{a}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {suspectProfile.platformsUsed.length > 0 && (
                            <div>
                              <p className="text-[11px] text-muted uppercase tracking-wider mb-1">Canaux utilisés</p>
                              <div className="flex flex-wrap gap-1.5">
                                {suspectProfile.platformsUsed.map((p) => (
                                  <span key={p} className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-medium text-foreground">{p}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {suspectProfile.scamTypes.length > 0 && (
                            <div>
                              <p className="text-[11px] text-muted uppercase tracking-wider mb-1">Types d&apos;arnaques</p>
                              <div className="flex flex-wrap gap-1.5">
                                {suspectProfile.scamTypes.map((st) => (
                                  <span key={st} className="px-2.5 py-1 bg-primary/10 rounded-lg text-xs font-medium text-primary">{st}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {suspectProfile.relatedPhones.length > 0 && (
                            <div>
                              <p className="text-[11px] text-muted uppercase tracking-wider mb-1">Numéros liés (même suspect)</p>
                              <div className="flex flex-wrap gap-1.5">
                                {suspectProfile.relatedPhones.map((rp) => (
                                  <button key={rp} onClick={() => { closeModal(); setSearch(rp); }} className="px-2.5 py-1 bg-gray-100 hover:bg-primary/10 rounded-lg text-xs font-mono font-medium text-foreground hover:text-primary transition-colors">{rp}</button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* ── Pistes d'investigation ── */}
                        <div className="bg-foreground rounded-xl p-4 text-white">
                          <p className="text-sm font-bold mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            Pistes d&apos;investigation
                          </p>
                          <div className="space-y-2">
                            {suspectProfile.investigationLinks.slice(0, 8).map((link, i) => (
                              <a
                                key={i}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-white/80 hover:text-white transition-colors group"
                              >
                                <span className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-[10px] shrink-0 group-hover:bg-white/20">
                                  {link.type === "whatsapp" ? "WA" : link.type === "facebook" ? "FB" : link.type === "instagram" ? "IG" : link.type === "email" ? "@" : "🔎"}
                                </span>
                                <span className="truncate">{link.label}</span>
                                <svg className="w-3 h-3 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                              </a>
                            ))}
                          </div>
                        </div>

                        {/* ── Recommandations ── */}
                        {suspectProfile.modusOperandi.recommendations.length > 0 && (
                          <div className="bg-success/5 border border-success/20 rounded-xl p-4">
                            <p className="text-sm font-bold text-success mb-2">Actions recommandées</p>
                            <ul className="space-y-1.5">
                              {suspectProfile.modusOperandi.recommendations.map((rec, i) => (
                                <li key={i} className="text-xs text-foreground flex items-start gap-2">
                                  <span className="w-4 h-4 rounded-full bg-success/10 text-success flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* ── Timeline d'activité ── */}
                        {suspectProfile.activityTimeline.length > 1 && (
                          <div>
                            <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Historique des signalements</p>
                            <div className="space-y-1.5">
                              {suspectProfile.activityTimeline.map((entry, i) => (
                                <div key={i} className="flex items-center gap-3 text-xs">
                                  <span className="text-muted w-20 shrink-0">{new Date(entry.date).toLocaleDateString("fr-FR")}</span>
                                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                  <span className="text-foreground">{entry.scamType}</span>
                                  {entry.amount && <span className="text-primary font-semibold">{entry.amount} FCFA</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {selectedReport.status !== "CONFIRME" &&
                    selectedReport.status !== "REJETE" && (
                      <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() =>
                            handleAction(
                              selectedReport.id,
                              "analyze",
                              "Mettre en analyse",
                            )
                          }
                          className="flex-1 py-2.5 px-4 rounded-xl bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors"
                        >
                          En analyse
                        </button>
                        <button
                          onClick={() =>
                            handleAction(
                              selectedReport.id,
                              "validate",
                              "Confirmer",
                            )
                          }
                          className="flex-1 py-2.5 px-4 rounded-xl bg-danger/10 text-danger font-medium text-sm hover:bg-danger/20 transition-colors"
                        >
                          Confirmer l&apos;arnaque
                        </button>
                        <button
                          onClick={() =>
                            handleAction(selectedReport.id, "reject", "Rejeter")
                          }
                          className="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors"
                        >
                          Rejeter
                        </button>
                      </div>
                    )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        active
          ? "bg-primary text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

function QuickAction({
  emoji,
  title,
  desc,
  onClick,
  bg,
}: {
  emoji: string;
  title: string;
  desc: string;
  onClick: () => void;
  bg: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${bg}`}
    >
      <span className="w-8 h-8 bg-white/60 rounded-lg flex items-center justify-center text-sm">
        {emoji}
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-[11px] text-muted">{desc}</p>
      </div>
    </button>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <div className="text-foreground">{children}</div>
    </div>
  );
}
