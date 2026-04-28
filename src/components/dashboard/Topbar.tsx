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
    <div className="flex flex-col gap-4 border-b border-border bg-bg/60 px-6 py-5 backdrop-blur md:flex-row md:items-center md:justify-between md:px-8">
      <div className="flex items-start gap-3">
        <Link
          href="/"
          aria-label="Retour à l'accueil"
          className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted transition-colors hover:border-border-hover hover:text-fg md:hidden"
        >
          <Home size={15} />
        </Link>
        <div>
          <h1 className="text-xl font-medium tracking-tight sm:text-2xl">{title}</h1>
          <p className="mt-0.5 text-xs text-muted sm:mt-1 sm:text-sm">{subtitle}</p>
        </div>
      </div>
      <div className="relative">
        <details className="group inline-block">
          <summary className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 text-sm text-fg hover:border-border-hover">
            <CalendarRange size={14} className="text-muted" />
            {period}
            <ChevronDown size={14} className="text-muted" />
          </summary>
          <div className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
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
