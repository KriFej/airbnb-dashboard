import { ReactNode } from "react";

type Props = {
  label: string;
  value: string;
  delta?: string;
  tone?: "default" | "green" | "danger";
  icon?: ReactNode;
  hint?: string;
  size?: "sm" | "lg";
};

export function KpiCard({
  label,
  value,
  delta,
  tone = "default",
  icon,
  hint,
  size = "sm",
}: Props) {
  if (tone === "green") {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-brand-500 p-6 text-black h-full">
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.5) 0%, transparent 60%)",
          }}
        />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
              {icon}
              {label}
            </span>
            {delta && (
              <span className="rounded-full bg-black/15 px-2.5 py-1 text-[11px] font-medium">
                {delta}
              </span>
            )}
          </div>
          <div>
            <div className="mt-4 text-4xl font-semibold tracking-tight xl:text-5xl">
              {value}
            </div>
            {hint && <div className="mt-1.5 text-xs text-black/65">{hint}</div>}
          </div>
        </div>
      </div>
    );
  }

  const isLg = size === "lg";
  const accentColor =
    tone === "danger"
      ? "text-red-400 bg-red-500/10"
      : "text-brand-400 bg-brand-500/10";

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 h-full transition-colors hover:border-border-hover">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-muted">{label}</span>
        {icon && (
          <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${accentColor}`}>
            {icon}
          </span>
        )}
      </div>
      <div>
        <div className={`mt-4 font-semibold tracking-tight ${isLg ? "text-3xl xl:text-4xl" : "text-2xl xl:text-3xl"}`}>
          {value}
        </div>
        <div className="mt-1.5 flex items-center gap-2 text-xs">
          {delta && (
            <span className={tone === "danger" ? "text-red-400" : "text-brand-400"}>
              {delta}
            </span>
          )}
          {hint && <span className="text-dim">{hint}</span>}
        </div>
      </div>
    </div>
  );
}
