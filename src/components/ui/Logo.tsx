import { Zap } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[17px] font-semibold tracking-tight ${className}`}>
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-white">
        <Zap size={14} fill="currentColor" />
      </span>
      <span className="text-fg">loc</span><span className="text-brand-500">pilote</span>
    </span>
  );
}
