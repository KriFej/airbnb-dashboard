"use client";

import Link from "next/link";
import { CalendarRange, ChevronDown, Home } from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
  period: string;
  onPeriod: (p: string) => void;
};

export const PERIODS = ["Ce mois-ci", "30 derniers jours", "Depuis le début de l'année"];

export function Topbar({ title, subtitle, period, onPeriod }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border bg-bg/60 px-4 py-3 backdrop-blur sm:px-6 sm:py-4 md:px-8 md:py-5">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href="/"
          aria-label="Retour à l'accueil"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted transition-colors hover:border-border-hover hover:text-fg md:hidden"
        >
          <Home size={14} />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-base font-medium tracking-tight sm:text-xl md:text-2xl">{title}</h1>
          <p className="hidden text-xs text-muted sm:block sm:mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="relative shrink-0">
        <details className="group inline-block">
          <summary className="flex h-9 max-w-[140px] cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs text-fg hover:border-border-hover sm:h-10 sm:max-w-none sm:px-4 sm:text-sm">
            <CalendarRange size={13} className="shrink-0 text-muted" />
            <span className="truncate">{period}</span>
            <ChevronDown size={13} className="shrink-0 text-muted" />
          </summary>
          <div className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-2xl sm:w-64">
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
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-card-hover ${
                  p === period ? "text-brand-400" : "text-fg"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}
