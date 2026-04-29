import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Button } from "../ui/Button";
import { GridBackground } from "../ui/GridBackground";
import { ProductMockup } from "./ProductMockup";

const AVATARS = ["CD", "MR", "SL", "AV", "JB"];
const COLORS = ["#22C55E", "#4ADE80", "#86EFAC", "#16A34A", "#15803D"];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <GridBackground />
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-0 md:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — text */}
          <div className="flex flex-col items-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-xs font-medium text-brand-400">
              <Sparkles size={12} />
              1 bien gratuit · Payant à partir de 2 biens
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-fg sm:text-5xl md:text-6xl">
              Votre bénéfice net<br />
              <span className="text-brand-500">en 30 secondes.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted md:text-lg">
              Connectez votre iCal Airbnb ou Booking, entrez vos dépenses — locpilote calcule votre vrai net automatiquement. Sans Excel, sans prise de tête.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/signup" size="lg" icon={<ArrowRight size={16} />}>
                Commencer gratuitement
              </Button>
              <Button href="#how-it-works" variant="secondary" size="lg">
                Voir comment ça marche
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {AVATARS.map((initials, i) => (
                  <span
                    key={initials}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-black ring-2 ring-bg"
                    style={{ background: COLORS[i] }}
                  >
                    {initials}
                  </span>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} fill="#22C55E" stroke="none" className="text-brand-500" />
                  ))}
                </div>
                <p className="text-xs text-muted">
                  <span className="font-medium text-fg">1 200+</span> hôtes dans 38 pays
                </p>
              </div>
            </div>
          </div>

          {/* Right — product mockup */}
          <div className="relative lg:block">
            <div className="absolute -inset-4 rounded-3xl bg-brand-500/5 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 shadow-[0_32px_80px_-12px_rgba(0,0,0,0.8)] backdrop-blur">
              <ProductMockup />
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />
      </div>
    </section>
  );
}
