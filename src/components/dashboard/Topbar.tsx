"use client";

import Link from "next/link";
import { Bell, CalendarRange, ChevronDown, Home, Search, Zap } from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
  period: string;
  onPeriod: (p: string) => void;
  plan?: string;
};

export const PERIODS = ["Ce mois-ci", "30 derniers jours", "Depuis le début de l'année"];

export function Topbar({ title, subtitle, period, onPeriod, plan }: Props) {
  const isFree = !plan || plan === "Gratuit" || plan === "Sans offre";

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-white px-4 py-3 sm:px-6 md:px-8">
      {/* Left: back button (mobile) + title */}
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href="/"
          aria-label="Retour à l'accueil"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-border-hover hover:text-fg md:hidden"
        >
          <Home size={14} />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold tracking-tight text-fg sm:text-lg md:text-xl">
            {title}
          </h1>
          <p className="hidden text-xs text-muted sm:block">{subtitle}</p>
        </div>
      </div>

      {/* Right: period picker + search + bell + upgrade */}
      <div className="flex items-center gap-2">
        {/* Period picker */}
        <div className="relative">
          <details className="group inline-block">
            <summary className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs text-fg hover:border-border-hover sm:px-4">
              <CalendarRange size={13} className="shrink-0 text-muted" />
              <span className="hidden truncate sm:block max-w-[130px]">{period}</span>
              <ChevronDown size={13} className="shrink-0 text-muted" />
            </summary>
            <div className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-white shadow-card-md">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={(e) => {
                    onPeriod(p);
                    const details = (
                      e.currentTarget.closest("details") as HTMLDetailsElement | null
                    );
                    if (details) details.open = false;
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface ${
                    p === period ? "text-brand-500 font-medium" : "text-fg"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </details>
        </div>

        {/* Search icon */}
        <button
          type="button"
          aria-label="Rechercher"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-muted transition-colors hover:border-border-hover hover:text-fg"
        >
          <Search size={15} />
        </button>

        {/* Bell icon */}
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-muted transition-colors hover:border-border-hover hover:text-fg"
        >
          <Bell size={15} />
        </button>

        {/* Upgrade button — only for free users */}
        {isFree && (
          <Link
            href="/#pricing"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-600"
          >
            <Zap size={12} fill="currentColor" />
            Upgrade
          </Link>
        )}
      </div>
    </div>
  );
}
