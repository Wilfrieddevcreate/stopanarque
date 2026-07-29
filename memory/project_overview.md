---
name: stopanarque-overview
description: Vue d'ensemble du projet StopArnaque Bénin — stack, fonctionnalités, structure
metadata:
  type: project
---

Plateforme anti-arnaque béninoise permettant aux citoyens de signaler des numéros frauduleux, de rechercher un suspect et de suivre leur dossier.

**Why:** Lutter contre la cybercriminalité et les arnaques téléphoniques au Bénin (Mobile Money, phishing, sextorsion, etc.)

**How to apply:** Référence complète pour toute décision d'architecture ou d'ajout de fonctionnalité sur ce projet.

---

## Stack

- **Framework**: Next.js 16.2.1 (App Router) — version avec breaking changes, lire `node_modules/next/dist/docs/` avant d'écrire du code
- **React**: 19.2.4
- **TypeScript** + **Tailwind CSS v4** (@tailwindcss/postcss)
- **ORM**: Prisma 7 avec SQLite (`prisma/dev.db`) et adapter libsql
- **Animations**: Framer Motion 12
- **Charts**: Recharts
- **Alertes UI**: SweetAlert2
- **Auth**: bcryptjs (hashage), sessions JWT en cookie

## Structure

```
app/
  page.tsx          → Landing page publique (Hero, stats, FAQ, CTA)
  signaler/         → Formulaire 2 étapes pour signaler une arnaque
  rechercher/       → Recherche d'un numéro suspect
  suivi/            → Suivi d'un dossier par code de tracking
  conseils/         → Conseils anti-arnaque
  statistiques/     → Statistiques publiques (Recharts)
  offline/          → Page offline PWA
  admin/            → Dashboard admin (auth requise)
  api/
    reports/        → POST (créer signalement), GET public
    admin/reports   → GET/PATCH (gestion admin, pagination cursor)
    admin/suspect-profile → profil enrichi d'un suspect
    admin/export    → CSV export
    auth/           → DELETE (logout), POST (login)
    alerts/         → Bannière d'alerte
    search/         → Recherche publique
    statistics/     → Stats publiques
    tracking/       → Suivi par code
    visits/         → Statistiques de trafic (admin)

components/
  statistics/       → DailyVisitsChart, MonthlyReportsChart, PlatformsChart, ScamTypesChart, StatCard, TopNumbersTable

lib/
  auth.ts           → JWT session management
  dedup.ts          → Détection de doublons
  enrichment.ts     → Enrichissement profil suspect (opérateur, liens d'investigation, modus operandi)
  i18n/             → Système i18n custom (context, translations, advice, data-labels, locale-store)
  prisma.ts         → Instance Prisma singleton
  rate-limit.ts     → Rate limiting custom (table RateLimit en DB)
  statistics.ts     → Calculs statistiques
  tracking.ts       → Gestion des codes de suivi
  types.ts          → SCAM_TYPES, PLATFORMS, REPORT_STATUSES, getRiskLevel
```

## Modèles Prisma

- `User` — admins (email, password, name, role)
- `Report` — signalements (trackingCode, phoneNumber, scamType, status, evidences, actions)
- `Evidence` — preuves fichiers liées à un Report
- `AdminAction` — historique des actions admin sur un Report
- `RateLimit` — limitation de débit par IP/identifiant
- `PageVisit` — tracking des visites par page

## Fonctionnalités clés

### Public
- Formulaire de signalement 2 étapes avec upload de preuves (images/PDF), drag & drop
- Recherche de numéro (niveau de risque: faible/moyen/élevé selon count)
- Suivi par code de tracking unique
- Page statistiques publique avec graphiques
- Conseils de sécurité i18n (fr/fon/yoruba probablement)
- PWA (manifest, service worker `/public/sw.js`, offline page)
- JSON-LD SEO (Organization + Website)
- VisitTracker (tracking anonyme des pages visitées)

### Admin (`/admin`, protégé par session)
- Dashboard : stats cards, liste paginée (cursor-based), scroll infini
- Filtres : statut, type d'arnaque, plateforme, recherche texte
- Tri : récent / plus signalés
- Détail signalement avec preuves et historique d'actions
- Profil suspect enrichi (risque 0-100, modus operandi, opérateur télécom, pistes d'investigation, numéros liés, timeline)
- Actions : mettre en analyse / confirmer arnaque / rejeter
- Export CSV
- Statistiques de trafic (visites totales, aujourd'hui, sparkline 7j, pages populaires)
- Numéros récurrents (signalés ≥2 fois)

## Variables d'env importantes
- `NEXT_PUBLIC_SITE_URL` → URL du site (défaut: https://stopanarque.bj)
