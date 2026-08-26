import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

// Never auto-seed in production — only run explicitly with: npm run seed
if (process.env.NODE_ENV === "production") {
  console.log("⏭  Seed skipped in production.");
  process.exit(0);
}

const adapter = new PrismaLibSql({ url: `file:${path.join(process.cwd(), "dev.db")}` });
const prisma = new PrismaClient({ adapter });

function cuid() {
  return "c" + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
}

function code() {
  return "SA" + Math.floor(100000 + Math.random() * 900000);
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function dateStr(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

const REPORTS = [
  // ─── Phishing / sites frauduleux ────────────────────────────────────────────
  {
    scamType: "Phishing / Hameçonnage",
    suspectUrl: "https://mtn-benin-recharge-gratuite.net/offre",
    suspectName: "MTN Promotion",
    suspectPlatform: "Facebook",
    suspectAccount: "MTN.BJ.Promo",
    description: "Page Facebook qui proposait de recharger gratuitement son crédit MTN en cliquant sur un lien. Le lien demandait le numéro de téléphone et le code PIN.",
    amountLost: null,
    isAttemptOnly: true,
    incidentDate: dateStr(3),
    contactEmail: "victime1@gmail.com",
    status: "VERIFIE",
  },
  {
    scamType: "Phishing / Hameçonnage",
    suspectUrl: "https://mtn-benin-recharge-gratuite.net/offre",
    suspectName: null,
    suspectPlatform: "WhatsApp",
    suspectAccount: null,
    description: "Lien reçu sur WhatsApp prétendant offrir 2000 FCFA de crédit MTN. Redirige vers un faux site qui vole les identifiants.",
    amountLost: null,
    isAttemptOnly: true,
    incidentDate: dateStr(5),
    contactEmail: null,
    status: "VERIFIE",
  },
  {
    scamType: "Phishing / Hameçonnage",
    suspectUrl: "https://mtn-benin-recharge-gratuite.net/code",
    suspectName: null,
    suspectPlatform: "SMS",
    suspectAccount: null,
    description: "SMS reçu avec ce lien, soi-disant de MTN Bénin. Le site est une copie parfaite du vrai site MTN.",
    amountLost: null,
    isAttemptOnly: true,
    incidentDate: dateStr(7),
    contactEmail: null,
    status: "EN_ATTENTE",
  },

  // ─── Faux site de vente ──────────────────────────────────────────────────────
  {
    scamType: "Faux vendeur en ligne",
    suspectUrl: "https://boutique-electromenager-benin.com/commande",
    suspectName: "Kofi Electronics",
    suspectPlatform: "Facebook",
    suspectAccount: "KofiElectronics.Bj",
    description: "J'ai commandé un réfrigérateur Samsung sur ce site. Payé 185 000 FCFA par Mobile Money. Jamais livré, le site a disparu.",
    amountLost: "185000",
    isAttemptOnly: false,
    incidentDate: dateStr(14),
    contactEmail: "acheteur.lese@yahoo.fr",
    status: "VERIFIE",
  },
  {
    scamType: "Faux vendeur en ligne",
    suspectUrl: "https://boutique-electromenager-benin.com/commande",
    suspectName: "Kofi Electronics",
    suspectPlatform: "Facebook",
    suspectAccount: null,
    description: "Téléphone commandé et payé, jamais reçu. Après paiement le vendeur a bloqué tous mes appels.",
    amountLost: "45000",
    isAttemptOnly: false,
    incidentDate: dateStr(18),
    contactEmail: null,
    status: "VERIFIE",
  },

  // ─── Faux agent immobilier ───────────────────────────────────────────────────
  {
    scamType: "Faux agent immobilier",
    suspectUrl: "https://immo-cotonou-location.com/appartement-fidjrosse",
    suspectName: "Agence ImmoCotonou",
    suspectPlatform: "Facebook",
    suspectAccount: "ImmoCotonou.Officiel",
    description: "Annonce appartement F3 à Fidjrossè à 60 000 FCFA/mois. Demande de 3 mois d'avance et frais d'agence. L'appartement appartient à quelqu'un d'autre.",
    amountLost: "240000",
    isAttemptOnly: false,
    incidentDate: dateStr(20),
    contactEmail: "locataire.piege@gmail.com",
    status: "EN_ATTENTE",
  },

  // ─── Faux support technique ──────────────────────────────────────────────────
  {
    scamType: "Faux support technique",
    suspectUrl: "https://support-moov-benin.com/assistance",
    suspectName: "Support Moov",
    suspectPlatform: "Telegram",
    suspectAccount: "SupportMoovBenin",
    description: "Groupe Telegram soi-disant de Moov Africa. Propose de débloquer les comptes Mobile Money moyennant un paiement de 2000 FCFA.",
    amountLost: "2000",
    isAttemptOnly: false,
    incidentDate: dateStr(2),
    contactEmail: null,
    status: "EN_ATTENTE",
  },
  {
    scamType: "Faux support technique",
    suspectUrl: "https://support-moov-benin.com/assistance",
    suspectName: "Support Moov Officiel",
    suspectPlatform: "Telegram",
    suspectAccount: null,
    description: "Même arnaque Moov. Demande code OTP pour 'vérification'. Ils ont vidé mon compte Mobile Money.",
    amountLost: "37500",
    isAttemptOnly: false,
    incidentDate: dateStr(4),
    contactEmail: "cible2@gmail.com",
    status: "VERIFIE",
  },

  // ─── Loterie / Faux gain ─────────────────────────────────────────────────────
  {
    scamType: "Loterie / Faux gain",
    suspectUrl: "https://loterie-nationale-benin.ga/tirage-gagnant",
    suspectName: "Loterie Nationale Bénin",
    suspectPlatform: "Facebook",
    suspectAccount: "LoterieBenin.Officielle",
    description: "Page qui annonce que j'ai gagné 500 000 FCFA à la loterie nationale. Demande de payer 15 000 FCFA de 'frais de dossier' pour recevoir le gain.",
    amountLost: "15000",
    isAttemptOnly: false,
    incidentDate: dateStr(8),
    contactEmail: null,
    status: "VERIFIE",
  },
  {
    scamType: "Loterie / Faux gain",
    suspectUrl: "https://loterie-nationale-benin.ga/tirage-gagnant",
    suspectName: null,
    suspectPlatform: "SMS",
    suspectAccount: null,
    description: "SMS m'annonçant un gain de 1 million. Lien vers ce site qui demande des infos personnelles et bancaires.",
    amountLost: null,
    isAttemptOnly: true,
    incidentDate: dateStr(10),
    contactEmail: null,
    status: "EN_ATTENTE",
  },

  // ─── Faux médicament ─────────────────────────────────────────────────────────
  {
    scamType: "Faux médicament / guérisseur",
    suspectUrl: "https://medecine-naturelle-africa.com/guerison-rapide",
    suspectName: "Dr. Ahouandjinou Herbal",
    suspectPlatform: "WhatsApp",
    suspectAccount: "+22967891234",
    description: "Site vendant des remèdes naturels contre le diabète et l'hypertension. Produits reçus étaient des simples herbes séchées sans aucune efficacité. 35 000 FCFA perdus.",
    amountLost: "35000",
    isAttemptOnly: false,
    incidentDate: dateStr(30),
    contactEmail: "malade.dupe@gmail.com",
    status: "EN_ATTENTE",
  },

  // ─── Arnaque bourses / visa ──────────────────────────────────────────────────
  {
    scamType: "Arnaque aux bourses / visa",
    suspectUrl: "https://bourse-canada-afrique.com/dossier",
    suspectName: "Canada Scholarship Program",
    suspectPlatform: "Facebook",
    suspectAccount: "CanadaScholarshipAfrica",
    description: "Page Facebook proposant des bourses d'études au Canada. Demande de payer 50 000 FCFA pour 'traitement du dossier'. Après paiement plus aucun contact.",
    amountLost: "50000",
    isAttemptOnly: false,
    incidentDate: dateStr(45),
    contactEmail: "etudiant.arnaue@hotmail.com",
    status: "VERIFIE",
  },
  {
    scamType: "Arnaque aux bourses / visa",
    suspectUrl: "https://bourse-canada-afrique.com/dossier",
    suspectName: "Programme Bourses Canada",
    suspectPlatform: "WhatsApp",
    suspectAccount: null,
    description: "Même arnaque, même site. J'ai payé 75 000 FCFA. Le 'conseiller' a disparu après le virement.",
    amountLost: "75000",
    isAttemptOnly: false,
    incidentDate: dateStr(50),
    contactEmail: null,
    status: "VERIFIE",
  },

  // ─── Arnaque Mobile Money (téléphone) ───────────────────────────────────────
  {
    scamType: "Arnaque Mobile Money",
    phoneNumber: "+22961234567",
    suspectName: "Agent MTN",
    suspectPlatform: "Téléphone",
    description: "Prétend être un agent MTN, demande le code OTP reçu par SMS pour 'activer un bonus'. A vidé le compte MTN Money (52 000 FCFA).",
    amountLost: "52000",
    isAttemptOnly: false,
    incidentDate: dateStr(6),
    contactEmail: null,
    status: "VERIFIE",
  },
  {
    scamType: "Arnaque Mobile Money",
    phoneNumber: "+22961234567",
    suspectName: null,
    suspectPlatform: "Téléphone",
    description: "Même numéro. Soi-disant erreur de virement et demande de rembourser. C'est une arnaque classique.",
    amountLost: "10000",
    isAttemptOnly: false,
    incidentDate: dateStr(9),
    contactEmail: null,
    status: "VERIFIE",
  },
  {
    scamType: "Arnaque Mobile Money",
    phoneNumber: "+22997654321",
    suspectName: "Moov Agent",
    suspectPlatform: "Téléphone",
    description: "Appel d'un soi-disant agent Moov qui demande de confirmer une transaction en partageant le code reçu.",
    amountLost: "25000",
    isAttemptOnly: false,
    incidentDate: dateStr(12),
    contactEmail: null,
    status: "EN_ATTENTE",
  },

  // ─── Usurpation d'identité ───────────────────────────────────────────────────
  {
    scamType: "Usurpation d'identité",
    phoneNumber: "+22990112233",
    suspectName: "Commissaire Adjovi",
    suspectPlatform: "Téléphone",
    description: "Prétend être un commissaire de police et dit que mon nom est impliqué dans une affaire de blanchiment. Demande de payer 100 000 FCFA pour 'classer le dossier'.",
    amountLost: null,
    isAttemptOnly: true,
    incidentDate: dateStr(1),
    contactEmail: "cible.police@gmail.com",
    status: "EN_ATTENTE",
  },

  // ─── Arnaque sentimentale ────────────────────────────────────────────────────
  {
    scamType: "Arnaque aux sentiments",
    phoneNumber: "+22966778899",
    suspectName: "Sophie Martin",
    suspectPlatform: "Facebook",
    suspectAccount: "sophie.martin.france",
    description: "Relation Facebook de 3 mois. Prétend être une infirmière française bloquée au Ghana. Demande 200 000 FCFA pour 'rentrer en France'. Profil Facebook totalement faux.",
    amountLost: "200000",
    isAttemptOnly: false,
    incidentDate: dateStr(60),
    contactEmail: null,
    status: "VERIFIE",
  },

  // ─── Sextorsion ─────────────────────────────────────────────────────────────
  {
    scamType: "Sextorsion / Chantage intime",
    phoneNumber: "+22955443322",
    suspectName: null,
    suspectPlatform: "Telegram",
    suspectAccount: "@chantage_2024",
    description: "Après échange de photos sur Telegram, demande de 50 000 FCFA sinon diffusion sur les réseaux sociaux.",
    amountLost: null,
    isAttemptOnly: true,
    incidentDate: dateStr(15),
    contactEmail: null,
    status: "EN_ATTENTE",
  },
];

async function main() {
  console.log("🌱 Seeding database...\n");

  // Clean existing test reports (keep real data)
  const deleted = await prisma.report.deleteMany({
    where: { trackingCode: { startsWith: "SA_TEST_" } },
  });
  if (deleted.count > 0) {
    console.log(`🗑  Deleted ${deleted.count} previous test reports\n`);
  }

  let created = 0;
  for (const r of REPORTS) {
    const daysOffset = Math.floor(Math.random() * 60);
    await prisma.report.create({
      data: {
        id: cuid(),
        trackingCode: "SA_TEST_" + code(),
        phoneNumber: (r as { phoneNumber?: string }).phoneNumber ?? null,
        suspectName: r.suspectName ?? null,
        suspectPlatform: r.suspectPlatform ?? null,
        suspectAccount: r.suspectAccount ?? null,
        suspectUrl: (r as { suspectUrl?: string }).suspectUrl ?? null,
        description: r.description,
        scamType: r.scamType,
        amountLost: r.amountLost ?? null,
        incidentDate: r.incidentDate ?? null,
        contactEmail: r.contactEmail ?? null,
        isAttemptOnly: r.isAttemptOnly,
        status: r.status,
        createdAt: daysAgo(daysOffset),
        updatedAt: daysAgo(daysOffset),
      },
    });
    created++;
    console.log(`  ✓ [${r.scamType}] ${(r as { suspectUrl?: string }).suspectUrl ?? (r as { phoneNumber?: string }).phoneNumber ?? r.suspectName ?? "—"}`);
  }

  console.log(`\n✅ ${created} reports created.\n`);

  // Summary
  const byUrl = REPORTS.filter((r) => (r as { suspectUrl?: string }).suspectUrl).length;
  const byPhone = REPORTS.filter((r) => (r as { phoneNumber?: string }).phoneNumber).length;
  console.log(`📊 Breakdown:`);
  console.log(`   ${byUrl} reports with URL (web scams)`);
  console.log(`   ${byPhone} reports with phone number`);
  console.log(`\n🔍 Test searches:`);
  console.log(`   URL  → mtn-benin-recharge-gratuite.net  (3 signalements)`);
  console.log(`   URL  → boutique-electromenager-benin.com (2 signalements)`);
  console.log(`   URL  → support-moov-benin.com            (2 signalements)`);
  console.log(`   URL  → loterie-nationale-benin.ga        (2 signalements)`);
  console.log(`   URL  → bourse-canada-afrique.com         (2 signalements)`);
  console.log(`   TEL  → +22961234567                      (2 signalements)`);
  console.log(`   NOM  → Sophie Martin                     (1 signalement)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
