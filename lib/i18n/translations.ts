export const LOCALES = ["fr", "en", "fon", "yo"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_NAMES: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  fon: "Fɔngbè",
  yo: "Yorùbá",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  fon: "🇧🇯",
  yo: "🇧🇯",
};

type T4 = { fr: string; en: string; fon: string; yo: string };

const translations: Record<string, T4> = {
  // ── Nav ──
  "nav.home": { fr: "Accueil", en: "Home", fon: "Xwégbé", yo: "Ilé" },
  "nav.report": { fr: "Signaler", en: "Report", fon: "Ðó gbè", yo: "Ròyìn" },
  "nav.search": { fr: "Rechercher", en: "Search", fon: "Ba mɔ", yo: "Wádìí" },
  "nav.tracking": { fr: "Mon dossier", en: "My case", fon: "Xwedó", yo: "Tọpasẹ́" },
  "nav.scams": { fr: "Les arnaques", en: "Scam types", fon: "Nǔ wiwá", yo: "Àwọn ìtànjẹ" },
  "nav.advice": { fr: "Conseils", en: "Advice", fon: "Wěmá", yo: "Ìmọ̀ràn" },
  "nav.stats": { fr: "Statistiques", en: "Statistics", fon: "Xóxó", yo: "Ìṣirò" },
  "nav.news": { fr: "Actualités", en: "News", fon: "Xó yɔyɔ", yo: "Ìròyìn" },
  "nav.learn": { fr: "S'informer", en: "Learn", fon: "Mɔ nǔ", yo: "Kọ́ ẹ̀kọ́" },

  // ── News / Actualités ──
  "news.label": { fr: "Restez informé", en: "Stay informed", fon: "Ðó ayi towe wu", yo: "Máa jẹ́ ìmọ̀" },
  "news.title": { fr: "Actualités", en: "News", fon: "Xó yɔyɔ", yo: "Ìròyìn" },
  "news.subtitle": { fr: "Alertes, conseils et infos pour vous protéger des arnaques au Bénin.", en: "Alerts, tips and info to protect you from scams in Benin.", fon: "Wuntun, nǔkplɔ́nkplɔ̌n kpó xó yɔyɔ lɛ̌ bǐ bo na hɛn we ɖó gblègblé wu ɖò Benɛ̀.", yo: "Àwọn ìkìlọ̀, ìmọ̀ràn àti ìwífún tuntun láti dáàbòbò rẹ lọ́wọ́ jìbìtì ní Benin." },
  "news.all": { fr: "Toutes", en: "All", fon: "Bǐ", yo: "Gbogbo" },
  "news.empty.title": { fr: "Aucun article disponible", en: "No articles available", fon: "Xó yɔyɔ ɖěbǔ ɖ'ayǐ ǎ", yo: "Kò sí nkan lati ka" },
  "news.empty.sub": { fr: "Revenez bientôt pour les dernières actualités.", en: "Check back soon for the latest news.", fon: "Wá tɛ̌n kpɛ̌vi bo na mɔ xó yɔyɔ lɛ̌.", yo: "Padà wá laipẹ́ fún ìròyìn tuntun." },
  "news.read_more": { fr: "Lire la suite", en: "Read more", fon: "Xà d'é jí", yo: "Ka síi" },
  "news.see_all": { fr: "Voir toutes les actualités", en: "See all news", fon: "Kpɔ haɖé lɛ bǐ", yo: "Wo gbogbo ìròyìn" },
  "news.back": { fr: "Retour aux actualités", en: "Back to news", fon: "Lɛ̌kɔ xó yɔyɔ lɛ̌ gɔ̌n", yo: "Padà sí ìròyìn" },
  "news.by": { fr: "Par", en: "By", fon: "Mɛ e wlán é", yo: "Láti ọ̀dọ̀" },
  "news.cta.text": { fr: "Vous avez été victime d'une arnaque ?", en: "Have you been scammed?", fon: "Gblègblé ko xò we wɛ̌ à?", yo: "Njẹ́ wọ́n jí ẹ lólè?" },
  "news.cta.sub": { fr: "Signalez-la pour protéger les autres Béninois.", en: "Report it to protect other Beninese.", fon: "Ðó gbè dó tɛn mǐtɔn jí bo na hɛn Benɛ̀ví ɖěvo lɛ̌.", yo: "Ṣe ìròyìn rẹ̀ lórí pẹpẹ wa láti dáàbòbò àwọn ará Benin mìíràn." },
  "news.cat.alerte": { fr: "Alerte", en: "Alert", fon: "Wuntun", yo: "Ìkìlọ̀" },
  "news.cat.conseil": { fr: "Conseil", en: "Advice", fon: "Nǔkplɔ́n", yo: "Ìmọ̀ràn" },
  "news.cat.actualite": { fr: "Actualité", en: "News", fon: "Xó yɔyɔ", yo: "Ìròyìn" },
  "news.cat.communique": { fr: "Communiqué", en: "Statement", fon: "Wèmá", yo: "Ìkéde" },

  // ── Hero ──
  "hero.badge": { fr: "Plateforme sécurisée et confidentielle", en: "Secure and confidential platform", fon: "Tɛn e è hɛn ɔ é", yo: "Pẹpẹ tó ní ààbò" },
  "hero.title1": { fr: "Protégez-vous", en: "Protect yourself", fon: "Hɛn hwiɖée", yo: "Dáàbòbò ara rẹ" },
  "hero.title2": { fr: "contre les", en: "against", fon: "ɖó", yo: "lòdì sí" },
  "hero.title3": { fr: "arnaques", en: "scams", fon: "gblègblé lɛ̌", yo: "jìbìtì" },
  "hero.subtitle": {
    fr: "Signalez un numéro suspect et vérifiez si d'autres l'ont déjà signalé.",
    en: "Report a suspicious number and check if others have already flagged it.",
    fon: "Ðó gbè dó wěmánúmɛ lɛ̌ wu bó kpɔ́n ɖɔ è ko ɖó gbè d'é wu wɛ̌ à. Mi ni ɖó kpɔ́ bo fun ahwan gblègblé lɛ̌ ɖò Benɛ̀.",
    yo: "Ṣe ìròyìn àwọn nọ́mbà arékerèké kí o sì yẹ̀ wò bóyá nọ́mbà kan ti jẹ́ ìròyìn tẹ́lẹ̀. Ẹ jẹ́ ká jagun jìbìtì ní Benin.",
  },
  "hero.cta.report": { fr: "Signaler une arnaque", en: "Report a scam", fon: "Ðó gbè dó gblègblé ɖé wu", yo: "Ròyìn jìbìtì kan" },
  "hero.cta.search": { fr: "Vérifier un numéro", en: "Check a number", fon: "Kpɔ́n wěmánúmɛ ɖé", yo: "Ṣàyẹ̀wò nọ́mbà kan" },

  // ── How it works ──
  "how.label": { fr: "Simple et rapide", en: "Simple and fast", fon: "Bɔkun bó yá", yo: "Ó rọrùn ó sì yára" },
  "how.title": { fr: "Comment ça fonctionne ?", en: "How does it work?", fon: "Nɛ̌ é ka nɔ w'azɔ̌ gbɔn?", yo: "Báwo ni ó ṣe ń ṣiṣẹ́?" },
  "how.subtitle": { fr: "3 étapes simples pour vous protéger", en: "3 simple steps to protect you", fon: "Alixo 3 bo na hɛn we", yo: "Ìgbésẹ̀ 3 láti dáàbòbò rẹ" },
  "how.step1.title": { fr: "Signalez", en: "Report", fon: "Ðó gbè", yo: "Ròyìn" },
  "how.step1.desc": { fr: "Remplissez le formulaire en 2 minutes. C'est rapide et 100% confidentiel.", en: "Fill out the form in 2 minutes. Fast and 100% confidential.", fon: "Kɛ́n fɔ́mù mǐtɔn mɛ kpó gblègblé ɔ sín tínmɛ kpó. É yá bó nɔ nǔhɛnmɛ.", yo: "Kún fọ́ọ̀mù wa kún pẹ̀lú àlàyé jìbìtì náà. Ó yára, ó sì jẹ́ ìkọ̀kọ̀." },
  "how.step2.title": { fr: "Vérification", en: "Verification", fon: "Kpɔ́ndómɛ", yo: "Ìṣàyẹ̀wò" },
  "how.step2.desc": { fr: "Notre équipe vérifie chaque signalement.", en: "Our team reviews every report.", fon: "Mɛ̌si mǐtɔn lɛ̌ nɔ kpɔ́n gbè ɖokpó ɖokpó.", yo: "Àwọn ògbógi wa ń ṣàyẹ̀wò ìròyìn kọ̀ọ̀kan." },
  "how.step3.title": { fr: "Protection", en: "Protection", fon: "Hɛnhɛn", yo: "Ààbò" },
  "how.step3.desc": { fr: "Les numéros validés rejoignent notre base. Tout le monde est protégé.", en: "Confirmed numbers join our database. Everyone is protected.", fon: "Wěmánúmɛ e è ɖè wě lɛ̌ nɔ byɔ́ dátabási mǐtɔn mɛ.", yo: "Àwọn nọ́mbà tí a fọwọ́sí ń wọ inú àkójọ wa." },

  // ── Why report ──
  "why.label": { fr: "Pourquoi signaler ?", en: "Why report?", fon: "Aniwu è ka na ɖó gbè?", yo: "Kí ló dé tí a fi ṣe ìròyìn?" },
  "why.title1": { fr: "Chaque signalement", en: "Each report", fon: "Gbè ɖokpó ɖokpó", yo: "Ìròyìn kọ̀ọ̀kan" },
  "why.title2": { fr: "protège des milliers", en: "protects thousands", fon: "nɔ hɛn afatɔ́n mɔ̌kpan", yo: "ń dáàbòbò ẹgbẹẹgbẹ̀rún" },
  "why.title3": { fr: "de Béninois", en: "of Beninese", fon: "Benɛ̀ví lɛ̌", yo: "àwọn ará Benin" },
  "why.text": {
    fr: "Chaque signalement alimente notre base et protège d'autres Béninois.",
    en: "Each report feeds our database and protects other Beninese.",
    fon: "Gblègblé lɛ̌ nɔ xò mɛ livi mɔ̌kpan xwè ɖokpó ɖokpó mɛ. Nú a ɖó gbè dó wěmánúmɛ ɖé wu ɔ, a ɖò alɔ dó wɛ̌ bó na hɛn gbɛtɔ́ lɛ̌ bǐ.",
    yo: "Jìbìtì fóònù ń kan àwọn mílíọ̀nù ẹ̀dá lọ́dọọdún. Bí o bá ṣe ìròyìn nọ́mbà afurasi, o ń ṣe àfikún sí àkójọ tó ń dáàbòbò gbogbo àwùjọ.",
  },
  "why.stat1": { fr: "des Béninois ont déjà été contactés par un arnaqueur", en: "of Beninese have been contacted by a scammer", fon: "Benɛ̀ví lɛ̌ ko sè gblègblétɔ́ ɖé sín gbè", yo: "àwọn ará Benin ti bá olójúkòkòrò kan sọ̀rọ̀ tẹ́lẹ̀" },
  "why.stat2": { fr: "FCFA de préjudice estimé par an", en: "FCFA estimated damage per year", fon: "FCFA wɛ̀ è nɔ hɛn bú xwè ɖokpó mɛ", yo: "FCFA iye ìbàjẹ́ lọ́dọọdún" },
  "why.stat3": { fr: "suffisent pour déposer un signalement", en: "enough to file a report", fon: "kpé bo na ɖó gbè ɖé", yo: "tó láti fi ìròyìn kan sílẹ̀" },

  // ── Scam types ──
  "scam.label": { fr: "Types d'arnaques", en: "Types of scams", fon: "Gblègblé sín alɔkpa lɛ̌", yo: "Irú jìbìtì" },
  "scam.title": { fr: "Quelles arnaques pouvez-vous signaler ?", en: "What scams can you report?", fon: "Gblègblé alɔkpa tɛ lɛ̌ a ka sixú ɖó gbè d'é wu?", yo: "Irú jìbìtì wo ni o lè ròyìn?" },
  "scam.subtitle": { fr: "Tous les types de fraudes téléphoniques et en ligne", en: "All types of phone and online fraud", fon: "Gblègblé alɔkpa lɛ̌ bǐ", yo: "Gbogbo irú jìbìtì fóònù àti lórí ayélujára" },
  "scam.cta.all": { fr: "Voir les 17 types d'arnaques", en: "See all 17 scam types", fon: "Kpɔ́n gblègblé wɛ̌n 17 lɛ̌", yo: "Wo gbogbo irú jìbìtì 17" },

  // ── Trust ──
  "trust.label": { fr: "Confiance & Sécurité", en: "Trust & Security", fon: "Jiɖiɖe kpó Hɛnhɛn kpó", yo: "Ìgbẹ́kẹ̀lé àti Ààbò" },
  "trust.title": { fr: "Votre sécurité, notre priorité", en: "Your security, our priority", fon: "Hɛnhɛn towe, azɔ̌ mǐtɔn", yo: "Ààbò rẹ, àkọ́kọ́ wa" },
  "trust.1.title": { fr: "Données chiffrées", en: "Encrypted data", fon: "Dátá e è hɛn é", yo: "Dátà tí a pa mọ́" },
  "trust.1.desc": { fr: "Toutes vos données sont protégées par un chiffrement de bout en bout.", en: "All your data is protected with end-to-end encryption.", fon: "Dátá towe lɛ̌ bǐ ɔ, è hɛn yě.", yo: "Gbogbo dátà rẹ ni a dáàbòbò." },
  "trust.2.title": { fr: "Anonymat total", en: "Total anonymity", fon: "Nǔhɛnmɛ bǐ mlɛ́mlɛ́", yo: "Aṣírí pátápátá" },
  "trust.2.desc": { fr: "Vos informations personnelles restent privées.", en: "Your personal details stay private.", fon: "È nɔ ɖè nyǐkɔ́ towe tɔ́n gbeɖé ǎ.", yo: "A kò fi ìwífún àdáni kankan hàn rí." },
  "trust.3.title": { fr: "Cadre légal", en: "Legal framework", fon: "Sɛ́n ɔ", yo: "Òfin" },
  "trust.3.desc": { fr: "Seules les autorités compétentes accèdent aux détails des signalements.", en: "Only competent authorities access report details.", fon: "Acɛkpikpa lɛ̌ kɛ́ɖɛ́ wɛ̀ nɔ kpɔ́n gbè lɛ̌ sín tínmɛ.", yo: "Àwọn aláṣẹ tó yẹ nìkan ló ní àǹfààní sí àlàyé ìròyìn." },

  // ── FAQ ──
  "faq.label": { fr: "FAQ", en: "FAQ", fon: "Nùkanbyɔ́", yo: "Àwọn ìbéèrè" },
  "faq.title": { fr: "Questions fréquentes", en: "Frequently asked questions", fon: "Nùkanbyɔ́ e è nɔ byɔ́ hwɛhwɛ lɛ̌", yo: "Àwọn ìbéèrè tí a máa ń béèrè" },

  // ── CTA ──
  "cta.title": { fr: "Vous avez été victime d'une arnaque ?", en: "Have you been scammed?", fon: "Gblègblé xò we wɛ̌ à?", yo: "Ṣé wọ́n ti jí ẹ lólè?" },
  "cta.text": { fr: "N'attendez pas. Votre signalement peut protéger d'autres Béninois.", en: "Don't wait. Your report can protect other Beninese.", fon: "Ma nɔ te ó. Gbè towe sixú hɛn Benɛ̀ví ɖěvo lɛ̌.", yo: "Má dúró. Ìròyìn rẹ lè da àwọn ará Benin mìíràn là." },
  "cta.button": { fr: "Signaler maintenant", en: "Report now", fon: "Ðó gbè dìn", yo: "Ṣe ìròyìn báyìí" },
  "cta.link": { fr: "ou vérifier un numéro", en: "or check a number", fon: "alǒ kpɔ́n wěmánúmɛ ɖé", yo: "tàbí ṣàyẹ̀wò nọ́mbà kan" },

  // ── Search page ──
  "search.title": { fr: "Vérifier un suspect", en: "Check a suspect", fon: "Kpɔ́n mɛ e è ɖò biba wɛ̌ é", yo: "Ṣàyẹ̀wò afurasi kan" },
  "search.subtitle": { fr: "Recherchez par numéro de téléphone, nom, pseudo ou compte.", en: "Search by phone number, name, alias or account.", fon: "Ba mɔ gbɔn wěmánúmɛ, nyǐkɔ́ alǒ kɔ́ntì gblamɛ.", yo: "Wá nípasẹ̀ nọ́mbà fóònù, orúkọ, tàbí àkáǹtì." },
  "search.placeholder": { fr: "Numéro, nom, pseudo, compte...", en: "Number, name, alias, account...", fon: "Wěmánúmɛ, nyǐkɔ́, kɔ́ntì...", yo: "Nọ́mbà, orúkọ, àkáǹtì..." },
  "search.button": { fr: "Rechercher", en: "Search", fon: "Ba mɔ", yo: "Wá" },
  "search.results": { fr: "Signalements trouvés", en: "Reports found", fon: "Gbè e è mɔ lɛ̌", yo: "Àwọn ìròyìn tí a rí" },
  "search.risk": { fr: "Risque", en: "Risk", fon: "Ayi", yo: "Ewu" },
  "search.types": { fr: "Types d'arnaques", en: "Scam types", fon: "Gblègblé sín alɔkpa", yo: "Irú jìbìtì" },
  "search.phones": { fr: "Numéros associés", en: "Associated numbers", fon: "Wěmánúmɛ lɛ̌", yo: "Àwọn nọ́mbà" },
  "search.names": { fr: "Noms / pseudos signalés", en: "Reported names / aliases", fon: "Nyǐkɔ́ lɛ̌", yo: "Àwọn orúkọ" },
  "search.platforms": { fr: "Plateformes utilisées", en: "Platforms used", fon: "Tɛn lɛ̌", yo: "Àwọn pẹpẹ" },
  "search.warning": { fr: "Soyez vigilant si vous recevez un appel ou un SMS de ce numéro.", en: "Be careful if you receive a call or SMS from this number.", fon: "Cɔ́ hwiɖée nú a sè wěmánúmɛ élɔ́ sín gbè.", yo: "Ṣọ́ra bí o bá gba ìpè tàbí SMS láti nọ́mbà yìí." },
  "search.no_result": { fr: "Aucun signalement trouvé", en: "No reports found", fon: "È ma mɔ nǔɖé ǎ", yo: "A kò rí ìròyìn kankan" },
  "search.no_result.text": { fr: "Ce numéro n'est pas dans notre base. Restez vigilant.", en: "This number isn't in our database. Stay alert.", fon: "È ma ɖó gbè dó wěmánúmɛ élɔ́ wu ǎ. Amɔ̌, cɔ́ hwiɖée.", yo: "A kò tíì ròyìn nọ́mbà yìí. Ṣùgbọ́n, ṣọ́ra." },

  // ── Report form ──
  "report.title": { fr: "Signaler une arnaque", en: "Report a scam", fon: "Ðó gbè dó gblègblé ɖé wu", yo: "Ròyìn jìbìtì kan" },
  "report.subtitle": { fr: "Anonyme et confidentiel. Aidez-nous à protéger le Bénin.", en: "Anonymous and confidential. Help us protect Benin.", fon: "Nǔhɛnmɛ tɔn. Mi d'alɔ mǐ bó hɛn Benɛ̀.", yo: "Aṣírí àti ìgbẹ́kẹ̀lé. Ṣe ìrànlọ́wọ́ láti dáàbòbò Benin." },
  "report.step1": { fr: "Le suspect", en: "The suspect", fon: "Mɛ e è ɖò biba wɛ̌ é", yo: "Afurasi náà" },
  "report.step2": { fr: "Détails", en: "Details", fon: "Tínmɛ lɛ̌", yo: "Àlàyé" },
  "report.phone": { fr: "Numéro du suspect", en: "Suspect's number", fon: "Wěmánúmɛ mɛ ɔ tɔn", yo: "Nọ́mbà afurasi" },
  "report.name": { fr: "Nom / pseudo du suspect", en: "Suspect's name / alias", fon: "Nyǐkɔ́ mɛ ɔ tɔn", yo: "Orúkọ afurasi" },
  "report.platform": { fr: "Plateforme", en: "Platform", fon: "Tɛn", yo: "Pẹpẹ" },
  "report.account": { fr: "Compte ou identifiant", en: "Account or ID", fon: "Kɔ́ntì", yo: "Àkáǹtì" },
  "report.scamtype": { fr: "Type d'arnaque", en: "Scam type", fon: "Gblègblé sín alɔkpa", yo: "Irú jìbìtì" },
  "report.amount": { fr: "Montant perdu", en: "Amount lost", fon: "Akwɛ́ e bú é", yo: "Iye owó tí o pàdánù" },
  "report.description": { fr: "Que s'est-il passé ?", en: "What happened?", fon: "Étɛ ka jɛ?", yo: "Kí ni ó ṣẹlẹ̀?" },
  "report.evidence": { fr: "Captures d'écran / preuves", en: "Screenshots / evidence", fon: "Kúnnuɖetɔ́n lɛ̌", yo: "Ẹ̀rí / àwòrán" },
  "report.dropzone": { fr: "Glissez ici ou", en: "Drag here or", fon: "Sɔ́ dó fí alǒ", yo: "Fà sí ibí tàbí" },
  "report.browse": { fr: "parcourir", en: "browse", fon: "ba mɔ", yo: "wá" },
  "report.dropzone.hint": { fr: "Images, PDF — ajoutez autant de preuves que nécessaire", en: "Images, PDF — add as many proofs as needed", fon: "Ðiɖe, PDF — zé nǔ e jɛxa lɛ̌ bǐ", yo: "Àwòrán, PDF — fi ẹ̀rí bí ó ṣe tó" },
  "report.continue": { fr: "Continuer", en: "Continue", fon: "Yi nukɔn", yo: "Tẹ̀síwájú" },
  "report.back": { fr: "Retour", en: "Back", fon: "Lɛ̌kɔ", yo: "Padà" },
  "report.submit": { fr: "Envoyer le signalement", en: "Submit report", fon: "Sɛ́ gbè ɔ dó", yo: "Fi ìròyìn náà ránṣẹ́" },
  "report.sending": { fr: "Envoi en cours...", en: "Sending...", fon: "Ðò didó wɛ̌...", yo: "Ń ránṣẹ́..." },
  "report.modify": { fr: "Modifier", en: "Edit", fon: "Ðyɔ", yo: "Ṣàtúnṣe" },
  "report.reported_number": { fr: "Numéro signalé", en: "Reported number", fon: "Wěmánúmɛ e è ɖó gbè d'é wu é", yo: "Nọ́mbà tí a ròyìn" },

  // ── Tracking ──
  "tracking.title": { fr: "Suivre mon signalement", en: "Track my report", fon: "Xwedó gbè ce", yo: "Tọpasẹ́ ìròyìn mi" },
  "tracking.subtitle": { fr: "Entrez le code reçu lors de votre signalement.", en: "Enter the code you received after reporting.", fon: "Zé kóɖú e a mɔ hwenu e a ɖó gbè é dó.", yo: "Tẹ koodu tí o gba nígbà tí o ṣe ìròyìn." },
  "tracking.button": { fr: "Vérifier le statut", en: "Check status", fon: "Kpɔ́n ninɔmɛ", yo: "Ṣàyẹ̀wò ipò" },
  "tracking.code": { fr: "Code de suivi", en: "Tracking code", fon: "Kóɖú xwedó tɔn", yo: "Koodu ìtọpasẹ́" },
  "tracking.reported_number": { fr: "Numéro signalé", en: "Reported number", fon: "Wěmánúmɛ", yo: "Nọ́mbà" },
  "tracking.scam_type": { fr: "Type d'arnaque", en: "Scam type", fon: "Gblègblé sín alɔkpa", yo: "Irú jìbìtì" },
  "tracking.date": { fr: "Date du signalement", en: "Report date", fon: "Gbè e è ɖó gbè é", yo: "Ọjọ́ ìròyìn" },
  "tracking.updated": { fr: "Dernière mise à jour", en: "Last updated", fon: "Yìyí gudo tɔn", yo: "Ìmúdójúìwọ̀n tó gbẹ̀yìn" },
  "tracking.history": { fr: "Historique", en: "History", fon: "Hwenuxó", yo: "Ìtàn" },
  "tracking.step.received": { fr: "Reçu", en: "Received", fon: "È yí", yo: "A ti gba" },
  "tracking.step.analysis": { fr: "En analyse", en: "Under analysis", fon: "Ðò kpɔ́n wɛ̌", yo: "Ń ṣàyẹ̀wò" },
  "tracking.step.confirmed": { fr: "Confirmé", en: "Confirmed", fon: "È ɖè wě", yo: "A fọwọ́sí" },
  "tracking.step.rejected": { fr: "Rejeté", en: "Rejected", fon: "È gbɛ́", yo: "A kọ̀" },
  "tracking.not_found": { fr: "Code introuvable", en: "Code not found", fon: "È ma mɔ kóɖú ɔ ǎ", yo: "A kò rí koodu náà" },
  "tracking.not_found.text": { fr: "Vérifiez votre code et réessayez. Format : SA-2026-XXXXXX.", en: "Check your code and try again. Format: SA-2026-XXXXXX.", fon: "Kpɔ́n kóɖú towe bo lɛ́ tɛ̀nkpɔn. SA-2026-XXXXXX.", yo: "Ṣàyẹ̀wò koodu rẹ kí o sì tún gbìyànjú. SA-2026-XXXXXX." },

  // ── Conseils ──
  "advice.label": { fr: "Guide pratique", en: "Practical guide", fon: "Alɔdó", yo: "Ìtọ́sọ́nà" },
  "advice.title": { fr: "Conseils & Sécurité", en: "Advice & Security", fon: "Wěmá kpó Hɛnhɛn kpó", yo: "Ìmọ̀ràn àti Ààbò" },
  "advice.subtitle": { fr: "Tout pour vous protéger des arnaques au Bénin et savoir quoi faire si vous êtes victime.", en: "Everything to protect yourself from scams in Benin and know what to do if you're a victim.", fon: "Nǔ e a ɖó na tuun bo na hɛn hwiɖée sín gblègblé lɛ̌ sí ɖò Benɛ̀ é.", yo: "Ohun gbogbo tí o nílò láti mọ̀ láti dáàbòbò ara rẹ lọ́wọ́ jìbìtì ní Benin." },
  "advice.tab.prevent": { fr: "Prévenir", en: "Prevent", fon: "Dǎ ji", yo: "Dènà" },
  "advice.tab.recognize": { fr: "Reconnaître", en: "Recognize", fon: "Dǒ nukún", yo: "Mọ̀" },
  "advice.tab.react": { fr: "Réagir", en: "React", fon: "Wà nǔ", yo: "Dahùn" },
  "advice.todo": { fr: "À faire", en: "Do this", fon: "Wà élɔ́", yo: "Ṣe èyí" },
  "advice.danger": { fr: "Danger", en: "Danger", fon: "Ayi", yo: "Ewu" },
  "advice.emergency.title": { fr: "Numéros utiles", en: "Useful numbers", fon: "Wěmánúmɛ ɖagbe lɛ̌", yo: "Àwọn nọ́mbà tó wúlò" },
  "advice.emergency.subtitle": { fr: "Contacts importants en cas d'arnaque au Bénin.", en: "Important contacts in case of scam in Benin.", fon: "Mɛ e è na ylɔ́ nú gblègblé ɖé jɛ ɔ.", yo: "Àwọn ọ̀nà ìbánisọ̀rọ̀ pàtàkì fún jìbìtì ní Benin." },
  "advice.cta": { fr: "Vous avez été victime ou témoin d'une arnaque ?", en: "Have you been a victim or witness of a scam?", fon: "Gblègblé xò we alǒ a mɔ mɛ e gblègblé xò é wɛ̌ à?", yo: "Ṣé o ti jẹ́ olùjìyà tàbí ẹlẹ́rìí jìbìtì?" },

  // ── Footer ──
  "footer.tagline": { fr: "Plateforme béninoise de signalement d'arnaques. Protégez-vous et protégez les autres.", en: "Beninese platform for reporting scams. Protect yourself and others.", fon: "Tɛn Benɛ̀ tɔn bo na ɖó gbè dó gblègblé lɛ̌ wu. Hɛn hwiɖée kpó mɛ ɖěvo lɛ̌ kpó.", yo: "Pẹpẹ ilẹ̀ Benin fún ìròyìn jìbìtì. Dáàbòbò ara rẹ àti àwọn ẹlòmíràn." },
  "footer.nav": { fr: "Navigation", en: "Navigation", fon: "Tɛn lɛ̌", yo: "Àtọ̀nà" },
  "footer.privacy.title": { fr: "Confidentialité", en: "Privacy", fon: "Nǔhɛnmɛ", yo: "Ìkọ̀kọ̀" },
  "footer.privacy.text": { fr: "Vos signalements restent confidentiels. Aucune info personnelle n'est publiée.", en: "Your reports stay confidential. No personal info is published.", fon: "Gbè e a ɖó lɛ̌ nɔ nɔ nǔhɛnmɛ. È nɔ ɖè nyǐkɔ́ towe tɔ́n ǎ.", yo: "Àwọn ìròyìn rẹ ni wọ́n ń tọ́jú ní ìkọ̀kọ̀. Kò sí ìwífún àdáni tí wọ́n fi hàn." },
  "footer.copyright": { fr: "Tous droits réservés.", en: "All rights reserved.", fon: "Acɛ bǐ wɛ̀ è hɛn.", yo: "Gbogbo ẹ̀tọ́ ni a pa mọ́." },
  "footer.legal": { fr: "Légal", en: "Legal", fon: "Susu tɔn", yo: "Òfin" },
  "footer.mentions": { fr: "Mentions légales", en: "Legal notice", fon: "Xó lɛ́ɖɔwɛ̀", yo: "Ìkìlọ̀ òfin" },
  "footer.privacy.policy": { fr: "Politique de confidentialité", en: "Privacy policy", fon: "Nǔhɛnmɛ sín susu", yo: "Ìlànà ìkọ̀kọ̀" },
  "footer.contact": { fr: "Nous contacter", en: "Contact us", fon: "Bló mǐ", yo: "Kàn sí wa" },

  // ── Common ──
  "common.anonymous": { fr: "Anonyme et confidentiel — aucune donnée personnelle collectée", en: "Anonymous and confidential — no personal data collected", fon: "Nǔhɛnmɛ — è nɔ yí nyǐkɔ́ towe ǎ", yo: "Aṣírí — a kò gba dátà àdáni kankan" },
  "common.optional": { fr: "optionnel", en: "optional", fon: "é byɔ́ ǎ", yo: "kìí ṣe dandan" },
  "common.if_known": { fr: "si connu", en: "if known", fon: "nú a tuun", yo: "bí o bá mọ̀" },
  "common.where_contacted": { fr: "où vous avez été contacté", en: "where you were contacted", fon: "fí e è ylɔ́ we ɖè é", yo: "ibití wọ́n ti bá ẹ sọ̀rọ̀" },
  "common.account_hint": { fr: "numéro MoMo, lien profil, email...", en: "MoMo number, profile link, email...", fon: "MoMo, lien profil, email...", yo: "nọ́mbà MoMo, ìjápọ̀ profaili, imeeli..." },
  "common.no_data": { fr: "Pas encore de données", en: "No data yet", fon: "Dátá kó ɖè ǎ", yo: "Kò sí dátà síbẹ̀" },
  "common.loading_error": { fr: "Impossible de charger les statistiques.", en: "Unable to load statistics.", fon: "È ma sixú xà dátá lɛ̌ ǎ.", yo: "A kò lè gba ìṣirò." },

  // ── Stats page ──
  "stats.label": { fr: "Tableau de bord public", en: "Public dashboard", fon: "Tɛn mɛ̌si tɔn", yo: "Pánẹ́ẹ̀lì gbogbogbò" },
  "stats.title": { fr: "Statistiques", en: "Statistics", fon: "Xóxó lɛ̌", yo: "Ìṣirò" },
  "stats.subtitle": { fr: "Données en temps réel sur les arnaques signalées au Bénin. Transparence totale.", en: "Real-time data on reported scams in Benin. Total transparency.", fon: "Dátá lɛ̌ dó gblègblé e è ɖó gbè d'é wu ɖò Benɛ̀ lɛ̌ wu. Wěɖègbɛ́.", yo: "Dátà àkókò gidi lórí jìbìtì tí a ròyìn ní Benin. Ìgbékalẹ̀ pátápátá." },
  "stats.total": { fr: "Signalements au total", en: "Total reports", fon: "Gbè lɛ̌ bǐ", yo: "Àpapọ̀ ìròyìn" },
  "stats.confirmed": { fr: "Arnaques confirmées", en: "Confirmed scams", fon: "Gblègblé e è ɖè wě lɛ̌", yo: "Jìbìtì tí a fọwọ́sí" },
  "stats.this_month": { fr: "Ce mois-ci", en: "This month", fon: "Sun élɔ́ mɛ", yo: "Oṣù yìí" },
  "stats.monthly.title": { fr: "Signalements par mois", en: "Reports per month", fon: "Gbè lɛ̌ sun ɖokpó ɖokpó mɛ", yo: "Ìròyìn fún oṣù kọ̀ọ̀kan" },
  "stats.monthly.subtitle": { fr: "Évolution sur les 12 derniers mois", en: "Evolution over the last 12 months", fon: "Yìyì ɖò sun 12 gudo tɔn lɛ̌ mɛ", yo: "Ìdàgbàsókè ní oṣù 12 sẹ́yìn" },
  "stats.monthly.bar": { fr: "signalements", en: "reports", fon: "gbè lɛ̌", yo: "ìròyìn" },
  "stats.scam_types.title": { fr: "Types d'arnaques", en: "Scam types", fon: "Gblègblé sín alɔkpa lɛ̌", yo: "Irú jìbìtì" },
  "stats.scam_types.subtitle": { fr: "Répartition des signalements", en: "Distribution of reports", fon: "Gbè lɛ̌ sín mámá", yo: "Ìpín ìròyìn" },
  "stats.platforms.title": { fr: "Plateformes utilisées", en: "Platforms used", fon: "Tɛn e è zán lɛ̌", yo: "Àwọn pẹpẹ tí a lò" },
  "stats.platforms.subtitle": { fr: "Canaux de contact des arnaqueurs", en: "Scammers' contact channels", fon: "Ali e gblègblétɔ́ lɛ̌ nɔ gbɔn ylɔ́ mɛ lɛ̌", yo: "Ọ̀nà ìbánisọ̀rọ̀ àwọn olójúkòkòrò" },
  "stats.top_numbers.title": { fr: "Numéros les plus signalés", en: "Most reported numbers", fon: "Wěmánúmɛ e è ɖó gbè d'é wu hugǎn lɛ̌", yo: "Àwọn nọ́mbà tí a ròyìn jù" },
  "stats.top_numbers.subtitle": { fr: "Top 10 (anonymisés)", en: "Top 10 (anonymized)", fon: "Mɔ̌kpan 10 (nǔhɛnmɛ)", yo: "Mẹ́wàá àkọ́kọ́ (aṣírí)" },

  // ── Visit stats ──
  "stats.visits.total": { fr: "Visites totales", en: "Total visits", fon: "Mɛ e wá lɛ̌ bǐ", yo: "Àpapọ̀ àbẹ̀wò" },
  "stats.visits.today": { fr: "Visites aujourd'hui", en: "Visits today", fon: "Mɛ e wá égbè lɛ̌", yo: "Àbẹ̀wò lónìí" },
  "stats.visits.popular": { fr: "Pages populaires", en: "Popular pages", fon: "Tɛn e è yì hugǎn lɛ̌", yo: "Àwọn ojú-ìwé olókìkí" },
  "stats.visits.daily.title": { fr: "Visites par jour", en: "Daily visits", fon: "Mɛ e wá gbè ɖokpó ɖokpó mɛ lɛ̌", yo: "Àbẹ̀wò lójúmọ́" },
  "stats.visits.daily.subtitle": { fr: "30 derniers jours", en: "Last 30 days", fon: "Azǎn 30 gudo tɔn lɛ̌", yo: "Ọjọ́ 30 sẹ́yìn" },
  "stats.visits.bar": { fr: "visites", en: "visits", fon: "wíwá", yo: "àbẹ̀wò" },
  "stats.visits.section": { fr: "Trafic du site", en: "Site traffic", fon: "Mɛ e nɔ wá tɛn ɔ jí lɛ̌", yo: "Ìṣàbẹ̀wò ojú-ìwé" },

  // ── Arnaques page UI ──
  "arnaques.label": { fr: "Guide des arnaques", en: "Scam guide", fon: "Gblègblé sín wěmá", yo: "Ìtọ́sọ́nà jìbìtì" },
  "arnaques.title": { fr: "Reconnaître une arnaque", en: "Recognize a scam", fon: "Tuùn gblègblé ɖé", yo: "Mọ jìbìtì kan" },
  "arnaques.subtitle": {
    fr: "Victime mais vous ne savez pas quel type ? Choisissez la situation qui vous ressemble.",
    en: "Were you a victim but unsure of the type? Pick the situation that matches yours.",
    fon: "Gblègblé ko xò we bó ma tuùn alɔkpa e nyí é ǎ? Sɔ́ nùɖiɖɛ e jɛhun we é hugǎn ɔ ɖé.",
    yo: "Ṣé jìbìtì ti lu ọ tí o kò mọ irú rẹ? Yan ipò tó bá tirẹ mú jù.",
  },
  "arnaques.section.example": { fr: "Exemple réel", en: "Real example", fon: "Kɛ́nsísɔ̀ e nyí nǔgbo", yo: "Àpẹẹrẹ gidi" },
  "arnaques.section.signs": { fr: "Signes à reconnaître", en: "Signs to recognize", fon: "Lìnlìn e na d'akɔ́", yo: "Àwọn àmì láti mọ" },
  "arnaques.section.protect": { fr: "Comment se protéger", en: "How to protect yourself", fon: "Nɛ̌ a ka na hɛn hwiɖée gbɔn", yo: "Bí a ṣe lè dáàbòbò ara rẹ" },
  "arnaques.cta.report": { fr: "Signaler cette arnaque", en: "Report this scam", fon: "Ðó gbè dó gblègblé élɔ́ wu", yo: "Ròyìn jìbìtì yìí" },
  "arnaques.cta.check": { fr: "Vérifier un numéro", en: "Check a number", fon: "Kpɔ́n wěmánúmɛ ɖé", yo: "Ṣàyẹ̀wò nọ́mbà kan" },
  "arnaques.victim.title": { fr: "Vous avez été victime ?", en: "Were you a victim?", fon: "Gblègblé ko xò we wɛ̌ à?", yo: "Ṣé wọ́n ti jí ẹ lólè?" },
  "arnaques.victim.text": {
    fr: "Signalez maintenant pour protéger d'autres Béninois.",
    en: "Report now to protect other people in Benin.",
    fon: "Ðó gbè dó gblègblé ɔ dìn. Gbè ɖokpó ɖokpó nɔ hɛn Benɛ̀ví ɖěvo lɛ̌.",
    yo: "Ṣe ìròyìn jìbìtì náà báyìí. Ìròyìn kọ̀ọ̀kan ń dáàbòbò àwọn ará Benin mìíràn.",
  },
  "arnaques.victim.button": { fr: "Faire un signalement", en: "File a report", fon: "Ðó gbè ɖé", yo: "Fi ìròyìn sílẹ̀" },

  // ── Contact ──
  "contact.subtitle": { fr: "Une question ? Notre équipe vous répond sous 48h.", en: "A question? Our team replies within 48h.", fon: "Nùkanbyɔ́ ɖé wɛ̌ à? Mɛ̌si mǐtɔn na fó xó towe ɖò hwenu wɛ̌ mɛ.", yo: "Ìbéèrè? Àwọn ògbógi wa máa ń dáhùn ní wákàtí 48." },
  "contact.reason.tracking": { fr: "Question sur un signalement", en: "Question about a report", fon: "Nùkanbyɔ́ dó gbè ɖé wu", yo: "Ìbéèrè nípa ìròyìn kan" },
  "contact.reason.tech": { fr: "Problème technique", en: "Technical issue", fon: "Nǔ nyanya e jɛ tɛn ɔ jí", yo: "Ìṣòro ìmọ̀ ẹ̀rọ" },
  "contact.reason.press": { fr: "Demande presse / partenariat", en: "Press / partnership inquiry", fon: "Nùkanbyɔ́ nú gazɛ̀ti alǒ kpɔ́ndó", yo: "Ìbéèrè ìròhìn / àjọṣepọ̀" },
  "contact.reason.suggestion": { fr: "Demande de suppression de données", en: "Data deletion request", fon: "Wěmá e è ɖɔ na ɖè dátá towe tɔ́n", yo: "Ìbéèrè píparẹ́ dátà" },
  "contact.reason.other": { fr: "Autre", en: "Other", fon: "Nǔ ɖěvo", yo: "Èlòmíràn" },
  "contact.field.subject": { fr: "Sujet", en: "Subject", fon: "Tínmɛ", yo: "Kókó ọ̀rọ̀" },
  "contact.field.name": { fr: "Votre nom", en: "Your name", fon: "Nyǐkɔ́ towe", yo: "Orúkọ rẹ" },
  "contact.field.email": { fr: "Votre email", en: "Your email", fon: "Email towe", yo: "Ìméèlì rẹ" },
  "contact.field.message": { fr: "Message", en: "Message", fon: "Xó", yo: "Ìsọ̀rọ̀" },
  "contact.submit": { fr: "Envoyer le message", en: "Send message", fon: "Sɛ́ xó ɔ dó", yo: "Fi ìsọ̀rọ̀ ránṣẹ́" },
  "contact.success.title": { fr: "Email prêt !", en: "Email ready!", fon: "Email ɔ ɖò ɖu wɛ̌ !", yo: "Ìméèlì ti ṣetán !" },
  "contact.success.text": { fr: "Votre email est prêt. Vérifiez votre client de messagerie et envoyez-le.", en: "Your email is ready. Check your mail client and send it.", fon: "Email towe ɖò ɖu wɛ̌. Kpɔ́n email towe mɛ bo sɛ́ é dó.", yo: "Ìméèlì rẹ ti ṣetán. Ṣàyẹ̀wò apoti ìméèlì rẹ kí o sì fi ránṣẹ́." },
  "contact.success.another": { fr: "Envoyer un autre message", en: "Send another message", fon: "Sɛ́ xó ɖěvo dó", yo: "Fi ìsọ̀rọ̀ mìíràn ránṣẹ́" },
  "contact.info.delay.title": { fr: "Délai de réponse", en: "Response time", fon: "Hwenu e è na fó xó ɔ", yo: "Àkókò ìdáhùn" },
  "contact.info.delay.value": { fr: "Sous 48 h ouvrées", en: "Within 48 business hours", fon: "Azǎn azɔ̌xwé 2 mɛ", yo: "Láàárín wákàtí 48 iṣẹ́" },
  "contact.info.lang.title": { fr: "Langue", en: "Language", fon: "Gbè", yo: "Èdè" },
  "contact.info.lang.value": { fr: "Français, English", en: "French, English", fon: "Fɛlɛnsí, Anglɛ", yo: "Faransé, Gẹ̀ẹ́sì" },
  "contact.links.title": { fr: "Liens utiles", en: "Useful links", fon: "Ali ɖagbe lɛ̌", yo: "Àwọn ìjápọ̀ tó wúlò" },

  // ── Error / Loading ──
  "error.title": { fr: "Une erreur est survenue", en: "An error occurred", fon: "Blɔ̌ ɖé jɛ", yo: "Àṣìṣe kan ṣẹlẹ̀" },
  "error.text": { fr: "Quelque chose s'est mal passé. Réessayez ou revenez à l'accueil.", en: "Something went wrong. Try again or go back home.", fon: "Nǔ ɖé nyanya jɛ. Lɛ́ tɛ̌nkpɔn alǒ lɛ̌kɔ xwégbé.", yo: "Nkan kan ṣe àṣìṣe. Tún gbìyànjú tàbí padà sí ilé." },
  "error.retry": { fr: "Réessayer", en: "Try again", fon: "Lɛ́ tɛ̌nkpɔn", yo: "Tún gbìyànjú" },
  "error.home": { fr: "Retour à l'accueil", en: "Back to home", fon: "Lɛ̌kɔ xwégbé", yo: "Padà sí ilé" },
  "loading.text": { fr: "Chargement…", en: "Loading…", fon: "Ðò hɛn wɛ̌…", yo: "Ń gbẹ̀rù…" },

  // ── Search chips and labels ──
  "search.chip.phone": { fr: "Numéro", en: "Number", fon: "Wěmánúmɛ", yo: "Nọ́mbà" },
  "search.chip.url": { fr: "Site web", en: "Website", fon: "Tɛn kpé lɛ̌ jí", yo: "Ojú-ìwé" },
  "search.chip.name": { fr: "Nom", en: "Name", fon: "Nyǐkɔ́", yo: "Orúkọ" },
  "search.input_hint": { fr: "Numéro, site web, nom du suspect", en: "Number, website, suspect name", fon: "Wěmánúmɛ, tɛn, nyǐkɔ́ mɛ e è ɖò biba wɛ̌ é", yo: "Nọ́mbà, ojú-ìwé, orúkọ afurasi" },
  "search.unverified": { fr: "Signalements non vérifiés", en: "Unverified reports", fon: "Gbè e è ma kpɔ́n lɛ̌ ǎ", yo: "Àwọn ìròyìn tí a kò ṣàyẹ̀wò" },
  "search.legal": { fr: "Données issues de signalements citoyens, sans valeur juridique.", en: "Data from citizen reports, with no legal value.", fon: "Dátá e gbɛtɔ́ lɛ̌ ɖó gbè d'é wu ɖè. È nɔ lɛ̌n gaan sɛ́n mɛ ǎ.", yo: "Dátà láti ìròyìn àwọn ọmọ ìlú, láìsí iye ìdájọ́ òfin." },
  "search.urls_label": { fr: "Sites signalés", en: "Reported sites", fon: "Tɛn e è ɖó gbè d'é wu lɛ̌", yo: "Àwọn ojú-ìwé tí a ròyìn" },
  "search.no_visit": { fr: "Ne pas visiter", en: "Do not visit", fon: "Ma yì tɛn élɔ́ ǎ", yo: "Má ṣàbẹ̀wò" },
  "search.urgent": { fr: "Contact fortement suspect. Soyez très prudent.", en: "Highly suspicious contact. Be very careful.", fon: "Mɛ élɔ́ nyí gblègblétɔ́ hugǎn. Cɔ́ hwiɖée númɛ.", yo: "Ọ̀nà ìbánisọ̀rọ̀ arékerèké gan-an. Ṣọ́ra púpọ̀." },

  // ── Search — no-result messages ──
  "search.noresult.url": { fr: "Ce site n'est pas signalé. Restez vigilant.", en: "This site hasn't been reported. Stay alert.", fon: "Tɛn élɔ́ ɔ, è ma ɖó gbè d'é wu ǎ. Cɔ́ hwiɖée.", yo: "A kò tíì ròyìn ojú-ìwé yìí. Ṣọ́ra." },
  "search.noresult.phone": { fr: "Ce numéro n'est pas dans notre base. Restez vigilant.", en: "This number isn't in our database. Stay alert.", fon: "Wěmánúmɛ élɔ́ ɔ, è ma ɖó gbè d'é wu ǎ. Cɔ́ hwiɖée.", yo: "A kò rí nọ́mbà yìí nínú àkójọ wa. Ṣọ́ra." },
  "search.noresult.general": { fr: "Aucun résultat pour cette recherche. Restez vigilant.", en: "No results for this search. Stay alert.", fon: "È ma mɔ nǔɖé dó nùkanbyɔ́ élɔ́ wu ǎ. Cɔ́ hwiɖée.", yo: "A kò rí ohunkóhun fún ìwádìí yìí. Ṣọ́ra." },
  "search.noresult.url_advice": { fr: "Comment vérifier ce site ?", en: "How to check this site?", fon: "Nɛ̌ è ka na kpɔ́n tɛn élɔ́ gbɔn?", yo: "Bí a ṣe lè ṣàyẹ̀wò ojú-ìwé yìí" },
  "search.noresult.phone_advice": { fr: "Que faire avec ce numéro ?", en: "What to do with this number?", fon: "Nɛ̌ è ka na wà kpó wěmánúmɛ élɔ́ kpó gbɔn?", yo: "Kí ni a lè ṣe pẹ̀lú nọ́mbà yìí?" },
  "search.noresult.general_advice": { fr: "Conseils de vigilance", en: "Vigilance advice", fon: "Nǔkplɔ́nkplɔ̌n dó cɔ́cɔ́ wu", yo: "Ìmọ̀ràn ìjágboyín" },

  // ── Search — FoundResultAdvice ──
  "search.found.urgent": { fr: "Contact très suspect. Soyez prudent.", en: "Very suspicious contact. Be careful.", fon: "Mɛ élɔ́ nyí gblègblétɔ́ tawun. Cɔ́ hwiɖée.", yo: "Ọ̀nà ìbánisọ̀rọ̀ afurasi gan-an. Ṣọ́ra." },
  "search.found.title": { fr: "Que faire maintenant ?", en: "What to do now?", fon: "Nɛ̌ è ka na wà gbɔn?", yo: "Kí ni o lè ṣe báyìí?" },
  "search.found.subtitle": { fr: "Ce contact a déjà été signalé. Voici comment réagir.", en: "This contact has been reported. Here's how to react.", fon: "Mɛ élɔ́ ko ɖó gbè d'é wu wɛ̌. Kpɔ́n nɛ̌ è ka na wà gbɔn.", yo: "Ọ̀nà ìbánisọ̀rọ̀ yìí ti jẹ́ ìròyìn tẹ́lẹ̀. Ìhà bí a ṣe lè dáhùn." },
  "search.found.step1.title": { fr: "Ne répondez pas, ne payez pas", en: "Don't respond, don't pay", fon: "Ma fó xó ɔ, ma hun akwɛ́ ǎ", yo: "Má dáhùn, má san owó" },
  "search.found.step1.text": { fr: "Refusez toute demande d'argent, de code OTP ou d'accès à vos comptes.", en: "Refuse any request for money, OTP codes or access to your accounts.", fon: "Gbɛ́ akwɛ́ byɔ́byɔ́, kóɖú OTP, alǒ kɔ́ntì towe sín byɔ́byɔ́.", yo: "Kọ gbogbo ìbéèrè owó, koodu OTP, tàbí ẹnu ìwọlé àkáǹtì rẹ." },
  "search.found.step2.title": { fr: "Bloquez et sauvegardez les preuves", en: "Block and save the evidence", fon: "Sɔ́n mɛ ɔ bo hɛn kúnnuɖetɔ́n lɛ̌ nǔhɛnmɛ mɛ", yo: "Dínà wọ́n kí o sì tọ́jú ẹ̀rí" },
  "search.found.step2.text": { fr: "Bloquez le contact et faites des captures d'écran avant de supprimer.", en: "Block the contact and take screenshots before deleting.", fon: "Sɔ́n mɛ ɔ bo kpé fɔtò lɛ̌ dó nukɔn nú è na ɖè.", yo: "Dínà ọ̀nà ìbánisọ̀rọ̀ náà kí o sì ya àwòrán ìfihàn ṣáájú píparẹ́." },
  "search.found.step3.title": { fr: "Signalez sur notre plateforme", en: "Report on our platform", fon: "Ðó gbè dó tɛn mǐtɔn jí", yo: "Ṣe ìròyìn lórí pẹpẹ wa" },
  "search.found.step3.text": { fr: "Votre signalement protège d'autres personnes lors des recherches.", en: "Your report protects other people during searches.", fon: "Gbè towe nɔ hɛn gbɛtɔ́ ɖěvo lɛ̌ hwenu e yě ɖò nùkanbyɔ́ wɛ̌.", yo: "Ìròyìn rẹ ń dáàbòbò àwọn ẹlòmíràn nígbà tí wọ́n bá ń wá." },
  "search.found.step4.title": { fr: "Portez plainte si nécessaire", en: "File a complaint if needed", fon: "Yì kɔ́ ɖ'alixlɛ́mɛtɔ́ lɛ̌ gɔ̌n nú é jɛxa", yo: "Fi ẹsùn sílẹ̀ bí ó bá yẹ" },
  "search.found.step4.text": { fr: "Rendez-vous à la BEFIC ou au CRIET à Cotonou avec vos preuves.", en: "Go to BEFIC or CRIET in Cotonou with your evidence.", fon: "Yì BEFIC alǒ CRIET ɖò Cotonou mɛ kpó kúnnuɖetɔ́n towe lɛ̌ kpó.", yo: "Lọ sí BEFIC tàbí CRIET ní Cotonou pẹ̀lú ẹ̀rí rẹ." },
  "search.found.cta.report": { fr: "Signaler ce contact", en: "Report this contact", fon: "Ðó gbè dó mɛ élɔ́ wu", yo: "Ròyìn ọ̀nà ìbánisọ̀rọ̀ yìí" },
  "search.found.cta.advice": { fr: "Voir tous nos conseils", en: "See all our advice", fon: "Kpɔ́n nǔkplɔ́nkplɔ̌n mǐtɔn lɛ̌ bǐ", yo: "Wo gbogbo ìmọ̀ràn wa" },

  // ── Pending review panel ──
  "search.pending.badge": { fr: "Examen en cours", en: "Under review", fon: "È ɖò kpɔ́n wɛ̌", yo: "Lábẹ́ àyẹ̀wò" },
  "search.pending.title": { fr: "Un signalement est en cours d'examen", en: "A report is currently under review", fon: "Gbè ɖokpó ɔ ɖò kpɔ́n wɛ̌", yo: "Ìròyìn kan wà lábẹ́ àyẹ̀wò" },
  "search.pending.text": { fr: "Plusieurs personnes ont signalé ce contact. Notre équipe vérifie les informations avant de les publier. En attendant, soyez très prudent.", en: "Multiple people have reported this contact. Our team is verifying the information before publishing. In the meantime, be very careful.", fon: "Gbɛtɔ́ lɛ̌ dǒ gbè dó mɛ élɔ́ wu. Sinsɛn mǐtɔn ɖò kpɔ́n nǔ e è ɖɔ lɛ̌ wɛ̌ cobonu è na xlɛ́. Cɔ́ hwiɖée tawun.", yo: "Ọpọ̀ ènìyàn ti ròyìn ọ̀nà ìbánisọ̀rọ̀ yìí. Ẹgbẹ́ wa ń ṣàyẹ̀wò àlàyé náà kí wọ́n tó gbé e jáde. Nígbà yìí, ṣọ́ra púpọ̀." },
  "search.pending.tip1.title": { fr: "Ne transférez pas d'argent", en: "Don't transfer money", fon: "Ma sɛ́ akwɛ́ ǎ", yo: "Má gbé owó ranse" },
  "search.pending.tip1.text": { fr: "Aucun paiement avant que notre vérification soit terminée.", en: "No payment until our verification is complete.", fon: "Akwɛ́ ɖě ǎ cobonu kpɔ́n mǐtɔn ɔ bɛ́.", yo: "Kò sí sisanowó títí tí àyẹ̀wò wa fi parí." },
  "search.pending.tip2.title": { fr: "Ne partagez pas d'informations personnelles", en: "Don't share personal information", fon: "Ma ɖè nǔ e wu hwɛ̌ lɛ̌ bɛ́ ǎ", yo: "Má pín àlàyé tọ̀ọ̀ rẹ" },
  "search.pending.tip2.text": { fr: "Pas de code OTP, mot de passe, numéro de carte ou photo d'identité.", en: "No OTP code, password, card number or ID photo.", fon: "Kóɖú OTP, xó gbɛ̌ mɛ, kàd nú, alǒ fɔtò kɔ́dɔ̌n towe ǎ.", yo: "Kò sí koodu OTP, ọ̀rọ̀ àṣírí, nọ́mbà kàdì, tàbí fọ́tò ìdánimọ̀." },
  "search.pending.tip3.title": { fr: "Signalez si vous êtes victimes", en: "Report if you are a victim", fon: "Ðó gbè nú é nyí wɛ̌ è hu hwɛ towe", yo: "Ròyìn bí o bá jẹ́ olùjìyà" },
  "search.pending.tip3.text": { fr: "Votre témoignage accélère la vérification et protège d'autres personnes.", en: "Your testimony speeds up verification and protects others.", fon: "Nǔ e hwɛjijɔ towe ɖɔ ɔ nɔ lɛ́ vɛ́ kpɔ́n ɔ bo hɛn gbɛtɔ́ ɖěvo lɛ̌.", yo: "Ẹ̀rí rẹ yóò yára àyẹ̀wò kí ó sì dáàbòbò àwọn ẹlòmíràn." },
  "search.pending.cta": { fr: "Signaler ce contact", en: "Report this contact", fon: "Ðó gbè dó mɛ élɔ́ wu", yo: "Ròyìn ọ̀nà ìbánisọ̀rọ̀ yìí" },

  // ── Tips — Phone ──
  "tip.phone.1.title": { fr: "Absent ≠ sûr", en: "Absent ≠ safe", fon: "È ma ɖè ɖě ǎ ≠ é nyí zɔ́", yo: "Kò sí ≠ ààbò" },
  "tip.phone.1.text": { fr: "Absent de notre base ne garantit pas sa fiabilité.", en: "Not in our database doesn't guarantee reliability.", fon: "Nú è ma ɖè ɖě ɖò dátabási mǐtɔn mɛ ǎ ɔ, é ma ɖɔ é nyí zɔ́ ɖě ǎ.", yo: "Kíkọ wà nínú àkójọ wa kò túmọ̀ sí pé ó ní ìgbẹ́kẹ̀lé." },
  "tip.phone.2.title": { fr: "Appel non sollicité", en: "Unsolicited call", fon: "Ylɔ́ e a ma byɔ́ ǎ", yo: "Ìpè tí a kò béèrè fún" },
  "tip.phone.2.text": { fr: "Ne rappelez pas un numéro inconnu qui demande de l'argent ou des données.", en: "Don't call back an unknown number asking for money or personal data.", fon: "Ma ylɔ́ wěmánúmɛ e a ma tuùn ɔ lɛ̌ ǎ, majɛ é ɖò akwɛ́ alǒ dátá byɔ́ wɛ̌.", yo: "Má tún pè nọ́mbà aláìmọ̀ tó ń béèrè owó tàbí dátà àdáni." },
  "tip.phone.3.title": { fr: "N'envoyez jamais d'argent", en: "Never send money", fon: "Ma sɛ́ akwɛ́ dó gbè ɖě ǎ", yo: "Má fi owó ránṣẹ́ rí" },
  "tip.phone.3.text": { fr: "Aucune organisation légitime ne vous demande de payer pour recevoir un gain.", en: "No legitimate organisation asks you to pay to receive a prize.", fon: "Atɔ́xwɛdóxwé e nyí nugbǒ ɖé ma nɔ byɔ́ akwɛ́ ɖò we jí bo na hɛn nǔ we ǎ.", yo: "Kò sí ẹgbẹ́ tó bójú mu tó ń béèrè kí o san owó láti gba ẹ̀bùn." },
  "tip.phone.4.title": { fr: "Vérifiez l'identité", en: "Verify the identity", fon: "Kpɔ́n nyǐkɔ́ mɛ ɔ tɔn", yo: "Ṣàyẹ̀wò ìdánimọ̀" },
  "tip.phone.4.text": { fr: "Raccrochez et appelez directement l'institution officielle pour vérifier.", en: "Hang up and call the official institution directly to verify.", fon: "Sɔ́n wěmá ɔ bo ylɔ́ atɔ́xwɛdóxwé sín gannugán bo na kpɔ́n.", yo: "Pa fóònù kí o sì pè ilé-iṣẹ́ ìjọba tààrà láti ṣàyẹ̀wò." },

  // ── Tips — URL ──
  "tip.url.1.title": { fr: "Absent ≠ sûr", en: "Absent ≠ safe", fon: "È ma ɖè ɖě ǎ ≠ é nyí zɔ́", yo: "Kò sí ≠ ààbò" },
  "tip.url.1.text": { fr: "De nouveaux sites frauduleux apparaissent chaque jour. Restez prudent.", en: "New fraudulent sites appear every day. Stay careful.", fon: "Tɛn gblègblé yɔyɔ lɛ̌ nɔ jɛ azǎn ɖokpó ɖokpó. Cɔ́ hwiɖée.", yo: "Àwọn ojú-ìwé jìbìtì tuntun máa ń farahàn lójoojúmọ́. Ṣọ́ra." },
  "tip.url.2.title": { fr: "Vérifiez le nom de domaine", en: "Check the domain name", fon: "Kpɔ́n tɛn sín nyǐkɔ́", yo: "Ṣàyẹ̀wò orúkọ ìkànsí" },
  "tip.url.2.text": { fr: "Méfiez-vous des extensions inhabituelles (.ga, .cf, .ml, .tk) imitant des marques connues.", en: "Beware of unusual extensions (.ga, .cf, .ml, .tk) imitating well-known brands.", fon: "Cɔ́ hwiɖée dó gbè e è ma nɔ zán ǎ (.ga, .cf, .ml, .tk) wu, e nɔ kpɔ́ndó azɔ̌xwémɛ tɔ́n lɛ̌ gbɔn.", yo: "Ṣọ́ fún àwọn ìfikún aásán (.ga, .cf, .ml, .tk) tó ń ṣe àfarawé àwọn àmì ìṣòwò tó mọ̀." },
  "tip.url.3.title": { fr: "Vérifiez l'ancienneté du site", en: "Check the site's age", fon: "Kpɔ́n hwenu e è ɖó tɛn ɔ é", yo: "Ṣàyẹ̀wò ọjọ́ orí ojú-ìwé" },
  "tip.url.3.text": { fr: "Vérifiez la date de création sur whois.domaintools.com — moins de 3 mois est suspect.", en: "Check the creation date on whois.domaintools.com — less than 3 months is suspicious.", fon: "Kpɔ́n azǎn e è ɖó tɛn ɔ ɖè whois.domaintools.com jí — sun atɔn kpɛ̌vi hugǎn é jɔ gblègblé.", yo: "Ṣàyẹ̀wò ọjọ́ ìdásílẹ̀ rẹ̀ lórí whois.domaintools.com — tí ó bá kéré ju oṣù 3 lọ, ó jẹ́ aféfé." },
  "tip.url.4.title": { fr: "Ne payez jamais avant de recevoir", en: "Never pay before receiving", fon: "Ma hun akwɛ́ nukɔn nú a na yí nǔ ǎ", yo: "Má san owó ṣáájú gbígba" },
  "tip.url.4.text": { fr: "Aucun site légitime ne demande un paiement Mobile Money avant livraison.", en: "No legitimate site asks for Mobile Money payment before delivery.", fon: "Tɛn e nyí nugbǒ ɖé ma nɔ byɔ́ akwɛ́ Mobile Money nukɔn nú è na sɛ́ nǔ dó ǎ.", yo: "Kò sí ojú-ìwé tó bójú mu tó ń béèrè ìsanwó Mobile Money ṣáájú ìfiránṣẹ́." },

  // ── Tips — General ──
  "tip.general.1.title": { fr: "Introuvable ne signifie pas sûr", en: "Not found doesn't mean safe", fon: "È ma mɔ é ǎ nú é nyí zɔ́ ɖɔhun ǎ", yo: "Kò rí kò túmọ̀ sí ó ní ààbò" },
  "tip.general.1.text": { fr: "L'absence de résultat ne garantit pas la fiabilité de ce contact.", en: "No result doesn't guarantee this contact's reliability.", fon: "È ma mɔ nǔɖé dó mɛ élɔ́ wu ǎ nú é nyí zɔ́ ɖɔhun ǎ.", yo: "Àìrísí àbájáde kò túmọ̀ sí pé ọ̀nà ìbánisọ̀rọ̀ yìí ní ìgbẹ́kẹ̀lé." },
  "tip.general.2.title": { fr: "Vérifiez les informations", en: "Check the information", fon: "Kpɔ́n xó lɛ̌ ɖó gɔ̌n ɖé", yo: "Ṣàyẹ̀wò ìwífún náà" },
  "tip.general.2.text": { fr: "Cherchez des avis en ligne et vérifiez les coordonnées officielles avant de payer.", en: "Look for online reviews and check official contact details before paying.", fon: "Ba wěmá lɛ̌ kpé lɛ̌ jí bo kpɔ́n tɛn lɛ̌ sín xó e nyí nugbǒ ɔ nukɔn nú a na hun akwɛ́.", yo: "Wá àwọn àtúnyẹ̀wò lórí intánẹẹ̀tì kí o sì ṣàyẹ̀wò àlàyé ìbánisọ̀rọ̀ ìjọba ṣáájú ìsanwó." },
  "tip.general.3.title": { fr: "Gardez vos données personnelles", en: "Keep your personal data private", fon: "Hɛn dátá towe nǔhɛnmɛ mɛ", yo: "Pa dátà àdáni rẹ mọ́" },
  "tip.general.3.text": { fr: "Ne communiquez jamais vos codes PIN, mots de passe ou numéros de carte.", en: "Never share your PIN codes, passwords or card numbers.", fon: "Ma ɖɔ kóɖú PIN towe, xókpé towe, alǒ kàtí towe sín nǔmɛ gbè ɖě ǎ.", yo: "Má fi koodu PIN rẹ, ọ̀rọ̀ aṣínà, tàbí nọ́mbà káàdì rẹ hàn ẹnikẹ́ni." },
  "tip.general.4.title": { fr: "Partagez l'information", en: "Share the information", fon: "Ðó xó ɔ sín ayi", yo: "Pín ìwífún náà" },
  "tip.general.4.text": { fr: "Prévenez vos proches si vous suspectez une arnaque.", en: "Warn your loved ones if you suspect a scam.", fon: "Kplɔ́n kpɛví towe lɛ̌ nú a ɖò gblègblé ɖé ɖokpó wɛ̌.", yo: "Kìlọ̀ fún àwọn ẹbí rẹ tí o bá fura pé jìbìtì wà." },

  // ── Report — success modal and trust ──
  "report.success.title": { fr: "Signalement enregistré !", en: "Report submitted!", fon: "È yí gbè ɔ !", yo: "A ti gba ìròyìn !" },
  "report.success.body": { fr: "Votre signalement a bien été enregistré. Conservez votre code de suivi.", en: "Your report has been recorded. Keep your tracking code safe.", fon: "È yí gbè towe. Hɛn kóɖú xwedó towe nǔhɛnmɛ mɛ.", yo: "A ti gba ìròyìn rẹ. Pa koodu ìtọpasẹ́ rẹ mọ́." },
  "report.success.track.label": { fr: "Votre code de suivi", en: "Your tracking code", fon: "Kóɖú xwedó towe", yo: "Koodu ìtọpasẹ́ rẹ" },
  "report.success.step1": { fr: "Notre équipe analyse votre dossier", en: "Our team is reviewing your case", fon: "Mɛ̌si mǐtɔn lɛ̌ ɖò dossier towe kpɔ́n wɛ̌", yo: "Àwọn ògbógi wa ń ṣàyẹ̀wò ẹjọ́ rẹ" },
  "report.success.step2": { fr: "Retour sous 48h maximum", en: "Response within 48h at most", fon: "Azǎn 2 mɛ è na fó xó towe", yo: "Ìdáhùn ní wákàtí 48 jù bẹ́ẹ̀ kọ" },
  "report.trust.title": { fr: "Votre signalement est protégé", en: "Your report is protected", fon: "Gbè towe ɔ è hɛn é", yo: "A dáàbòbò ìròyìn rẹ" },
  "report.trust.text": { fr: "Votre identité reste confidentielle. Aucune information personnelle n'est partagée.", en: "Your identity remains confidential. No personal information is shared.", fon: "Nyǐkɔ́ towe nɔ nǔhɛnmɛ mɛ. È nɔ sɛ́ nǔxó e jɔ we ɖó gbè ɖě ǎ.", yo: "Ìdánimọ̀ rẹ ń wà ní ìkọ̀kọ̀. A kò fi ìwífún àdáni kankan hàn." },
  "report.email.hint": { fr: "Utilisé uniquement pour le suivi de votre dossier. Jamais partagé.", en: "Used only to follow up on your case. Never shared.", fon: "È nɔ zán é bo na xwedó dossier towe kɛ́ɖɛ́. È nɔ ɖó é sín ayi ǎ.", yo: "A máa ń lo rẹ̀ fún ìtọpasẹ́ ẹjọ́ rẹ nìkan. A kò fí hàn ẹnikẹ́ni." },
  "report.success.steps.title": { fr: "La suite", en: "Next steps", fon: "E bɔ nukɔn", yo: "Ìgbésẹ̀ tó kàn" },
  "report.success.confirm": { fr: "J'ai noté mon code ✓", en: "I noted my code ✓", fon: "Un hɛn kóɖú ce ✓", yo: "Mo kọ koodu mi ✓" },
  "report.guarantee.1": { fr: "100% anonyme et confidentiel", en: "100% anonymous and confidential", fon: "100% nǔhɛnmɛ mlɛ́mlɛ́", yo: "100% aṣírí àti ìkọ̀kọ̀" },
  "report.guarantee.2": { fr: "Retour sous 48h garanti", en: "Response within 48h guaranteed", fon: "Azǎn 2 mɛ è na fó xó towe gan", yo: "Ìdáhùn ní wákàtí 48 tí a dá ní ìdánilójú" },
  "report.guarantee.3": { fr: "Investigation par des experts", en: "Investigation by experts", fon: "Mɛ e tuùn é lɛ̌ wɛ̌ na ba mɔ gbɛ̌", yo: "Ìwádìí láti ọwọ́ àwọn amoye" },
  "report.guarantee.4": { fr: "Code de suivi pour votre dossier", en: "Tracking code for your case", fon: "Kóɖú xwedó dossier towe tɔn", yo: "Koodu ìtọpasẹ́ fún ẹjọ́ rẹ" },

  // ── Home — FAQ ──
  "faq.1.q": { fr: "Est-ce que mon signalement est anonyme ?", en: "Is my report anonymous?", fon: "Gbè ce ka nɔ nǔhɛnmɛ mɛ wɛ̌ à?", yo: "Ṣé ìròyìn mi jẹ́ aṣírí?" },
  "faq.1.a": { fr: "Oui. Votre identité n'est jamais révélée. L'email est facultatif.", en: "Yes. Your identity is never revealed. Email is optional.", fon: "Ɛ̌ɛ̌. È nɔ ɖè nyǐkɔ́ towe tɔ́n gbě ɖě ǎ. Email nɔ byɔ́ ǎ.", yo: "Bẹ́ẹ̀ni. Ìdánimọ̀ rẹ kò fi hàn rí. Ìméèlì kíí ṣe dandan." },
  "faq.2.q": { fr: "Que se passe-t-il après mon signalement ?", en: "What happens after my report?", fon: "Nɛ̌ nǔ ka nɔ nyí gbɔn gudo e a ɖó gbè é?", yo: "Kí ló máa ṣẹlẹ̀ lẹ́yìn ìròyìn mi?" },
  "faq.2.a": { fr: "Notre équipe analyse votre dossier. Si confirmé, le numéro est ajouté à la base publique.", en: "Our team reviews your case. If confirmed, the number is added to the public database.", fon: "Mɛ̌si mǐtɔn nɔ kpɔ́n dossier towe. Nú è ɖè wě ɔ, è na sɔ́ wěmánúmɛ ɔ dó dátabási gbejixwé ɔ mɛ.", yo: "Àwọn ògbógi wa ń ṣàyẹ̀wò ẹjọ́ rẹ. Bí a bá fọwọ́sí rẹ̀, nọ́mbà náà ń wọ àkójọ gbogbogbò." },
  "faq.3.q": { fr: "Combien de temps prend le traitement ?", en: "How long does processing take?", fon: "Hwenu ɛlɛ é ka nɔ zán gbɔn kpɔ́ndó mɛ?", yo: "Ìgbà mélòó ni àgbátẹ̀rù ń gba?" },
  "faq.3.a": { fr: "La plupart des dossiers sont traités sous 48h, 7 jours au maximum.", en: "Most cases are processed within 48h, 7 days at most.", fon: "Dossier lɛ̌ hugǎn è nɔ wà d'é jí ɖò azǎn 2 mɛ, azǎn 7 nukɔnmɛ hugǎn.", yo: "A máa ń ṣe àgbátẹ̀rù ẹjọ́ jù lọ ní wákàtí 48, ọjọ́ 7 jù bẹ́ẹ̀ kọ." },
  "faq.4.q": { fr: "Les résultats de recherche révèlent-ils des informations personnelles ?", en: "Do search results reveal personal information?", fon: "Mɔ̌ e è ba lɛ̌ ka nɔ ɖè nǔxó e jɔ mɛɖesunɔ lɛ̌ jí à?", yo: "Ṣé àbájáde ìwádìí ń fi ìwífún àdáni hàn?" },
  "faq.4.a": { fr: "Non. La recherche affiche uniquement le niveau de risque. Aucun détail personnel n'est visible.", en: "No. Search shows only the risk level. No personal details are visible.", fon: "Dɔ. Nùkanbyɔ́ ɔ nɔ xlɛ́ ayi sín dóhwɛ kɛ́ɖɛ́. È nɔ mɔ nǔxó e jɔ mɛɖesunɔ lɛ̌ ǎ.", yo: "Rárá. Ìwádìí máa ń fi ìpele ewu hàn nìkan. Kò sí àlàyé àdáni tó hàn." },

  // ── Home — ScamTypes ──
  "home.scam.1.name": { fr: "Appel frauduleux", en: "Fraudulent call", fon: "Ylɔ́ gblègblé", yo: "Ìpè jìbìtì" },
  "home.scam.1.desc": { fr: "Faux conseillers ou agents de l'État.", en: "Fake advisors or government agents.", fon: "Mɛ e lɛ̀n ɖɔ é nyí alixlɛ́mɛtɔ́ alǒ gbɛ̀tɔ́ sín mɛ é.", yo: "Àwọn olùmọ̀ràn ìrọ̀ tàbí aṣojú ìjọba ìrọ̀." },
  "home.scam.2.name": { fr: "SMS frauduleux", en: "Fraudulent SMS", fon: "Xó tì gblègblé", yo: "SMS jìbìtì" },
  "home.scam.2.desc": { fr: "Faux Mobile Money ou remboursements fictifs.", en: "Fake Mobile Money or fictitious refunds.", fon: "Mobile Money ìrọ̀ alǒ akwɛ́ yíyí lɛ̌ nyí ìrọ̀.", yo: "Mobile Money ìrọ̀ tàbí àwọn ìpayà ìrọ̀." },
  "home.scam.3.name": { fr: "Phishing", en: "Phishing", fon: "Sɛ́hùn", yo: "Phishing" },
  "home.scam.3.desc": { fr: "Sites frauduleux pour voler vos identifiants.", en: "Fraudulent sites to steal your credentials.", fon: "Tɛn gblègblé lɛ̌ bo na hɛn xókpé towe.", yo: "Àwọn ojú-ìwé jìbìtì láti jí ìwífún ìwọlé rẹ." },
  "home.scam.4.name": { fr: "Arnaque bancaire", en: "Banking scam", fon: "Gblègblé kpé akwɛ́ tɛn jí", yo: "Jìbìtì ilé-ìfowópamọ́" },
  "home.scam.4.desc": { fr: "Faux agents bancaires cherchant vos codes.", en: "Fake bank agents looking for your codes.", fon: "Akwɛ́ tɛn sín gbɛtɔ́ nyì ìrọ̀ lɛ̌ bo ɖò kóɖú towe byɔ́ wɛ̌.", yo: "Àwọn aṣojú ilé-ìfowópamọ́ ìrọ̀ tó ń wá koodu rẹ." },
  "home.scam.5.name": { fr: "Faux support tech", en: "Fake tech support", fon: "Alɔ nyanya kpé ero jí", yo: "Ìrànlọ́wọ́ ìmọ̀ ẹ̀rọ ìrọ̀" },
  "home.scam.5.desc": { fr: "Faux techniciens accédant à votre appareil.", en: "Fake technicians accessing your device.", fon: "Gbɛtɔ́ nyì ìrọ̀ lɛ̌ bo byɔ́ ero towe mɛ.", yo: "Àwọn onímọ̀ ẹ̀rọ ìrọ̀ tó ń wọ ẹ̀rọ rẹ." },
  "home.scam.6.name": { fr: "Usurpation d'identité", en: "Identity theft", fon: "Nyǐkɔ́ yiyi", yo: "Jíjí ìdánimọ̀" },
  "home.scam.6.desc": { fr: "Quelqu'un se fait passer pour vous.", en: "Someone impersonates you.", fon: "Mɛ ɖé nɔ lɛ̀n ɖɔ é nyí we.", yo: "Ẹnikan ń ṣe àfarawé rẹ." },

  // ── Home — StatsBar ──
  "home.stat.reports": { fr: "Signalements", en: "Reports", fon: "Gbè lɛ̌", yo: "Ìròyìn" },
  "home.stat.confirmed": { fr: "Confirmées", en: "Confirmed", fon: "E è ɖè wě lɛ̌", yo: "Tí a fọwọ́sí" },
  "home.stat.searches": { fr: "Recherches", en: "Searches", fon: "Nùkanbyɔ́ lɛ̌", yo: "Àwọn ìwádìí" },
  "home.stat.satisfaction": { fr: "Satisfaction", en: "Satisfaction", fon: "Fífá ayi", yo: "Ìtẹ́lọ́rùn" },

  // ── Contact (additional keys) ──
  "contact.label": { fr: "Contact", en: "Contact", fon: "Kɔntakti", yo: "Ìkànsí" },
  "contact.info.title": { fr: "Informations", en: "Information", fon: "Xó lɛ̌", yo: "Ìwífún" },
  "contact.info.email": { fr: "Email", en: "Email", fon: "Email", yo: "Ìméèlì" },
  "contact.link.tracking": { fr: "Suivre mon dossier", en: "Track my case", fon: "Xwedó dosiye ce", yo: "Tọpasẹ́ ẹjọ́ mi" },
  "contact.form.title": { fr: "Envoyer un message", en: "Send a message", fon: "Sɛ́ xó ɖé dó", yo: "Fi ìsọ̀rọ̀ ránṣẹ́" },
  "contact.field.subject.placeholder": { fr: "— Choisir un sujet —", en: "— Choose a subject —", fon: "— Sɔ́ tínmɛ ɖé —", yo: "— Yan kókó ọ̀rọ̀ —" },
  "contact.field.name.placeholder": { fr: "Ex : Kofi Mensah", en: "E.g.: Kofi Mensah", fon: "Kɛ́nsísɔ̀: Kofi Mensah", yo: "Àpẹẹrẹ: Kofi Mensah" },
  "contact.field.email.placeholder": { fr: "vous@exemple.com", en: "you@example.com", fon: "ewe@kɛnsiso.bj", yo: "iwo@apere.com" },
  "contact.field.message.placeholder": { fr: "Décrivez votre demande en détail…", en: "Describe your request in detail…", fon: "Tín xó towe mɛ bǐ mlɛ́mlɛ́…", yo: "Ṣàpèjúwe ìbéèrè rẹ ní àlàyé…" },
  "contact.hint.mailto": { fr: "Cliquer sur Envoyer ouvrira votre client de messagerie avec le message prêt.", en: "Clicking Send will open your email client with the message ready.", fon: "Nú a kliki Sɛ́ dó ɔ, email towe na mɔ ɖu nú a na sɛ́ é.", yo: "Títẹ Firánṣẹ́ yóò ṣí apoti ìméèlì rẹ pẹ̀lú ìsọ̀rọ̀ tí ó ṣetán." },
  "contact.security.note": { fr: "Ne nous envoyez jamais de mots de passe ou de codes PIN par email.", en: "Never send us passwords or PIN codes by email.", fon: "Ma sɛ́ xókpé alǒ kóɖú PIN lɛ̌ dó mǐ gbɔn email gblamɛ ǎ.", yo: "Má fi ọ̀rọ̀ aṣínà tàbí koodu PIN ránṣẹ́ sí wa nípa ìméèlì." },
  "contact.security.form": { fr: "Pour un signalement, utilisez le", en: "To report, use the", fon: "Nú ka na ɖó gbè ɔ, zán", yo: "Láti ròyìn, lo" },
  "contact.security.link": { fr: "formulaire dédié", en: "dedicated form", fon: "fɔ́mù e è ɖ'é tɔn", yo: "fọ́ọ̀mù tó yàn" },
  "contact.email.name_label": { fr: "Nom", en: "Name", fon: "Nyǐkɔ́", yo: "Orúkọ" },
  "contact.email.reply_label": { fr: "Email de réponse", en: "Reply email", fon: "Email fó xó tɔn", yo: "Ìméèlì ìdáhùn" },
};

export type TranslationKey = keyof typeof translations;

export function t(key: string, locale: Locale): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[locale] || entry.fr || key;
}
