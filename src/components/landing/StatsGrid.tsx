import { BarChart3 } from "lucide-react";

export function StatsGrid() {
  return (
    <section className="pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {/* Card 1 */}
          <div className="flex flex-col justify-center rounded-2xl border border-border bg-card p-8 min-h-[240px]">
            <h3 className="text-xl font-medium">Rentabilité maîtrisée</h3>
            <p className="mt-3 text-sm text-muted">
              Suivez chaque charge récurrente au même endroit et voyez
              instantanément quelle part de votre revenu brut part chaque mois.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col justify-center rounded-2xl border border-border bg-card p-8 min-h-[240px]">
            <div className="text-6xl font-medium tracking-tight">0 €</div>
            <p className="mt-3 text-sm text-muted">
              De frais cachés. Chaque centime dépensé est visible, catégorisé et déduit de votre bénéfice.
            </p>
          </div>

          {/* Card 3 */}
          <div className="relative flex flex-col justify-center overflow-hidden rounded-2xl bg-brand-500 p-8 text-black min-h-[240px]">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} />
              <h3 className="text-xl font-medium">Analyse et insights</h3>
            </div>
            <p className="mt-3 text-sm text-black/80">
              Prévisions mensuelles, taux d&apos;occupation et bénéfice net —
              tout dans une vue claire.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
