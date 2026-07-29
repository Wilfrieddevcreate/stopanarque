/**
 * Enrichissement automatique des données suspect
 */

interface OperatorInfo {
  operator: string;
  type: string;
  region?: string;
  customerService?: string; // numéro à contacter pour signaler
  momoService?: string; // service Mobile Money
}

// Préfixes opérateurs Bénin (format: 229XXXXXXXX)
const BENIN_PREFIXES: { prefix: string; operator: string; type: string; customerService: string; momoService?: string }[] = [
  { prefix: "22996", operator: "MTN", type: "mobile", customerService: "123", momoService: "MoMo" },
  { prefix: "22997", operator: "MTN", type: "mobile", customerService: "123", momoService: "MoMo" },
  { prefix: "22990", operator: "MTN", type: "mobile", customerService: "123", momoService: "MoMo" },
  { prefix: "22991", operator: "MTN", type: "mobile", customerService: "123", momoService: "MoMo" },
  { prefix: "22966", operator: "MTN", type: "mobile", customerService: "123", momoService: "MoMo" },
  { prefix: "22967", operator: "MTN", type: "mobile", customerService: "123", momoService: "MoMo" },
  { prefix: "22961", operator: "MTN", type: "mobile", customerService: "123", momoService: "MoMo" },
  { prefix: "22962", operator: "MTN", type: "mobile", customerService: "123", momoService: "MoMo" },
  { prefix: "22994", operator: "Moov Africa", type: "mobile", customerService: "155", momoService: "Moov Money" },
  { prefix: "22995", operator: "Moov Africa", type: "mobile", customerService: "155", momoService: "Moov Money" },
  { prefix: "22998", operator: "Moov Africa", type: "mobile", customerService: "155", momoService: "Moov Money" },
  { prefix: "22999", operator: "Moov Africa", type: "mobile", customerService: "155", momoService: "Moov Money" },
  { prefix: "22964", operator: "Moov Africa", type: "mobile", customerService: "155", momoService: "Moov Money" },
  { prefix: "22965", operator: "Moov Africa", type: "mobile", customerService: "155", momoService: "Moov Money" },
  { prefix: "22968", operator: "Moov Africa", type: "mobile", customerService: "155", momoService: "Moov Money" },
  { prefix: "22993", operator: "Celtiis", type: "mobile", customerService: "124" },
  { prefix: "22963", operator: "Celtiis", type: "mobile", customerService: "124" },
  { prefix: "22921", operator: "Bénin Télécom", type: "fixe", customerService: "100" },
  { prefix: "22922", operator: "Bénin Télécom", type: "fixe", customerService: "100" },
  { prefix: "22923", operator: "Bénin Télécom", type: "fixe", customerService: "100" },
];

const COUNTRY_PREFIXES: Record<string, { name: string; flag: string }> = {
  "228": { name: "Togo", flag: "🇹🇬" },
  "226": { name: "Burkina Faso", flag: "🇧🇫" },
  "227": { name: "Niger", flag: "🇳🇪" },
  "234": { name: "Nigeria", flag: "🇳🇬" },
  "233": { name: "Ghana", flag: "🇬🇭" },
  "225": { name: "Côte d'Ivoire", flag: "🇨🇮" },
  "221": { name: "Sénégal", flag: "🇸🇳" },
  "223": { name: "Mali", flag: "🇲🇱" },
  "237": { name: "Cameroun", flag: "🇨🇲" },
  "241": { name: "Gabon", flag: "🇬🇦" },
  "242": { name: "Congo", flag: "🇨🇬" },
  "243": { name: "RDC", flag: "🇨🇩" },
  "229": { name: "Bénin", flag: "🇧🇯" },
  "33": { name: "France", flag: "🇫🇷" },
  "1": { name: "USA/Canada", flag: "🇺🇸" },
  "44": { name: "Royaume-Uni", flag: "🇬🇧" },
};

