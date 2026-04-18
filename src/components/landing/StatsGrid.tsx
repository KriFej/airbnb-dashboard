import { CheckCircle2, Users } from "lucide-react";

export function StatsGrid() {
  return (
    <section className="pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 rounded-full border border-border bg-black/60 p-3 backdrop-blur w-full">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-black">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <div className="text-sm font-medium text-white">
                  Dépense enregistrée
                </div>
                <div className="text-[11px] text-muted">Aujourd&apos;hui, 09:24</div>
              </div>
            </div>
            <h3 className="mt-10 text-xl font-medium">Rentabilité maîtrisée</h3>
            <p className="mt-2 text-sm text-muted">
              Suivez chaque charge récurrente au même endroit et voyez
              instantanément quelle part de votre revenu brut part chaque mois.
            </p>
          </div>

          {/* Card 2: 90% */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-end gap-1.5 h-24">
              {[35, 55, 25, 70, 40, 85, 50, 75, 40, 90, 60, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-brand-500"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="mt-6 text-6xl font-medium tracking-tight">0 €</div>
            <p className="mt-2 text-sm text-muted">
              De frais cachés. Chaque centime dépensé est visible, catégorisé et déduit de votre bénéfice.
            </p>
          </div>

          {/* Card 3 */}
          <div className="relative overflow-hidden rounded-2xl bg-brand-500 p-6 text-black">
            <div className="mt-4 flex items-center gap-2">
              <Users size={18} />
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
