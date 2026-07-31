import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guide des arnaques",
  description:
    "Reconnaître une arnaque au Bénin : Mobile Money, faux emploi, phishing, romance scam, sextorsion, faux prêt… Apprenez les signes et comment vous protéger.",
  keywords: [
    "types d'arnaques Bénin",
    "arnaque Mobile Money",
    "phishing Bénin",
    "faux emploi Bénin",
    "romance scam Bénin",
    "sextorsion Bénin",
    "arnaque investissement Bénin",
    "faux prêt Bénin",
    "reconnaître arnaque",
    "protection arnaque",
  ],
  openGraph: {
    title: "Guide des arnaques au Bénin | StopArnaque",
    description:
      "17 types d'arnaques expliqués : comment les reconnaître, exemples réels et conseils de protection.",
    type: "article",
  },
  alternates: {
    canonical: "/arnaques",
  },
};

const FAQ_ITEMS = [
  { question: "Comment reconnaître une arnaque Mobile Money au Bénin ?", answer: "L'escroc prétend être un agent MTN ou Moov et demande votre code PIN, prétexte un remboursement d'erreur, ou promet de multiplier votre argent. Un vrai opérateur ne demandera jamais votre PIN par appel ou SMS." },
  { question: "Qu'est-ce que le phishing et comment l'éviter ?", answer: "Le phishing crée une copie d'un vrai site (banque, opérateur) pour voler vos identifiants. Vérifiez toujours l'URL exacte dans votre navigateur et ne cliquez jamais sur un lien reçu par SMS." },
  { question: "Comment savoir si une offre d'emploi est une arnaque ?", answer: "Une offre d'emploi est frauduleuse si elle demande un paiement avant l'embauche (frais de dossier, formation), propose un salaire très élevé sans qualifications requises, ou si l'entretien se fait uniquement par WhatsApp." },
  { question: "Que faire si on est victime de sextorsion au Bénin ?", answer: "Ne payez pas — cela empire toujours la situation. Signalez immédiatement à l'OCRC Bénin, bloquez l'escroc sur toutes les plateformes et signalez les profils. Gardez les preuves (captures d'écran)." },
  { question: "Comment identifier une arnaque à l'investissement ?", answer: "Toute promesse de rendement garanti à 100% ou 200% en peu de temps est une arnaque. Il n'existe pas d'investissement légal avec de tels taux. Vérifiez si la société est agréée par la BCEAO." },
  { question: "Comment vérifier si un numéro de téléphone est un arnaqueur au Bénin ?", answer: "Utilisez notre moteur de recherche sur stopanarque.bj pour vérifier si un numéro a déjà été signalé par d'autres utilisateurs au Bénin." },
  { question: "Qu'est-ce qu'une arnaque aux sentiments (romance scam) ?", answer: "L'escroc crée un faux profil séduisant sur les réseaux sociaux et entame une relation romantique. Après des semaines de confiance, il demande de l'argent pour une urgence. Ne jamais envoyer d'argent à quelqu'un qu'on n'a pas rencontré en personne." },
];

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://stopanarque.bj" },
    { "@type": "ListItem", position: 2, name: "Guide des arnaques", item: "https://stopanarque.bj/arnaques" },
  ],
};

export default function ArnaquesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      {children}
    </>
  );
}
