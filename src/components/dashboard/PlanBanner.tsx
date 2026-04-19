"use client";

import { Crown, Gift, Sparkles, Zap } from "lucide-react";
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
        <span className="text-white/90">Offre Unlimited active · biens illimités.</span>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-purple-500/30 bg-purple-500/10 px-4 py-3 text-sm md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <Gift size={16} className="text-purple-400" />
          <span className="text-white/90">
            Offre Gratuite · 1 bien inclus. Passez à Starter pour iCal + 2 biens.
          </span>
        </div>
        <Link
          href="/api/checkout?plan=starter"
          className="shrink-0 rounded-full bg-purple-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-purple-400"
        >
          Passer à Starter — 9,90 €/mois
        </Link>
      </div>
    );
  }

  const planName = plan === "starter" ? "Starter" : "Pro";
  const upgradeHref = plan === "starter" ? "/api/checkout?plan=pro" : "/#pricing";
  const upgradeLabel = plan === "starter" ? "Passer au Pro" : "Passer à Unlimited";

  return (
    <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm md:flex-row md:items-center">
      <div className="flex items-center gap-3">
        <Sparkles size={16} className="text-brand-400" />
        <span className="text-white/90">
          Offre {planName} active · {count} / {limit === Infinity ? "∞" : limit} biens utilisés.
        </span>
      </div>
      <Link
        href={upgradeHref}
        className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-xs font-medium text-white hover:border-border-hover hover:bg-card-hover"
      >
        <Zap size={11} />
        {upgradeLabel}
      </Link>
    </div>
  );
}
