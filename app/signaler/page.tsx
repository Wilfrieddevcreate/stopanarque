"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { SCAM_TYPES, PLATFORMS } from "@/lib/types";
import { FadeIn } from "@/components/MotionDiv";
import { useI18n } from "@/lib/i18n/context";

export default function SignalerPage() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [suspectName, setSuspectName] = useState("");
  const [suspectPlatform, setSuspectPlatform] = useState("");
  const [suspectAccount, setSuspectAccount] = useState("");
  const [scamType, setScamType] = useState("");
  const [amountLost, setAmountLost] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragOver, setDragOver] = useState(false);

  function validateStep1() {
    const errs: Record<string, string> = {};
    if (!phoneNumber.trim()) {
      errs.phoneNumber = "Le numéro est requis";
    } else if (!/^[\d\s+()-]{6,20}$/.test(phoneNumber.trim())) {
      errs.phoneNumber = "Numéro invalide";
    }
    if (!scamType) {
      errs.scamType = "Sélectionnez un type";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function goToStep2() {
    if (validateStep1()) setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep1()) { setStep(1); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("phoneNumber", phoneNumber.trim());
      fd.append("scamType", scamType);
      fd.append("description", description.trim() || "Aucune description");
      if (suspectName.trim()) fd.append("suspectName", suspectName.trim());
      if (suspectPlatform) fd.append("suspectPlatform", suspectPlatform);
      if (suspectAccount.trim()) fd.append("suspectAccount", suspectAccount.trim());
      if (amountLost.trim()) fd.append("amountLost", amountLost.trim());
      for (const file of files) fd.append("files", file);

      const res = await fetch("/api/reports", { method: "POST", body: fd });
      if (res.status === 429) {
        await Swal.fire({
          icon: "warning",
          title: "Trop de signalements",
          text: "Veuillez patienter une minute avant de soumettre un nouveau signalement.",
          confirmButtonColor: "#E8112D",
        });
        return;
      }
      if (!res.ok) throw new Error("Erreur serveur");

      const data = await res.json();
      await Swal.fire({
        icon: "success",
        title: "Signalement bien reçu !",
        html: `
          <div style="text-align:left;max-width:380px;margin:0 auto">
            <p style="margin-bottom:16px;color:#1a1a2e;line-height:1.6">
              Votre signalement a été <b>enregistré avec succès</b> et transmis à notre équipe d'investigation.
              Nous prenons chaque signalement très au sérieux.
            </p>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:16px">
              <p style="font-size:12px;color:#64748b;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px">Votre code de suivi</p>
              <p style="font-size:24px;font-weight:bold;font-family:monospace;letter-spacing:3px;color:#E8112D;margin-bottom:4px">${data.trackingCode}</p>
              <p style="font-size:11px;color:#94a3b8">Notez-le précieusement pour suivre l'avancement</p>
            </div>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:14px;margin-bottom:12px">
              <p style="font-size:13px;color:#166534;font-weight:600;margin-bottom:6px">🔍 Que se passe-t-il maintenant ?</p>
              <ul style="font-size:12px;color:#166534;line-height:1.8;padding-left:16px;margin:0">
                <li>Notre équipe va analyser votre signalement</li>
                <li>Le numéro suspect sera vérifié et recoupé</li>
                <li>Vous aurez un retour <b>sous 48h maximum</b></li>
              </ul>
            </div>
            <p style="font-size:12px;color:#64748b;line-height:1.6">
              Rendez-vous sur la page <b>Suivi</b> avec votre code pour consulter l'avancement à tout moment.
              Votre identité reste <b>100% confidentielle</b>.
            </p>
          </div>
        `,
        confirmButtonColor: "#E8112D",
        confirmButtonText: "J'ai noté mon code ✓",
        width: 500,
      });

      setPhoneNumber(""); setSuspectName(""); setSuspectPlatform("");
      setSuspectAccount(""); setScamType(""); setAmountLost("");
      setDescription(""); setFiles([]); setErrors({}); setStep(1);
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue. Veuillez réessayer.",
        confirmButtonColor: "#991b1b",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false);
    setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  }

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              {t("report.title")}
            </h1>
            <p className="mt-3 text-muted">
              {t("report.subtitle")}
            </p>
          </div>

          {/* Trust banner */}
          <div className="bg-success/5 border border-success/20 rounded-2xl p-4 mb-8 flex items-start gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Votre signalement est protégé</p>
              <p className="text-xs text-muted leading-relaxed mt-0.5">
                Votre identité n&apos;est <strong>jamais révélée</strong>. Seules les autorités compétentes ont accès aux détails.
                Chaque signalement est traité avec le plus grand sérieux par notre équipe.
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-3 mb-10">
            {[
              { n: 1, label: t("report.step1") },
              { n: 2, label: t("report.step2") },
            ].map((s) => (
              <button
                key={s.n}
                type="button"
                onClick={() => s.n === 1 ? setStep(1) : goToStep2()}
                className="flex-1 group"
              >
                <div className={`h-1.5 rounded-full mb-2 transition-colors ${
                  step >= s.n ? "bg-primary" : "bg-gray-200"
                }`} />
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                    step >= s.n
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}>
                    {s.n}
                  </span>
                  <span className={`text-sm font-medium transition-colors ${
                    step >= s.n ? "text-foreground" : "text-muted"
                  }`}>
                    {s.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Numéro */}
                  <div>
                    <Label required>{t("report.phone")}</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </span>
                      <input
                        type="tel"
                        placeholder="+229 XX XX XX XX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border text-lg font-mono ${
                          errors.phoneNumber ? "border-primary bg-primary/5" : "border-border"
                        } bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-gray-300`}
                      />
                    </div>
                    {errors.phoneNumber && <p className="text-sm text-primary mt-1.5">{errors.phoneNumber}</p>}
                  </div>

                  {/* Nom du suspect */}
                  <div>
                    <Label hint={t("common.if_known")}>{t("report.name")}</Label>
                    <input
                      type="text"
                      placeholder="Ex: Jean Dupont, @arnaqueur229..."
                      value={suspectName}
                      onChange={(e) => setSuspectName(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  {/* Plateforme */}
                  <div>
                    <Label hint={t("common.where_contacted")}>{t("report.platform")}</Label>
                    <div className="flex flex-wrap gap-2">
                      {PLATFORMS.map((p) => (
                        <motion.button
                          key={p}
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSuspectPlatform(suspectPlatform === p ? "" : p)}
                          className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                            suspectPlatform === p
                              ? "bg-primary text-white shadow-sm"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {p}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Compte / identifiant */}
                  <div>
                    <Label hint={t("common.account_hint")}>{t("report.account")}</Label>
                    <input
                      type="text"
                      placeholder="Ex: 229 97 00 00 00 (MoMo), fb.com/faux.profil..."
                      value={suspectAccount}
                      onChange={(e) => setSuspectAccount(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  {/* Type d'arnaque */}
                  <div>
                    <Label required>{t("report.scamtype")}</Label>
                    <div className="flex flex-wrap gap-2">
                      {SCAM_TYPES.map((type) => (
                        <motion.button
                          key={type}
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setScamType(type)}
                          className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                            scamType === type
                              ? "bg-primary text-white shadow-sm"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {type}
                        </motion.button>
                      ))}
                    </div>
                    {errors.scamType && <p className="text-sm text-primary mt-1.5">{errors.scamType}</p>}
                  </div>

                  {/* Bouton suivant */}
                  <motion.button
                    type="button"
                    onClick={goToStep2}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-semibold text-base transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                  >
                    {t("report.continue")}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Récap */}
                  <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted">{t("report.reported_number")}</p>
                      <p className="font-mono font-semibold text-foreground">{phoneNumber}</p>
                      <p className="text-xs text-muted mt-0.5">{scamType}{suspectName ? ` · ${suspectName}` : ""}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-sm text-primary font-medium hover:underline"
                    >
                      {t("report.modify")}
                    </button>
                  </div>

                  {/* Montant perdu */}
                  <div>
                    <Label hint={t("common.optional")}>{t("report.amount")}</Label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Ex: 50 000"
                        value={amountLost}
                        onChange={(e) => setAmountLost(e.target.value)}
                        className={`${inputClass} pr-16`}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted font-medium">
                        FCFA
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Label hint={t("common.optional")}>{t("report.description")}</Label>
                    <textarea
                      rows={3}
                      placeholder="Racontez brièvement les faits..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-gray-300 resize-none"
                    />
                    <p className="text-xs text-muted mt-1.5 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-accent-dark shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Optionnel — mais une description aide notre équipe à traiter votre dossier plus rapidement et avec plus de sérieux.
                    </p>
                  </div>

                  {/* Preuves */}
                  <div>
                    <Label hint={t("common.optional")}>{t("report.evidence")}</Label>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      className={`relative rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
                        dragOver ? "border-primary bg-primary/5" : "border-border hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleFileInput}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-muted">
                        {t("report.dropzone")} <span className="text-primary font-medium">{t("report.browse")}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{t("report.dropzone.hint")}</p>
                    </div>
                    <p className="text-xs text-muted mt-1.5 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-accent-dark shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Optionnel — mais les preuves (captures d&apos;écran, SMS, relevés) renforcent considérablement votre signalement et accélèrent l&apos;investigation.
                    </p>

                    <AnimatePresence>
                      {files.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 space-y-2 overflow-hidden"
                        >
                          {files.map((file, i) => (
                            <motion.div
                              key={file.name + i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5"
                            >
                              <span className="text-sm text-foreground truncate">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                                className="text-muted hover:text-primary transition-colors shrink-0 ml-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Trust + buttons */}
                  <div className="space-y-4 pt-2">
                    <div className="bg-foreground/[0.03] rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                        <svg className="w-4 h-4 text-success shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Vos garanties
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-start gap-2">
                          <svg className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="text-xs text-muted">100% anonyme et confidentiel</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="text-xs text-muted">Retour sous 48h garanti</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="text-xs text-muted">Investigation par des experts</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="text-xs text-muted">Code de suivi pour suivre votre dossier</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 py-4 rounded-2xl font-semibold text-base border border-border text-foreground hover:bg-gray-50 transition-colors"
                      >
                        {t("report.back")}
                      </button>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="flex-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white py-4 rounded-2xl font-semibold text-base transition-colors shadow-lg shadow-primary/25"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Envoi...
                          </span>
                        ) : (
                          t("report.submit")
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </FadeIn>
      </div>
    </div>
  );
}

function Label({ children, required, hint }: { children: React.ReactNode; required?: boolean; hint?: string }) {
  return (
    <label className="block text-sm font-semibold text-foreground mb-2">
      {children}
      {required && <span className="text-primary ml-0.5">*</span>}
      {hint && <span className="text-muted font-normal ml-1">({hint})</span>}
    </label>
  );
}

const inputClass = "w-full px-4 py-3.5 rounded-2xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-gray-300";
