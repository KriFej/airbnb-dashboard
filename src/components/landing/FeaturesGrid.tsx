import {
  Scale,
  FileCheck,
  TrendingUp,
  Calculator,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

const FEATURES = [
  {
    icon: Scale,
    title: "Micro-BIC vs Régime Réel",
    body: "Comparaison automatique des deux régimes. LocFiscal calcule lequel vous fait payer moins.",
    accent: true,
  },
  {
    icon: Calculator,
    title: "Amortissement LMNP",
    body: "Calculez vos amortissements (bien, mobilier, travaux) et réduisez votre base imposable.",
  },
  {
    icon: FileCheck,
    title: "Récapitulatif déclaration",
    body: "Résumé prêt à recopier sur votre déclaration 2042-C-PRO ou à envoyer à votre comptable.",
  },
  {
    icon: TrendingUp,
    title: "Rentabilité nette après impôts",
    body: "Rendement brut, rendement net avant et après imposition. La vraie performance de votre bien.",
  },
  {
    icon: BarChart3,
    title: "Suivi annuel",
    body: "Suivez vos revenus mois par mois, anticipez votre imposition avant la déclaration d'avril.",
  },
  {
    icon: ShieldCheck,
    title: "Conforme à la loi Le Meur 2024",
    body: "Calculs mis à jour selon la loi de finances 2024 et les nouvelles règles LMNP.",
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
            Tout ce qu&apos;un hôte LMNP<br />
            doit savoir.
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
