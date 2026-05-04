# Supabase — setup locpilote

## 1. Appliquer le schéma

1. Ouvre **SQL Editor** dans ton projet Supabase
2. Colle le contenu de `supabase/schema.sql`
3. Clique **Run** → `Success. No rows returned`

Les tables `properties` et `subscriptions` apparaissent dans Table Editor.

## 2. Variables d'environnement

Dans **Project Settings → API** :

| Variable | Source |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé `sb_publishable_…` |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé `sb_secret_…` (serveur uniquement) |

Ajoute les 3 dans Vercel → Project → Settings → Environment Variables.

## 3. SMTP — Resend (enlève la limite 3 emails/h)

Dans Supabase → **Settings → Authentication → SMTP** :

| Champ | Valeur |
|---|---|
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | ta `RESEND_API_KEY` |
| Sender email | `hello@locpilote.com` |
| Sender name | `locpilote` |

## 4. Sécurité — RLS

- `properties` : chaque utilisateur ne voit que ses propres biens
- `subscriptions` : lecture seule côté client — les mutations passent uniquement par le webhook Lemon Squeezy avec la clé service role (bypass RLS sécurisé)
