import {
  RefreshCw,
  LineChart,
  Receipt,
  TrendingUp,
  Wallet,
  Building2,
} from "lucide-react";

const FEATURES = [
  {
    icon: Wallet,
    title: "Revenu net réel",
    body: "Voyez exactement ce qui arrive sur votre compte après les frais Airbnb et Booking.",
  },
  {
    icon: Receipt,
    title: "Détail des dépenses",
    body: "Crédit, électricité, eau, internet, ménage — tout est suivi en quelques secondes.",
  },
  {
    icon: RefreshCw,
    title: "Synchro iCal",
    body: "Collez votre URL iCal une fois. Vos réservations apparaissent automatiquement.",
  },
  {
    icon: Building2,
    title: "Multi-biens",
    body: "Gérez plusieurs logements depuis un seul tableau de bord, chacun avec ses propres chiffres.",
  },
  {
    icon: TrendingUp,
    title: "Prévision fin de mois",
    body: "Bénéfice projeté à partir de vos réservations actuelles et futures.",
  },
  {
    icon: LineChart,
    title: "Multi-plateforme",
    body: "Fonctionne avec Airbnb, Booking.com et toute source compatible iCal.",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="border-t border-border/60 py-14 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-widest text-brand-500">
            Fonctionnalités
          </span>
          <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
            Tout ce dont un hôte a besoin,
            <br />
            rien de superflu.
          </h2>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-border-hover hover:bg-card-hover"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20">
                <Icon size={20} />
              </div>
              <h3 className="mt-5 text-lg font-medium">{title}</h3>
              <p className="mt-2 text-sm text-muted">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
