"use client";

import { Building2, Plus, Trash2, TrendingUp, Wallet } from "lucide-react";
import { computePropertyKpis, formatEuro, formatYield } from "@/lib/calc";
import { Property } from "@/lib/types";

type Props = {
  properties: Property[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddClick: () => void;
  onDelete: (id: string) => void;
};

export function PropertyList({
  properties,
  selectedId,
  onSelect,
  onAddClick,
  onDelete,
}: Props) {
  if (properties.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-white p-10 text-center shadow-card">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 ring-1 ring-brand-200">
          <Building2 size={22} />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-fg">Aucun bien pour l&apos;instant</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          Ajoutez votre premier bien pour commencer à suivre ses revenus, ses
          dépenses et son bénéfice net.
        </p>
        <button
          type="button"
          onClick={onAddClick}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-medium text-white transition-colors hover:bg-slate-700"
        >
          <Plus size={16} />
          Créer votre premier bien
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-fg">Vos biens</h3>
          <p className="text-xs text-muted">
            Cliquez sur un bien pour éditer ses dépenses et synchroniser son
            iCal.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-900 px-4 text-xs font-medium text-white transition-colors hover:bg-slate-700"
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
              className={`flex flex-col rounded-xl border bg-white p-4 text-left transition-all duration-150 ${
                isActive
                  ? "border-brand-500/60 ring-1 ring-brand-500/20 shadow-card"
                  : "border-border hover:border-border-hover hover:shadow-card"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-500 ring-1 ring-brand-100">
                  <Building2 size={14} />
                </span>
                <span className="flex-1 truncate text-sm font-medium text-fg">
                  {p.name}
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      confirm(
                        `Supprimer le bien « ${p.name} » ? Toutes ses données (dépenses, iCal) seront perdues.`,
                      )
                    ) {
                      onDelete(p.id);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      e.preventDefault();
                      if (
                        confirm(
                          `Supprimer le bien « ${p.name} » ? Toutes ses données (dépenses, iCal) seront perdues.`,
                        )
                      ) {
                        onDelete(p.id);
                      }
                    }
                  }}
                  aria-label={`Supprimer ${p.name}`}
                  className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-dim transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 size={13} />
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-1 text-dim">
                    <Wallet size={10} /> Brut
                  </div>
                  <div className="mt-1 text-sm text-fg">
                    {formatEuro(k.grossRevenue)}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-dim">
                    <TrendingUp size={10} /> Net
                  </div>
                  <div className="mt-1 text-sm text-brand-500 font-semibold">
                    {formatEuro(k.netProfit)}
                  </div>
                </div>
                {(k.yieldGross !== null || k.yieldNet !== null) && (
                  <>
                    <div>
                      <div className="text-dim">Renta. brute</div>
                      <div className="mt-1 text-sm text-fg">
                        {formatYield(k.yieldGross)}
                      </div>
                    </div>
                    <div>
                      <div className="text-dim">Renta. nette</div>
                      <div className="mt-1 text-sm text-brand-500 font-semibold">
                        {formatYield(k.yieldNet)}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
