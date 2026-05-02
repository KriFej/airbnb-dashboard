import { TrendingUp, Link2, SlidersHorizontal, BarChart3, CheckCircle2 } from "lucide-react";

const BENEFITS = [
  "Calcul automatique après chaque réservation",
  "Déduction des frais Airbnb, Booking et Vrbo",
  "Taux d'occupation et prévision fin de mois",
  "Export des données en un clic",
];

export function FeatureSplit() {
  return (
    <section className="border-t border-border py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-6 space-y-6">

        {/* Row 1 */}
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              Rentabilité réelle
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
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

          <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-8 shadow-card-md">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/6 via-transparent to-transparent" />
            <div className="relative">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                Les 3 étapes
              </span>
              <div className="mt-8 space-y-5">
                {[
                  { icon: Link2, title: "Connectez vos iCals", desc: "Collez l'URL iCal de votre bien Airbnb ou Booking en une fois." },
                  { icon: SlidersHorizontal, title: "Renseignez vos dépenses", desc: "Crédit, charges, ménage, frais de plateforme — tout en 2 minutes." },
                  { icon: BarChart3, title: "Voyez votre bénéfice net", desc: "Tableau de bord mis à jour en temps réel. Aucun tableur nécessaire." },
                ].map(({ icon: Icon, title, desc }, i) => (
                  <div key={title} className="flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-fg">{i + 1}. {title}</div>
                      <div className="mt-1 text-xs text-muted">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 — full width yellow banner */}
        <div className="relative flex flex-col justify-center overflow-hidden rounded-2xl bg-brand-500 p-10 text-black md:p-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.5) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-black/15 px-3 py-1 text-xs font-semibold">
                <TrendingUp size={12} /> Le profit d&apos;abord
              </div>
              <h3 className="mt-4 max-w-lg text-2xl font-bold md:text-3xl">
                Votre vrai bénéfice, sans les chiffres qui flattent.
              </h3>
              <p className="mt-3 max-w-md text-sm text-black/75">
                Chaque KPI, graphique et prévision est calculé sur le net — après frais de plateforme, après dépenses, après tout.
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-1 md:items-end">
              <div className="text-5xl font-bold">−31%</div>
              <div className="text-sm text-black/75">d&apos;écart en moyenne entre<br />revenu brut et net réel</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
