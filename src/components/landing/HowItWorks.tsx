import { UserPlus, Link2, TrendingUp } from "lucide-react";
import { Button } from "../ui/Button";

const STEPS = [
  {
    icon: UserPlus,
    step: "01",
    title: "Créez votre compte gratuit",
    desc: "Inscription en 30 secondes, aucune carte bancaire requise. Votre tableau de bord vous attend.",
  },
  {
    icon: Link2,
    step: "02",
    title: "Connectez vos calendriers",
    desc: "Copiez votre lien iCal depuis Airbnb ou Booking.com et collez-le dans locpilote. Vos réservations s'importent automatiquement.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Visualisez votre vrai bénéfice",
    desc: "Entrez vos dépenses (électricité, ménage, crédit…) et obtenez votre bénéfice net réel en temps réel.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border/60 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-widest text-brand-500">
            Comment ça marche
          </span>
          <h2 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">
            Opérationnel en 2 minutes.
          </h2>
          <p className="mt-4 text-muted">
            Un compte, un lien iCal, vos dépenses — c&apos;est tout ce qu&apos;il faut.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="relative flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-500/30 bg-brand-500/10">
                  <Icon size={20} className="text-brand-400" />
                </div>
                <span className="text-4xl font-medium text-white/10">{step}</span>
              </div>
              <h3 className="text-lg font-medium text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-muted">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button href="/signup" size="lg">
            Créer mon compte gratuitement
          </Button>
          <p className="mt-3 text-xs text-dim">
            Accès immédiat · 1 bien gratuit inclus · Aucune carte requise
          </p>
        </div>
      </div>
    </section>
  );
}
