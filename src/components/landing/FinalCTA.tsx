import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

export function FinalCTA() {
  return (
    <section className="py-14 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-b from-brand-500/15 via-brand-500/5 to-transparent p-8 text-center sm:p-12 md:p-16">
          <div className="pointer-events-none absolute inset-x-0 -bottom-40 h-80 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(34,197,94,0.35),transparent_70%)]" />
          <div className="relative">
            <h2 className="text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
              Savez-vous vraiment
              <br />
              ce que vous gagnez ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Créez votre compte, collez votre iCal, remplissez vos dépenses.
              Vous aurez votre vrai net en moins de 2 minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                href="/signup"
                size="lg"
                icon={<ArrowRight size={16} />}
              >
                Commencer
              </Button>
              <Button href="#features" variant="secondary" size="lg">
                Voir les fonctionnalités
              </Button>
            </div>
            <p className="mt-5 text-xs text-dim">
              1 bien gratuit · Payant à partir de 2 biens · 11 biens et plus ? Contactez-nous.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