export function detectOperator(phoneNumber: string): OperatorInfo | null {
  const clean = phoneNumber.replace(/[\s+\-()]/g, "");
  let normalized = clean;
  if (clean.startsWith("0") && clean.length >= 8) {
    normalized = "229" + clean.slice(1);
  }

  for (const entry of BENIN_PREFIXES) {
    if (normalized.startsWith(entry.prefix)) {
      return {
        operator: entry.operator,
        type: entry.type,
        customerService: entry.customerService,
        momoService: entry.momoService,
      };
    }
  }

  if (!normalized.startsWith("229") && normalized.length > 8) {
    for (const [prefix, info] of Object.entries(COUNTRY_PREFIXES)) {
      if (normalized.startsWith(prefix)) {
        return { operator: "International", type: "mobile", region: `${info.flag} ${info.name}` };
      }
    }
    return { operator: "International", type: "inconnu" };
  }

  return { operator: "Bénin (opérateur inconnu)", type: "inconnu" };
}

// ── Liens d'investigation ──

export interface InvestigationLink {
  label: string;
  url: string;
  type: "whatsapp" | "facebook" | "instagram" | "google" | "phone" | "email";
}

export function generateInvestigationLinks(
  phone: string,
  names: string[],
  accounts: string[]
): InvestigationLink[] {
  const links: InvestigationLink[] = [];
  const clean = phone.replace(/[\s+\-()]/g, "");
  const intlPhone = clean.startsWith("229") ? clean : clean.startsWith("0") ? "229" + clean.slice(1) : clean;

  // WhatsApp check
  links.push({
    label: `Vérifier sur WhatsApp (+${intlPhone})`,
    url: `https://wa.me/${intlPhone}`,
    type: "whatsapp",
  });

  // Google search du numéro
  links.push({
    label: `Rechercher "${phone}" sur Google`,
    url: `https://www.google.com/search?q="${phone}"`,
    type: "google",
  });

  // Recherche numéro inversé
  links.push({
    label: `Annuaire inversé`,
    url: `https://www.google.com/search?q=annuaire+inversé+${intlPhone}+Bénin`,
    type: "google",
  });

  // Pour chaque nom suspect
  for (const name of names) {
    links.push({
      label: `Rechercher "${name}" sur Google`,
      url: `https://www.google.com/search?q="${encodeURIComponent(name)}"`,
      type: "google",
    });
    links.push({
      label: `Rechercher "${name}" sur Facebook`,
      url: `https://www.facebook.com/search/top/?q=${encodeURIComponent(name)}`,
      type: "facebook",
    });
  }

  // Pour chaque compte signalé
  for (const account of accounts) {
    if (account.includes("facebook.com") || account.includes("fb.com")) {
      links.push({ label: `Profil Facebook: ${account}`, url: account.startsWith("http") ? account : `https://${account}`, type: "facebook" });
    } else if (account.includes("instagram.com")) {
      links.push({ label: `Profil Instagram: ${account}`, url: account.startsWith("http") ? account : `https://${account}`, type: "instagram" });
    } else if (account.startsWith("@")) {
      links.push({ label: `Instagram: ${account}`, url: `https://instagram.com/${account.slice(1)}`, type: "instagram" });
      links.push({ label: `Facebook: ${account}`, url: `https://www.facebook.com/search/top/?q=${encodeURIComponent(account)}`, type: "facebook" });
    } else if (account.includes("@") && account.includes(".")) {
      links.push({ label: `Email: ${account}`, url: `https://www.google.com/search?q="${encodeURIComponent(account)}"`, type: "email" });
    } else {
      links.push({ label: `Rechercher "${account}"`, url: `https://www.google.com/search?q="${encodeURIComponent(account)}"`, type: "google" });
    }
  }

  return links;
}

// ── Analyse du mode opératoire ──

export interface ModusOperandi {
  summary: string;
  patterns: string[];
  recommendations: string[];
}

