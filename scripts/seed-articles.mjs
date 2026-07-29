import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");
const { PrismaLibSql } = require("@prisma/adapter-libsql");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const articles = [
  {
    title: "Arnaque Mobile Money : comment les escrocs volent votre argent en 2 minutes",
    titleEn: "Mobile Money Scam: how fraudsters steal your money in 2 minutes",
    excerpt: "Une nouvelle technique de fraude cible les utilisateurs MTN MoMo et Moov Money au Bénin. Les victimes perdent en moyenne 50 000 à 200 000 FCFA en quelques instants.",
    excerptEn: "A new fraud technique is targeting MTN MoMo and Moov Money users in Benin. Victims lose an average of 50,000 to 200,000 FCFA in a matter of seconds.",
    content: `Des escrocs se font passer pour des agents Mobile Money et contactent leurs victimes par appel téléphonique ou WhatsApp. Ils prétendent qu'un virement a été effectué par erreur sur votre compte et vous demandent de "renvoyer" la somme.

En réalité, aucun argent n'a été reçu. Le SMS de confirmation que vous recevez est entièrement falsifié. Dès que vous transférez la somme demandée, l'argent est perdu et l'arnaqueur disparaît.

Comment se protéger ? Vérifiez TOUJOURS votre solde réel en composant le *880# (MTN) ou *555# (Moov) avant de renvoyer quoi que ce soit. Aucun agent légitime ne vous demandera de renvoyer de l'argent de cette façon.

Si vous êtes victime, appelez immédiatement le service client MTN (123) ou Moov (155) pour tenter de bloquer la transaction, et signalez le numéro sur StopArnaque Bénin.

Les numéros utilisés pour cette arnaque changent fréquemment. Notre base de données recense déjà plusieurs dizaines de numéros impliqués dans ce type de fraude.`,
    contentEn: `Fraudsters pose as Mobile Money agents and contact victims by phone or WhatsApp. They claim that a transfer was mistakenly made to your account and ask you to "send back" the amount.

In reality, no money was received. The confirmation SMS you receive is entirely fake. As soon as you transfer the requested amount, the money is gone and the scammer disappears.

How to protect yourself? ALWAYS check your real balance by dialing *880# (MTN) or *555# (Moov) before sending anything back. No legitimate agent will ever ask you to return money this way.

If you are a victim, immediately call MTN customer service (123) or Moov (155) to try to block the transaction, and report the number on StopArnaque Benin.

The numbers used for this scam change frequently. Our database already lists dozens of numbers involved in this type of fraud.`,
    category: "Alerte",
  },
  {
    title: "Sextorsion : ce qu'il faut faire si vous êtes victime",
    titleEn: "Sextortion: what to do if you are a victim",
    excerpt: "La sextorsion est en forte hausse au Bénin. Des centaines de personnes sont victimes chaque mois. Voici les étapes à suivre immédiatement si cela vous arrive.",
    excerptEn: "Sextortion is sharply rising in Benin. Hundreds of people are victimized every month. Here are the steps to take immediately if it happens to you.",
    content: `La sextorsion consiste à menacer une personne de diffuser des photos ou vidéos intimes si elle ne paie pas une rançon. Cette arnaque touche aussi bien les hommes que les femmes, de tous âges.

Comment ça se passe : un inconnu vous contacte sur Facebook, WhatsApp ou Instagram. La relation devient rapidement intime. Il ou elle vous demande des photos ou initie un appel vidéo. Ensuite viennent les menaces.

Que faire ? D'abord, ne payez JAMAIS. Payer ne fait qu'encourager l'arnaqueur à demander plus. Bloquez immédiatement la personne sur toutes les plateformes. Ne supprimez aucune preuve (conservez les captures d'écran et les messages).

Signalez le profil sur la plateforme concernée (Facebook, Instagram, WhatsApp) et déposez une plainte à l'OCRC (Office Central de Répression de la Cybercriminalité) au +229 21 30 84 50.

Vous n'avez aucune raison d'avoir honte. Vous êtes la victime. Ces criminels sont des professionnels qui ciblent des milliers de personnes. Parlez-en à quelqu'un de confiance et cherchez de l'aide.`,
    contentEn: `Sextortion involves threatening a person to share intimate photos or videos unless they pay a ransom. This scam affects both men and women of all ages.

How it works: a stranger contacts you on Facebook, WhatsApp or Instagram. The relationship quickly turns intimate. They ask for photos or start a video call. Then come the threats.

What to do? First, NEVER pay. Paying only encourages the scammer to ask for more. Immediately block the person on all platforms. Do not delete any evidence (keep screenshots and messages).

Report the profile on the relevant platform (Facebook, Instagram, WhatsApp) and file a complaint with the OCRC (Central Office for the Repression of Cybercrime) at +229 21 30 84 50.

You have no reason to be ashamed. You are the victim. These criminals are professionals who target thousands of people. Talk to someone you trust and seek help.`,
    category: "Conseil",
  },
  {
    title: "5 signes qui montrent qu'un numéro qui vous appelle est un arnaqueur",
    titleEn: "5 signs that a caller is a scammer",
    excerpt: "Apprenez à reconnaître les signaux d'alerte avant de décrocher ou de rappeler un numéro inconnu. Ces 5 indices peuvent vous sauver de milliers de FCFA de pertes.",
    excerptEn: "Learn to recognize warning signs before answering or calling back an unknown number. These 5 clues can save you thousands of FCFA in losses.",
    content: `Chaque jour, des milliers de Béninois reçoivent des appels frauduleux. Voici les 5 signes les plus courants qui doivent vous mettre en garde immédiatement.

1. L'urgence artificielle : "Votre compte sera bloqué dans 1 heure", "Vous devez payer maintenant"... Les arnaqueurs créent une pression de temps pour vous empêcher de réfléchir. Raccrochez, vérifiez, rappellez le numéro officiel.

2. Un gain inattendu : Vous n'avez participé à aucune loterie mais vous avez "gagné" ? C'est une arnaque. Aucune vraie loterie ne contacte ses gagnants par SMS ou appel aléatoire.

3. Une demande de virement Mobile Money : Aucun service officiel (banque, opérateur, administration) ne vous demande d'envoyer de l'argent via MoMo pour "débloquer" quoi que ce soit.

4. Un numéro étranger ou surtaxé : Les numéros commençant par +225, +221, +237 ou des numéros surtaxés sont souvent utilisés dans les arnaques Wangiri (raccrocher juste après que ça sonne pour vous inciter à rappeler).

5. Des fautes d'orthographe dans les SMS : Les messages de phishing contiennent souvent des erreurs et viennent de numéros génériques.

En cas de doute, consultez notre base de données sur StopArnaque Bénin avant de rappeler.`,
    contentEn: `Every day, thousands of Beninese receive fraudulent calls. Here are the 5 most common signs that should put you on guard immediately.

1. Artificial urgency: "Your account will be blocked in 1 hour", "You must pay now"... Scammers create time pressure to stop you from thinking. Hang up, verify, call the official number back.

2. An unexpected prize: You didn't enter any lottery but you "won"? It's a scam. No real lottery contacts winners by random SMS or call.

3. A Mobile Money transfer request: No official service (bank, operator, administration) will ask you to send money via MoMo to "unblock" anything.

4. A foreign or premium number: Numbers starting with +225, +221, +237 or premium numbers are often used in Wangiri scams (hanging up just after one ring to entice you to call back).

5. Spelling mistakes in SMS: Phishing messages often contain errors and come from generic numbers.

If in doubt, check our database on StopArnaque Benin before calling back.`,
    category: "Conseil",
  },
  {
    title: "Faux agents MTN et Moov : la nouvelle arnaque qui circule à Cotonou",
    titleEn: "Fake MTN and Moov agents: the new scam circulating in Cotonou",
    excerpt: "Des individus se font passer pour des techniciens MTN ou Moov et se présentent à domicile pour \"mettre à jour\" votre SIM. En réalité, ils cherchent à accéder à votre compte Mobile Money.",
    excerptEn: "Individuals are posing as MTN or Moov technicians and showing up at homes to \"update\" your SIM card. In reality, they are trying to access your Mobile Money account.",
    content: `Une nouvelle arnaque signalée à plusieurs reprises à Cotonou et dans d'autres villes du Bénin : des individus se présentent à votre domicile ou vous contactent en prétendant être des techniciens de MTN ou Moov.

Ils vous expliquent que votre SIM doit être "mise à jour" ou "migrée" vers une nouvelle version. Pour cela, ils demandent votre numéro de téléphone, votre code PIN Mobile Money, et parfois un code OTP qu'ils vous font recevoir à cet instant.

Une fois ces informations en main, ils vident votre compte Mobile Money en quelques secondes.

Rappel important : MTN et Moov NE VIENDRONT JAMAIS à votre domicile sans rendez-vous préalable pris via leurs canaux officiels. Aucun technicien légitime ne vous demandera votre code PIN ou un code OTP.

Si quelqu'un se présente comme agent et vous demande ces informations, appelez immédiatement le 123 (MTN) ou le 155 (Moov) pour vérifier. Signalez le numéro de la personne sur StopArnaque Bénin.`,
    contentEn: `A new scam reported multiple times in Cotonou and other cities in Benin: individuals show up at your home or contact you claiming to be MTN or Moov technicians.

They explain that your SIM needs to be "updated" or "migrated" to a new version. To do this, they ask for your phone number, your Mobile Money PIN, and sometimes an OTP code they cause you to receive at that moment.

Once they have this information, they empty your Mobile Money account in seconds.

Important reminder: MTN and Moov will NEVER come to your home without a prior appointment made through their official channels. No legitimate technician will ask for your PIN or OTP code.

If someone presents themselves as an agent and asks for this information, immediately call 123 (MTN) or 155 (Moov) to verify. Report the person's number on StopArnaque Benin.`,
    category: "Alerte",
  },
  {
    title: "Arnaque aux sentiments : comment les \"romance scammers\" opèrent au Bénin",
    titleEn: "Romance scam: how romance scammers operate in Benin",
    excerpt: "Des centaines de Béninois perdent des millions de FCFA chaque année à cause des arnaques romantiques en ligne. Ces escrocs sont organisés et professionnels.",
    excerptEn: "Hundreds of Beninese lose millions of FCFA every year due to online romance scams. These fraudsters are organized and professional.",
    content: `Les arnaques aux sentiments sont l'une des escroqueries les plus dévastatrices, car elles ciblent les émotions. Voici comment elles fonctionnent généralement.

Étape 1 — Le contact initial : L'arnaqueur crée un faux profil attrayant sur Facebook, Instagram ou des sites de rencontres. Il vous contacte de façon inattendue avec un message amical ou romantique.

Étape 2 — La construction de confiance : Pendant des semaines ou des mois, la relation se développe. L'arnaqueur est attentionné, vous fait des compliments, parle de projets d'avenir. Il prétend souvent être à l'étranger (médecin en mission, militaire, ingénieur sur un chantier offshore).

Étape 3 — La demande d'argent : Une "urgence" survient. Une hospitalisation, des billets d'avion pour venir vous rejoindre... Il a besoin d'argent "juste pour quelques jours". Puis une autre urgence arrive, et encore une autre.

Les signaux d'alerte : le profil est trop parfait, la personne refuse les appels vidéo, elle n'a que des photos de studio, elle vous déclare son amour très rapidement.

Si vous pensez être victime, cessez tout contact, ne transférez plus d'argent et signalez le profil sur StopArnaque Bénin.`,
    contentEn: `Romance scams are one of the most devastating frauds because they target emotions. Here is how they typically work.

Step 1 — Initial contact: The scammer creates an attractive fake profile on Facebook, Instagram or dating sites. They contact you unexpectedly with a friendly or romantic message.

Step 2 — Building trust: Over weeks or months, the relationship develops. The scammer is attentive, gives compliments, talks about future plans. They often claim to be abroad (doctor on a mission, military officer, engineer on an offshore project).

Step 3 — The money request: An "emergency" occurs. A hospitalization, plane tickets to come see you... They need money "just for a few days". Then another emergency comes, and another.

Warning signs: the profile is too perfect, the person consistently refuses video calls, they only have studio photos, they declare their love very quickly.

If you think you are a victim, stop all contact, do not transfer any more money, and report the profile on StopArnaque Benin.`,
    category: "Conseil",
  },
  {
    title: "StopArnaque Bénin : rejoignez le mouvement pour protéger notre communauté",
    titleEn: "StopArnaque Benin: join the movement to protect our community",
    excerpt: "Chaque signalement compte. En partageant les informations sur les arnaques que vous avez subies, vous protégez des milliers de Béninois.",
    excerptEn: "Every report counts. By sharing information about scams you have experienced, you are protecting thousands of Beninese people.",
    content: `StopArnaque Bénin est une plateforme citoyenne créée pour lutter contre la cybercriminalité et les arnaques téléphoniques au Bénin.

Notre mission est simple : permettre à chaque Béninois de signaler un numéro frauduleux, de vérifier si un numéro est suspect, et d'accéder à des informations pour se protéger.

Chaque signalement que vous déposez est analysé par notre équipe. Si l'arnaque est confirmée, le numéro est ajouté à notre base de données publique, accessible à tous. Votre signalement peut ainsi protéger des milliers de personnes qui pourraient être contactées par le même arnaqueur.

Comment participer ? C'est simple : si vous recevez un appel, un SMS ou un message suspect, signalez le numéro sur notre site. Partagez nos alertes sur vos réseaux sociaux.

Ensemble, nous pouvons rendre le Bénin moins vulnérable aux arnaques. La cybercriminalité prospère dans le silence. Brisons ce silence.`,
    contentEn: `StopArnaque Benin is a citizen platform created to fight cybercrime and phone scams in Benin.

Our mission is simple: to allow every Beninese person to report a fraudulent number, check if a number is suspicious, and access information to protect themselves.

Every report you submit is analyzed by our team. If the scam is confirmed, the number is added to our public database, accessible to everyone. Your report can protect thousands of people who might be contacted by the same scammer.

How to participate? It's simple: if you receive a suspicious call, SMS or message, report the number on our site. Share our alerts on your social media.

Together, we can make Benin less vulnerable to scams. Cybercrime thrives in silence. Let's break that silence.`,
    category: "Communiqué",
  },
];

async function main() {
  const admin = await prisma.user.findFirst();
  if (!admin) {
    console.error("Aucun utilisateur admin trouvé.");
    process.exit(1);
  }

  console.log(`Seeding avec l'auteur : ${admin.name}`);

  let created = 0;
  for (const data of articles) {
    const baseSlug = slugify(data.title);
    let slug = baseSlug;
    let i = 1;
    while (await prisma.article.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${i++}`;
    }

    await prisma.article.create({
      data: {
        slug,
        title: data.title,
        titleEn: data.titleEn,
        excerpt: data.excerpt,
        excerptEn: data.excerptEn,
        content: data.content,
        contentEn: data.contentEn,
        category: data.category,
        published: true,
        authorId: admin.id,
      },
    });

    console.log(`  ✓ [${data.category}] ${data.title.substring(0, 55)}...`);
    created++;
  }

  console.log(`\n${created} articles créés.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
