import { Check, Mail, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-border/60 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-widest text-brand-500">
            Tarifs
          </span>
          <h2 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">
            Des offres simples.
          </h2>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-3">
          {/* Starter */}
          <div className="flex flex-col rounded-2xl border border-border bg-card p-8">
            <div className="text-sm font-medium text-muted">Starter</div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-medium tracking-tight">
                9,90 €
              </span>
              <span className="text-sm text-muted">/ mois</span>
            </div>
            <p className="mt-2 text-sm text-muted">
              Pour les hôtes avec un ou deux biens.
            </p>
            <Button
              href="https://buy.stripe.com/TODO-starter"
              external
              variant="secondary"
              size="lg"
              className="mt-6 w-full"
            >
              Choisir Starter
            </Button>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Jusqu'à 2 biens",
                "Suivi des revenus Airbnb & Booking.com",
                "Tableau de bord complet",
                "Export des données (CSV / PDF)",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-white/90">
                  <Check
                    size={16}
                    className="mt-0.5 shrink-0 text-brand-500"
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl bg-brand-500 p-8 text-black shadow-glow md:-mt-4">
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.4) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative flex h-full flex-col">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-black/80">Pro</div>
                <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
                  <Sparkles size={10} /> Le plus populaire
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-5xl font-medium tracking-tight">
                  19,90 €
                </span>
                <span className="text-sm text-black/70">/ mois</span>
              </div>
              <p className="mt-2 text-sm text-black/80">
                Pour les hôtes qui passent de 3 à 10 biens.
              </p>
              <Button
                href="https://buy.stripe.com/TODO-pro"
                external
                size="lg"
                className="mt-6 w-full !bg-black !text-white hover:!bg-black/90"
              >
                Choisir Pro
              </Button>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "3 à 10 biens",
                  "Tout ce qui est inclus dans Starter",
                  "Agenda des réservations synchro iCal en direct",
                  "Lien direct vers les calendriers Airbnb + Booking.com",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={16} className="mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Unlimited */}
          <div className="flex flex-col rounded-2xl border border-border bg-card p-8">
            <div className="text-sm font-medium text-muted">Unlimited</div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-medium tracking-tight">
                Sur devis
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">
              À partir de 11 biens — tarif adapté à votre portefeuille.
            </p>
            <Button
              href="mailto:hello@locpilote.app?subject=Demande%20de%20devis%20Unlimited"
              variant="secondary"
              size="lg"
              className="mt-6 w-full"
              icon={<Mail size={14} />}
            >
              Contacter l&apos;équipe
            </Button>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "11 biens et plus, sans limite",
                "Tout ce qui est inclus dans Pro",
                "Devis personnalisé selon votre volume",
                "Onboarding et support dédiés",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-white/90">
                  <Check
                    size={16}
                    className="mt-0.5 shrink-0 text-brand-500"
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-dim">
          Tous les tarifs en euros, facturés mensuellement. Annulation à tout
          moment. TVA applicable selon le pays.
        </p>
      </div>
    </section>
  );
}
