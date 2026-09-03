"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// SweetAlert2 : import dynamique — ne charge que si l'utilisateur déclenche une alerte
const swal = () => import("sweetalert2").then((m) => m.default);
import { SCAM_TYPES, PLATFORMS } from "@/lib/types";
import { FadeIn } from "@/components/MotionDiv";
import { useI18n } from "@/lib/i18n/context";

// ── Catégorisation des types d'arnaque ────────────────────────────────────────

const PHONE_SCAMS = new Set([
  "Arnaque Mobile Money",
  "Arnaque bancaire",
  "Appel frauduleux",
  "SMS frauduleux",
  "Usurpation d'identité",
  "Loterie / Faux gain",
  "Arnaque aux sentiments",
  "Sextorsion / Chantage intime",
]);

const WEB_SCAMS = new Set([
  "Phishing / Hameçonnage",
  "Faux vendeur en ligne",
  "Faux agent immobilier",
  "Arnaque aux bourses / visa",
  "Faux support technique",
  "Faux médicament / guérisseur",
]);

function needsPhone(type: string) {
  return PHONE_SCAMS.has(type) || (!WEB_SCAMS.has(type) && type !== "");
}

function needsUrl(type: string) {
  return WEB_SCAMS.has(type) || type === "Faux emploi" || type === "Arnaque à l'investissement" || type === "Faux prêt";
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SignalerPage() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Step 1
  const [phoneNumber, setPhoneNumber] = useState("");
  const [suspectUrl, setSuspectUrl] = useState("");
  const [suspectName, setSuspectName] = useState("");
  const [suspectPlatform, setSuspectPlatform] = useState("");
  const [suspectAccount, setSuspectAccount] = useState("");
  const [scamType, setScamType] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 2
  const [amountLost, setAmountLost] = useState("");
  const [description, setDescription] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isAttemptOnly, setIsAttemptOnly] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const phoneRequired = scamType === "" || PHONE_SCAMS.has(scamType);
  const showUrl = scamType !== "" && (WEB_SCAMS.has(scamType) || !PHONE_SCAMS.has(scamType));

  function validateStep1() {
    const errs: Record<string, string> = {};
    if (!scamType) {
      errs.scamType = "Sélectionnez un type d'arnaque";
    }
    if (phoneRequired && !phoneNumber.trim()) {
      errs.phoneNumber = "Le numéro est requis pour ce type d'arnaque";
    } else if (phoneNumber.trim() && !/^[\d\s+()-]{6,20}$/.test(phoneNumber.trim())) {
      errs.phoneNumber = "Numéro invalide";
    }
    if (WEB_SCAMS.has(scamType) && !suspectUrl.trim() && !phoneNumber.trim() && !suspectName.trim()) {
      errs.suspectUrl = "Fournissez au moins un lien, numéro ou nom suspect";
    }
    if (suspectUrl.trim() && !/^https?:\/\/.{3,}/.test(suspectUrl.trim())) {
      errs.suspectUrl = "Lien invalide (doit commencer par http:// ou https://)";
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
      fd.append("scamType", scamType);
      fd.append("description", description.trim() || "Aucune description");
      fd.append("isAttemptOnly", String(isAttemptOnly));
      if (phoneNumber.trim()) fd.append("phoneNumber", phoneNumber.trim());
      if (suspectUrl.trim()) fd.append("suspectUrl", suspectUrl.trim());
      if (suspectName.trim()) fd.append("suspectName", suspectName.trim());
      if (suspectPlatform) fd.append("suspectPlatform", suspectPlatform);
      if (suspectAccount.trim()) fd.append("suspectAccount", suspectAccount.trim());
      if (amountLost.trim()) fd.append("amountLost", amountLost.trim());
      if (incidentDate) fd.append("incidentDate", incidentDate);
      if (contactEmail.trim()) fd.append("contactEmail", contactEmail.trim());
      for (const file of files) fd.append("files", file);

      const res = await fetch("/api/reports", { method: "POST", body: fd });
      if (res.status === 429) {
        await (await swal()).fire({ icon: "warning", title: "Trop de signalements", text: "Veuillez patienter une minute.", confirmButtonColor: "#E8112D" });
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Erreur serveur");
      }

      const data = await res.json();
      await (await swal()).fire({
        icon: "success",
        title: t("report.success.title"),
        html: `
          <div style="text-align:left;max-width:360px;margin:0 auto">
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:14px">
              <p style="font-size:12px;color:#64748b;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px">${t("report.success.track.label")}</p>
              <p style="font-size:24px;font-weight:bold;font-family:monospace;letter-spacing:3px;color:#E8112D;margin-bottom:4px">${data.trackingCode}</p>
              <p style="font-size:11px;color:#94a3b8">${t("report.success.body")}</p>
            </div>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:14px">
              <p style="font-size:13px;color:#166534;font-weight:600;margin-bottom:6px">${t("report.success.steps.title")}</p>
              <ul style="font-size:12px;color:#166534;line-height:1.8;padding-left:16px;margin:0">
                <li>${t("report.success.step1")}</li>
                <li>${t("report.success.step2")}</li>
              </ul>
            </div>
          </div>
        `,
        confirmButtonColor: "#E8112D",
        confirmButtonText: t("report.success.confirm"),
        width: 480,
      });

      setPhoneNumber(""); setSuspectUrl(""); setSuspectName(""); setSuspectPlatform("");
      setSuspectAccount(""); setScamType(""); setAmountLost(""); setDescription("");
      setIncidentDate(""); setContactEmail(""); setIsAttemptOnly(false);
      setFiles([]); setErrors({}); setStep(1);
    } catch (err) {
      await (await swal()).fire({
        icon: "error",
        title: "Erreur",
        text: err instanceof Error ? err.message : "Une erreur est survenue. Veuillez réessayer.",
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
    if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{t("report.title")}</h1>
            <p className="mt-3 text-muted">{t("report.subtitle")}</p>
          </div>

          {/* Trust banner */}
          <div className="bg-success/5 border border-success/20 rounded-2xl p-4 mb-8 flex items-start gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{t("report.trust.title")}</p>
              <p className="text-xs text-muted leading-relaxed mt-0.5">
                {t("report.trust.text")}
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-3 mb-10">
            {[{ n: 1, label: t("report.step1") }, { n: 2, label: t("report.step2") }].map((s) => (
              <button key={s.n} type="button" onClick={() => s.n === 1 ? setStep(1) : goToStep2()} className="flex-1 group">
                <div className={`h-1.5 rounded-full mb-2 transition-colors ${step >= s.n ? "bg-primary" : "bg-gray-200"}`} />
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${step >= s.n ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}>{s.n}</span>
                  <span className={`text-sm font-medium transition-colors ${step >= s.n ? "text-foreground" : "text-muted"}`}>{s.label}</span>
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">

              {/* ── STEP 1 ── */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-6">

                  {/* Type d'arnaque — EN PREMIER pour adapter le reste */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label required>{t("report.scamtype")}</Label>
                      <a href="/arnaques" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Je ne sais pas quel type choisir
                      </a>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SCAM_TYPES.map((type) => (
                        <motion.button key={type} type="button" whileTap={{ scale: 0.95 }}
                          onClick={() => setScamType(type)}
                          className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${scamType === type ? "bg-primary text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                          {type}
                        </motion.button>
                      ))}
                    </div>
                    {errors.scamType && <p className="text-sm text-primary mt-1.5">{errors.scamType}</p>}
                  </div>

                  {/* Numéro de téléphone */}
                  <AnimatePresence>
                    <motion.div key="phone" layout>
                      <Label required={phoneRequired} hint={!phoneRequired ? "si applicable" : undefined}>
                        {t("report.phone")}
                      </Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </span>
                        <input type="tel" placeholder="+229 XX XX XX XX" value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className={`w-full pl-12 pr-4 py-4 rounded-2xl border text-lg font-mono ${errors.phoneNumber ? "border-primary bg-primary/5" : "border-border"} bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-gray-300`} />
                      </div>
                      {errors.phoneNumber && <p className="text-sm text-primary mt-1.5">{errors.phoneNumber}</p>}
                    </motion.div>
                  </AnimatePresence>

                  {/* URL / Lien suspect — affiché pour les arnaques web */}
                  <AnimatePresence>
                    {(showUrl || suspectUrl) && (
                      <motion.div key="url" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                        <Label hint={WEB_SCAMS.has(scamType) ? undefined : "si applicable"}>
                          Lien / URL suspect{WEB_SCAMS.has(scamType) ? "" : " (site, profil, annonce)"}
                        </Label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </span>
                          <input type="url" placeholder="https://faux-site-arnaque.com" value={suspectUrl}
                            onChange={(e) => setSuspectUrl(e.target.value)}
                            className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border ${errors.suspectUrl ? "border-primary bg-primary/5" : "border-border"} bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-gray-300`} />
                        </div>
                        {errors.suspectUrl && <p className="text-sm text-primary mt-1.5">{errors.suspectUrl}</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Nom du suspect */}
                  <div>
                    <Label hint={t("common.if_known")}>{t("report.name")}</Label>
                    <input type="text" placeholder="Ex: Jean Dupont, @arnaqueur229..." value={suspectName}
                      onChange={(e) => setSuspectName(e.target.value)} className={inputClass} />
                  </div>

                  {/* Plateforme */}
                  <div>
                    <Label hint={t("common.where_contacted")}>{t("report.platform")}</Label>
                    <div className="flex flex-wrap gap-2">
                      {PLATFORMS.map((p) => (
                        <motion.button key={p} type="button" whileTap={{ scale: 0.95 }}
                          onClick={() => setSuspectPlatform(suspectPlatform === p ? "" : p)}
                          className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${suspectPlatform === p ? "bg-primary text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                          {p}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Compte / identifiant */}
                  <div>
                    <Label hint={t("common.account_hint")}>{t("report.account")}</Label>
                    <input type="text" placeholder="Ex: numéro MoMo, fb.com/profil, @compte..." value={suspectAccount}
                      onChange={(e) => setSuspectAccount(e.target.value)} className={inputClass} />
                  </div>

                  <motion.button type="button" onClick={goToStep2} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-semibold text-base transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2">
                    {t("report.continue")}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.button>
                </motion.div>
              )}

              {/* ── STEP 2 ── */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }} className="space-y-6">

                  {/* Récap step 1 */}
                  <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted">{scamType}</p>
                      <p className="font-mono font-semibold text-foreground">{phoneNumber || suspectUrl || suspectName || "—"}</p>
                      {suspectName && phoneNumber && <p className="text-xs text-muted mt-0.5">{suspectName}</p>}
                    </div>
                    <button type="button" onClick={() => setStep(1)} className="text-sm text-primary font-medium hover:underline">
                      {t("report.modify")}
                    </button>
                  </div>

                  {/* Tentative ou réussie */}
                  <div>
                    <Label>L'arnaque a-t-elle réussi ?</Label>
                    <div className="flex gap-3">
                      {[
                        { value: false, label: "Oui, j'ai perdu de l'argent ou des données", color: "border-primary bg-primary/5 text-primary" },
                        { value: true, label: "Non, j'ai évité l'arnaque à temps", color: "border-success bg-success/5 text-success" },
                      ].map((opt) => (
                        <button key={String(opt.value)} type="button"
                          onClick={() => setIsAttemptOnly(opt.value)}
                          className={`flex-1 py-3 px-3 rounded-xl text-xs font-medium border-2 transition-all text-center ${isAttemptOnly === opt.value ? opt.color : "border-border text-muted hover:border-gray-300"}`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Montant perdu */}
                  {!isAttemptOnly && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <Label hint={t("common.optional")}>{t("report.amount")}</Label>
                      <div className="relative">
                        <input type="text" placeholder="Ex: 50 000" value={amountLost}
                          onChange={(e) => setAmountLost(e.target.value)}
                          className={`${inputClass} pr-16`} />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted font-medium">FCFA</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Date des faits */}
                  <div>
                    <Label hint={t("common.optional")}>Date de l'incident</Label>
                    <input type="date" max={today} value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      className={inputClass} />
                  </div>

                  {/* Description */}
                  <div>
                    <Label hint={t("common.optional")}>{t("report.description")}</Label>
                    <textarea rows={3} placeholder="Racontez brièvement les faits..." value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-gray-300 resize-none" />
                    <p className="text-xs text-muted mt-1.5 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-accent-dark shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Une description aide notre équipe à traiter votre dossier plus rapidement.
                    </p>
                  </div>

                  {/* Preuves */}
                  <div>
                    <Label hint={t("common.optional")}>{t("report.evidence")}</Label>
                    <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
                      className={`relative rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-gray-300"}`}>
                      <input type="file" multiple accept="image/*,.pdf" onChange={handleFileInput} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-muted">{t("report.dropzone")} <span className="text-primary font-medium">{t("report.browse")}</span></p>
                      <p className="text-xs text-gray-400 mt-1">{t("report.dropzone.hint")}</p>
                    </div>
                    <AnimatePresence>
                      {files.length > 0 && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 space-y-2 overflow-hidden">
                          {files.map((file, i) => (
                            <motion.div key={file.name + i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                              <span className="text-sm text-foreground truncate">{file.name}</span>
                              <button type="button" onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))} className="text-muted hover:text-primary transition-colors shrink-0 ml-2">
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

                  {/* Email de contact optionnel */}
                  <div>
                    <Label hint="facultatif — pour être recontacté sur l'avancement">Email de contact</Label>
                    <input type="email" placeholder="votre@email.com" value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)} className={inputClass} />
                    <p className="text-xs text-muted mt-1.5 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-accent-dark shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t("report.email.hint")}
                    </p>
                  </div>

                  {/* Garanties */}
                  <div className="bg-foreground/[0.03] rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                      <svg className="w-4 h-4 text-success shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Vos garanties
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {["100% anonyme et confidentiel", "Retour sous 48h garanti", "Investigation par des experts", "Code de suivi pour votre dossier"].map((g) => (
                        <div key={g} className="flex items-start gap-2">
                          <svg className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="text-xs text-muted">{g}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)}
                      className="flex-1 py-4 rounded-2xl font-semibold text-base border border-border text-foreground hover:bg-gray-50 transition-colors">
                      {t("report.back")}
                    </button>
                    <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      className="flex-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white py-4 rounded-2xl font-semibold text-base transition-colors shadow-lg shadow-primary/25">
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          {t("report.sending")}
                        </span>
                      ) : t("report.submit")}
                    </motion.button>
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
