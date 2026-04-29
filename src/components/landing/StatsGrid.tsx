import { BarChart3 } from "lucide-react";

export function StatsGrid() {
  return (
    <section className="pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {/* Card 1 */}
          <div className="flex flex-col justify-center rounded-2xl border border-border bg-card p-6 min-h-[200px] md:p-8 md:min-h-[240px]">
            <h3 className="text-lg font-medium md:text-xl">Rentabilité maîtrisée</h3>
            <p className="mt-2 text-sm text-muted md:mt-3">
              <span className="sm:hidden">Suivez chaque charge et voyez ce qui reste vraiment.</span>
              <span className="hidden sm:inline">Suivez chaque charge récurrente au même endroit et voyez instantanément quelle part de votre revenu brut part chaque mois.</span>
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-500/40 bg-card p-6 min-h-[200px] text-center ring-1 ring-brand-500/20 md:p-8 md:min-h-[240px]">
            <div className="text-6xl font-medium tracking-tight text-brand-400 md:text-7xl">0 €</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-brand-500">de frais cachés</div>
            <p className="mt-3 max-w-[200px] text-sm text-muted">
              Chaque centime visible, catégorisé, déduit.
            </p>
          </div>

          {/* Card 3 */}
          <div className="relative flex flex-col justify-center overflow-hidden rounded-2xl bg-brand-500 p-6 text-black min-h-[200px] md:p-8 md:min-h-[240px]">
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
