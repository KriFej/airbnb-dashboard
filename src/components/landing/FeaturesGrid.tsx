import { RefreshCw, LineChart, Receipt, TrendingUp, Wallet, Building2 } from "lucide-react";

const FEATURES = [
  {
    icon: Wallet,
    title: "Revenu net réel",
    body: "Voyez exactement ce qui arrive sur votre compte après les frais Airbnb et Booking.",
    highlighted: true,
  },
  {
    icon: Receipt,
    title: "Détail des dépenses",
    body: "Crédit, électricité, eau, internet, ménage — tout suivi en quelques secondes.",
  },
  {
    icon: RefreshCw,
    title: "Synchro iCal",
    body: "Collez votre URL iCal une fois. Vos réservations apparaissent automatiquement.",
  },
  {
    icon: Building2,
    title: "Multi-biens",
    body: "Gérez plusieurs logements depuis un tableau de bord, chacun avec ses propres chiffres.",
  },
  {
    icon: TrendingUp,
    title: "Prévision fin de mois",
    body: "Bénéfice projeté à partir de vos réservations actuelles et futures.",
  },
  {
    icon: LineChart,
    title: "Multi-plateforme",
    body: "Compatible Airbnb, Booking.com et toute source iCal.",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="border-t border-border py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
            Fonctionnalités
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-fg md:text-5xl">
            Tout ce dont un hôte a besoin,
            <br />rien de superflu.
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body, highlighted }) => (
            <div
              key={title}
              className={`group relative overflow-hidden rounded-2xl p-7 transition-all duration-200 ${
                highlighted
                  ? "bg-brand-500 text-black shadow-btn-glow"
                  : "bg-white border border-border shadow-card hover:shadow-card-md hover:border-border-hover"
              }`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  highlighted ? "bg-black/15" : "bg-brand-500/10"
                }`}
              >
                <Icon size={20} className={highlighted ? "text-black" : "text-brand-600"} />
              </div>
              <h3 className={`mt-5 text-base font-semibold ${highlighted ? "text-black" : "text-fg"}`}>
                {title}
              </h3>
              <p className={`mt-2 text-sm leading-relaxed ${highlighted ? "text-black/75" : "text-muted"}`}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
