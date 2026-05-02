import { ReactNode } from "react";
import { Sparkline } from "../ui/Sparkline";

type Props = {
  label: string;
  value: string;
  delta?: string;
  tone?: "default" | "green" | "danger";
  icon?: ReactNode;
  hint?: string;
  size?: "sm" | "lg";
  sparkline?: number[];
};

export function KpiCard({ label, value, delta, tone = "default", icon, hint, size = "sm", sparkline }: Props) {
  if (tone === "green") {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-brand-500 p-6 text-black h-full shadow-btn-glow">
        {sparkline && (
          <div className="pointer-events-none absolute bottom-0 right-0 opacity-20">
            <Sparkline data={sparkline} color="#000000" height={60} width={120} filled />
          </div>
        )}
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/15 px-2.5 py-1 text-[11px] font-semibold">
              {icon}{label}
            </span>
            {delta && (
              <span className="rounded-full bg-black/15 px-2.5 py-1 text-[11px] font-semibold">{delta}</span>
            )}
          </div>
          <div>
            <div className="mt-4 text-4xl font-bold tracking-tight xl:text-5xl">{value}</div>
            {hint && <div className="mt-1.5 text-xs text-black/65">{hint}</div>}
          </div>
        </div>
      </div>
    );
  }

  const isLg = size === "lg";
  const iconBg = tone === "danger" ? "bg-red-500/10 text-red-500" : "bg-brand-500/10 text-brand-600";
  const sparkColor = tone === "danger" ? "#EF4444" : "#EAB308";

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white p-6 h-full shadow-card transition hover:shadow-card-md hover:border-border-hover">
      {sparkline && (
        <div className="pointer-events-none absolute bottom-0 right-0 opacity-15">
          <Sparkline data={sparkline} color={sparkColor} height={56} width={110} filled />
        </div>
      )}
      <div className="relative flex items-start justify-between gap-2">
        <span className="text-xs font-semibold text-muted">{label}</span>
        {icon && (
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
            {icon}
          </span>
        )}
      </div>
      <div className="relative">
        <div className={`mt-4 font-bold tracking-tight ${isLg ? "text-3xl xl:text-4xl" : "text-2xl xl:text-3xl"} text-fg`}>
          {value}
        </div>
        <div className="mt-1.5 flex items-center gap-2 text-xs">
          {delta && <span className={tone === "danger" ? "text-red-500" : "text-brand-600"}>{delta}</span>}
          {hint && <span className="text-dim">{hint}</span>}
        </div>
      </div>
    </div>
  );
}
