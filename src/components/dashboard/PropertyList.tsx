"use client";

import { Building2, Plus, TrendingUp, Wallet } from "lucide-react";
import { computePropertyKpis, formatEuro } from "@/lib/calc";
import { Property } from "@/lib/types";

type Props = {
  properties: Property[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddClick: () => void;
};

export function PropertyList({
  properties,
  selectedId,
  onSelect,
  onAddClick,
}: Props) {
  if (properties.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20">
          <Building2 size={22} />
        </div>
        <h3 className="mt-5 text-lg font-medium">Aucun bien pour l&apos;instant</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          Ajoutez votre premier bien pour commencer à suivre ses revenus, ses
          dépenses et son bénéfice net.
        </p>
        <button
          type="button"
          onClick={onAddClick}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-brand-500 px-5 text-sm font-medium text-black transition-colors hover:bg-brand-400"
        >
          <Plus size={16} />
          Créer votre premier bien
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-white">Vos biens</h3>
          <p className="text-xs text-muted">
            Cliquez sur un bien pour éditer ses dépenses et synchroniser son
            iCal.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-500 px-4 text-xs font-medium text-black transition-colors hover:bg-brand-400"
        >
          <Plus size={14} />
          Ajouter un bien
        </button>
      </header>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((p) => {
          const k = computePropertyKpis(p);
          const isActive = p.id === selectedId;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className={`flex flex-col rounded-xl border bg-[#0E0E0E] p-4 text-left transition-colors ${
                isActive
                  ? "border-brand-500/60 ring-1 ring-brand-500/30"
                  : "border-border hover:border-border-hover"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20">
                  <Building2 size={14} />
                </span>
                <span className="truncate text-sm font-medium text-white">
                  {p.name}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-1 text-dim">
                    <Wallet size={10} /> Brut
                  </div>
                  <div className="mt-1 text-sm text-white">
                    {formatEuro(k.grossRevenue)}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-dim">
                    <TrendingUp size={10} /> Net
                  </div>
                  <div className="mt-1 text-sm text-brand-400">
                    {formatEuro(k.netProfit)}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
