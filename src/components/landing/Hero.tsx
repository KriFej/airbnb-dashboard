import { Button } from "../ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-16 md:pt-24 md:pb-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-muted shadow-sm">
            ✦ Automatisation IA
          </div>

          <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tighter text-fg sm:text-6xl md:text-7xl lg:text-8xl">
            Vos biens,<br />
            <span className="text-brand-500">vos vrais chiffres</span>,<br />
            automatiquement.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Locpilote centralise vos annonces Airbnb &amp; Booking, déduit toutes vos charges et vous affiche votre <strong className="text-fg font-medium">bénéfice net réel</strong> — sans tableur.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/signup" size="lg">
              Commencer gratuitement →
            </Button>
            <Button href="/dashboard" variant="secondary" size="lg">
              Voir le tableau de bord
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
