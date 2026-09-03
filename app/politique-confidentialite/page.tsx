import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité de StopArnaque Bénin — données collectées, finalités, droits des utilisateurs et sécurité.",
  alternates: { canonical: "/politique-confidentialite" },
};

const jsonLdBreadcrumb = breadcrumb([
  { name: "Accueil", path: "/" },
  { name: "Politique de confidentialité", path: "/politique-confidentialite" },
]);

const UPDATED = "31 juillet 2026";

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="py-12 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10">
          <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-2">Légal</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Politique de confidentialité</h1>
          <p className="text-muted mt-2 text-sm">Dernière mise à jour : {UPDATED}</p>
        </div>

        {/* Résumé visuel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", color: "bg-green-50 border-green-200 text-green-700", title: "100% anonyme", desc: "Votre identité n'est jamais révélée publiquement" },
            { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", color: "bg-blue-50 border-blue-200 text-blue-700", title: "Données sécurisées", desc: "Chiffrement et accès restreint aux équipes autorisées" },
            { icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16", color: "bg-yellow-50 border-yellow-200 text-yellow-700", title: "Suppression possible", desc: "Demandez la suppression de vos données à tout moment" },
          ].map((card) => (
            <div key={card.title} className={`rounded-2xl border p-4 ${card.color.split(" ").slice(0, 2).join(" ")}`}>
              <svg className={`w-6 h-6 mb-2 ${card.color.split(" ")[2]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={card.icon} />
              </svg>
              <p className={`font-semibold text-sm ${card.color.split(" ")[2]}`}>{card.title}</p>
              <p className="text-xs mt-1 text-foreground/70">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="space-y-10">

          <Section title="1. Responsable du traitement">
            <p>
              Le responsable du traitement des données personnelles collectées via le site <strong>stopanarque.bj</strong> est :
            </p>
            <dl className="mt-3 space-y-1 text-sm">
              <Row label="Entité">StopArnaque Bénin</Row>
              <Row label="Email">
                <a href="mailto:contact@stopanarque.bj" className="text-primary hover:underline">contact@stopanarque.bj</a>
              </Row>
            </dl>
          </Section>

          <Section title="2. Données collectées">
            <p>Selon votre utilisation du site, nous collectons les données suivantes :</p>
            <div className="mt-4 space-y-4">
              <DataTable
                title="Lors d'un signalement"
                rows={[
                  ["Numéro de téléphone suspect", "Optionnel", "Identification du numéro frauduleux"],
                  ["URL ou lien suspect", "Optionnel", "Identification du site ou profil frauduleux"],
                  ["Nom du suspect", "Optionnel", "Enrichissement du dossier"],
                  ["Description des faits", "Optionnel", "Instruction du dossier"],
                  ["Montant perdu", "Optionnel", "Évaluation du préjudice"],
                  ["Date de l'incident", "Optionnel", "Analyse temporelle"],
                  ["Pièces jointes (captures d'écran, PDF)", "Optionnel", "Preuve à l'instruction"],
                  ["Email de contact", "Optionnel", "Retour sur votre dossier uniquement"],
                ]}
              />
              <DataTable
                title="Automatiquement (navigation)"
                rows={[
                  ["Adresse IP", "Automatique", "Sécurité, prévention des abus"],
                  ["Pages visitées", "Automatique", "Statistiques anonymes d'usage"],
                  ["User-agent (navigateur)", "Automatique", "Compatibilité et sécurité"],
                ]}
              />
            </div>
            <p className="mt-4 text-sm bg-blue-50 border border-blue-200 rounded-xl p-3 text-blue-800">
              <strong>Important :</strong> Le signaleur (vous) reste <strong>entièrement anonyme</strong>.
              Nous ne collectons ni votre nom, ni votre propre numéro de téléphone lors d'un signalement.
            </p>
          </Section>

          <Section title="3. Finalités du traitement">
            <ul className="space-y-2">
              {[
                ["Instruction des signalements", "Analyse et vérification des numéros et profils frauduleux signalés"],
                ["Lutte contre la cybercriminalité", "Transmission aux autorités compétentes (OCRC, CRIET) lorsque nécessaire"],
                ["Sécurité de la plateforme", "Détection et prévention des abus, attaques et signalements malveillants"],
                ["Amélioration du service", "Statistiques anonymes d'utilisation de la plateforme"],
                ["Suivi de dossier", "Vous informer de l'avancement si vous avez fourni un email de contact"],
              ].map(([title, desc]) => (
                <li key={title} className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                  <div>
                    <span className="font-medium text-foreground">{title}</span>
                    <span className="text-foreground/70"> — {desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="4. Base légale du traitement">
            <ul className="space-y-2">
              {[
                ["Intérêt légitime", "Traitement des signalements et sécurité de la plateforme (art. 8 de la loi n°2009-09)"],
                ["Consentement", "Email de contact optionnel fourni volontairement"],
                ["Mission d'intérêt public", "Coopération avec les autorités judiciaires béninoises"],
              ].map(([base, desc]) => (
                <li key={base} className="flex gap-2 text-sm">
                  <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5">{base}</span>
                  <span className="text-foreground/80">{desc}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="5. Durée de conservation">
            <div className="space-y-2 text-sm">
              {[
                ["Données de signalement", "2 ans", "À compter de la date de signalement, sauf procédure judiciaire en cours"],
                ["Logs de sécurité (IP)", "90 jours", "Puis suppression automatique"],
                ["Email de contact", "Durée du traitement du dossier", "Puis suppression immédiate"],
                ["Statistiques anonymes", "Indéfinie", "Aucune donnée personnelle associée"],
              ].map(([type, duration, note]) => (
                <div key={type} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <span className="font-medium text-foreground">{type}</span>
                    <span className="text-muted"> — {note}</span>
                  </div>
                  <span className="shrink-0 text-xs font-semibold bg-foreground/10 px-2 py-0.5 rounded-full">{duration}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="6. Partage des données">
            <p>Vos données ne sont <strong>jamais vendues</strong> à des tiers. Elles peuvent être partagées uniquement avec :</p>
            <ul className="mt-3 space-y-2">
              {[
                "Les autorités judiciaires béninoises (OCRC, CRIET, Police) sur réquisition judiciaire",
                "Notre hébergeur (Vercel) pour le fonctionnement technique du site — soumis à des garanties contractuelles strictes",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="7. Vos droits">
            <p>Conformément à la loi n°2009-09 du 22 mai 2009 relative à la protection des données à caractère personnel au Bénin, vous disposez des droits suivants :</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { right: "Droit d'accès", desc: "Obtenir une copie de vos données" },
                { right: "Droit de rectification", desc: "Corriger des données inexactes" },
                { right: "Droit à l'effacement", desc: "Demander la suppression de vos données" },
                { right: "Droit d'opposition", desc: "Vous opposer à certains traitements" },
                { right: "Droit à la limitation", desc: "Restreindre l'utilisation de vos données" },
                { right: "Droit de réclamation", desc: "Saisir l'APDP Bénin" },
              ].map(({ right, desc }) => (
                <div key={right} className="border border-border rounded-xl p-3">
                  <p className="font-semibold text-sm text-foreground">{right}</p>
                  <p className="text-xs text-muted mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm">
              Pour exercer vos droits : <a href="mailto:contact@stopanarque.bj" className="text-primary hover:underline font-medium">contact@stopanarque.bj</a> — réponse sous 30 jours.
            </p>
            <p className="mt-2 text-sm text-muted">
              Vous pouvez également adresser une réclamation à l'<strong>APDP</strong> (Autorité de Protection des Données à Caractère Personnel du Bénin).
            </p>
          </Section>

          <Section title="8. Cookies">
            <p>Le site utilise uniquement des cookies techniques essentiels au fonctionnement :</p>
            <div className="mt-3 space-y-2 text-sm">
              {[
                ["admin_session", "Session administrateur", "Durée de la session", "Strictement nécessaire"],
                ["locale", "Préférence de langue", "1 an", "Strictement nécessaire"],
              ].map(([name, purpose, duration, type]) => (
                <div key={name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <code className="text-xs font-mono bg-white border border-border px-2 py-0.5 rounded shrink-0">{name}</code>
                  <span className="flex-1 text-foreground/80">{purpose}</span>
                  <span className="text-xs text-muted shrink-0">{duration}</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full shrink-0">{type}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted">
              Aucun cookie publicitaire ou de tracking tiers n'est utilisé sur ce site.
            </p>
          </Section>

          <Section title="9. Sécurité">
            <p>Nous mettons en œuvre les mesures techniques suivantes pour protéger vos données :</p>
            <ul className="mt-3 space-y-1.5">
              {[
                "Connexions chiffrées HTTPS (TLS 1.3)",
                "Détection automatique des attaques et blocage des IPs malveillantes",
                "Accès aux données restreint aux administrateurs authentifiés",
                "Fichiers joints stockés hors de l'accès public direct",
                "Mots de passe administrateurs hachés (bcrypt)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="10. Modifications">
            <p>
              Nous nous réservons le droit de modifier la présente politique à tout moment.
              Toute modification sera signalée par la mise à jour de la date en haut de cette page.
              Nous vous encourageons à consulter cette page régulièrement.
            </p>
          </Section>

          <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <Link href="/mentions-legales" className="text-sm text-primary hover:underline font-medium">
              ← Mentions légales
            </Link>
            <a href="mailto:contact@stopanarque.bj" className="text-sm text-primary hover:underline font-medium">
              Nous contacter : contact@stopanarque.bj
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-foreground mb-3 pb-2 border-b border-border">{title}</h2>
      <div className="text-sm text-foreground/80 leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <dt className="text-muted shrink-0 w-44">{label} :</dt>
      <dd className="text-foreground font-medium">{children}</dd>
    </div>
  );
}

function DataTable({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <div>
      <p className="font-semibold text-foreground text-sm mb-2">{title}</p>
      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 text-muted font-semibold">Donnée</th>
              <th className="text-left p-3 text-muted font-semibold">Caractère</th>
              <th className="text-left p-3 text-muted font-semibold">Finalité</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map(([data, required, purpose]) => (
              <tr key={data} className="hover:bg-gray-50/50">
                <td className="p-3 text-foreground font-medium">{data}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${required === "Automatique" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                    {required}
                  </span>
                </td>
                <td className="p-3 text-foreground/70">{purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
