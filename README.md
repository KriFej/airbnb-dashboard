# locpilote

Tableau de bord de rentabilité pour les hôtes Airbnb & Booking.com.  
Bénéfice net réel, synchronisation iCal, gestion multi-biens, abonnements.

## Stack

- **Next.js 14** App Router
- **Supabase** Auth + RLS (tables : `properties`, `subscriptions`)
- **Tailwind CSS** — light mode, tokens indigo (`#6366F1`)
- **Lemon Squeezy** — paiements & abonnements
- **Resend** — emails transactionnels
- **Vercel** — déploiement

## Démarrage local

```bash
cp .env.local.example .env.local   # puis remplir les valeurs
npm install
npm run dev
```

- `http://localhost:3000` — landing
- `http://localhost:3000/dashboard` — tableau de bord

## Setup Supabase

Voir `supabase/README.md`.

## Variables d'environnement

Voir `.env.local` (toutes les variables sont documentées avec leur source).

## Structure

```
src/
├── app/
│   ├── page.tsx                  # landing
│   ├── dashboard/page.tsx        # tableau de bord
│   ├── api/
│   │   ├── ical/                 # proxy fetch iCal (whitelist domaines)
│   │   ├── checkout/             # redirect Lemon Squeezy
│   │   ├── webhooks/lemonsqueezy/# mise à jour plan après paiement
│   │   └── notify/signup/        # email bienvenue + notif propriétaire
│   └── simulateur/               # calculateur loi Le Meur 2025 (SEO)
├── components/
│   ├── landing/                  # Nav, Hero, HowItWorks, Pricing, FAQ…
│   ├── dashboard/                # Sidebar, KpiCard, ICalImport…
│   └── ui/                       # Button, Input, Logo, BarChart…
└── lib/
    ├── calc.ts                   # calculs KPI (bénéfice net, rendement)
    ├── ical.ts                   # parse fichiers .ics
    ├── plan.ts                   # limites par plan
    └── types.ts                  # types TypeScript
```

## Plans

| Plan | Biens | iCal | Prix |
|---|---|---|---|
| Gratuit | 1 | — | 0 € |
| Starter | 3 | ✓ | 9,90 €/mois |
| Pro | 10 | ✓ | 19,90 €/mois |
| Unlimited | ∞ | ✓ | Sur devis |
