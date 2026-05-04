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
- `Nav.tsx` — sticky `bg-white/90`, liens : Comment ça marche / Fonctionnalités / Tarifs
- `Hero.tsx` — centré, H1 "vos vrais chiffres" en `text-brand-500`, CTA secondaire → `#how-it-works`
- `HowItWorks.tsx` — 3 étapes zigzag + CTA
- `FeatureSplit.tsx` — centré, benefits liste, bannière indigo sans stat fausse
- `StatsGrid.tsx` — 2 stats : "0 €" frais cachés + "2 min" mise en route
- `FeaturesGrid.tsx` — grille 6 features + CTA bas de section
- `Pricing.tsx` — 4 plans, featured indigo, plan Gratuit sans iCal (Starter+)
- `FAQ.tsx` — accordéon + CTA bas de section
- `FinalCTA.tsx` — `bg-brand-50 border-brand-200`, propre
- `Footer.tsx` — sans newsletter, liens légaux

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
- `Logo.tsx` — texte seul : "loc" (fg) + "pilote" (brand-500), pas d'icône

#### Logique métier (ne pas toucher)
- `src/lib/calc.ts` — calculs KPI
- `src/lib/types.ts` — types TypeScript
- `src/lib/plan.ts` — limites par plan (Gratuit=1, Starter=3, Pro=10, Unlimited=∞)
- `src/hooks/useAuth.ts` — signup/login/logout via Supabase Auth
- `src/hooks/usePlan.ts` — lit table `subscriptions` → plan actif
- `src/hooks/useProperties.ts` — CRUD biens, sync Supabase + cache localStorage
- `src/app/api/ical/` — proxy serveur pour fetcher les URLs iCal (CORS)
- `src/app/api/checkout/` — redirige vers Lemon Squeezy avec user_id
- `src/app/api/webhooks/lemonsqueezy/` — reçoit les événements paiement, met à jour `subscriptions`
- `src/app/api/notify/signup/` — envoie email bienvenue (Resend) + notif propriétaire

## Architecture — flux complet

```
Prospect → Landing → /signup
  → Supabase Auth (email confirmation)
  → Dashboard (/dashboard)
    → useProperties charge biens depuis Supabase (cache localStorage)
    → InputsPanel : revenus / charges / frais plateforme
    → ICalImport → /api/ical (proxy) → parse .ics → bookings dans Supabase
    → calc.ts : bénéfice net, rendement, prévision → KpiCard affiche
    → Bouton upgrade → /api/checkout?plan=starter
      → Lemon Squeezy (checkout avec user_id en custom_data)
      → Paiement OK → webhook POST /api/webhooks/lemonsqueezy
        → vérifie signature HMAC → upsert table `subscriptions`
        → usePlan re-lit → nouveau plan actif → UI débloquée
```

### Tables Supabase
| Table | Contenu |
|---|---|
| `properties` | Biens de l'utilisateur (inputs, URLs iCal, réservations) |
| `subscriptions` | Plan actif par user_id (mis à jour par webhook LS) |

### Sécurité
- RLS Supabase : chaque user ne voit que ses propres lignes
- iCal proxy : whitelist de domaines autorisés (Airbnb, Booking, etc.)
- Webhook LS : vérification signature HMAC SHA-256
- Rate limiting sur toutes les routes API

## Rappels permanents

- Branche de dev active : `claude/locpilote-progress-8FxX7`
- Email support : `hello@locpilote.com`
- IndexNow key : `a7f3d9c2b8e5f1a4d6b2c9e8f7a3d5b1`

## Todo restant

### Code (à faire)
- [x] OG image — mise à jour branding v2 ✅
- [ ] Templates emails welcome/notif — mettre à jour dark→light/indigo
- [ ] Décider : remettre `/simulateur` dans le nav ou laisser SEO uniquement

### Config Vercel (user) — dans l'ordre de priorité
- [ ] `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY` — **bloquant** (cause "Failed to fetch")
- [ ] Nom de domaine → DNS Vercel (records A/CNAME indiqués dans Vercel → Domains)
- [ ] `RESEND_API_KEY` + `OWNER_EMAIL` — emails welcome + notif propriétaire
- [ ] Supabase → Settings → Auth → SMTP → activer Resend SMTP (host: smtp.resend.com, port: 465, user: resend, password: RESEND_API_KEY)
- [ ] `LEMONSQUEEZY_WEBHOOK_SECRET` — LS → Settings → Webhooks → Signing Secret
- [ ] `LEMONSQUEEZY_CHECKOUT_STARTER` / `_STARTER_ANNUAL` / `_PRO` / `_PRO_ANNUAL` — URLs checkout LS
- [ ] `LEMONSQUEEZY_VARIANT_STARTER` / `_STARTER_ANNUAL` / `_PRO` / `_PRO_ANNUAL` — IDs numériques variantes LS
- [ ] `NEXT_PUBLIC_CLARITY_ID` — clarity.microsoft.com → New project → copier l'ID
- [ ] `NEXT_PUBLIC_GA_ID` — analytics.google.com → Measurement ID (G-XXXXXXXX)
- [ ] `NEXT_PUBLIC_GOOGLE_VERIFICATION` — Search Console → Balise HTML → valeur content=""
- [ ] `MAKE_WEBHOOK_URL` — optionnel, Make.com pour Google Sheets
