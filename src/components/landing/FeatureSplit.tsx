import { PlayCircle, TrendingUp } from "lucide-react";

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
          <div className="relative overflow-hidden rounded-2xl bg-brand-500 p-8 text-black">
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
              <h3 className="mt-40 max-w-md text-2xl font-medium md:text-3xl">
                Conçu pour les hôtes qui veulent du bénéfice, pas du revenu
                brut.
              </h3>
              <p className="mt-3 max-w-md text-sm text-black/70">
                Chaque KPI, graphique et prévision est calculé sur le net —
                après frais de plateforme, après dépenses, après tout.
              </p>
            </div>
          </div>

          {/* Dark card with illustration/play button */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/15 via-transparent to-transparent" />
            <div className="relative flex h-full min-h-[360px] flex-col items-center justify-center p-8">
              <button
                type="button"
                className="group flex h-20 w-20 items-center justify-center rounded-full bg-black/70 backdrop-blur border border-white/10 transition-transform hover:scale-105"
                aria-label="Lancer la vidéo de démo"
              >
                <PlayCircle size={40} className="text-white" strokeWidth={1.2} />
              </button>
              <p className="mt-6 text-sm text-muted">Démo produit en 90 s</p>
              <div className="mt-10 grid w-full max-w-sm grid-cols-3 gap-3">
                <Stat n="1,8 M €" l="suivis chaque mois" />
                <Stat n="38" l="pays" />
                <Stat n="4,9 ★" l="note hôtes" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3 text-center">
      <div className="text-lg font-medium text-white">{n}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-dim">
        {l}
      </div>
    </div>
  );
}
