import type { Metadata } from "next";
import { CONTACT_EMAIL, SITE_LANG, SITE_NAME, absoluteUrl, breadcrumb, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Nous contacter",
  description:
    "Contactez l'équipe StopArnaque Bénin : question, problème technique, demande de suppression de données ou partenariat. Réponse sous 48 h.",
  path: "/contact",
  ogDescription:
    "Une question ? Notre équipe vous répond sous 48 h.",
});

const jsonLdContact = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contacter ${SITE_NAME}`,
  url: absoluteUrl("/contact"),
  inLanguage: SITE_LANG,
  mainEntity: {
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    email: CONTACT_EMAIL,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: CONTACT_EMAIL,
        areaServed: "BJ",
        availableLanguage: ["French", "English"],
      },
    ],
  },
};

const jsonLdBreadcrumb = breadcrumb([
  { name: "Accueil", path: "/" },
  { name: "Nous contacter", path: "/contact" },
]);

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdContact) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      {children}
    </>
  );
}
