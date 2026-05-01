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
    accent: true,
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
    <section id="features" className="border-t border-border/30 py-14 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-widest text-brand-500">
            Fonctionnalités
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Tout ce dont un hôte a besoin,
            <br />
            rien de superflu.
          </h2>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body, accent }) => (
            <div
              key={title}
              className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
                accent
                  ? "bg-brand-500 text-black"
                  : "bg-card/60 shadow-card hover:bg-card hover:shadow-[0_0_0_1px_rgba(34,197,94,0.15),0_4px_20px_rgba(0,0,0,0.5)]"
              }`}
            >
              {accent && (
                <div
                  className="pointer-events-none absolute inset-0 opacity-15"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 60%)",
                  }}
                />
              )}
              <div
                className={`relative flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${
                  accent
                    ? "bg-black/20 text-black ring-black/20"
                    : "bg-brand-500/10 text-brand-400 ring-brand-500/20"
                }`}
              >
                <Icon size={20} />
              </div>
              <h3 className={`relative mt-5 text-lg font-semibold ${accent ? "text-black" : "text-fg"}`}>
                {title}
              </h3>
              <p className={`relative mt-2 text-sm leading-relaxed ${accent ? "text-black/75" : "text-muted"}`}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
