import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "../ui/Button";
import { ProductMockup } from "./ProductMockup";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-0 md:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — text */}
          <div className="flex flex-col items-start animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-muted shadow-sm">
              ✦ Automatisation IA
            </div>

            <h1 className="mt-6 text-5xl font-black leading-[1.0] tracking-tighter text-fg sm:text-6xl md:text-7xl">
              Gérez vos biens<br />
              <span className="text-brand-500">en 30 secondes</span><br />
              par jour
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted md:text-lg">
              Locpilote centralise vos annonces Airbnb &amp; Booking, optimise vos tarifs et génère vos rapports fiscaux automatiquement.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/signup" size="lg">
                Essai gratuit 14 jours →
              </Button>
              <Button href="#how-it-works" variant="secondary" size="lg">
                Voir la démo
              </Button>
            </div>
          </div>

          {/* Right — floating card + mockup */}
          <div className="relative animate-slide-up-1">
            {/* Floating revenue card */}
            <div className="absolute -top-6 -left-4 z-10 rounded-2xl border border-border bg-white p-4 shadow-card-md">
              <p className="text-xs text-muted">Revenus nets</p>
              <p className="mt-0.5 text-2xl font-bold text-fg tabular-nums">4 820 €</p>
              <div className="mt-1 flex items-center gap-1 text-xs font-medium text-positive-500">
                <TrendingUp size={12} />
                +9% ce mois
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-card-md">
              <ProductMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
