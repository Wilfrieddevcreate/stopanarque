export type FaqItem = { question: string; answer: string };

/**
 * Questions fréquentes affichées sur /arnaques ET balisées en FAQPage.
 * Source unique : un FAQPage dont les questions ne sont pas visibles sur la page
 * est une violation des règles Google sur les résultats enrichis.
 */
export const ARNAQUES_FAQ: FaqItem[] = [
  { question: "Comment reconnaître une arnaque Mobile Money au Bénin ?", answer: "L'escroc prétend être un agent MTN ou Moov et demande votre code PIN, prétexte un remboursement d'erreur, ou promet de multiplier votre argent. Un vrai opérateur ne demandera jamais votre PIN par appel ou SMS." },
  { question: "Qu'est-ce que le phishing et comment l'éviter ?", answer: "Le phishing crée une copie d'un vrai site (banque, opérateur) pour voler vos identifiants. Vérifiez toujours l'URL exacte dans votre navigateur et ne cliquez jamais sur un lien reçu par SMS." },
  { question: "Comment savoir si une offre d'emploi est une arnaque ?", answer: "Une offre d'emploi est frauduleuse si elle demande un paiement avant l'embauche (frais de dossier, formation), propose un salaire très élevé sans qualifications requises, ou si l'entretien se fait uniquement par WhatsApp." },
  { question: "Que faire si on est victime de sextorsion au Bénin ?", answer: "Ne payez pas — cela empire toujours la situation. Signalez immédiatement à l'OCRC Bénin, bloquez l'escroc sur toutes les plateformes et signalez les profils. Gardez les preuves (captures d'écran)." },
  { question: "Comment identifier une arnaque à l'investissement ?", answer: "Toute promesse de rendement garanti à 100% ou 200% en peu de temps est une arnaque. Il n'existe pas d'investissement légal avec de tels taux. Vérifiez si la société est agréée par la BCEAO." },
  { question: "Comment vérifier si un numéro de téléphone est un arnaqueur au Bénin ?", answer: "Utilisez notre moteur de recherche sur stopanarque.bj pour vérifier si un numéro a déjà été signalé par d'autres utilisateurs au Bénin." },
  { question: "Qu'est-ce qu'une arnaque aux sentiments (romance scam) ?", answer: "L'escroc crée un faux profil séduisant sur les réseaux sociaux et entame une relation romantique. Après des semaines de confiance, il demande de l'argent pour une urgence. Ne jamais envoyer d'argent à quelqu'un qu'on n'a pas rencontré en personne." },
];
