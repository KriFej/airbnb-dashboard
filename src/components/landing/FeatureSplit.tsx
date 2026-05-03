import { TrendingUp, Link2, SlidersHorizontal, BarChart3, CheckCircle2 } from "lucide-react";

const BENEFITS = [
  "Calcul automatique après chaque réservation",
  "Déduction des frais Airbnb, Booking et Vrbo",
  "Taux d'occupation et prévision fin de mois",
  "Export des données en un clic",
];

export function FeatureSplit() {
  return (
    <section className="relative border-t border-border/30 py-14 md:py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Row 1 — text left, steps right */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="text-xs uppercase tracking-widest text-brand-500">
              Rentabilité réelle
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Arrêtez de célébrer
              <br />les chiffres bruts.
            </h2>
            <p className="mt-4 text-muted">
              locpilote déduit les frais de plateforme, le ménage, les charges et le crédit. Vous voyez le montant qui arrive vraiment sur votre compte.
            </p>
            <ul className="mt-8 space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-muted">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-500" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Steps card */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/8 via-transparent to-transparent" />
            <div className="relative">
              <span className="text-xs uppercase tracking-widest text-brand-500">
                Comment ça marche
              </span>
              <div className="mt-8 space-y-6">
                <Step
                  n="1"
                  icon={<Link2 size={16} />}
                  title="Connectez vos iCals"
                  desc="Collez l'URL iCal de votre bien Airbnb ou Booking en une fois."
                />
                <Step
                  n="2"
                  icon={<SlidersHorizontal size={16} />}
                  title="Renseignez vos dépenses"
                  desc="Crédit, charges, ménage, frais de plateforme — tout en 2 minutes."
                />
                <Step
                  n="3"
                  icon={<BarChart3 size={16} />}
                  title="Voyez votre bénéfice net"
                  desc="Tableau de bord mis à jour en temps réel. Aucun tableur nécessaire."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 — green hero card full width */}
        <div className="mt-6 relative flex flex-col justify-center overflow-hidden rounded-2xl bg-brand-500 p-10 text-white md:p-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.4) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">
                <TrendingUp size={12} /> Le profit d&apos;abord
              </div>
              <h3 className="mt-4 max-w-lg text-2xl font-semibold md:text-3xl">
                Votre vrai bénéfice, sans les chiffres qui flattent.
              </h3>
              <p className="mt-3 max-w-md text-sm text-white/75">
                Chaque KPI, graphique et prévision est calculé sur le net — après frais de plateforme, après dépenses, après tout.
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-1 md:items-end">
              <div className="text-5xl font-semibold">−31%</div>
              <div className="text-sm text-white/75">d&apos;écart en moyenne entre<br />revenu brut et net réel</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function Step({
  n,
  icon,
  title,
  desc,
}: {
  n: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500 ring-1 ring-brand-100">
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-fg">
          {n}. {title}
        </div>
        <div className="mt-1 text-xs text-muted">{desc}</div>
      </div>
    </div>
  );
}
