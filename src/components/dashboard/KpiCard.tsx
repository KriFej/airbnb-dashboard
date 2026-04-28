import { ReactNode } from "react";

type Props = {
  label: string;
  value: string;
  delta?: string;
  tone?: "default" | "green" | "danger";
  icon?: ReactNode;
  hint?: string;
};

export function KpiCard({
  label,
  value,
  delta,
  tone = "default",
  icon,
  hint,
}: Props) {
  if (tone === "green") {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-brand-500 p-6 text-black">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.4) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
              {icon}
              {label}
            </span>
            {delta && (
              <span className="rounded-full bg-black/20 px-2 py-0.5 text-[11px] font-medium">
                {delta}
              </span>
            )}
          </div>
          <div className="mt-6 text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
            {value}
          </div>
          {hint && <div className="mt-1 text-xs text-black/70">{hint}</div>}
        </div>
      </div>
    );
  }

  const deltaColor =
    tone === "danger" ? "text-red-400" : "text-brand-400";

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">{label}</span>
        {icon && <span className="text-muted">{icon}</span>}
      </div>
      <div className="mt-3 text-xl font-medium tracking-tight sm:text-2xl">{value}</div>
      <div className="mt-1 flex items-center gap-2 text-xs">
        {delta && <span className={deltaColor}>{delta}</span>}
        {hint && <span className="text-dim">{hint}</span>}
      </div>
    </div>
  );
}
