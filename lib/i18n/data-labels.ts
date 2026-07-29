import type { Locale } from "./translations";

// Traduction des types d'arnaques (stockés en FR dans la DB)
const SCAM_TYPE_LABELS: Record<string, Record<Locale, string>> = {
  "Appel frauduleux": { fr: "Appel frauduleux", en: "Fraudulent call", fon: "Telefónu gblègblé", yo: "Ìpè arékerèké" },
  "SMS frauduleux": { fr: "SMS frauduleux", en: "Fraudulent SMS", fon: "SMS gblègblé", yo: "SMS arékerèké" },
  "Phishing / Hameçonnage": { fr: "Phishing / Hameçonnage", en: "Phishing", fon: "Phishing / Hɛn mɛ", yo: "Phishing" },
  "Arnaque en ligne": { fr: "Arnaque en ligne", en: "Online scam", fon: "Gblègblé ɛntɛnɛ́ti tɔn", yo: "Jìbìtì lórí ayélujára" },
  "Usurpation d'identité": { fr: "Usurpation d'identité", en: "Identity theft", fon: "Mɛ ɖěvo sín nǔ wìwà", yo: "Jíjí ìdánimọ̀" },
  "Faux support technique": { fr: "Faux support technique", en: "Fake tech support", fon: "Alɔdó tekníki nyijɛ́", yo: "Àtìlẹ́yìn ìmọ̀-ẹ̀rọ èké" },
  "Arnaque bancaire": { fr: "Arnaque bancaire", en: "Banking scam", fon: "Gblègblé bánkì tɔn", yo: "Jìbìtì báńkì" },
  "Arnaque Mobile Money": { fr: "Arnaque Mobile Money", en: "Mobile Money scam", fon: "Gblègblé Mobile Money tɔn", yo: "Jìbìtì Mobile Money" },
  "Sextorsion / Chantage intime": { fr: "Sextorsion / Chantage intime", en: "Sextortion / Intimate blackmail", fon: "Sextorsion / Xɛ̌si nǔhɛnmɛ tɔn", yo: "Sextortion / Ìhalẹ̀mọ́ni ìkọ̀kọ̀" },
  "Arnaque aux sentiments": { fr: "Arnaque aux sentiments", en: "Romance scam", fon: "Gblègblé wǎn tɔn", yo: "Jìbìtì ìfẹ́" },
  "Autre": { fr: "Autre", en: "Other", fon: "Ðěvo", yo: "Mìíràn" },
};

// Traduction des plateformes (stockées en FR dans la DB)
const PLATFORM_LABELS: Record<string, Record<Locale, string>> = {
  "Appel téléphonique": { fr: "Appel téléphonique", en: "Phone call", fon: "Telefónu ylɔ̌ylɔ́", yo: "Ìpè fóònù" },
  "WhatsApp": { fr: "WhatsApp", en: "WhatsApp", fon: "WhatsApp", yo: "WhatsApp" },
  "SMS": { fr: "SMS", en: "SMS", fon: "SMS", yo: "SMS" },
  "Facebook": { fr: "Facebook", en: "Facebook", fon: "Facebook", yo: "Facebook" },
  "Instagram": { fr: "Instagram", en: "Instagram", fon: "Instagram", yo: "Instagram" },
  "Telegram": { fr: "Telegram", en: "Telegram", fon: "Telegram", yo: "Telegram" },
  "Email": { fr: "Email", en: "Email", fon: "Email", yo: "Imeeli" },
  "Site web": { fr: "Site web", en: "Website", fon: "Tɛn ɛntɛnɛ́ti tɔn", yo: "Ojú-ìwé ayélujára" },
  "Mobile Money (MTN/Moov)": { fr: "Mobile Money (MTN/Moov)", en: "Mobile Money (MTN/Moov)", fon: "Mobile Money (MTN/Moov)", yo: "Mobile Money (MTN/Moov)" },
  "Autre": { fr: "Autre", en: "Other", fon: "Ðěvo", yo: "Mìíràn" },
};

export function translateScamType(value: string, locale: Locale): string {
  return SCAM_TYPE_LABELS[value]?.[locale] || value;
}

export function translatePlatform(value: string, locale: Locale): string {
  return PLATFORM_LABELS[value]?.[locale] || value;
}
