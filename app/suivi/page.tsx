"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type ReportStatus } from "@/lib/types";
import { FadeIn } from "@/components/MotionDiv";
import { useI18n } from "@/lib/i18n/context";

interface TrackingResult {
  trackingCode: string;
  status: ReportStatus;
  scamType: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  timeline: { action: string; date: string }[];
}

const ACTION_LABELS: Record<string, Record<string, string>> = {
  analyze: { fr: "Mis en analyse", en: "Under analysis", fon: "Ðò kpɔ́n wɛ̌", yo: "Ń ṣàyẹ̀wò" },
  validate: { fr: "Arnaque confirmée", en: "Scam confirmed", fon: "Gblègblé ɔ̌ jɛ nugbǒ", yo: "A fọwọ́sí jìbìtì" },
  reject: { fr: "Signalement rejeté", en: "Report rejected", fon: "È gbɛ́ gbè ɔ", yo: "A kọ ìròyìn náà" },
};

const STATUS_STEP: Record<string, number> = {
  EN_ATTENTE: 1,
  EN_ANALYSE: 2,
  CONFIRME: 3,
  REJETE: 3,
};

export default function SuiviPage() {
  const { t, locale } = useI18n();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setSearched(false);
    try {
      const res = await fetch(`/api/tracking?code=${encodeURIComponent(code.trim())}`);
      const data = await res.json();
      setResult(data.result);
      setSearched(true);
    } catch {
      setResult(null);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  const step = result ? STATUS_STEP[result.status] || 1 : 0;

  async function handleDelete() {
    if (!result) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/tracking?code=${encodeURIComponent(result.trackingCode)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || "Erreur lors de la suppression.");
        setDeleteConfirm(false);
        return;
      }
      setDeleted(true);
      setResult(null);
    } catch {
      setDeleteError("Impossible de contacter le serveur.");
    } finally {
      setDeleting(false);
      setDeleteConfirm(false);
    }
  }

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{t("tracking.title")}</h1>
            <p className="mt-3 text-muted">{t("tracking.subtitle")}</p>
          </div>

          <form onSubmit={handleSearch} className="mb-8">
            <input
              type="text"
              placeholder="Ex: SA-2026-A1B2C3"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-5 py-4 rounded-2xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-center text-lg font-mono tracking-widest placeholder:text-gray-300 placeholder:tracking-normal placeholder:font-body"
            />
            <motion.button
              type="submit"
              disabled={loading || !code.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-6 py-3.5 rounded-2xl font-semibold transition-colors"
            >
              {loading ? "..." : t("tracking.button")}
            </motion.button>
          </form>

          {deleted && (
            <div className="rounded-2xl border border-success/30 bg-success/5 p-6 text-center mb-6">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold text-foreground mb-1">Signalement supprimé</p>
              <p className="text-sm text-muted">Vos données ont été effacées de notre système.</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {searched && (
              <motion.div
                key={result ? "found" : "not-found"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {result ? (
                  <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted uppercase tracking-wider">{t("tracking.code")}</p>
                        <p className="text-lg font-mono font-bold text-foreground">{result.trackingCode}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        result.status === "CONFIRME" ? "bg-primary/10 text-primary" :
                        result.status === "EN_ANALYSE" ? "bg-success/10 text-success" :
                        result.status === "REJETE" ? "bg-gray-100 text-gray-600" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {t(`tracking.step.${result.status === "EN_ATTENTE" ? "received" : result.status === "EN_ANALYSE" ? "analysis" : result.status === "CONFIRME" ? "confirmed" : "rejected"}`)}
                      </span>
                    </div>

                    {/* Progress steps */}
                    <div className="flex items-center gap-0">
                      {[
                        { n: 1, label: t("tracking.step.received") },
                        { n: 2, label: t("tracking.step.analysis") },
                        { n: 3, label: result.status === "REJETE" ? t("tracking.step.rejected") : t("tracking.step.confirmed") },
                      ].map((s, i) => (
                        <div key={s.n} className="flex-1 flex items-center">
                          <div className="flex flex-col items-center flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                              step >= s.n
                                ? result.status === "REJETE" && s.n === 3 ? "bg-gray-400 text-white" : "bg-primary text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}>
                              {step > s.n ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : s.n}
                            </div>
                            <p className={`text-xs mt-1.5 font-medium ${step >= s.n ? "text-foreground" : "text-gray-400"}`}>{s.label}</p>
                          </div>
                          {i < 2 && <div className={`h-0.5 flex-1 mx-1 rounded ${step > s.n ? "bg-primary" : "bg-gray-200"}`} />}
                        </div>
                      ))}
                    </div>

                    {/* Message rassurant selon le statut */}
                    <div className={`rounded-xl p-4 ${
                      result.status === "EN_ATTENTE" ? "bg-accent/10 border border-accent/30" :
                      result.status === "EN_ANALYSE" ? "bg-success/10 border border-success/30" :
                      result.status === "CONFIRME" ? "bg-primary/10 border border-primary/30" :
                      "bg-gray-50 border border-border"
                    }`}>
                      {result.status === "EN_ATTENTE" && (
                        <div>
                          <p className="text-sm font-semibold text-foreground mb-1">Votre signalement est bien pris en compte</p>
                          <p className="text-xs text-muted leading-relaxed">
                            Notre équipe a bien reçu votre signalement et va l&apos;examiner dans les plus brefs délais.
                            Vous recevrez un retour <strong>sous 48h maximum</strong>.
                            Le numéro suspect est déjà dans notre système de surveillance.
                            Votre identité reste entièrement confidentielle.
                          </p>
                        </div>
                      )}
                      {result.status === "EN_ANALYSE" && (
                        <div>
                          <p className="text-sm font-semibold text-success mb-1">Investigation en cours</p>
                          <p className="text-xs text-muted leading-relaxed">
                            Votre signalement est <strong>activement en cours d&apos;investigation</strong> par notre équipe.
                            Nous recoupons les informations avec d&apos;autres signalements pour constituer un dossier solide.
                            Cette étape peut prendre quelques jours selon la complexité du cas.
                            N&apos;hésitez pas à revenir consulter cette page pour les mises à jour.
                          </p>
                        </div>
                      )}
                      {result.status === "CONFIRME" && (
                        <div>
                          <p className="text-sm font-semibold text-primary mb-1">Arnaque confirmée — Merci pour votre aide !</p>
                          <p className="text-xs text-muted leading-relaxed">
                            Grâce à votre signalement, cette arnaque a été <strong>officiellement confirmée</strong>.
                            Le numéro est désormais référencé dans notre base et les autres utilisateurs seront alertés.
                            Si vous avez subi un préjudice financier, nous vous recommandons de porter plainte
                            auprès du commissariat le plus proche ou de contacter l&apos;OCRC au +229 21 30 84 50.
                          </p>
                        </div>
                      )}
                      {result.status === "REJETE" && (
                        <div>
                          <p className="text-sm font-semibold text-foreground mb-1">Signalement classé</p>
                          <p className="text-xs text-muted leading-relaxed">
                            Après vérification, notre équipe n&apos;a pas pu confirmer qu&apos;il s&apos;agissait d&apos;une arnaque.
                            Cela ne signifie pas que votre signalement était inutile — chaque information contribue à notre base de données.
                            Si vous avez de nouveaux éléments, n&apos;hésitez pas à soumettre un nouveau signalement.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-muted">{t("tracking.reported_number")}</p>
                        <p className="font-mono font-semibold text-foreground">{result.phoneNumber}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-muted">{t("tracking.scam_type")}</p>
                        <p className="font-semibold text-foreground text-sm">{result.scamType}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-muted">{t("tracking.date")}</p>
                        <p className="text-sm text-foreground">{new Date(result.createdAt).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-muted">{t("tracking.updated")}</p>
                        <p className="text-sm text-foreground">{new Date(result.updatedAt).toLocaleDateString("fr-FR")}</p>
                      </div>
                    </div>

                    {result.timeline.length > 0 && (
                      <div>
                        <p className="text-xs text-muted uppercase tracking-wider mb-3">{t("tracking.history")}</p>
                        <div className="space-y-3">
                          {result.timeline.map((tl, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                              <p className="text-sm font-medium text-foreground flex-1">
                                {ACTION_LABELS[tl.action]?.[locale] || tl.action}
                              </p>
                              <p className="text-xs text-muted">{new Date(tl.date).toLocaleDateString("fr-FR")}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Right to erasure — only for non-confirmed reports */}
                    {result.status !== "CONFIRME" && (
                      <div className="border-t border-border pt-5">
                        {!deleteConfirm ? (
                          <button
                            onClick={() => setDeleteConfirm(true)}
                            className="text-xs text-gray-400 hover:text-danger transition-colors underline underline-offset-2"
                          >
                            Supprimer mon signalement
                          </button>
                        ) : (
                          <div className="rounded-xl border border-danger/20 bg-danger/5 p-4">
                            <p className="text-sm font-semibold text-danger mb-1">Confirmer la suppression ?</p>
                            <p className="text-xs text-muted mb-4">Cette action est irréversible. Votre signalement et toutes les pièces jointes seront définitivement effacés.</p>
                            {deleteError && <p className="text-xs text-danger mb-3">{deleteError}</p>}
                            <div className="flex gap-3">
                              <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 bg-danger hover:bg-danger/90 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                              >
                                {deleting ? "Suppression..." : "Oui, supprimer"}
                              </button>
                              <button
                                onClick={() => { setDeleteConfirm(false); setDeleteError(null); }}
                                className="flex-1 border border-border hover:bg-gray-50 text-foreground text-sm font-medium py-2 rounded-lg transition-colors"
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border bg-gray-50 p-6 sm:p-8 text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{t("tracking.not_found")}</h3>
                    <p className="text-muted">{t("tracking.not_found.text")}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </FadeIn>
      </div>
    </div>
  );
}
