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

export function KpiCard({
  label,
  value,
  delta,
  tone = "default",
  icon,
  hint,
  size = "sm",
  sparkline,
}: Props) {
  const isLg = size === "lg";

  const iconBg = tone === "danger"
    ? "bg-red-50 text-red-500"
    : "bg-surface text-muted";

  const sparkColor = tone === "danger" ? "#EF4444" : "#6366F1";

  const deltaColor = tone === "danger"
    ? "text-red-500"
    : delta?.startsWith("+") || delta?.startsWith("↑")
      ? "text-positive-500"
      : "text-muted";

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white p-6 h-full shadow-card transition-all duration-200 hover:shadow-card-md hover:-translate-y-0.5">
      {sparkline && (
        <div className="pointer-events-none absolute bottom-0 right-0 opacity-25">
          <Sparkline data={sparkline} color={sparkColor} height={56} width={110} filled />
        </div>
      )}
      <div className="relative flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-muted">{label}</span>
        {icon && (
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
            {icon}
          </span>
        )}
      </div>
      <div className="relative">
        <div className={`mt-4 tabular-nums font-bold tracking-tight text-fg ${isLg ? "text-3xl xl:text-4xl" : "text-2xl xl:text-3xl"}`}>
          {value}
        </div>
        <div className="mt-1.5 flex items-center gap-2 text-xs">
          {delta && (
            <span className={deltaColor}>
              {delta}
            </span>
          )}
          {hint && <span className="text-dim">{hint}</span>}
        </div>
      </div>
    </div>
  );
}
