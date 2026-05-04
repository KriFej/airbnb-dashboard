# CLAUDE.md — locpilote

## Règles absolues

- Répondre en français, phrases courtes, zéro mot compliqué inutile
- **AVANT chaque estimation** : lire `.claude/leconhorloge.md`
- **DÉBUT de chaque tâche** : `.claude/chrono.sh start "nom tâche"`
- **FIN de chaque tâche** : `.claude/chrono.sh stop "nom tâche" "estimation_min"`
- **APRÈS chaque modification** : mettre à jour ce fichier (todo, structure) et commiter
- **TOUJOURS** conclure : `⏱ Réel : Xm Xs — Estimé : X-Y min`

## Slash commands
- `/topo` — état du projet, ce qui reste à faire
- `/estimation` — estimation de temps pour une tâche
- `/sync-md` — met à jour et commite CLAUDE.md

## Stack technique

- Next.js 14 App Router
- Supabase Auth + RLS
- Tailwind CSS — light mode (`bg: #EEF2FF`, `brand-500: #6366F1` indigo)
- Lemon Squeezy (paiements)
- Vercel (déploiement)
- Resend (emails)

## Système de design v2 (light-first)

### Tokens couleurs
| Token | Valeur | Usage |
|---|---|---|
| `bg` | `#EEF2FF` | Fond global lavande |
| `surface` | `#F5F7FF` | Fond secondaire |
| `card` | `#FFFFFF` | Toujours `bg-white` sur les cards |
| `border` | `#E2E8F0` | Bordures |
| `fg` | `#0F172A` | Texte principal |
| `muted` | `#64748B` | Texte secondaire |
| `dim` | `#94A3B8` | Texte tertiaire |
| `brand-500` | `#6366F1` | Indigo — boutons, accents |
| `brand-600` | `#4F46E5` | Hover indigo |
| `brand-50` | `#EEF2FF` | Fond teinté indigo clair |
| `brand-200` | `#C7D2FE` | Bordure indigo |
| `positive-500` | `#22C55E` | Vert — uniquement deltas positifs |

### Règles UI
- Cards : `bg-white border border-border shadow-card rounded-2xl`
- Bouton primaire : `bg-slate-900 text-white hover:bg-slate-700`
- Bouton action : `bg-brand-500 text-white hover:bg-brand-600` (jamais `text-black`)
- Delta positif : `text-positive-500` | Delta négatif : `text-red-500`
- Fond teinté : `bg-brand-50 border-brand-200 text-brand-600`

## Structure clés

### Landing (`src/components/landing/`)
- `Nav.tsx` — sticky `bg-white/90`, liens : Comment ça marche / Fonctionnalités / Tarifs
- `Hero.tsx` — centré, H1 "vos vrais chiffres" en `text-brand-500`, CTA → `#how-it-works`
- `HowItWorks.tsx` — 3 étapes zigzag + CTA
- `StatsGrid.tsx` — 2 stats : "0 €" frais cachés + "2 min" mise en route
- `FeaturesGrid.tsx` — 6 features + CTA
- `FeatureSplit.tsx` — benefits + bannière indigo
- `Pricing.tsx` — 4 plans, featured indigo, Gratuit sans iCal
- `FAQ.tsx` — accordéon + CTA
- `FinalCTA.tsx` — `bg-brand-50 border-brand-200`
- `Footer.tsx` — sans newsletter

### Dashboard (`src/components/dashboard/`)
- `Sidebar.tsx` — `bg-white border-r`, item actif `border rounded-xl`
- `Topbar.tsx` — `bg-white border-b`, period picker + Search + Bell
- `KpiCard.tsx` — `bg-white shadow-card`, delta vert/rouge
- `ICalImport.tsx` — sync iCal, verrouillé plan Gratuit
- `InputsPanel.tsx` — revenus / charges / frais / rentabilité

### UI (`src/components/ui/`)
- `Button.tsx` — `primary` (slate-900), `secondary` (white border), `ghost`
- `BarChart.tsx` / `Sparkline.tsx` — couleur `#6366F1`
- `Logo.tsx` — "loc" (fg) + "pilote" (brand-500), sans icône

### Logique métier (ne pas toucher)
- `src/lib/calc.ts` — KPIs : brut, frais, dépenses, net, prévision, rendement
- `src/lib/plan.ts` — limites : Gratuit=1, Starter=3, Pro=10, Unlimited=∞
- `src/hooks/useAuth.ts` — signup/login/logout Supabase
- `src/hooks/usePlan.ts` — lit table `subscriptions`
- `src/hooks/useProperties.ts` — CRUD biens, sync Supabase + cache localStorage

## Architecture — flux complet

```
Prospect → Landing → /signup
  → Supabase Auth → email confirmation (Resend SMTP)
  → /dashboard
    → useProperties : biens depuis Supabase (cache localStorage)
    → InputsPanel : revenus / charges / frais
    → ICalImport → /api/ical (proxy whitelist) → parse .ics → Supabase
    → calc.ts : KPIs temps réel → KpiCard
    → Upgrade → /api/checkout → Lemon Squeezy (user_id en custom_data)
      → Paiement → webhook /api/webhooks/lemonsqueezy
        → vérif HMAC → upsert table subscriptions → plan débloqué
```

### Tables Supabase
| Table | Contenu |
|---|---|
| `properties` | Biens, inputs, URLs iCal, réservations |
| `subscriptions` | Plan actif par user_id (mis à jour par webhook LS) |

## Todo restant

### Code (Claude)
- [ ] Templates emails welcome/notif — mettre à jour dark→light/indigo
- [ ] Décider : remettre `/simulateur` dans le nav ou SEO uniquement

### Config Vercel (toi) — par ordre de priorité
- [ ] `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY` — **bloquant**
- [ ] Nom de domaine → DNS Vercel
- [ ] `RESEND_API_KEY` + `OWNER_EMAIL`
- [ ] Supabase SMTP → Resend (host: smtp.resend.com, port: 465, user: resend)
- [ ] `LEMONSQUEEZY_WEBHOOK_SECRET`
- [ ] `LEMONSQUEEZY_CHECKOUT_*` et `LEMONSQUEEZY_VARIANT_*`
- [ ] `NEXT_PUBLIC_CLARITY_ID`
- [ ] `NEXT_PUBLIC_GA_ID`
- [ ] `NEXT_PUBLIC_GOOGLE_VERIFICATION`

### Stratégie & croissance (toi)
- [ ] INPI — déposer marque "locpilote" (classe 42, ~250 €) dans les 90 jours
- [ ] Legal — ajouter SIRET + adresse dans `/legal/privacy` et `/legal/terms`
- [ ] SEO — articles : "calcul rentabilité Airbnb", "loi Le Meur impact", "micro-BIC vs réel LMNP"
- [ ] Product Hunt — préparer listing

## Rappels permanents
- Branche active : `claude/locpilote-progress-8FxX7`
- Email support : `hello@locpilote.com`
- Concurrent principal : **Excel** (pas Smoobu/Lodgify)
- TAM : 800 000 hôtes Airbnb en France
