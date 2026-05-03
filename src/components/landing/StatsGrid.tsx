import { BarChart3, Users, TrendingUp } from "lucide-react";

export function StatsGrid() {
  return (
    <section className="border-t border-border/30 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Stat 1 */}
          <div className="flex flex-col gap-1 rounded-2xl border border-brand-200 bg-brand-50 p-8 ring-1 ring-brand-100">
            <div className="flex items-center gap-2 text-brand-500">
              <Users size={18} />
              <span className="text-xs uppercase tracking-widest">Hôtes actifs</span>
            </div>
            <div className="mt-4 text-5xl font-semibold tracking-tight text-fg">1 200+</div>
            <p className="mt-2 text-sm text-muted">dans 38 pays</p>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col gap-1 rounded-2xl border border-border bg-white p-8">
            <div className="flex items-center gap-2 text-brand-500">
              <BarChart3 size={18} />
              <span className="text-xs uppercase tracking-widest">Frais cachés</span>
            </div>
            <div className="mt-4 text-5xl font-semibold tracking-tight text-fg">0 €</div>
            <p className="mt-2 text-sm text-muted">Chaque centime visible, catégorisé, déduit.</p>
          </div>

          {/* Stat 3 */}
          <div className="relative overflow-hidden rounded-2xl bg-brand-500 p-8 text-white">
            <div className="pointer-events-none absolute inset-0 opacity-15"
              style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 0%, transparent 60%)" }}
            />
            <div className="relative flex items-center gap-2">
              <TrendingUp size={18} />
              <span className="text-xs uppercase tracking-widest">Mise en route</span>
            </div>
            <div className="relative mt-4 text-5xl font-semibold tracking-tight">2 min</div>
            <p className="relative mt-2 text-sm text-white/75">
              De l&apos;inscription à votre premier bénéfice net affiché.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
