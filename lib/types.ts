export const SCAM_TYPES = [
  "Arnaque Mobile Money",
  "Arnaque bancaire",
  "Phishing / Hameçonnage",
  "Faux vendeur en ligne",
  "Faux emploi",
  "Arnaque à l'investissement",
  "Faux prêt",
  "Loterie / Faux gain",
  "Usurpation d'identité",
  "Arnaque aux sentiments",
  "Sextorsion / Chantage intime",
  "Faux agent immobilier",
  "Arnaque aux bourses / visa",
  "Faux médicament / guérisseur",
  "Faux support technique",
  "Appel frauduleux",
  "SMS frauduleux",
  "Autre",
] as const;

export type ScamType = (typeof SCAM_TYPES)[number];

export const PLATFORMS = [
  "Appel téléphonique",
  "WhatsApp",
  "SMS",
  "Facebook",
  "Instagram",
  "Telegram",
  "Email",
  "Site web",
  "Mobile Money (MTN/Moov)",
  "Autre",
] as const;

export const REPORT_STATUSES = {
  EN_ATTENTE: "EN_ATTENTE",
  EN_ANALYSE: "EN_ANALYSE",
  CONFIRME: "CONFIRME",
  REJETE: "REJETE",
} as const;

export type ReportStatus = keyof typeof REPORT_STATUSES;

export const STATUS_LABELS: Record<ReportStatus, string> = {
  EN_ATTENTE: "En attente",
  EN_ANALYSE: "En analyse",
  CONFIRME: "Confirmé",
  REJETE: "Rejeté",
};

export const STATUS_COLORS: Record<ReportStatus, string> = {
  EN_ATTENTE: "bg-yellow-100 text-yellow-800",
  EN_ANALYSE: "bg-green-100 text-green-800",
  CONFIRME: "bg-red-100 text-red-800",
  REJETE: "bg-gray-100 text-gray-600",
};

export function getRiskLevel(count: number): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (count >= 5) return { label: "Élevé", color: "text-red-700", bgColor: "bg-red-50 border-red-200" };
  if (count >= 2) return { label: "Moyen", color: "text-orange-700", bgColor: "bg-orange-50 border-orange-200" };
  return { label: "Faible", color: "text-green-700", bgColor: "bg-green-50 border-green-200" };
}
