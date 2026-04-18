import { TrendingUp, Link2, SlidersHorizontal, BarChart3 } from "lucide-react";

export function FeatureSplit() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-medium tracking-tight md:text-5xl">
            Accédez à votre vraie rentabilité
          </h2>
          <p className="mt-4 text-muted">
            Arrêtez de célébrer les chiffres bruts. locpilote déduit les frais,
            le ménage, les charges et le crédit : vous voyez le montant qui
            arrive vraiment sur votre compte.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {/* Green feature card */}
          <div className="relative flex flex-col justify-center overflow-hidden rounded-2xl bg-brand-500 p-8 text-black min-h-[360px]">
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.5) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1 text-xs font-medium backdrop-blur">
                <TrendingUp size={12} /> Le profit d&apos;abord
              </span>
              <h3 className="mt-6 max-w-md text-2xl font-medium md:text-3xl">
                Votre vrai bénéfice, sans les chiffres qui flattent.
              </h3>
              <p className="mt-3 max-w-md text-sm text-black/70">
                Chaque KPI, graphique et prévision est calculé sur le net —
                après frais de plateforme, après dépenses, après tout.
              </p>
            </div>
          </div>

          {/* 3 étapes */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-transparent" />
            <div className="relative">
              <span className="text-xs uppercase tracking-widest text-brand-500">
                Comment ça marche
              </span>
              <div className="mt-8 space-y-6">
                <Step n="1" icon={<Link2 size={16} />} title="Connectez vos iCals" desc="Collez l'URL iCal de votre bien Airbnb ou Booking en une fois." />
                <Step n="2" icon={<SlidersHorizontal size={16} />} title="Renseignez vos dépenses" desc="Crédit, charges, ménage, frais de plateforme — tout en 2 minutes." />
                <Step n="3" icon={<BarChart3 size={16} />} title="Voyez votre bénéfice net" desc="Tableau de bord mis à jour en temps réel. Aucun tableur nécessaire." />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ n, icon, title, desc }: { n: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20">
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-white">{n}. {title}</div>
        <div className="mt-1 text-xs text-muted">{desc}</div>
      </div>
    </div>
  );
}
