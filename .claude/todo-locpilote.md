# TO-DO locpilote — Liste complète

## 🔴 URGENT (bloquant)

- [ ] **Confirmer email OVH** — cliquer le lien dans `krinopro@gmail.com` avant le 2 juin 2026
- [ ] **Resend SMTP** — créer compte resend.com, vérifier domaine `locpilote.com`, configurer SMTP dans Supabase Auth → emails de confirmation fonctionnels
- [ ] **INPI** — déposer la marque "locpilote" dans les 90 jours (classe 42, ~250 €) sur inpi.fr — risque de confusion avec locpilotbyr4.fr et locpilotfr.com

---

## 🟠 IMPORTANT (à faire rapidement)

- [ ] **Microsoft Clarity** — créer compte clarity.microsoft.com, intégrer le script dans layout.tsx
- [ ] **Google Search Console** — obtenir le code de vérification (Balise HTML) → me donner le code → j'intègre en 2 min → soumettre sitemap
- [ ] **Bing Webmaster + IndexNow** — activer la clé `a7f3d9c2b8e5f1a4d6b2c9e8f7a3d5b1` sur Bing Webmaster Tools
- [ ] **Lemon Squeezy** — créer compte, créer 4 produits (Starter mensuel, Starter annuel, Pro mensuel, Pro annuel), configurer webhook, remplir les variables d'env Vercel
- [ ] **Simulateur loi Le Meur** — page `/simulateur` gratuite : calcul impact micro-BIC réformé sur la rentabilité — aimant à leads majeur avant juin 2026 (déclarations revenus 2025)

---

## 🟡 À FAIRE (produit & croissance)

- [ ] **Legal pages** — ajouter SIRET + adresse physique dans `/legal/privacy` et `/legal/terms` (quand reçu, ~4 semaines)
- [ ] **Exporter PDF contexte session** — voir si `/export` Claude Code couvre le besoin ou créer un script markdown → PDF
- [ ] **Content SEO** — articles sur : "calcul rentabilité Airbnb", "loi Le Meur impact propriétaire", "micro-BIC ou réel meublé tourisme", "tableau Excel Airbnb rentabilité"
- [ ] **Module fiscal** — calculateur micro-BIC vs régime réel LMNP (moat défendable vs concurrents étrangers)
- [ ] **Open banking PSD2** — intégration Bridge/Powens pour auto-import dépenses bancaires (différenciant fort vs Excel)
- [ ] **Programme partenaire conciergeries** — contacter 5 conciergeries (GuestReady, BnbLord, Welkeys…) pour white-label rapports propriétaires
- [ ] **Product Hunt** — préparer listing, screenshots, tagline, hunter

---

## 🔵 AMÉLIORATION PRODUIT

- [ ] **Spinner / loading** — tester que le nouveau spinner s'affiche bien sur mobile après redéploiement
- [ ] **Logo** — valider le rendu sur locpilote.com après redéploiement
- [ ] **Test emails** — une fois Resend configuré : tester inscription, confirmation, reset password
- [ ] **Test Lemon Squeezy** — une fois configuré : tester checkout, webhook, upgrade plan

---

## 🗓️ CE WEEKEND

- [ ] Confirmer email OVH
- [ ] Intégrer Microsoft Clarity
- [ ] Créer compte Lemon Squeezy
- [ ] Pousser les changements sur Vercel (`git push` depuis PC)
- [ ] **Google Calendar** — intégration synchro calendrier Google (voir prompt ci-dessous)

---

---

## 🗓️ PROMPT CLAUDE CHAT — Google Calendar

> Colle ce prompt dans claude.ai pour planifier l'intégration Google Calendar.

```
Tu es un expert Next.js 14 App Router + Supabase.

Je construis "locpilote", un SaaS de rentabilité pour les hôtes Airbnb/Booking.com.
Stack : Next.js 14 App Router, Supabase Auth + RLS, Tailwind CSS, Vercel.

Actuellement, les hôtes synchronisent leurs réservations via iCal (URL en lecture seule).
Je veux ajouter une intégration Google Calendar pour :
1. Lire les réservations depuis un calendrier Google (lecture seule, via OAuth)
2. Optionnellement : écrire les réservations locpilote dans un calendrier Google

Contexte technique :
- Les réservations sont des objets { uid, summary, start, end, source } stockés localement
- Les biens (Property) ont déjà airbnbUrl, bookingUrl, airbnbBookings, bookingBookings
- Auth gérée par Supabase (pas de NextAuth)
- Pas de base de données SQL propre, données stockées via Supabase Realtime/localStorage

Questions :
1. Quelle est la meilleure approche pour Google Calendar OAuth avec Supabase Auth (provider Google ou OAuth séparé) ?
2. Quels fichiers créer/modifier ? (route API, composant ICalImport, types)
3. Faut-il Google Calendar API v3 ou une lib ?
4. Comment gérer le refresh token en production sur Vercel ?
5. Plan d'implémentation étape par étape.

Donne-moi un plan détaillé avant d'écrire du code.
```

---

## 📌 RAPPELS STRATÉGIQUES (veille concurrentielle)

- Le vrai concurrent c'est **Excel**, pas Smoobu/Lodgify → messaging "Arrêtez votre tableur"
- **Superhote V2** est la menace principale — aller vite sur le module fiscal
- Pricing actuel : 1 bien gratuit, Starter 2-3 biens, Pro 4-10 biens ✅
- **800 000 hôtes Airbnb en France** — TAM énorme, catégorie quasi-vide
- Simulateur loi Le Meur = opportunité de devenir la référence SEO avant juin 2026