export function analyzeModusOperandi(
  scamTypes: string[],
  platforms: string[],
  totalAmount: number,
  reportCount: number,
  names: string[]
): ModusOperandi {
  const patterns: string[] = [];
  const recommendations: string[] = [];

  // Analyse des patterns
  if (reportCount >= 3) {
    patterns.push(`Récidiviste — signalé ${reportCount} fois`);
  }
  if (names.length > 1) {
    patterns.push(`Utilise plusieurs identités (${names.length} noms différents)`);
  }
  if (platforms.length > 1) {
    patterns.push(`Multi-canal — opère sur ${platforms.join(", ")}`);
  }
  if (totalAmount > 500000) {
    patterns.push(`Préjudice élevé — ${totalAmount.toLocaleString("fr-FR")} FCFA au total`);
  }

  // Patterns spécifiques par type d'arnaque
  if (scamTypes.includes("Sextorsion / Chantage intime")) {
    patterns.push("Sextorsion — utilise des photos/vidéos intimes pour faire chanter");
    recommendations.push("Vérifier si le profil est un compte volé (reverse image search sur la photo de profil)");
    recommendations.push("Signaler le profil sur la plateforme concernée (Facebook, Instagram...)");
  }
  if (scamTypes.includes("Arnaque aux sentiments")) {
    patterns.push("Romance scam — relation fictive pour soutirer de l'argent");
    recommendations.push("Vérifier les photos du suspect avec Google Images (recherche inversée)");
  }
  if (scamTypes.includes("Arnaque bancaire") || scamTypes.includes("Arnaque Mobile Money")) {
    patterns.push("Arnaque financière — cible les comptes bancaires ou Mobile Money");
    recommendations.push("Contacter l'opérateur pour tenter de bloquer/tracer les transactions");
    recommendations.push("Vérifier le numéro Mobile Money auprès de l'opérateur");
  }
  if (scamTypes.includes("Phishing / Hameçonnage")) {
    patterns.push("Phishing — utilise de faux sites web ou messages pour voler des identifiants");
    recommendations.push("Identifier et signaler le domaine frauduleux (Google Safe Browsing, CERT Bénin)");
  }
  if (scamTypes.includes("Faux support technique")) {
    patterns.push("Faux support technique — se fait passer pour un service officiel");
  }
  if (scamTypes.includes("Appel frauduleux")) {
    patterns.push("Opère par appel vocal — potentiel call center");
    if (reportCount >= 5) {
      recommendations.push("Volume élevé d'appels — possible organisation structurée, transmettre à l'OCRC");
    }
  }

  // Recommandations générales
  recommendations.push("Contacter le service client opérateur pour signaler le numéro");
  if (reportCount >= 3) {
    recommendations.push("Transmettre le dossier à l'OCRC (Office Central de Répression de la Cybercriminalité)");
  }

  // Summary
  const mainType = scamTypes[0] || "Arnaque";
  const summary = reportCount >= 5
    ? `Suspect très actif — ${mainType} avec ${reportCount} signalements. Préjudice total: ${totalAmount.toLocaleString("fr-FR")} FCFA. Enquête approfondie recommandée.`
    : reportCount >= 2
    ? `Suspect récurrent — ${mainType} signalé ${reportCount} fois. ${platforms.length > 1 ? "Opère sur plusieurs canaux." : ""}`
    : `Premier signalement pour ${mainType}. Surveillance recommandée.`;

  return { summary, patterns, recommendations };
}

// ── Profil suspect complet ──

export interface SuspectProfile {
  phoneNumber: string;
  internationalFormat: string;
  operator: OperatorInfo | null;
  totalReports: number;
  firstReported: string;
  lastReported: string;
  daysSinceFirst: number;
  daysSinceLast: number;
  namesUsed: string[];
  platformsUsed: string[];
  accountsUsed: string[];
  scamTypes: string[];
  totalAmountLost: number;
  statuses: { status: string; count: number }[];
  riskScore: number;
  riskLevel: "faible" | "moyen" | "élevé" | "critique";
  relatedPhones: string[];
  investigationLinks: InvestigationLink[];
  modusOperandi: ModusOperandi;
  activityTimeline: { date: string; scamType: string; amount: string | null; status: string }[];
}

