"use client";

import { CalendarRange, ChevronDown } from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
  period: string;
  onPeriod: (p: string) => void;
};

const PERIODS = ["This month", "Last 30 days", "Year to date"];

export function Topbar({ title, subtitle, period, onPeriod }: Props) {
  return (
    <div className="flex flex-col gap-4 border-b border-border bg-bg/60 px-6 py-5 backdrop-blur md:flex-row md:items-center md:justify-between md:px-8">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>
      <div className="relative">
        <details className="group inline-block">
          <summary className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 text-sm text-white hover:border-border-hover">
            <CalendarRange size={14} className="text-muted" />
            {period}
            <ChevronDown size={14} className="text-muted" />
          </summary>
          <div className="absolute right-0 z-40 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
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
                  p === period ? "text-brand-400" : "text-white"
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
