import { UserPlus, Link2, TrendingUp } from "lucide-react";
import { Button } from "../ui/Button";

const STEPS = [
  {
    icon: UserPlus,
    step: "01",
    title: "Créez votre compte gratuit",
    desc: "Inscription en 30 secondes, sans carte bancaire. Votre tableau de bord vous attend immédiatement.",
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
    title: "Visualisez votre bénéfice net",
    desc: "Entrez vos dépenses (électricité, ménage, crédit…) et obtenez votre bénéfice net réel en temps réel.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border/30 py-14 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-widest text-brand-500">
            Comment ça marche
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Opérationnel en 2 minutes.
          </h2>
          <p className="mt-4 text-muted">
            Un compte, un lien iCal, vos dépenses — c&apos;est tout ce qu&apos;il faut.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connecting line — desktop only */}
          <div className="absolute left-1/2 top-6 hidden h-[calc(100%-3rem)] w-px -translate-x-1/2 bg-gradient-to-b from-brand-500/40 via-brand-500/20 to-transparent md:block" />

          <div className="grid gap-10 md:gap-0">
            {STEPS.map(({ icon: Icon, step, title, desc }, i) => (
              <div
                key={step}
                className={`relative flex flex-col gap-6 md:flex-row md:items-start md:gap-16 ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Content */}
                <div className={`flex-1 md:pb-16 ${i % 2 === 1 ? "md:text-right" : ""}`}>
                  <span className="text-[80px] font-semibold leading-none tracking-tighter text-fg/[0.04] select-none">
                    {step}
                  </span>
                  <div className={`mt-2 flex items-start gap-4 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-500/30 bg-brand-500/10 md:h-12 md:w-12">
                      <Icon size={20} className="text-brand-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-fg">{title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
                    </div>
                  </div>
                </div>

                {/* Center dot */}
                <div className="hidden md:flex md:w-4 md:shrink-0 md:flex-col md:items-center md:pt-6">
                  <div className="h-4 w-4 rounded-full border-2 border-brand-500 bg-bg shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                </div>

                {/* Empty spacer */}
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-center md:mt-10">
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
