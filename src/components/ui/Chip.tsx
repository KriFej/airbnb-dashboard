import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  icon?: ReactNode;
  tone?: "default" | "green";
  className?: string;
};

export function Chip({ children, icon, tone = "default", className = "" }: Props) {
  const style =
    tone === "green"
      ? "bg-brand-50 border-brand-200 text-brand-600"
      : "bg-surface border-border text-muted";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur ${style} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
