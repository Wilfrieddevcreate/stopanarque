"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

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
  { value: "signalement", label: "Question sur un signalement" },
  { value: "technique", label: "Problème technique" },
  { value: "presse", label: "Demande presse / partenariat" },
  { value: "suppression", label: "Demande de suppression de données" },
  { value: "autre", label: "Autre" },
];

export default function ContactPage() {
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subjectLine = subject
      ? `[${REASONS.find((r) => r.value === subject)?.label ?? subject}] ${name ? `- ${name}` : ""}`
      : `Contact StopArnaque${name ? ` - ${name}` : ""}`;
    const body = `${message}\n\n---\nNom : ${name}\nEmail de réponse : ${email}`;
    window.location.href = `mailto:contact@stopanarque.bj?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-2">Contact</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Nous contacter</h1>
          <p className="text-muted max-w-xl mx-auto">
            Une question, un problème ou une suggestion ? Notre équipe vous répond dans les meilleurs délais.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left — info */}
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-foreground">Informations</h2>

              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <IconMail />
                </div>
                <div>
                  <p className="text-xs text-muted mb-0.5">Email</p>
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
                  <p className="text-xs text-muted mb-0.5">Délai de réponse</p>
                  <p className="text-sm font-medium text-foreground">Sous 48 h ouvrées</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <IconMsg />
                </div>
                <div>
                  <p className="text-xs text-muted mb-0.5">Langue</p>
                  <p className="text-sm font-medium text-foreground">Français, English</p>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-3">
              <h2 className="font-semibold text-foreground text-sm mb-2">Liens utiles</h2>
              {[
                { href: "/signaler", label: "Signaler une arnaque" },
                { href: "/suivi", label: "Suivre mon dossier" },
                { href: "/politique-confidentialite", label: "Politique de confidentialité" },
                { href: "/mentions-legales", label: "Mentions légales" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between text-sm text-muted hover:text-foreground transition-colors group"
                >
                  <span>{label}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity"><IconChevron /></span>
                </Link>
              ))}
            </div>

            {/* Security note */}
            <div className="flex gap-3 bg-success/5 border border-success/20 rounded-xl p-4">
              <span className="text-success shrink-0 mt-0.5"><IconShield /></span>
              <p className="text-xs text-muted leading-relaxed">
                Ne nous envoyez jamais de mots de passe ou de codes PIN par email.
                Pour un signalement, utilisez le{" "}
                <Link href="/signaler" className="text-primary hover:underline">formulaire dédié</Link>.
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
                <h2 className="text-xl font-bold text-foreground mb-2">Message préparé !</h2>
                <p className="text-sm text-muted mb-6">
                  Votre client de messagerie s'est ouvert avec le message pré-rempli.
                  Il vous suffit d'envoyer l'email.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="text-sm text-primary hover:underline"
                >
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 sm:p-8 space-y-5">
                <h2 className="font-semibold text-foreground mb-1">Envoyer un message</h2>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Sujet <span className="text-danger">*</span>
                  </label>
                  <select
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    <option value="">— Choisir un sujet —</option>
                    {REASONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Votre nom <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex : Kofi Mensah"
                      className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Votre email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@exemple.com"
                      className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Message <span className="text-danger">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Décrivez votre demande en détail…"
                    className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                  />
                </div>

                <p className="text-xs text-muted">
                  En cliquant sur Envoyer, votre client de messagerie s'ouvrira avec votre message pré-rempli.
                </p>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
                >
                  <IconSend size={15} />
                  Envoyer le message
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
