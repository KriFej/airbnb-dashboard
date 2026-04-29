# Supabase — setup locpilote

## 1. Appliquer le schéma

Dans ton projet Supabase :

1. Ouvre **SQL Editor** (icône `</>` dans la sidebar).
2. Crée une nouvelle query, colle le contenu de `supabase/schema.sql`.
3. Clique **Run**.

Tu devrais voir `Success. No rows returned`. Les tables `properties`
et `subscriptions` apparaissent dans **Table Editor**.

## 2. Variables d'environnement

Copie `.env.local.example` en `.env.local` et renseigne toutes les valeurs.

### Supabase (obligatoire)

Sous **Project Settings → API** :

| Variable | Où la trouver |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | *Project URL* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé *publishable* (`sb_publishable_…`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé *secret* (`sb_secret_…`) — serveur uniquement |

### Lemon Squeezy (paiements)

1. Créer 4 produits/variants dans le dashboard LS (Starter mensuel, Starter annuel, Pro mensuel, Pro annuel).
2. Renseigner les URLs de checkout (`LEMONSQUEEZY_CHECKOUT_*`).
3. Renseigner les IDs numériques des variants (`LEMONSQUEEZY_VARIANT_*`).
4. Créer un webhook LS → `https://ton-domaine.com/api/webhooks/lemonsqueezy` et copier le Signing Secret dans `LEMONSQUEEZY_WEBHOOK_SECRET`.
5. Dans le champ "Custom data" du checkout, passer `user_id` (l'UUID Supabase de l'utilisateur connecté).

### Resend (emails transactionnels)

1. Créer un compte sur resend.com.
2. Vérifier le domaine `locpilote.com`.
3. Créer une API Key et la mettre dans `RESEND_API_KEY`.
4. Dans Supabase → **Auth → SMTP Settings**, configurer :
   - Host : `smtp.resend.com`
   - Port : `465`
   - User : `resend`
   - Password : ta clé API Resend

### Emails Supabase — templates personnalisés

Les templates HTML sont dans `supabase/email-templates/`. Pour les activer :

1. Supabase → **Auth → Email Templates**
2. Coller le contenu de chaque fichier HTML dans le template correspondant.
3. Vérifier que l'URL de redirection pour le reset est `https://ton-domaine.com/auth/reset`.

## 3. Sur Vercel

Ajouter **toutes** les variables de `.env.local.example` dans :
**Project → Settings → Environment Variables** (Production + Preview).

## 4. Sécurité — RLS

Toutes les tables sont protégées par Row Level Security :

- `properties` : l'utilisateur authentifié n'accède qu'à ses propres biens.
- `subscriptions` : lecture seule côté client. Les mutations passent par
  le webhook Lemon Squeezy avec la clé service role (qui bypass RLS).

Cela verrouille la vulnérabilité `/success?plan=unlimited` : même en
appelant l'API Supabase directement, un utilisateur ne peut pas
insérer/modifier sa ligne `subscriptions`.
