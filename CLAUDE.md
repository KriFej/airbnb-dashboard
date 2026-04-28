# CLAUDE.md — locpilote

## Règles absolues

- Répondre en français, phrases courtes, zéro mot compliqué inutile
- Toujours donner une estimation de temps avant chaque tâche (fourchette basse/haute)
- **AVANT chaque estimation : lire `.claude/leconhorloge.md`** pour ne pas répéter les erreurs passées
- Si l'estimation était fausse après la tâche : logger dans `.claude/leconhorloge.md`

## Stack technique

- Next.js 14 App Router
- Supabase Auth + RLS
- Tailwind CSS (dark theme, brand-500 = #22C55E)
- Lemon Squeezy (paiements)
- Vercel (déploiement)
- Resend (emails — à configurer)

## Structure clés

- Landing : `src/components/landing/`
- Dashboard : `src/app/dashboard/`
- Auth : `src/components/auth/`, `src/hooks/useAuth.ts`
- Plans/limites : `src/lib/plan.ts`
- API : `src/app/api/`

## Rappels permanents

- Branche de dev : `claude/saas-app-nextjs-m3T5M`
- Email support : `hello@locpilote.com`
- IndexNow key : `a7f3d9c2b8e5f1a4d6b2c9e8f7a3d5b1`
