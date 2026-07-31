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

  // ── News / Actualités ──
  "news.label": { fr: "Restez informé", en: "Stay informed", fon: "Ðó ayi towe wu", yo: "Máa jẹ́ ìmọ̀" },
  "news.title": { fr: "Actualités", en: "News", fon: "Xó yɔyɔ", yo: "Ìròyìn" },
  "news.subtitle": { fr: "Les dernières alertes, conseils et informations pour vous protéger des arnaques au Bénin.", en: "The latest alerts, tips and information to protect you from scams in Benin.", fon: "Wuntun, nǔkplɔ́nkplɔ̌n kpó xó yɔyɔ lɛ̌ bǐ bo na hɛn we ɖó gblègblé wu ɖò Benɛ̀.", yo: "Àwọn ìkìlọ̀, ìmọ̀ràn àti ìwífún tuntun láti dáàbòbò rẹ lọ́wọ́ jìbìtì ní Benin." },
  "news.all": { fr: "Toutes", en: "All", fon: "Bǐ", yo: "Gbogbo" },
  "news.empty.title": { fr: "Aucun article disponible", en: "No articles available", fon: "Xó yɔyɔ ɖěbǔ ɖ'ayǐ ǎ", yo: "Kò sí nkan lati ka" },
  "news.empty.sub": { fr: "Revenez bientôt pour les dernières actualités.", en: "Check back soon for the latest news.", fon: "Wá tɛ̌n kpɛ̌vi bo na mɔ xó yɔyɔ lɛ̌.", yo: "Padà wá laipẹ́ fún ìròyìn tuntun." },
  "news.read_more": { fr: "Lire la suite", en: "Read more", fon: "Xà d'é jí", yo: "Ka síi" },
  "news.see_all": { fr: "Voir toutes les actualités", en: "See all news", fon: "Kpɔ haɖé lɛ bǐ", yo: "Wo gbogbo ìròyìn" },
  "news.back": { fr: "Retour aux actualités", en: "Back to news", fon: "Lɛ̌kɔ xó yɔyɔ lɛ̌ gɔ̌n", yo: "Padà sí ìròyìn" },
  "news.by": { fr: "Par", en: "By", fon: "Mɛ e wlán é", yo: "Láti ọ̀dọ̀" },
  "news.cta.text": { fr: "Vous avez été victime d'une arnaque ?", en: "Have you been scammed?", fon: "Gblègblé ko xò we wɛ̌ à?", yo: "Njẹ́ wọ́n jí ẹ lólè?" },
  "news.cta.sub": { fr: "Signalez-la sur notre plateforme pour protéger les autres Béninois.", en: "Report it on our platform to protect other Beninese.", fon: "Ðó gbè dó tɛn mǐtɔn jí bo na hɛn Benɛ̀ví ɖěvo lɛ̌.", yo: "Ṣe ìròyìn rẹ̀ lórí pẹpẹ wa láti dáàbòbò àwọn ará Benin mìíràn." },
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
    fr: "Signalez les numéros frauduleux et vérifiez si un numéro a déjà été signalé. Ensemble, luttons contre les escroqueries au Bénin.",
    en: "Report fraudulent numbers and check if a number has already been reported. Together, let's fight scams in Benin.",
    fon: "Ðó gbè dó wěmánúmɛ lɛ̌ wu bó kpɔ́n ɖɔ è ko ɖó gbè d'é wu wɛ̌ à. Mi ni ɖó kpɔ́ bo fun ahwan gblègblé lɛ̌ ɖò Benɛ̀.",
    yo: "Ṣe ìròyìn àwọn nọ́mbà arékerèké kí o sì yẹ̀ wò bóyá nọ́mbà kan ti jẹ́ ìròyìn tẹ́lẹ̀. Ẹ jẹ́ ká jagun jìbìtì ní Benin.",
  },
  "hero.cta.report": { fr: "Signaler une arnaque", en: "Report a scam", fon: "Ðó gbè dó gblègblé ɖé wu", yo: "Ròyìn jìbìtì kan" },
  "hero.cta.search": { fr: "Vérifier un numéro", en: "Check a number", fon: "Kpɔ́n wěmánúmɛ ɖé", yo: "Ṣàyẹ̀wò nọ́mbà kan" },

  // ── How it works ──
  "how.label": { fr: "Simple et rapide", en: "Simple and fast", fon: "Bɔkun bó yá", yo: "Ó rọrùn ó sì yára" },
  "how.title": { fr: "Comment ça fonctionne ?", en: "How does it work?", fon: "Nɛ̌ é ka nɔ w'azɔ̌ gbɔn?", yo: "Báwo ni ó ṣe ń ṣiṣẹ́?" },
  "how.subtitle": { fr: "Un processus transparent en 3 étapes pour vous protéger", en: "A transparent 3-step process to protect you", fon: "Alixo 3 bo na hɛn we", yo: "Ìgbésẹ̀ 3 láti dáàbòbò rẹ" },
  "how.step1.title": { fr: "Signalez", en: "Report", fon: "Ðó gbè", yo: "Ròyìn" },
  "how.step1.desc": { fr: "Remplissez notre formulaire sécurisé avec les détails de l'arnaque. Le processus est rapide et 100% confidentiel.", en: "Fill in our secure form with the scam details. The process is fast and 100% confidential.", fon: "Kɛ́n fɔ́mù mǐtɔn mɛ kpó gblègblé ɔ sín tínmɛ kpó. É yá bó nɔ nǔhɛnmɛ.", yo: "Kún fọ́ọ̀mù wa kún pẹ̀lú àlàyé jìbìtì náà. Ó yára, ó sì jẹ́ ìkọ̀kọ̀." },
  "how.step2.title": { fr: "Vérification", en: "Verification", fon: "Kpɔ́ndómɛ", yo: "Ìṣàyẹ̀wò" },
  "how.step2.desc": { fr: "Nos équipes d'experts analysent chaque signalement, recoupent les données et vérifient l'authenticité.", en: "Our expert teams analyze each report, cross-reference data and verify authenticity.", fon: "Mɛ̌si mǐtɔn lɛ̌ nɔ kpɔ́n gbè ɖokpó ɖokpó.", yo: "Àwọn ògbógi wa ń ṣàyẹ̀wò ìròyìn kọ̀ọ̀kan." },
  "how.step3.title": { fr: "Protection", en: "Protection", fon: "Hɛnhɛn", yo: "Ààbò" },
  "how.step3.desc": { fr: "Les numéros confirmés intègrent notre base. Vous et les autres utilisateurs êtes protégés.", en: "Confirmed numbers join our database. You and other users are protected.", fon: "Wěmánúmɛ e è ɖè wě lɛ̌ nɔ byɔ́ dátabási mǐtɔn mɛ.", yo: "Àwọn nọ́mbà tí a fọwọ́sí ń wọ inú àkójọ wa." },

  // ── Why report ──
  "why.label": { fr: "Pourquoi signaler ?", en: "Why report?", fon: "Aniwu è ka na ɖó gbè?", yo: "Kí ló dé tí a fi ṣe ìròyìn?" },
  "why.title1": { fr: "Chaque signalement", en: "Each report", fon: "Gbè ɖokpó ɖokpó", yo: "Ìròyìn kọ̀ọ̀kan" },
  "why.title2": { fr: "protège des milliers", en: "protects thousands", fon: "nɔ hɛn afatɔ́n mɔ̌kpan", yo: "ń dáàbòbò ẹgbẹẹgbẹ̀rún" },
  "why.title3": { fr: "de Béninois", en: "of Beninese", fon: "Benɛ̀ví lɛ̌", yo: "àwọn ará Benin" },
  "why.text": {
    fr: "Les arnaques téléphoniques touchent des millions de personnes chaque année. En signalant un numéro suspect, vous contribuez à une base de données collective qui protège toute la communauté.",
    en: "Phone scams affect millions every year. By reporting a suspicious number, you contribute to a collective database that protects the entire community.",
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

  // ── Trust ──
  "trust.label": { fr: "Confiance & Sécurité", en: "Trust & Security", fon: "Jiɖiɖe kpó Hɛnhɛn kpó", yo: "Ìgbẹ́kẹ̀lé àti Ààbò" },
  "trust.title": { fr: "Votre sécurité, notre priorité", en: "Your security, our priority", fon: "Hɛnhɛn towe, azɔ̌ mǐtɔn", yo: "Ààbò rẹ, àkọ́kọ́ wa" },
  "trust.1.title": { fr: "Données chiffrées", en: "Encrypted data", fon: "Dátá e è hɛn é", yo: "Dátà tí a pa mọ́" },
  "trust.1.desc": { fr: "Toutes vos données sont protégées par un chiffrement de bout en bout.", en: "All your data is protected with end-to-end encryption.", fon: "Dátá towe lɛ̌ bǐ ɔ, è hɛn yě.", yo: "Gbogbo dátà rẹ ni a dáàbòbò." },
  "trust.2.title": { fr: "Anonymat total", en: "Total anonymity", fon: "Nǔhɛnmɛ bǐ mlɛ́mlɛ́", yo: "Aṣírí pátápátá" },
  "trust.2.desc": { fr: "Aucune information personnelle n'est jamais rendue publique ni partagée.", en: "No personal information is ever made public or shared.", fon: "È nɔ ɖè nyǐkɔ́ towe tɔ́n gbeɖé ǎ.", yo: "A kò fi ìwífún àdáni kankan hàn rí." },
  "trust.3.title": { fr: "Cadre légal", en: "Legal framework", fon: "Sɛ́n ɔ", yo: "Òfin" },
  "trust.3.desc": { fr: "Seules les autorités compétentes accèdent aux détails des signalements.", en: "Only competent authorities access report details.", fon: "Acɛkpikpa lɛ̌ kɛ́ɖɛ́ wɛ̀ nɔ kpɔ́n gbè lɛ̌ sín tínmɛ.", yo: "Àwọn aláṣẹ tó yẹ nìkan ló ní àǹfààní sí àlàyé ìròyìn." },

  // ── FAQ ──
  "faq.label": { fr: "FAQ", en: "FAQ", fon: "Nùkanbyɔ́", yo: "Àwọn ìbéèrè" },
  "faq.title": { fr: "Questions fréquentes", en: "Frequently asked questions", fon: "Nùkanbyɔ́ e è nɔ byɔ́ hwɛhwɛ lɛ̌", yo: "Àwọn ìbéèrè tí a máa ń béèrè" },

  // ── CTA ──
  "cta.title": { fr: "Vous avez été victime d'une arnaque ?", en: "Have you been scammed?", fon: "Gblègblé xò we wɛ̌ à?", yo: "Ṣé wọ́n ti jí ẹ lólè?" },
  "cta.text": { fr: "N'attendez pas. Votre signalement peut empêcher d'autres Béninois de tomber dans le piège.", en: "Don't wait. Your report can prevent other Beninese from falling into the trap.", fon: "Ma nɔ te ó. Gbè towe sixú hɛn Benɛ̀ví ɖěvo lɛ̌.", yo: "Má dúró. Ìròyìn rẹ lè da àwọn ará Benin mìíràn là." },
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
  "search.no_result.text": { fr: "Ce numéro n'a pas été signalé dans notre base de données. Restez toutefois vigilant.", en: "This number has not been reported in our database. Stay vigilant.", fon: "È ma ɖó gbè dó wěmánúmɛ élɔ́ wu ǎ. Amɔ̌, cɔ́ hwiɖée.", yo: "A kò tíì ròyìn nọ́mbà yìí. Ṣùgbọ́n, ṣọ́ra." },

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
  "tracking.subtitle": { fr: "Entrez le code de suivi reçu lors de votre signalement.", en: "Enter the tracking code received when you reported.", fon: "Zé kóɖú e a mɔ hwenu e a ɖó gbè é dó.", yo: "Tẹ koodu tí o gba nígbà tí o ṣe ìròyìn." },
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
  "tracking.not_found.text": { fr: "Vérifiez votre code de suivi et réessayez. Il est au format SA-2026-XXXXXX.", en: "Check your tracking code and try again. Format: SA-2026-XXXXXX.", fon: "Kpɔ́n kóɖú towe bo lɛ́ tɛ̀nkpɔn. SA-2026-XXXXXX.", yo: "Ṣàyẹ̀wò koodu rẹ kí o sì tún gbìyànjú. SA-2026-XXXXXX." },

  // ── Conseils ──
  "advice.label": { fr: "Guide pratique", en: "Practical guide", fon: "Alɔdó", yo: "Ìtọ́sọ́nà" },
  "advice.title": { fr: "Conseils & Sécurité", en: "Advice & Security", fon: "Wěmá kpó Hɛnhɛn kpó", yo: "Ìmọ̀ràn àti Ààbò" },
  "advice.subtitle": { fr: "Tout ce que vous devez savoir pour vous protéger des arnaques au Bénin et réagir efficacement si vous en êtes victime.", en: "Everything you need to know to protect yourself from scams in Benin and react effectively if you are a victim.", fon: "Nǔ e a ɖó na tuun bo na hɛn hwiɖée sín gblègblé lɛ̌ sí ɖò Benɛ̀ é.", yo: "Ohun gbogbo tí o nílò láti mọ̀ láti dáàbòbò ara rẹ lọ́wọ́ jìbìtì ní Benin." },
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
  "footer.privacy.text": { fr: "Vos signalements sont traités de manière confidentielle. Aucune information personnelle n'est rendue publique.", en: "Your reports are handled confidentially. No personal information is made public.", fon: "Gbè e a ɖó lɛ̌ nɔ nɔ nǔhɛnmɛ. È nɔ ɖè nyǐkɔ́ towe tɔ́n ǎ.", yo: "Àwọn ìròyìn rẹ ni wọ́n ń tọ́jú ní ìkọ̀kọ̀. Kò sí ìwífún àdáni tí wọ́n fi hàn." },
  "footer.copyright": { fr: "Tous droits réservés.", en: "All rights reserved.", fon: "Acɛ bǐ wɛ̀ è hɛn.", yo: "Gbogbo ẹ̀tọ́ ni a pa mọ́." },

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
    fr: "Vous avez été victime mais vous ne savez pas de quel type il s'agit ? Choisissez la situation qui vous ressemble le plus.",
    en: "Were you a victim but unsure of the type? Choose the situation that best matches yours.",
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
    fr: "Signalez l'arnaque maintenant. Chaque signalement aide à protéger d'autres personnes au Bénin.",
    en: "Report the scam now. Each report helps protect other people in Benin.",
    fon: "Ðó gbè dó gblègblé ɔ dìn. Gbè ɖokpó ɖokpó nɔ hɛn Benɛ̀ví ɖěvo lɛ̌.",
    yo: "Ṣe ìròyìn jìbìtì náà báyìí. Ìròyìn kọ̀ọ̀kan ń dáàbòbò àwọn ará Benin mìíràn.",
  },
  "arnaques.victim.button": { fr: "Faire un signalement", en: "File a report", fon: "Ðó gbè ɖé", yo: "Fi ìròyìn sílẹ̀" },
};

export type TranslationKey = keyof typeof translations;

export function t(key: string, locale: Locale): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[locale] || entry.fr || key;
}
