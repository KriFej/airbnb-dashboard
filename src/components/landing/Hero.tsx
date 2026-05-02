import { ArrowRight, Star } from "lucide-react";
import { Button } from "../ui/Button";
import { ProductMockup } from "./ProductMockup";

const AVATARS = [
  { initials: "CD", bg: "#EAB308", dark: false },
  { initials: "MR", bg: "#1C1C1C", dark: true },
  { initials: "SL", bg: "#FACC15", dark: false },
  { initials: "AV", bg: "#6B7280", dark: true },
  { initials: "JB", bg: "#111111", dark: true },
];

const STEPS = [
  { n: "01", label: "Créez votre compte" },
  { n: "02", label: "Connectez votre iCal" },
  { n: "03", label: "Voyez votre net" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg">
      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-0 md:pt-24">

        {/* Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            1 bien gratuit · Sans carte bancaire
          </div>
        </div>

        {/* Headline */}
        <div className="mt-6 text-center">
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-fg sm:text-5xl md:text-6xl lg:text-7xl">
            Votre bénéfice net Airbnb
            <br />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 text-brand-600">en 30 secondes.</span>
              <span
                className="absolute inset-x-0 bottom-1 h-3 z-0 rounded-sm"
                style={{ background: "rgba(234,179,8,0.2)" }}
              />
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Connectez votre iCal Airbnb ou Booking, entrez vos dépenses — locpilote calcule votre vrai net automatiquement. Sans Excel, sans prise de tête.
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/signup" size="lg" icon={<ArrowRight size={16} />}>
            Commencer gratuitement
          </Button>
          <Button href="#how-it-works" variant="secondary" size="lg">
            Voir comment ça marche
          </Button>
        </div>

        {/* Social proof */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {AVATARS.map((a) => (
                <span
                  key={a.initials}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ring-2 ring-white"
                  style={{ background: a.bg, color: a.dark ? "#fff" : "#111" }}
                >
                  {a.initials}
                </span>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} fill="#EAB308" stroke="none" />
                ))}
              </div>
              <p className="text-xs text-muted">
                <span className="font-semibold text-fg">1 200+</span> hôtes dans 38 pays
              </p>
            </div>
          </div>
        </div>

        {/* 3-step mini flow */}
        <div className="mt-10 flex items-center justify-center">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center">
              <div className="flex flex-col items-center gap-2 px-4 md:px-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-500/40 bg-white text-sm font-bold text-brand-700 shadow-card">
                  {s.n}
                </div>
                <span className="text-center text-xs font-medium text-muted">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="mb-5 h-px w-8 bg-brand-500/30 md:w-16" />
              )}
            </div>
          ))}
        </div>

        {/* Dashboard mockup */}
        <div className="relative mt-10">
          <div className="relative overflow-hidden rounded-t-2xl border border-b-0 border-border bg-white shadow-card-lg">
            <ProductMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
