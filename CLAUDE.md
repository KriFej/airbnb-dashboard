# CLAUDE.md — locpilote

## Règles absolues

- Répondre en français, phrases courtes, zéro mot compliqué inutile
- Toujours donner une estimation de temps avant chaque tâche (fourchette basse/haute)
- **AVANT chaque estimation : lire `.claude/leconhorloge.md`** pour ne pas répéter les erreurs passées
- **DÉBUT de chaque tâche** : lancer `.claude/chrono.sh start "nom tâche"`
- **FIN de chaque tâche** : lancer `.claude/chrono.sh stop "nom tâche" "estimation_min"`
- Si écart > 2 min : automatiquement loggé dans `leconhorloge.md`
- **TOUJOURS** conclure en affichant : `⏱ Réel : Xm Xs — Estimé : X-Y min`

## Stack technique

- Next.js 14 App Router
- Supabase Auth + RLS
- Tailwind CSS — **light mode** (bg lavande `#EEF2FF`, brand-500 = `#6366F1` indigo)
- Lemon Squeezy (paiements)
- Vercel (déploiement)
- Resend (emails — à configurer)

## Système de design v2 (light-first)

### Tokens couleurs clés
| Token | Valeur | Usage |
|---|---|---|
| `bg` | `#EEF2FF` | Fond global (lavande) |
| `surface` | `#F5F7FF` | Fond secondaire |
| `card` | `#FFFFFF` | Toujours `bg-white` sur les cards |
| `border` | `#E2E8F0` | Bordures subtiles |
| `fg` | `#0F172A` | Texte principal |
| `muted` | `#64748B` | Texte secondaire |
| `dim` | `#94A3B8` | Texte tertiaire |
| `brand-500` | `#6366F1` | Indigo primaire — boutons, accents |
| `brand-600` | `#4F46E5` | Hover indigo |
| `brand-50` | `#EEF2FF` | Fond teinté indigo clair |
| `brand-100` | `#E0E7FF` | Fond teinté indigo moyen |
| `brand-200` | `#C7D2FE` | Bordure teinté indigo |
| `positive-500` | `#22C55E` | Vert — **uniquement** pour deltas positifs (+%) |

### Règles UI impératives
- Cards : toujours `bg-white border border-border shadow-card rounded-2xl`
- Bouton primaire : `bg-slate-900 text-white hover:bg-slate-700` (noir, pas indigo)
- Bouton action (brand) : `bg-brand-500 text-white hover:bg-brand-600` (**jamais** `text-black`)
- Delta positif : `text-positive-500` (#22C55E vert)
- Delta négatif : `text-red-500`
- Fond teinté indigo : `bg-brand-50 border-brand-200 text-brand-600` (pas `brand-500/10`)
- Glow/shadow indigo : `rgba(99,102,241,…)` (jamais `rgba(34,197,94,…)` vert)
- Ombres : `shadow-card` (subtil) ou `shadow-card-md` (hover)

### Thème sombre
Géré via `[data-theme="dark"]` dans `globals.css`. Le ThemeProvider est conservé.

## Structure clés

### Landing (`src/components/landing/`)
- `Nav.tsx` — barre de navigation sticky, `bg-white/90 backdrop-blur-xl`
- `Hero.tsx` — H1 "en 30 secondes" en `text-brand-500`, floating card
- `ProductMockup.tsx` — aperçu UI light (sidebar blanche, chrome navigateur)
- `FeaturesGrid.tsx` — grille 6 features, card accent indigo `text-white`
- `StatsGrid.tsx` — 3 stats, card indigo `text-white`
- `HowItWorks.tsx` — 3 étapes zigzag, step numbers clamp responsive
- `Pricing.tsx` — 4 plans (`lg:grid-cols-4`), featured card indigo `text-white`
- `FinalCTA.tsx` — CTA final, glow indigo
- `Footer.tsx` — newsletter, liens légaux

### Dashboard (`src/components/dashboard/`)
- `Sidebar.tsx` — `bg-white border-r border-border`, item actif `border rounded-xl`
- `Topbar.tsx` — `bg-white border-b`, period picker + Search + Bell + Upgrade
- `KpiCard.tsx` — `bg-white shadow-card`, delta `text-positive-500` ou `text-red-500`
- `PropertyList.tsx` — grille `md:grid-cols-2 xl:grid-cols-3`
- `BookingsList.tsx` — `bg-white`, badges source `bg-brand-50 text-brand-600`
- `BookingsCalendar.tsx` — `bg-white`, jours réservés `bg-brand-50 border-brand-200`
- `ICalImport.tsx` — `bg-white`, bouton sync `text-white hover:bg-brand-600`
- `InputsPanel.tsx` — `bg-white`, card rentabilité nette `bg-brand-50 border-brand-200`

### UI (`src/components/ui/`)
- `Button.tsx` — variants : `primary` (slate-900), `secondary` (white border), `ghost`
- `BarChart.tsx` — couleur défaut `#6366F1`, barre inactive `#C7D2FE`
- `Sparkline.tsx` — couleur défaut `#6366F1`
- `Logo.tsx` — icône Zap indigo + "loc" (fg) + "pilote" (brand-500)

### Logique métier (ne pas toucher)
- `src/lib/calc.ts` — calculs KPI
- `src/lib/types.ts` — types TypeScript
- `src/lib/plan.ts` — limites par plan
- `src/hooks/` — useAuth, usePlan, useProperties
- `src/app/api/` — routes API

## Rappels permanents

- Branche de dev active : `claude/locpilote-progress-8FxX7`
- Email support : `hello@locpilote.com`
- IndexNow key : `a7f3d9c2b8e5f1a4d6b2c9e8f7a3d5b1`
