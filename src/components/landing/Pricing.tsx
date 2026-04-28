"use client";

import { useState } from "react";
import { Check, Mail, Sparkles, Zap } from "lucide-react";
import { Button } from "../ui/Button";

type Billing = "monthly" | "annual";

const MONTHLY = { starter: "9,90 €", pro: "19,90 €" };
const ANNUAL = { starter: "99 €", pro: "199 €" };
const ANNUAL_MONTHLY = { starter: "8,25 €", pro: "16,58 €" };

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const annual = billing === "annual";
  const prices = annual ? ANNUAL : MONTHLY;

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

        {/* Toggle mensuel / annuel */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center rounded-full border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !annual ? "bg-white text-black" : "text-muted hover:text-white"
              }`}
            >
              Mensuel
            </button>
            <button
              type="button"
              onClick={() => setBilling("annual")}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                annual ? "bg-white text-black" : "text-muted hover:text-white"
              }`}
            >
              Annuel
              <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-semibold text-black">
                −2 mois
              </span>
            </button>
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-2 xl:grid-cols-4">

          {/* Gratuit */}
          <div className="flex flex-col rounded-2xl border border-border bg-card p-8">
            <div className="text-sm font-medium text-muted">Gratuit</div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-medium tracking-tight">0 €</span>
              <span className="text-sm text-muted">/ mois</span>
            </div>
            <p className="mt-2 text-sm text-muted">1 bien, toutes les fonctionnalités. Sans carte.</p>
            <Button href="/signup" variant="secondary" size="lg" className="mt-6 w-full">
              Commencer gratuitement
            </Button>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "1 bien inclus",
                "Synchronisation iCal Airbnb & Booking",
                "Tableau de bord complet",
                "Calcul bénéfice net en temps réel",
                "Export CSV",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-white/70">
                  <Check size={16} className="mt-0.5 shrink-0 text-brand-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Starter */}
          <div className="flex flex-col rounded-2xl border border-border bg-card p-8">
            <div className="text-sm font-medium text-muted">Starter</div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-medium tracking-tight">{prices.starter}</span>
              <span className="text-sm text-muted">/ {annual ? "an" : "mois"}</span>
            </div>
            {annual && (
              <p className="mt-1 text-xs text-brand-400">soit {ANNUAL_MONTHLY.starter} / mois</p>
            )}
            <p className="mt-2 text-sm text-muted">Pour les hôtes avec 2 ou 3 biens.</p>
            <Button
              href={`/api/checkout?plan=starter${annual ? "-annual" : ""}`}
              variant="secondary"
              size="lg"
              className="mt-6 w-full"
            >
              Choisir Starter
            </Button>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Jusqu'à 3 biens",
                "Synchronisation iCal Airbnb & Booking.com",
                "Tableau de bord complet",
                "Export CSV",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-white/90">
                  <Check size={16} className="mt-0.5 shrink-0 text-brand-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl bg-brand-500 p-8 text-black shadow-glow xl:-mt-4">
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
                <span className="text-5xl font-medium tracking-tight">{prices.pro}</span>
                <span className="text-sm text-black/70">/ {annual ? "an" : "mois"}</span>
              </div>
              {annual && (
                <p className="mt-1 text-xs text-black/70">soit {ANNUAL_MONTHLY.pro} / mois</p>
              )}
              <p className="mt-2 text-sm text-black/80">Pour les hôtes de 4 à 10 biens.</p>
              <Button
                href={`/api/checkout?plan=pro${annual ? "-annual" : ""}`}
                size="lg"
                className="mt-6 w-full !bg-black !text-white hover:!bg-black/90"
              >
                Choisir Pro
              </Button>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "4 à 10 biens",
                  "Tout ce qui est inclus dans Starter",
                  "Agenda des réservations iCal en direct",
                  "Lien direct Airbnb + Booking.com",
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
              <span className="text-4xl font-medium tracking-tight">Sur devis</span>
            </div>
            <p className="mt-2 text-sm text-muted">
              À partir de 11 biens — tarif adapté à votre volume.
            </p>
            <Button
              href="mailto:hello@locpilote.com?subject=Demande%20de%20devis%20Unlimited"
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
                  <Check size={16} className="mt-0.5 shrink-0 text-brand-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-dim">
          Tous les tarifs en euros, TVA incluse. Annulation à tout moment.{" "}
          {annual && (
            <span className="text-brand-400">
              <Zap size={10} className="mr-0.5 inline" />
              Facturation annuelle — 2 mois offerts par rapport au mensuel.
            </span>
          )}
        </p>
      </div>
    </section>
  );
}
