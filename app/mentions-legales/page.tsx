import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de StopArnaque Bénin — éditeur, hébergeur, propriété intellectuelle et responsabilités.",
  alternates: { canonical: "/mentions-legales" },
};

const jsonLdBreadcrumb = breadcrumb([
  { name: "Accueil", path: "/" },
  { name: "Mentions légales", path: "/mentions-legales" },
]);

const UPDATED = "3 septembre 2026";

export default function MentionsLegalesPage() {
  return (
    <div className="py-12 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10">
          <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-2">Légal</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Mentions légales</h1>
          <p className="text-muted mt-2 text-sm">Dernière mise à jour : {UPDATED}</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-10">

          <Section title="1. Éditeur du site">
            <p>Le site <strong>stopanarque.bj</strong> est édité par :</p>
            <dl className="mt-3 space-y-1 text-sm">
              <Row label="Dénomination">StopArnaque Bénin</Row>
              <Row label="Forme juridique">Association à but non lucratif</Row>
              <Row label="Siège social">Cotonou, République du Bénin</Row>
              <Row label="Email de contact"><a href="mailto:contact@stopanarque.bj" className="text-primary hover:underline">contact@stopanarque.bj</a></Row>
              <Row label="Directeur de publication">Équipe StopArnaque Bénin</Row>
            </dl>
          </Section>

          <Section title="2. Hébergement">
            <p>Le site est hébergé par :</p>
            <dl className="mt-3 space-y-1 text-sm">
              <Row label="Hébergeur">Render Inc.</Row>
              <Row label="Adresse">525 Brannan St, Suite 300, San Francisco, CA 94107, États-Unis</Row>
              <Row label="Site web"><a href="https://render.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">render.com</a></Row>
            </dl>
          </Section>

          <Section title="3. Propriété intellectuelle">
            <p>
              L'ensemble des éléments constituant le site StopArnaque Bénin (textes, graphismes, logotypes, icônes, images, code source)
              est la propriété exclusive de StopArnaque Bénin et est protégé par les lois en vigueur relatives à la propriété intellectuelle.
            </p>
            <p className="mt-3">
              Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie de ces éléments,
              quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de StopArnaque Bénin.
            </p>
          </Section>

          <Section title="4. Responsabilité">
            <p>
              StopArnaque Bénin s'efforce d'assurer l'exactitude et la mise à jour des informations publiées sur ce site.
              Cependant, nous ne pouvons garantir l'exactitude, la complétude ou l'actualité des informations diffusées.
            </p>
            <p className="mt-3">
              Les signalements publiés sur la plateforme proviennent d'utilisateurs tiers. StopArnaque Bénin effectue
              une vérification de ces signalements mais ne peut être tenu responsable des erreurs ou omissions.
            </p>
            <p className="mt-3">
              StopArnaque Bénin ne pourra être tenu responsable des dommages directs ou indirects causés au matériel
              de l'utilisateur lors de l'accès au site.
            </p>
          </Section>

          <Section title="5. Liens hypertextes">
            <p>
              Le site peut contenir des liens vers des sites tiers. StopArnaque Bénin n'exerce aucun contrôle sur
              ces sites et décline toute responsabilité quant à leur contenu ou leur politique de confidentialité.
            </p>
          </Section>

          <Section title="6. Droit applicable">
            <p>
              Le présent site et ses mentions légales sont soumis au droit béninois. Tout litige relatif
              à l'utilisation du site relèvera de la compétence exclusive des tribunaux compétents de Cotonou,
              République du Bénin.
            </p>
          </Section>

          <Section title="7. Contact">
            <p>
              Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter à l'adresse
              suivante : <a href="mailto:contact@stopanarque.bj" className="text-primary hover:underline">contact@stopanarque.bj</a>
            </p>
          </Section>

          <div className="pt-4 border-t border-border">
            <Link href="/politique-confidentialite" className="text-sm text-primary hover:underline font-medium">
              Consulter notre Politique de confidentialité →
            </Link>
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
