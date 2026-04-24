# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at http://localhost:3000
npm run build    # production build (type-checks via tsc)
npm run start    # serve the production build
npm run lint     # Next.js ESLint
```

There is no test suite. TypeScript compilation (`next build`) is the primary correctness gate.

## Architecture

**locpilote** is a SaaS dashboard for Airbnb/Booking.com hosts to track net profit. The app has two surfaces:

- `/` — marketing landing page (no auth required)
- `/dashboard` — the main app (auth-gated via Next.js middleware)

### Auth & data layer

Authentication is handled by Supabase. Two client factories exist:
- `src/lib/supabase/client.ts` — browser-side (`createBrowserClient`)
- `src/lib/supabase/server.ts` — server-side / middleware (`createServerClient` with cookie handling)

`src/middleware.ts` runs on every request: redirects unauthenticated users away from `/dashboard` to `/login`, and redirects logged-in users away from `/login`/`/signup` to `/dashboard`.

### State management via hooks

All dashboard state lives in three hooks consumed by `src/app/dashboard/page.tsx`:

| Hook | Purpose |
|---|---|
| `useAuth` | Supabase auth session, exposes `userId`, `email`, `signup`, `login`, `logout`, `deleteAccount` |
| `usePlan` | Reads `subscriptions` table; caches plan in `localStorage` under key `locpilote:plan:{email}` |
| `useProperties` | Reads/writes `properties` table; debounces Supabase upserts by 800 ms; caches in `localStorage` under `locpilote:properties:{email}` |

`useProperties` handles **legacy migration**: if Supabase has no rows but `localStorage` has old single-property data (keys `locpilote:inputs`, `locpilote:ical-*`, etc.), it inserts those into Supabase and clears the legacy keys.

### Plan & property limits

Defined in `src/lib/plan.ts`:

| Plan | Max properties | iCal access |
|---|---|---|
| Free (null) | 1 | No |
| Starter | 2 | Yes |
| Pro | 10 | Yes |
| Unlimited | ∞ | Yes |

The `subscriptions` table is the source of truth and is **only written by the LemonSqueezy webhook** (`/api/webhooks/lemonsqueezy`), never by the client. The checkout flow (`/api/checkout`) injects `user_id` into the LemonSqueezy checkout URL as custom data, which the webhook uses to associate the subscription with the Supabase user.

### KPI calculations

`src/lib/calc.ts` contains all financial math:
- `computeKpis(inputs)` → derives `grossRevenue`, `platformFees`, `totalExpenses`, `netProfit`, `feesLostPct`, `forecast`
- `computeAggregateKpis(properties[])` → sums across all properties
- `forecast` = current net profit + expected net from future bookings (using weighted avg fee %)
- Currencies formatted as Euro (`fr-FR` locale)

### iCal sync

`src/lib/ical.ts` → `fetchICal(url)` tries a direct client-side fetch first, then falls back to the server-side proxy `/api/ical` to avoid CORS. The proxy (`src/app/api/ical/route.ts`) enforces an allowlist of known hosts (Airbnb, Booking.com, Vrbo, Google Calendar, etc.) and a 20 req/min rate limit per IP.

`parseICS(text, forceSource?)` extracts `VEVENT` blocks and normalises both all-day (`YYYYMMDD`) and timestamped (`YYYYMMDDTHHMMSSZ`) date formats to `yyyy-MM-dd` ISO strings. The `DTEND` is exclusive per the iCal spec.

### API routes

| Route | Method | Purpose |
|---|---|---|
| `/api/ical` | GET | Server-side CORS proxy for iCal feeds |
| `/api/checkout` | GET | Redirects to LemonSqueezy checkout with `user_id` injected |
| `/api/webhooks/lemonsqueezy` | POST | Handles subscription lifecycle; verifies HMAC-SHA256 signature; upserts `subscriptions` table via service-role client |
| `/api/notify/signup` | POST | Notifies owner via Resend on new signup; optionally pings Make.com webhook |
| `/api/account/delete` | DELETE | Deletes the user via service-role client |

Rate limiting (`src/lib/rateLimit.ts`) is in-memory with a `Map`; it resets on process restart (not suitable for multi-instance deployments without modification).

### Design system

Pure dark theme. All color tokens are in `tailwind.config.ts → theme.extend.colors` and `src/app/globals.css`:

- Accent: `brand-500` = `#22C55E` (green)
- Backgrounds: `bg` (#000), `surface` (#0A0A0A), `card` (#111)
- Borders: `border` (#1F1F1F), `border-hover` (#2A2A2A)
- Text: `muted` (#A1A1AA), `dim` (#71717A)
- Utilities: `shadow-glow`, `bg-grid-pattern`, `bg-radial-green` for decorative effects

### Database schema

Apply `supabase/schema.sql` in the Supabase SQL editor to provision tables. It is idempotent. Two tables:
- `properties` — per-user property records with `inputs` (JSONB), iCal URLs, and cached booking arrays
- `subscriptions` — one row per user, written only by the webhook service-role client; RLS prevents client writes

### Environment variables

Copy `.env.local.example` to `.env.local`. Required for local dev:
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public Supabase credentials
- `SUPABASE_SERVICE_ROLE_KEY` — server-only, used by webhook and account-delete routes
- `LEMONSQUEEZY_WEBHOOK_SECRET` — HMAC secret for webhook verification
- `LEMONSQUEEZY_VARIANT_*` and `LEMONSQUEEZY_CHECKOUT_*` — variant IDs and checkout URLs per plan/billing period