interface ReportData {
  id: string;
  phoneNumber: string;
  suspectName: string | null;
  suspectPlatform: string | null;
  suspectAccount: string | null;
  scamType: string;
  amountLost: string | null;
  status: string;
  createdAt: Date;
  duplicateOf: string | null;
}

export function buildSuspectProfile(
  phoneNumber: string,
  reports: ReportData[],
  relatedReports: ReportData[] = []
): SuspectProfile {
  const operator = detectOperator(phoneNumber);

  const namesUsed = [...new Set(reports.map((r) => r.suspectName).filter(Boolean))] as string[];
  const platformsUsed = [...new Set(reports.map((r) => r.suspectPlatform).filter(Boolean))] as string[];
  const accountsUsed = [...new Set(reports.map((r) => r.suspectAccount).filter(Boolean))] as string[];
  const scamTypes = [...new Set(reports.map((r) => r.scamType))];

  const totalAmountLost = reports.reduce((sum, r) => {
    if (!r.amountLost) return sum;
    const parsed = parseInt(r.amountLost.replace(/\D/g, ""), 10);
    return sum + (isNaN(parsed) ? 0 : parsed);
  }, 0);

  const dates = reports.map((r) => new Date(r.createdAt).getTime());
  const firstReported = new Date(Math.min(...dates)).toISOString();
  const lastReported = new Date(Math.max(...dates)).toISOString();
  const now = Date.now();
  const daysSinceFirst = Math.floor((now - Math.min(...dates)) / 86400000);
  const daysSinceLast = Math.floor((now - Math.max(...dates)) / 86400000);

  // Format international
  const clean = phoneNumber.replace(/[\s+\-()]/g, "");
  const internationalFormat = clean.startsWith("229") ? `+${clean}` : clean.startsWith("0") ? `+229${clean.slice(1)}` : `+${clean}`;

  // Statuts
  const statusMap: Record<string, number> = {};
  for (const r of reports) statusMap[r.status] = (statusMap[r.status] || 0) + 1;
  const statuses = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

  // Numéros liés
  const relatedPhones = [...new Set(
    relatedReports.filter((r) => r.phoneNumber !== phoneNumber).map((r) => r.phoneNumber)
  )];

  // Score de risque
  let riskScore = 0;
  riskScore += Math.min(reports.length * 15, 40);
  riskScore += statusMap["CONFIRME"] ? 25 : 0;
  riskScore += totalAmountLost > 0 ? Math.min(Math.floor(totalAmountLost / 50000), 15) : 0;
  riskScore += platformsUsed.length > 1 ? 10 : 0;
  riskScore += namesUsed.length > 1 ? 5 : 0;
  riskScore += relatedPhones.length > 0 ? 5 : 0;
  riskScore = Math.min(riskScore, 100);

  let riskLevel: SuspectProfile["riskLevel"] = "faible";
  if (riskScore >= 75) riskLevel = "critique";
  else if (riskScore >= 50) riskLevel = "élevé";
  else if (riskScore >= 25) riskLevel = "moyen";

  // Liens d'investigation
  const investigationLinks = generateInvestigationLinks(phoneNumber, namesUsed, accountsUsed);

  // Modus operandi
  const modusOperandi = analyzeModusOperandi(scamTypes, platformsUsed, totalAmountLost, reports.length, namesUsed);

  // Timeline d'activité
  const activityTimeline = reports
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((r) => ({
      date: new Date(r.createdAt).toISOString(),
      scamType: r.scamType,
      amount: r.amountLost,
      status: r.status,
    }));

  return {
    phoneNumber,
    internationalFormat,
    operator,
    totalReports: reports.length,
    firstReported,
    lastReported,
    daysSinceFirst,
    daysSinceLast,
    namesUsed,
    platformsUsed,
    accountsUsed,
    scamTypes,
    totalAmountLost,
    statuses,
    riskScore,
    riskLevel,
    relatedPhones,
    investigationLinks,
    modusOperandi,
    activityTimeline,
  };
}
