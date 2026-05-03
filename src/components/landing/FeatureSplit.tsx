import { TrendingUp, CheckCircle2 } from "lucide-react";

const BENEFITS = [
  "Calcul automatique après chaque réservation",
  "Déduction des frais Airbnb et Booking.com",
  "Suivi des réservations en temps réel",
  "Export CSV de vos revenus et dépenses",
];

export function FeatureSplit() {
  return (
    <section className="relative border-t border-border/30 py-14 md:py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Row 1 — text centered */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-widest text-brand-500">
            Rentabilité réelle
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Arrêtez de célébrer<br />
            les <span className="text-brand-500">chiffres bruts</span>.
          </h2>
          <p className="mt-4 text-muted">
            locpilote déduit les frais de plateforme, le ménage, les charges et le crédit. Vous voyez le montant qui arrive <strong className="text-fg font-medium">vraiment</strong> sur votre compte.
          </p>
          <ul className="mt-8 inline-flex flex-col items-start gap-3 text-left">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-muted">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-500" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Row 2 — indigo banner, no fake stat */}
        <div className="mt-10 relative flex flex-col justify-center overflow-hidden rounded-2xl bg-brand-500 p-10 text-white md:p-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.4) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">
              <TrendingUp size={12} /> Le profit d&apos;abord
            </div>
            <h3 className="mt-4 text-2xl font-semibold md:text-3xl">
              Votre vrai bénéfice, sans les chiffres qui flattent.
            </h3>
            <p className="mt-3 text-sm text-white/75">
              Chaque KPI, graphique et prévision est calculé sur le net — après frais de plateforme, après dépenses, après tout.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
