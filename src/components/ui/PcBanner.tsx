"use client";

import { useState } from "react";
import { Monitor, X } from "lucide-react";

export function PcBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="flex items-center justify-between gap-3 bg-brand-50 border-b border-brand-200 px-4 py-2.5 md:hidden">
      <div className="flex items-center gap-2 text-xs text-brand-600">
        <Monitor size={14} className="shrink-0" />
        <span>Pour une meilleure expérience, utilisez locpilote sur ordinateur.</span>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="shrink-0 text-brand-500 hover:text-fg"
        aria-label="Fermer"
      >
        <X size={14} />
      </button>
    </div>
  );
}
