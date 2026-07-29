import type { Locale } from "./translations";

interface Card {
  icon: string;
  titleKey: string;
  descKey: string;
  type: "do" | "dont" | "info";
}

interface Section {
  titleKey: string;
  subtitleKey: string;
  cards: Card[];
}

export const ADVICE_SECTIONS: Record<string, Section> = {
  prevenir: {
    titleKey: "adv.prev.title",
    subtitleKey: "adv.prev.subtitle",
    cards: [
      { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", titleKey: "adv.prev.1.t", descKey: "adv.prev.1.d", type: "do" },
      { icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636", titleKey: "adv.prev.2.t", descKey: "adv.prev.2.d", type: "do" },
      { icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1", titleKey: "adv.prev.3.t", descKey: "adv.prev.3.d", type: "do" },
      { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", titleKey: "adv.prev.4.t", descKey: "adv.prev.4.d", type: "do" },
      { icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z", titleKey: "adv.prev.5.t", descKey: "adv.prev.5.d", type: "do" },
      { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", titleKey: "adv.prev.6.t", descKey: "adv.prev.6.d", type: "do" },
      { icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", titleKey: "adv.prev.7.t", descKey: "adv.prev.7.d", type: "do" },
      { icon: "M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", titleKey: "adv.prev.8.t", descKey: "adv.prev.8.d", type: "do" },
    ],
  },
  reconnaitre: {
    titleKey: "adv.reco.title",
    subtitleKey: "adv.reco.subtitle",
    cards: [
      { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", titleKey: "adv.reco.1.t", descKey: "adv.reco.1.d", type: "dont" },
      { icon: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7", titleKey: "adv.reco.2.t", descKey: "adv.reco.2.d", type: "dont" },
      { icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z", titleKey: "adv.reco.3.t", descKey: "adv.reco.3.d", type: "dont" },
      { icon: "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2", titleKey: "adv.reco.4.t", descKey: "adv.reco.4.d", type: "dont" },
      { icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z", titleKey: "adv.reco.5.t", descKey: "adv.reco.5.d", type: "dont" },
      { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", titleKey: "adv.reco.6.t", descKey: "adv.reco.6.d", type: "dont" },
      { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", titleKey: "adv.reco.7.t", descKey: "adv.reco.7.d", type: "dont" },
      { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", titleKey: "adv.reco.8.t", descKey: "adv.reco.8.d", type: "dont" },
    ],
  },
  reagir: {
    titleKey: "adv.react.title",
    subtitleKey: "adv.react.subtitle",
    cards: [
      { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", titleKey: "adv.react.1.t", descKey: "adv.react.1.d", type: "info" },
      { icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636", titleKey: "adv.react.2.t", descKey: "adv.react.2.d", type: "info" },
      { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", titleKey: "adv.react.3.t", descKey: "adv.react.3.d", type: "info" },
      { icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z", titleKey: "adv.react.4.t", descKey: "adv.react.4.d", type: "info" },
      { icon: "M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9", titleKey: "adv.react.5.t", descKey: "adv.react.5.d", type: "info" },
      { icon: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z", titleKey: "adv.react.6.t", descKey: "adv.react.6.d", type: "info" },
      { icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z", titleKey: "adv.react.7.t", descKey: "adv.react.7.d", type: "info" },
    ],
  },
};

type T4 = { fr: string; en: string; fon: string; yo: string };

export const adviceTranslations: Record<string, T4> = {
  // ── Prévenir ──
  "adv.prev.title": { fr: "Comment se protéger des arnaques", en: "How to protect yourself from scams", fon: "Nɛ̌ è ka sixú hɛn éɖée sín gblègblé lɛ̌ sí gbɔn?", yo: "Báwo ni o ṣe lè dáàbòbò ara rẹ lọ́wọ́ jìbìtì?" },
  "adv.prev.subtitle": { fr: "Les bons réflexes à adopter au quotidien pour ne jamais tomber dans le piège.", en: "Good habits to adopt daily to never fall into the trap.", fon: "Nǔ ɖagbe e è na wà gbèbígbèbí bo ma jɛ mɔ̌ mɛ ǎ é.", yo: "Àṣà rere láti ní lójoojúmọ́ kí o má bàa wọ ìdẹ̀kùn." },
  "adv.prev.1.t": { fr: "Ne partagez jamais vos codes", en: "Never share your codes", fon: "Ma na kóɖú towe mɛɖé gbeɖé ó", yo: "Má fi koodu rẹ fún ẹnìkẹ́ni rí" },
  "adv.prev.1.d": { fr: "Code PIN, mot de passe, code OTP, code de transfert Mobile Money... Aucune banque, aucun opérateur ne vous demandera jamais ces informations par téléphone ou SMS.", en: "PIN code, password, OTP code, Mobile Money transfer code... No bank or operator will ever ask you for this information by phone or SMS.", fon: "Kóɖú PIN, kóɖú OTP, kóɖú Mobile Money... Bánkì ɖé ɔ́ opérateur ɖé kún na byɔ́ nǔ élɔ́ lɛ̌ we gbɔn telefónu alǒ SMS gblamɛ gbeɖé ó.", yo: "Koodu PIN, ọ̀rọ̀ aṣínà, koodu OTP, koodu Mobile Money... Ko sí báńkì tàbí olùpèsè tó máa béèrè àwọn ìwífún wọ̀nyí lọ́wọ́ rẹ nípasẹ̀ fóònù tàbí SMS." },
  "adv.prev.2.t": { fr: "Ne rappelez pas les numéros inconnus", en: "Don't call back unknown numbers", fon: "Ma lɛ́ ylɔ́ wěmánúmɛ e a ma tuun ǎ é ó", yo: "Má pe nọ́mbà tí o kò mọ̀ padà" },
  "adv.prev.2.d": { fr: "Si un numéro inconnu vous appelle et raccroche immédiatement (arnaque Wangiri), ne rappelez pas. C'est un piège pour vous soutirer de l'argent via un numéro surtaxé.", en: "If an unknown number calls and hangs up immediately (Wangiri scam), don't call back. It's a trap to extract money via a premium number.", fon: "Nú wěmánúmɛ e a ma tuun ǎ é ylɔ́ we bó sɔ́ telefónu ɔ d'ayǐ tlóló ɔ, ma lɛ́ ylɔ́ ɛ ó. Mɔ̌ wɛ̀ bo na xò akwɛ́ towe.", yo: "Tí nọ́mbà tí o kò mọ̀ bá pe ẹ́ tí ó sì gbé fóònù lẹ́sẹ̀kẹsẹ̀, má pe padà. Ìdẹ̀kùn ni láti gba owó rẹ." },
  "adv.prev.3.t": { fr: "Ne cliquez pas sur les liens suspects", en: "Don't click suspicious links", fon: "Ma zín lien e ma sɔgbe ǎ lɛ̌ wu ó", yo: "Má tẹ àwọn ìjápọ̀ afurasi" },
  "adv.prev.3.d": { fr: "SMS vous annonçant un gain, un colis bloqué ou un remboursement ? Ne cliquez jamais. Allez directement sur le site officiel en tapant l'adresse vous-même.", en: "SMS announcing a prize, blocked parcel or refund? Never click. Go directly to the official site by typing the address yourself.", fon: "SMS ɖé ɖɔ a ɖu nǔ, kɔ̌li towe ɖò ayǐ alǒ è na sɔ́ akwɛ́ lɛ̌kɔ na we? Ma zín wu gbeɖé ó. Yi tɛn ɔ jɛ̌jɛ̌ bó wlán adɔ̌rɛ́sù ɔ hwiɖesunɔ.", yo: "SMS tó sọ pé o ṣẹ́gun, pàásẹ̀lì dí tàbí ìsanpadà? Má tẹ̀ẹ́ rí. Lọ taara sí ojú-ìwé aṣẹ náà kí o sì tẹ àdírẹ́sì náà fúnra rẹ." },
  "adv.prev.4.t": { fr: "Vérifiez l'identité de votre interlocuteur", en: "Verify the identity of your caller", fon: "Kpɔ́n mɛ e ɖò xó ɖɔ nú we wɛ̌ é dó gaàn", yo: "Ṣàyẹ̀wò ẹni tó ń bá ẹ sọ̀rọ̀" },
  "adv.prev.4.d": { fr: "Quelqu'un prétend être de votre banque, de MTN, de Moov ? Raccrochez et appelez vous-même le numéro officiel du service client pour vérifier.", en: "Someone claims to be from your bank, MTN, Moov? Hang up and call the official customer service number yourself to verify.", fon: "Mɛɖé ɖɔ émi wɛ̀ nyí bánkì towe, MTN, Moov? Sɔ́ telefónu ɔ d'ayǐ bó ylɔ́ wěmánúmɛ tótɔ́ ɔ hwiɖesunɔ.", yo: "Ẹnìkan sọ pé òun wá láti ọ̀dọ̀ báńkì rẹ, MTN, Moov? Gbé fóònù kí o sì pe nọ́mbà aṣẹ fúnra rẹ." },
  "adv.prev.5.t": { fr: "Méfiez-vous des offres trop belles", en: "Beware of offers too good to be true", fon: "Cɔ́ hwiɖée dó nǔ e nyɔ́ hú agbɔ̌n lɛ̌ wu", yo: "Ṣọ́ra fún àwọn ipèsè tó dára jù" },
  "adv.prev.5.d": { fr: "\"Vous avez gagné 5 millions\", \"Doublez votre argent en 24h\"... Si c'est trop beau pour être vrai, c'est une arnaque. Aucune loterie ne contacte des gagnants par SMS.", en: "\"You won 5 million\", \"Double your money in 24h\"... If it's too good to be true, it's a scam. No lottery contacts winners by SMS.", fon: "\"A ɖu loto miliɔ́ɔ̌n 5\", \"Dǒ akwɛ́ towe jí azɔn wè ɖò ganxixo 24 mɛ\"... Nú é nyɔ́ hú agbɔ̌n ɔ, gblègblé wɛ̀. Loto ɖé kún nɔ sɛ̀ xó dó nú mɛ gbɔn SMS gblamɛ ó.", yo: "\"O ṣẹ́gun mílíọ̀nù 5\", \"Ṣe owó rẹ ní ìlọ́po méjì ní wákàtí 24\"... Tí ó bá dára jù, jìbìtì ni. Ko sí lottery tó máa kàn sí olùborí nípasẹ̀ SMS." },
  "adv.prev.6.t": { fr: "Parlez-en autour de vous", en: "Talk about it around you", fon: "Ðɔ nú mɛ e lɛ̀ li we lɛ̌", yo: "Sọ fún àwọn tó wà ní àyíká rẹ" },
  "adv.prev.6.d": { fr: "Sensibilisez vos proches, surtout les personnes âgées et les jeunes. Les arnaqueurs ciblent les personnes isolées ou peu informées.", en: "Raise awareness among your loved ones, especially elderly and young people. Scammers target isolated or poorly informed people.", fon: "Dǒ nǔ kplɔ́n mɛ vívɔ́ towe lɛ̌, taji mɛxomɔ lɛ̌ kpó yɔ̌vǐ lɛ̌ kpó. Gblègblétɔ́ lɛ̌ nɔ ba mɛ e ɖò éɖokpónɔ lɛ̌.", yo: "Jẹ́ kí àwọn ẹbí rẹ mọ̀, pàápàá àgbàlagbà àti ọ̀dọ́. Àwọn olójúkòkòrò máa ń wá àwọn tó dá wà tàbí tí kò ní ìwífún." },
  "adv.prev.7.t": { fr: "N'envoyez jamais de photos intimes", en: "Never send intimate photos", fon: "Ma sɛ́ ɖiɖe nǔhɛnmɛ tɔn dó mɛɖé gbeɖé ó", yo: "Má fi àwòrán ìkọ̀kọ̀ ránṣẹ́ sí ẹnìkẹ́ni rí" },
  "adv.prev.7.d": { fr: "Même à une personne de confiance rencontrée en ligne. Les arnaqueurs créent de faux profils séduisants pour obtenir des photos compromettantes, puis vous font chanter (sextorsion).", en: "Even to a trusted person met online. Scammers create attractive fake profiles to get compromising photos, then blackmail you (sextortion).", fon: "Ké mɛ e a ɖeji dó wu bó mɔ ɖò ɛntɛnɛ́ti jí é ɔ nɛ̀. Gblègblétɔ́ lɛ̌ nɔ bló profil yǎyi bo na mɔ ɖiɖe towe lɛ̌, bó nɔ dó xɛ̌si we (sextorsion).", yo: "Kódà sí ẹni tí o gbẹ́kẹ̀lé tí o pàdé lórí ayélujára. Àwọn olójúkòkòrò máa ń dá profaili èké ẹlẹ́wà láti gba àwòrán rẹ, lẹ́yìn náà wọ́n á halẹ̀ mọ́ ẹ (sextorsion)." },
  "adv.prev.8.t": { fr: "Désactivez votre caméra avec les inconnus", en: "Disable your camera with strangers", fon: "Sú kaméra towe nú mɛ e a ma tuun ǎ lɛ̌", yo: "Pa kámẹ́rà rẹ fún àwọn àjèjì" },
  "adv.prev.8.d": { fr: "N'acceptez jamais d'appel vidéo avec quelqu'un que vous ne connaissez pas en vrai. Les arnaqueurs enregistrent votre image pour créer de faux montages compromettants.", en: "Never accept a video call with someone you don't know in real life. Scammers record your image to create fake compromising montages.", fon: "Ma yí gbè nú vidéo ylɔ̌ylɔ́ xá mɛ e a ma tuun ɖò gbɛmɛ ǎ é gbeɖé ó. Gblègblétɔ́ lɛ̌ nɔ wlí ɖiɖe towe bo nɔ bló nǔ nyanya.", yo: "Má gba ìpè fídíò lọ́wọ́ ẹni tí o kò mọ̀ ní ojúko. Àwọn olójúkòkòrò máa ń ya àwòrán rẹ láti ṣe àdàkọ èké." },

  // ── Reconnaître ──
  "adv.reco.title": { fr: "Comment reconnaître une arnaque", en: "How to recognize a scam", fon: "Nɛ̌ è ka sixú dǒ gblègblé ɖé nukún gbɔn?", yo: "Báwo ni o ṣe lè mọ jìbìtì?" },
  "adv.reco.subtitle": { fr: "Les signaux d'alerte qui doivent immédiatement vous mettre en garde.", en: "Warning signs that should immediately alert you.", fon: "Wuntun ayi tɔn e ɖó na ɖó ayi towe wu tlóló lɛ̌.", yo: "Àwọn àmì ìkìlọ̀ tó gbọ́dọ̀ mú ẹ ṣọ́ra lẹ́sẹ̀kẹsẹ̀." },
  "adv.reco.1.t": { fr: "L'urgence artificielle", en: "Artificial urgency", fon: "Kàn e ma nyí tɔn ǎ é", yo: "Ìpayà èké" },
  "adv.reco.1.d": { fr: "\"Vous devez payer maintenant\", \"Votre compte sera bloqué dans 1h\"... Les arnaqueurs créent un sentiment d'urgence pour vous empêcher de réfléchir.", en: "\"You must pay now\", \"Your account will be blocked in 1h\"... Scammers create urgency to prevent you from thinking.", fon: "\"A ɖó na sú dìn\", \"Kɔ́ntì towe na sú ɖò ganxixo 1 mɛ\"... Gblègblétɔ́ lɛ̌ nɔ bló bonu nǔ na yá bó ma na lin tamɛ ǎ.", yo: "\"O gbọ́dọ̀ san báyìí\", \"Àkáǹtì rẹ yóò dí ní wákàtí 1\"... Àwọn olójúkòkòrò máa ń dá ìpayà kí o má lè ronú." },
  "adv.reco.2.t": { fr: "Les gains inattendus", en: "Unexpected winnings", fon: "Nǔɖuɖu e è ma ɖó nukún tɔn ǎ lɛ̌", yo: "Èrè àìròtẹ́lẹ̀" },
  "adv.reco.2.d": { fr: "Vous n'avez participé à aucun jeu mais vous avez \"gagné\" ? On vous demande de payer des \"frais de dossier\" pour récupérer votre gain ? C'est toujours une arnaque.", en: "You didn't enter any game but you \"won\"? Asked to pay \"processing fees\" to collect your prize? It's always a scam.", fon: "A ma ɖó alɔ ɖò loto ɖé mɛ ǎ amɔ̌ a \"ɖu\"? È byɔ́ we ɖɔ a ni sú \"akwɛ́ dɔ̌syé tɔn\"? Gblègblé wɛ̀ hwebǐnu.", yo: "O kò forúkọsílẹ̀ fún eré kankan ṣùgbọ́n o \"ṣẹ́gun\"? Wọ́n béèrè pé kí o san \"owó iṣẹ́\"? Jìbìtì ni nígbà gbogbo." },
  "adv.reco.3.t": { fr: "L'appel aux sentiments", en: "Emotional manipulation", fon: "Ayixa sísɔ́", yo: "Ìfọkànbalẹ̀ èké" },
  "adv.reco.3.d": { fr: "Un proche en \"danger\" qui a besoin d'argent en urgence ? Vérifiez en appelant directement la personne sur son vrai numéro avant d'envoyer quoi que ce soit.", en: "A loved one in \"danger\" needing money urgently? Verify by calling the person directly on their real number before sending anything.", fon: "Mɛ vívɔ́ towe ɖò \"axɔ\" mɛ bó ɖó hudo akwɛ́ tɔn tlóló? Ylɔ́ mɛ ɔ ɖesunɔ dó wěmánúmɛ tɔn tɔn jí hwɛ̌ cobɔ a na sɛ́ nǔɖé dó.", yo: "Ẹbí rẹ kan wà nínú \"ewu\" tó nílò owó ní kíákíá? Ṣàyẹ̀wò nípa pípe ẹni náà taara lórí nọ́mbà gidi rẹ̀ kí o tó fi ohunkóhun ránṣẹ́." },
  "adv.reco.4.t": { fr: "L'usurpation d'autorité", en: "Authority impersonation", fon: "Mɛ e nɔ wà mɛ ɖěvo sín nǔ lɛ̌", yo: "Dídá ẹni aláṣẹ" },
  "adv.reco.4.d": { fr: "Faux policier, faux agent des impôts, faux responsable de banque... Les arnaqueurs se font passer pour des autorités pour vous intimider et vous faire obéir.", en: "Fake police, fake tax agent, fake bank manager... Scammers impersonate authorities to intimidate and make you obey.", fon: "Polisíe-nyijɛ́, agent takwɛ́-nyijɛ́, bánkì gǎn-nyijɛ́... Gblègblétɔ́ lɛ̌ nɔ wà acɛkpikpa sín nǔ bo na dó xɛ̌si we.", yo: "Ọlọ́pàá èké, aṣojú owó-orí èké, alámòjúlò báńkì èké... Àwọn olójúkòkòrò máa ń ṣe bí ẹni aláṣẹ láti dẹ́rù bá ẹ." },
  "adv.reco.5.t": { fr: "Les demandes de transfert Mobile Money", en: "Mobile Money transfer requests", fon: "Akwɛ́ e è nɔ byɔ́ gbɔn Mobile Money gblamɛ lɛ̌", yo: "Àwọn ìbéèrè ìfiránṣẹ́ owó Mobile Money" },
  "adv.reco.5.d": { fr: "On vous demande d'envoyer de l'argent via MTN MoMo ou Moov Money pour \"débloquer\" un paiement, un colis ou un service ? N'envoyez rien.", en: "Asked to send money via MTN MoMo or Moov Money to \"unlock\" a payment, parcel or service? Don't send anything.", fon: "È byɔ́ we ɖɔ a ni sɛ́ akwɛ́ dó gbɔn MTN MoMo alǒ Moov Money gblamɛ bo na \"hun\" nǔsúsú, kɔ̌li alǒ azɔ̌ ɖé? Ma sɛ́ nǔɖé dó ó.", yo: "Wọ́n béèrè pé kí o fi owó ránṣẹ́ nípasẹ̀ MTN MoMo tàbí Moov Money láti \"ṣí\" owó, pàásẹ̀lì tàbí iṣẹ́? Má fi ohunkóhun ránṣẹ́." },
  "adv.reco.6.t": { fr: "Les fausses erreurs de transfert", en: "Fake transfer errors", fon: "Wěmá-nyijɛ́ akwɛ́ sísɛ́dó tɔn", yo: "Àṣìṣe ìfiránṣẹ́ owó èké" },
  "adv.reco.6.d": { fr: "\"Je me suis trompé de numéro, renvoyez-moi l'argent\" : vérifiez votre solde réel avant tout. Le SMS de réception peut être falsifié.", en: "\"I sent to the wrong number, send back the money\": check your real balance first. The receipt SMS can be faked.", fon: "\"Un wɔ̀n ɖé, lɛ̌ sɛ́ akwɛ́ ɔ wá nú mì\" : kpɔ́n akwɛ́ e ɖò kɔ́ntì towe mɛ nugbǒ é hwɛ̌. SMS yíyí tɔn ɔ sixú nyí nyijɛ́.", yo: "\"Mo ṣàṣìṣe nọ́mbà, fi owó náà padà ránṣẹ́\" : ṣàyẹ̀wò iye owó gidi rẹ kí ó tó pé ohunkóhun. SMS gbígba lè jẹ́ èké." },
  "adv.reco.7.t": { fr: "La sextorsion / chantage intime", en: "Sextortion / intimate blackmail", fon: "Sextorsion / xɛ̌sidíd xó nǔhɛnmɛ tɔn", yo: "Sextortion / ìhalẹ̀mọ́ni ìkọ̀kọ̀" },
  "adv.reco.7.d": { fr: "Un(e) inconnu(e) séduisant(e) vous contacte, la relation évolue vite vers des échanges intimes. Ensuite viennent les menaces : \"Paye ou je diffuse tes photos à ta famille et tes collègues.\"", en: "An attractive stranger contacts you, the relationship quickly moves to intimate exchanges. Then come the threats: \"Pay or I'll share your photos with your family and colleagues.\"", fon: "Mɛ e a ma tuun ǎ bɔ é nyɔ́ é ylɔ́ we, bɔ nǔ lɛ̌ sù tawun yì nǔhɛnmɛ tɔn. Enɛ̌ gudo ɔ, xɛ̌si lɛ̌ wá: \"Sú akwɛ́ alǒ un na ɖè ɖiɖe towe tɔ́n nú xwédo towe.\"", yo: "Àjèjì ẹlẹ́wà kan kàn sí ẹ, ìbáṣepọ̀ náà yára dé ipele ìkọ̀kọ̀. Lẹ́yìn náà ìhalẹ̀mọ́ni dé: \"San owó bí bẹ́ẹ̀ kọ́ èmi yóò fi àwòrán rẹ hàn fún ẹbí rẹ.\"" },
  "adv.reco.8.t": { fr: "L'arnaque aux sentiments (romance scam)", en: "Romance scam", fon: "Gblègblé wǎn tɔn (romance scam)", yo: "Jìbìtì ìfẹ́ (romance scam)" },
  "adv.reco.8.d": { fr: "Relation amoureuse en ligne avec une personne que vous n'avez jamais vue en vrai. Après des semaines de séduction, elle vous demande de l'argent pour un \"billet d'avion\", une \"urgence médicale\"...", en: "Online romantic relationship with someone you've never met in person. After weeks of seduction, they ask for money for a \"plane ticket\", a \"medical emergency\"...", fon: "Wǎnyíyí ɖò ɛntɛnɛ́ti jí xá mɛ e a ma mɔ gbeɖé ǎ é. Aklunɔzán wè gudo ɔ, é byɔ́ akwɛ́ dó \"tikɛ́ti zɔ̌nlin\" alǒ \"azɔn kàn\" wu.", yo: "Ìbáṣepọ̀ ìfẹ́ lórí ayélujára pẹ̀lú ẹni tí o kò tíì rí ní ojúko. Lẹ́yìn ọ̀sẹ̀ púpọ̀, wọ́n béèrè owó fún \"tikẹ́ẹ̀tì ọkọ̀ òfurufú\", \"pàjáwírì ìlera\"..." },

  // ── Réagir ──
  "adv.react.title": { fr: "Que faire si vous êtes victime", en: "What to do if you are a victim", fon: "Nǔ e è na wà nú gblègblé xò we ɔ", yo: "Ohun tí o lè ṣe bí o bá jẹ́ olùjìyà" },
  "adv.react.subtitle": { fr: "Les étapes à suivre immédiatement si vous avez été arnaqué.", en: "Steps to follow immediately if you have been scammed.", fon: "Afɔ e è na ɖè lɛ̌ tlóló nú gblègblé xò we ɔ.", yo: "Àwọn ìgbésẹ̀ láti tẹ̀lé lẹ́sẹ̀kẹsẹ̀ bí wọ́n bá ti jí ẹ lólè." },
  "adv.react.1.t": { fr: "Gardez votre calme", en: "Stay calm", fon: "Nɔ fífá mɛ", yo: "Farabalẹ̀" },
  "adv.react.1.d": { fr: "Ne paniquez pas. Plus vous agissez vite et de manière réfléchie, plus vous avez de chances de limiter les dégâts. Notez tout ce dont vous vous souvenez.", en: "Don't panic. The faster and more thoughtfully you act, the better your chances of limiting damage. Write down everything you remember.", fon: "Ma ɖò adǎn jí ó. Nú a wà nǔ yá bó lin tamɛ ɔ, a na ɖó acɛ d'é jí hugǎn. Wlán nǔ e a flín lɛ̌ bǐ.", yo: "Má páyà. Bí o ṣe yára tó sì ronú, bẹ́ẹ̀ ni àǹfààní rẹ ṣe pọ̀ tó láti dín àìdá kù. Kọ ohun gbogbo tí o rántí sílẹ̀." },
  "adv.react.2.t": { fr: "Bloquez le numéro de l'arnaqueur", en: "Block the scammer's number", fon: "Sú wěmánúmɛ gblègblétɔ́ ɔ tɔn", yo: "Dí nọ́mbà olójúkòkòrò náà" },
  "adv.react.2.d": { fr: "Bloquez immédiatement le numéro sur votre téléphone pour éviter tout nouveau contact. Ne répondez plus à aucun message de cette personne.", en: "Block the number immediately on your phone to prevent further contact. Don't respond to any more messages from this person.", fon: "Sú wěmánúmɛ ɔ tlóló ɖò telefónu towe jí. Ma sɔ́ yí gbè nú wěmá mɛ ɔ tɔn ɖě ó.", yo: "Dí nọ́mbà náà lẹ́sẹ̀kẹsẹ̀ lórí fóònù rẹ. Má dáhùn ìfiránṣẹ́ kankan mọ́ láti ọ̀dọ̀ ẹni yìí." },
  "adv.react.3.t": { fr: "Contactez votre opérateur / banque", en: "Contact your operator / bank", fon: "Ylɔ́ opérateur / bánkì towe", yo: "Kàn sí olùpèsè / báńkì rẹ" },
  "adv.react.3.d": { fr: "Si de l'argent a été transféré via Mobile Money, appelez immédiatement le service client MTN (123) ou Moov (155) pour tenter de bloquer la transaction.", en: "If money was transferred via Mobile Money, immediately call MTN customer service (123) or Moov (155) to try to block the transaction.", fon: "Nú è ko sɛ́ akwɛ́ gbɔn Mobile Money gblamɛ ɔ, ylɔ́ MTN (123) alǒ Moov (155) tlóló bo na tɛ̀nkpɔn bo sú nǔsúsú ɔ.", yo: "Tí wọ́n bá ti fi owó ránṣẹ́ nípasẹ̀ Mobile Money, pe MTN (123) tàbí Moov (155) lẹ́sẹ̀kẹsẹ̀ láti gbìyànjú láti dí ìdúnàádúrà náà." },
  "adv.react.4.t": { fr: "Changez vos mots de passe", en: "Change your passwords", fon: "Ðyɔ kóɖú towe lɛ̌", yo: "Yí ọ̀rọ̀ aṣínà rẹ padà" },
  "adv.react.4.d": { fr: "Si vous avez partagé des identifiants, changez immédiatement tous vos mots de passe : email, réseaux sociaux, services bancaires, Mobile Money.", en: "If you shared login details, immediately change all your passwords: email, social media, banking services, Mobile Money.", fon: "Nú a ko na kóɖú towe lɛ̌ mɛɖé ɔ, ɖyɔ yě bǐ tlóló: email, Facebook, bánkì, Mobile Money.", yo: "Tí o bá ti pín àwọn ìdánimọ̀, yí gbogbo ọ̀rọ̀ aṣínà rẹ padà lẹ́sẹ̀kẹsẹ̀: imeeli, àwọn mẹ́díà àwùjọ, iṣẹ́ báńkì, Mobile Money." },
  "adv.react.5.t": { fr: "Signalez sur StopArnaque", en: "Report on StopArnaque", fon: "Ðó gbè dó StopArnaque jí", yo: "Ṣe ìròyìn lórí StopArnaque" },
  "adv.react.5.d": { fr: "Déposez un signalement sur notre plateforme avec toutes les informations du suspect. Votre signalement protégera d'autres Béninois.", en: "File a report on our platform with all the suspect's information. Your report will protect other Beninese.", fon: "Ðó gbè ɖó tɛn mǐtɔn jí kpó gblègblétɔ́ ɔ sín tínmɛ bǐ kpó. Gbè towe na hɛn Benɛ̀ví ɖěvo lɛ̌.", yo: "Fi ìròyìn sílẹ̀ lórí pẹpẹ wa pẹ̀lú gbogbo ìwífún afurasi náà. Ìròyìn rẹ yóò dáàbòbò àwọn ará Benin mìíràn." },
  "adv.react.6.t": { fr: "Portez plainte", en: "File a complaint", fon: "Yi hwlɛn dó", yo: "Fi ẹ̀sùn sílẹ̀" },
  "adv.react.6.d": { fr: "Rendez-vous au commissariat le plus proche avec toutes vos preuves (captures d'écran, relevés de transactions). Vous pouvez aussi contacter l'OCRC (Office Central de Répression de la Cybercriminalité).", en: "Go to the nearest police station with all your evidence (screenshots, transaction records). You can also contact the OCRC (Central Office for the Repression of Cybercrime).", fon: "Yi commissariat e sɛkpɔ we hugǎn é kpó kúnnuɖetɔ́n towe lɛ̌ bǐ kpó. A sixú lɛ́ ylɔ́ OCRC.", yo: "Lọ sí ibùdó ọlọ́pàá tó sún mọ́ ẹ jù pẹ̀lú gbogbo ẹ̀rí rẹ. O tún lè kàn sí OCRC." },
  "adv.react.7.t": { fr: "En cas de sextorsion : ne payez JAMAIS", en: "In case of sextortion: NEVER pay", fon: "Nú sextorsion jɛ: ma sú akwɛ́ GBEÐÉ ó", yo: "Ní ọ̀ràn sextortion: MÁ san owó LÁÉLÁÉ" },
  "adv.react.7.d": { fr: "Payer ne fait qu'encourager l'arnaqueur à demander plus. Ne supprimez rien (gardez les preuves). Bloquez la personne, signalez le profil sur la plateforme, et portez plainte. Vous n'avez pas à avoir honte : vous êtes la victime.", en: "Paying only encourages the scammer to ask for more. Don't delete anything (keep the evidence). Block the person, report the profile on the platform, and file a complaint. You don't have to be ashamed: you are the victim.", fon: "Akwɛ́ súsú nɔ na akɔnkpinkpan gblègblétɔ́ ɔ bó na byɔ́ d'é jí. Ma sùnsún nǔɖé ó (hɛn kúnnuɖetɔ́n lɛ̌). Sú mɛ ɔ, ɖó gbè dó profil ɔ wu, bo yi hwlɛn dó. Winnya ma ɖó na hu we ó: a wɛ̀ nyí mɛ e è wà nǔ nyanya nà é.", yo: "Sísanwó nìkan ló ń fún olójúkòkòrò ní ìgboyà láti béèrè síi. Má pa ohunkóhun rẹ́ (tọ́jú ẹ̀rí náà). Dí ẹni náà, ṣe ìròyìn profaili lórí pẹpẹ náà, kí o sì fi ẹ̀sùn sílẹ̀. O kò nílò láti tìjú: ìwọ ni olùjìyà." },
};

export function getAdviceTranslation(key: string, locale: Locale): string {
  const entry = adviceTranslations[key];
  if (!entry) return key;
  return entry[locale] || entry.fr || key;
}
