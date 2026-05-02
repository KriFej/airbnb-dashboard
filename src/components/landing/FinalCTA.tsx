import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

export function FinalCTA() {
  return (
    <section className="py-14 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-b from-brand-500/12 via-brand-500/5 to-transparent px-8 py-16 text-center sm:px-12 md:px-20 md:py-24">
          {/* Glow */}
          <div className="pointer-events-none absolute inset-x-0 -bottom-32 h-80 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(34,197,94,0.4),transparent_70%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />

          <div className="relative">
            <span className="inline-block text-xs uppercase tracking-widest text-brand-500">
              Commencer maintenant
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Savez-vous vraiment
              <br />
              ce que vous gagnez ?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted">
              Créez votre compte, collez votre iCal, remplissez vos dépenses. Vous aurez votre vrai net en moins de 2 minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/signup" size="lg" icon={<ArrowRight size={16} />}>
                Commencer gratuitement
              </Button>
              <Button href="#features" variant="secondary" size="lg">
                Voir les fonctionnalités
              </Button>
            </div>
            <p className="mt-5 text-xs text-dim">
              1 bien gratuit · Payant à partir de 2 biens · Annulation à tout moment
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
