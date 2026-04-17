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
            Nouveau · synchro iCal en temps réel Airbnb & Booking
          </Chip>
          <h1 className="mt-6 text-5xl font-medium tracking-tight text-white md:text-7xl">
            Votre vrai bénéfice
            <br />
            <span className="text-muted">net Airbnb, enfin visible.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-muted md:text-lg">
            Revenus moins frais moins dépenses. locpilote transforme vos
            calendriers Airbnb et Booking en un seul tableau de bord qui vous
            montre ce que vous gagnez vraiment — en temps réel.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/signup" size="lg" icon={<ArrowRight size={16} />}>
              Commencer gratuitement
            </Button>
            <Button href="#features" variant="secondary" size="lg">
              Voir comment ça marche
            </Button>
          </div>
          <p className="mt-4 text-xs text-dim">
            À partir de 9,90 €/mois · Annulation à tout moment · Mise en route
            en moins de 2 minutes
          </p>
        </div>
        <div className="mt-16 md:mt-20">
          <ProductMockup />
        </div>
      </div>
    </section>
  );
}
