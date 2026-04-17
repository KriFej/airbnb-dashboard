# Profitly — Airbnb Net Profit Dashboard

A modern, dark-mode SaaS dashboard for Airbnb & Booking.com hosts who want to
see their **real net profit** after platform fees and operating expenses.

- Landing marketing page at `/`
- App dashboard at `/dashboard` with KPIs, expense inputs, iCal sync and a
  visual bookings calendar
- No backend — every value persists in `localStorage`
- iCal fetch with `api.allorigins.win` CORS proxy fallback

Stack: **Next.js 14 (App Router) · TypeScript · Tailwind CSS · lucide-react · date-fns**.

---

## Quick start

```bash
npm install
npm run dev
```

Open:
- http://localhost:3000 — landing
- http://localhost:3000/dashboard — the app

Build for production:

```bash
npm run build
npm run start
```

---

## How to use the dashboard

1. Click **Open Dashboard** from the landing.
2. Fill your **revenues** (Airbnb, Booking.com, future stays).
3. Fill your **expenses** (mortgage, electricity, water, internet, cleaning).
4. Set your **platform fees** (`14%` Airbnb default, `15%` Booking).
5. Paste your **iCal URL** (Airbnb → Calendar → Availability → Export) and
   click **Sync** — your bookings appear in the calendar and the list.

All inputs save automatically. Reload and they're still there.

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx        # Inter font + SEO metadata
│   ├── globals.css       # dark theme + grid/glow utilities
│   ├── page.tsx          # landing
│   └── dashboard/page.tsx
├── components/
│   ├── landing/          # Nav, Hero, ProductMockup, FAQ, …
│   ├── dashboard/        # Sidebar, KpiCard, ICalImport, BookingsCalendar, …
│   └── ui/               # Button, Card, Input, Chip, Logo, GridBackground
└── lib/
    ├── calc.ts           # revenue / fees / profit / forecast math
    ├── ical.ts           # fetch (+ proxy) and parse VEVENT blocks
    ├── storage.ts        # SSR-safe localStorage wrapper
    └── types.ts
```

---

## Customising the brand

Tokens live in `tailwind.config.ts` and `src/app/globals.css`:

| Token            | Value            |
| ---------------- | ---------------- |
| `brand-500`      | `#22C55E` (accent) |
| `bg`             | `#000000`        |
| `surface`        | `#0A0A0A`        |
| `card`           | `#111111`        |
| `border`         | `#1F1F1F`        |

Change the hex values in `tailwind.config.ts` → `theme.extend.colors` and the
whole UI updates.

---

## iCal support

- **Direct fetch** first. If the endpoint blocks CORS, we automatically retry
  through `https://api.allorigins.win/raw?url=…`.
- Parser understands `SUMMARY`, `DTSTART`, `DTEND`, `UID` for all-day events
  and timestamped events.
- Works with Airbnb, Booking.com, Vrbo, Google Calendar and any iCal-compatible
  source.

---

## License

MIT. Use it, ship it, profit from it.
