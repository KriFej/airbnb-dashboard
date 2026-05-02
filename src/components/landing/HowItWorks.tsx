import { UserPlus, Link2, TrendingUp } from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    n: "01",
    title: "Créez votre compte gratuit",
    desc: "Inscription en 30 secondes, sans carte bancaire.",
  },
  {
    icon: Link2,
    n: "02",
    title: "Connectez vos calendriers",
    desc: "Copiez votre lien iCal depuis Airbnb ou Booking.com — vos réservations s'importent automatiquement.",
  },
  {
    icon: TrendingUp,
    n: "03",
    title: "Voyez votre bénéfice net",
    desc: "Entrez vos dépenses et obtenez votre bénéfice net réel en temps réel.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left — title */}
          <div className="lg:sticky lg:top-24">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-brand-600">
              Comment ça marche
            </span>
            <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-fg md:text-5xl">
              Opérationnel
              <br />
              en 2 minutes.
            </h2>
            <p className="mt-4 text-muted">
              Un compte, un lien iCal, vos dépenses — c&apos;est tout ce qu&apos;il faut pour connaître votre vrai net.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-2 text-sm font-semibold text-brand-700">
              <TrendingUp size={14} />
              −31% d&apos;écart brut/net en moyenne
            </div>
          </div>

          {/* Right — steps */}
          <div className="space-y-4">
            {STEPS.map(({ icon: Icon, n, title, desc }) => (
              <div
                key={n}
                className="flex gap-5 rounded-2xl bg-white p-6 shadow-card border border-border"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10">
                  <Icon size={20} className="text-brand-600" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-brand-500 mb-1">
                    Étape {n}
                  </div>
                  <h3 className="text-base font-semibold text-fg">{title}</h3>
                  <p className="mt-1 text-sm text-muted">{desc}</p>
                </div>
              </div>
            ))}

            {/* CTA mini card */}
            <div className="rounded-2xl bg-brand-500 p-6 text-black">
              <p className="text-sm font-semibold">Prêt à connaître votre vrai net ?</p>
              <a
                href="/signup"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/80"
              >
                Commencer gratuitement →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
