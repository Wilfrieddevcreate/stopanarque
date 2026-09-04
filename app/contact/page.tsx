"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const IconMsg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
);
const IconSend = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);

const REASONS = [
  { value: "signalement", key: "contact.reason.tracking" },
  { value: "technique",   key: "contact.reason.tech" },
  { value: "presse",      key: "contact.reason.press" },
  { value: "suppression", key: "contact.reason.suggestion" },
  { value: "autre",       key: "contact.reason.other" },
];

export default function ContactPage() {
  const { t } = useI18n();
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const reasonEntry = REASONS.find((r) => r.value === subject);
      const subjectLabel = reasonEntry ? t(reasonEntry.key) : subject;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject: subjectLabel, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de l'envoi.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-2">{t("contact.label")}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t("footer.contact")}</h1>
          <p className="text-muted max-w-xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left — info */}
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-foreground">{t("contact.info.title")}</h2>

              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <IconMail />
                </div>
                <div>
                  <p className="text-xs text-muted mb-0.5">{t("contact.info.email")}</p>
                  <a href="mailto:contact@stopanarque.bj" className="text-sm font-medium text-primary hover:underline">
                    contact@stopanarque.bj
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <IconClock />
                </div>
                <div>
                  <p className="text-xs text-muted mb-0.5">{t("contact.info.delay.title")}</p>
                  <p className="text-sm font-medium text-foreground">{t("contact.info.delay.value")}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <IconMsg />
                </div>
                <div>
                  <p className="text-xs text-muted mb-0.5">{t("contact.info.lang.title")}</p>
                  <p className="text-sm font-medium text-foreground">{t("contact.info.lang.value")}</p>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-3">
              <h2 className="font-semibold text-foreground text-sm mb-2">{t("contact.links.title")}</h2>
              {[
                { href: "/signaler",                  labelKey: "report.title" },
                { href: "/suivi",                     labelKey: "contact.link.tracking" },
                { href: "/politique-confidentialite", labelKey: "footer.privacy.policy" },
                { href: "/mentions-legales",          labelKey: "footer.mentions" },
              ].map(({ href, labelKey }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between text-sm text-muted hover:text-foreground transition-colors group"
                >
                  <span>{t(labelKey)}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity"><IconChevron /></span>
                </Link>
              ))}
            </div>

            {/* Security note */}
            <div className="flex gap-3 bg-success/5 border border-success/20 rounded-xl p-4">
              <span className="text-success shrink-0 mt-0.5"><IconShield /></span>
              <p className="text-xs text-muted leading-relaxed">
                {t("contact.security.note")}{" "}
                {t("contact.security.form")}{" "}
                <Link href="/signaler" className="text-primary hover:underline">{t("contact.security.link")}</Link>.
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-success/5 border border-success/30 rounded-xl p-10 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4 text-success">
                  <IconSend size={24} />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">{t("contact.success.title")}</h2>
                <p className="text-sm text-muted mb-6">
                  {t("contact.success.text")}
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="text-sm text-primary hover:underline"
                >
                  {t("contact.success.another")}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 sm:p-8 space-y-5">
                <h2 className="font-semibold text-foreground mb-1">{t("contact.form.title")}</h2>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t("contact.field.subject")} <span className="text-danger">*</span>
                  </label>
                  <select
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    <option value="">{t("contact.field.subject.placeholder")}</option>
                    {REASONS.map((r) => (
                      <option key={r.value} value={r.value}>{t(r.key)}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("contact.field.name")} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("contact.field.name.placeholder")}
                      className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("contact.field.email")} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("contact.field.email.placeholder")}
                      className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t("contact.field.message")} <span className="text-danger">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("contact.field.message.placeholder")}
                    className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-danger bg-danger/5 border border-danger/20 rounded-lg px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors text-sm"
                >
                  {sending ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                  ) : (
                    <IconSend size={15} />
                  )}
                  {sending ? "Envoi en cours…" : t("contact.submit")}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
