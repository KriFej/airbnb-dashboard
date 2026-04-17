"use client";

import Link from "next/link";
import { Crown, X } from "lucide-react";
import { Plan, PLAN_LABELS } from "@/lib/plan";

type Props = {
  open: boolean;
  onClose: () => void;
  plan: Plan;
  limit: number;
};

export function UpgradeModal({ open, onClose, plan, limit }: Props) {
  if (!open) return null;

  const currentLabel = plan ? PLAN_LABELS[plan] : null;
  const nextLabel =
    plan === "starter" ? "Pro" : plan === "pro" ? "Unlimited" : "Pro";

  const title = plan ? "Limite de biens atteinte" : "Choisissez une offre";
  const description = plan
    ? `Votre offre ${currentLabel} permet jusqu'à ${limit === Infinity ? "une infinité de" : limit} biens. Passez à ${nextLabel} pour en ajouter plus.`
    : "Pour ajouter des biens à votre tableau de bord, choisissez l'offre qui correspond à votre volume.";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-brand-500/30 bg-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20">
              <Crown size={18} />
            </span>
            <div>
              <h3 className="text-base font-medium text-white">{title}</h3>
              <p className="mt-1 text-xs text-muted">{description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-muted hover:bg-white/5 hover:text-white"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-full border border-border bg-[#0E0E0E] px-4 text-xs font-medium text-white hover:border-border-hover"
          >
            Fermer
          </button>
          <Link
            href="/#pricing"
            onClick={onClose}
            className="inline-flex h-10 items-center rounded-full bg-brand-500 px-4 text-xs font-medium text-black hover:bg-brand-400"
          >
            Voir les offres
          </Link>
        </div>
      </div>
    </div>
  );
}
