import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

export function FinalCTA() {
  return (
    <section className="py-16 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-brand-500 px-8 py-16 text-center text-black sm:px-12 md:px-20 md:py-24 shadow-btn-glow">
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,0,0,0.3) 0%, transparent 50%)",
            }}
          />
          <div className="relative">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-black/60">
              Commencer maintenant
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Savez-vous vraiment
              <br />ce que vous gagnez ?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-black/75">
              Créez votre compte, collez votre iCal, remplissez vos dépenses. Vous aurez votre vrai net en moins de 2 minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/signup"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-black px-7 text-[15px] font-semibold text-white transition hover:bg-black/80"
              >
                Commencer gratuitement <ArrowRight size={16} />
              </a>
              <Button href="#features" variant="secondary" size="lg">
                Voir les fonctionnalités
              </Button>
            </div>
            <p className="mt-5 text-xs text-black/60">
              1 bien gratuit · Payant à partir de 2 biens · Annulation à tout moment
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
