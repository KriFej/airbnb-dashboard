import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { GridBackground } from "../ui/GridBackground";
import { ProductMockup } from "./ProductMockup";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <GridBackground />
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-10 md:pt-28 md:pb-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Chip icon={<Sparkles size={12} className="text-brand-500" />} tone="green">
            1 bien gratuit · Payant à partir de 2 biens
          </Chip>
          <h1 className="mt-6 text-[2.25rem] font-medium leading-tight tracking-tight text-fg sm:text-5xl md:text-7xl">
            Arrêtez votre tableur.<br className="hidden sm:block" />Votre bénéfice net en 30 secondes.
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted md:text-lg">
            <span className="sm:hidden">Connectez votre iCal, entrez vos dépenses — votre bénéfice net s'affiche instantanément.</span>
            <span className="hidden sm:inline">Connectez vos iCals Airbnb et Booking, entrez vos dépenses — locpilote calcule votre vrai bénéfice net automatiquement. Sans Excel, sans prise de tête.</span>
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/signup" size="lg" icon={<ArrowRight size={16} />}>
              Commencer gratuitement
            </Button>
            <Button href="#how-it-works" variant="secondary" size="lg">
              Voir comment ça marche
            </Button>
          </div>
          <p className="mt-4 text-xs text-dim">
            <span className="sm:hidden">1 bien gratuit · Sans carte</span>
            <span className="hidden sm:inline">1 bien gratuit · Payant à partir de 2 biens · Annulation à tout moment</span>
          </p>
        </div>
        <div className="mt-16 md:mt-20">
          <ProductMockup />
        </div>
      </div>
    </section>
  );
}
