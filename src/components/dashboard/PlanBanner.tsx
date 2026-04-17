"use client";

import { AlertCircle, Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import { Plan } from "@/lib/plan";

export function PlanBanner({
  plan,
  count,
  limit,
}: {
  plan: Plan;
  count: number;
  limit: number;
}) {
  if (plan === "unlimited") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-brand-500/30 bg-brand-500/10 px-4 py-3 text-sm">
        <Crown size={16} className="text-brand-400" />
        <span className="text-white/90">
          Offre Unlimited active · biens illimités.
        </span>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <AlertCircle size={16} className="text-amber-400" />
          <span className="text-white/90">
            Aucune offre active — choisissez un plan pour ajouter vos biens.
          </span>
        </div>
        <Link
          href="/#pricing"
          className="rounded-full bg-amber-400 px-4 py-1.5 text-xs font-medium text-black hover:bg-amber-300"
        >
          Voir les offres
        </Link>
      </div>
    );
  }

  const planName = plan === "starter" ? "Starter" : "Pro";
  const upgradeLabel = plan === "starter" ? "Passer au Pro" : "Passer à Unlimited";

  return (
    <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm md:flex-row md:items-center">
      <div className="flex items-center gap-3">
        <Sparkles size={16} className="text-brand-400" />
        <span className="text-white/90">
          Offre {planName} active · {count} / {limit} biens utilisés.
        </span>
      </div>
      <Link
        href="/#pricing"
        className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-white hover:border-border-hover hover:bg-card-hover"
      >
        {upgradeLabel}
      </Link>
    </div>
  );
}
