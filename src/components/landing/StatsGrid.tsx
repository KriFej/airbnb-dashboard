import { BarChart3, Scale, Users } from "lucide-react";

export function StatsGrid() {
  return (
    <section className="border-t border-border/30 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-8 ring-1 ring-brand-500/10">
            <div className="flex items-center gap-2 text-brand-500">
              <Users size={18} />
              <span className="text-xs uppercase tracking-widest">Hôtes concernés</span>
            </div>
            <div className="mt-4 text-5xl font-semibold tracking-tight text-fg">500 000+</div>
            <p className="mt-2 text-sm text-muted">hôtes LMNP en France à déclarer chaque année</p>
          </div>

          <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-8">
            <div className="flex items-center gap-2 text-brand-500">
              <BarChart3 size={18} />
              <span className="text-xs uppercase tracking-widest">Économie moyenne</span>
            </div>
            <div className="mt-4 text-5xl font-semibold tracking-tight text-fg">1 200 €</div>
            <p className="mt-2 text-sm text-muted">économisés en passant au bon régime fiscal</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-brand-500 p-8 text-black">
            <div className="pointer-events-none absolute inset-0 opacity-15"
              style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 0%, transparent 60%)" }}
            />
            <div className="relative flex items-center gap-2">
              <Scale size={18} />
              <span className="text-xs uppercase tracking-widest">Simulation</span>
            </div>
            <div className="relative mt-4 text-5xl font-semibold tracking-tight">30 sec</div>
            <p className="relative mt-2 text-sm text-black/75">
              Pour connaître le meilleur régime fiscal et votre économie.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
