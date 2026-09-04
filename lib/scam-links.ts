/**
 * Rapprochement entre les articles d'actualité et les fiches d'arnaques.
 *
 * Le mot-clé est cherché parmi les segments du slug (égalité stricte, pas de
 * sous-chaîne) : « appelle » ne matche pas « appellation ». Le premier type
 * listé qui correspond l'emporte, d'où l'ordre du plus spécifique au plus
 * générique. Un article sans correspondance n'est simplement lié à rien.
 */
const KEYWORDS: [scamId: string, words: string[]][] = [
  ["sextorsion",        ["sextorsion", "chantage", "intime", "intimes"]],
  ["romance",           ["sentiments", "sentiment", "romance", "romantique", "amoureuse", "amoureux"]],
  ["mobile-money",      ["mobile", "momo", "mtn", "moov", "celtiis", "money"]],
  ["arnaque-bancaire",  ["bancaire", "bancaires", "banque", "banques", "carte"]],
  ["phishing",          ["phishing", "hameconnage", "hameçonnage"]],
  ["faux-emploi",       ["emploi", "emplois", "recrutement", "embauche", "job"]],
  ["investissement",    ["investissement", "investissements", "placement", "crypto", "trading"]],
  ["faux-pret",         ["pret", "prêt", "prets", "prêts", "credit", "crédit"]],
  ["loterie",           ["loterie", "tirage", "gain", "gains"]],
  ["faux-vendeur",      ["vendeur", "vendeurs", "boutique", "colis", "livraison"]],
  ["immobilier",        ["immobilier", "immobiliers", "loyer", "logement"]],
  ["bourse-visa",       ["bourse", "bourses", "visa", "visas"]],
  ["medecin",           ["medicament", "médicament", "medicaments", "guerisseur", "guérisseur"]],
  ["support-technique", ["support", "antivirus", "technique"]],
  ["sms-frauduleux",    ["sms"]],
  ["usurpation",        ["usurpation", "identite", "identité"]],
  ["appel-frauduleux",  ["appel", "appels", "appelle", "numero", "numéro", "numeros", "numéros"]],
];

export function scamIdForArticle(article: { slug: string }): string | null {
  const tokens = new Set(article.slug.toLowerCase().split("-").filter(Boolean));
  for (const [scamId, words] of KEYWORDS) {
    if (words.some((w) => tokens.has(w))) return scamId;
  }
  return null;
}

export function articlesForScam<T extends { slug: string }>(scamId: string, articles: T[]): T[] {
  return articles.filter((a) => scamIdForArticle(a) === scamId);
}
