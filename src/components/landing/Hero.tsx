import { ArrowRight, Calculator, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";
import { GridBackground } from "../ui/GridBackground";

const STATS = [
  { value: "500 000+", label: "hôtes concernés en France" },
  { value: "1 200 €", label: "économisés en moyenne / an" },
  { value: "5 min", label: "pour votre bilan LMNP" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <GridBackground />
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-12 md:pt-32 md:pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-xs font-medium text-brand-400">
            <Sparkles size={12} />
            Simulateur LMNP 2024 — gratuit, sans inscription
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-fg sm:text-5xl md:text-6xl lg:text-7xl">
            Payez moins d&apos;impôts<br />
            <span className="text-brand-500">sur votre Airbnb.</span>
          </h1>

          <p className="mt-6 mx-auto max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            Micro-BIC ou Régime Réel ? LocFiscal calcule votre imposition LMNP en 30 secondes
            et vous montre combien vous économisez. Sans comptable, sans Excel.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button href="/simulateur-lmnp" size="lg" icon={<Calculator size={16} />}>
              Simuler maintenant — gratuit
            </Button>
            <Button href="/signup" variant="secondary" size="lg" icon={<ArrowRight size={16} />}>
              Accès complet
            </Button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted">
            <ShieldCheck size={13} className="text-brand-500" />
            Calculs conformes à la fiscalité française 2024 · Aucune carte requise
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card/60 p-5 text-center backdrop-blur"
            >
              <div className="text-2xl font-semibold text-brand-500 sm:text-3xl">{s.value}</div>
              <div className="mt-1 text-xs text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
