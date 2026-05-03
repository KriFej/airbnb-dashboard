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
    <section id="pricing" className="relative overflow-hidden border-t border-border/30 py-14 md:py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-widest text-brand-500">Tarifs</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Des offres simples.
          </h2>
        </div>

        {/* Toggle mensuel / annuel */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center rounded-full border border-border bg-white p-1">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                !annual ? "bg-fg text-bg" : "text-muted hover:text-fg"
              }`}
            >
              Mensuel
            </button>
            <button
              type="button"
              onClick={() => setBilling("annual")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                annual ? "bg-fg text-bg" : "text-muted hover:text-fg"
              }`}
            >
              Annuel
              <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                −2 mois
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="relative mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4">

          {/* Gratuit */}
          <PricingCard
            name="Gratuit"
            price="0 €"
            period=""
            desc="1 bien, toutes les fonctionnalités. Sans carte."
            cta="Commencer gratuitement"
            href="/signup"
            variant="default"
            features={[
              "1 bien inclus",
              "Synchronisation iCal Airbnb & Booking",
              "Tableau de bord complet",
              "Calcul bénéfice net en temps réel",
              "Export CSV",
            ]}
          />

          {/* Starter */}
          <PricingCard
            name="Starter"
            price={prices.starter}
            period={annual ? "/ an" : "/ mois"}
            subPrice={annual ? `soit ${ANNUAL_MONTHLY.starter} / mois` : undefined}
            desc="Pour les hôtes avec 2 ou 3 biens."
            cta="Choisir Starter"
            href={`/api/checkout?plan=starter${annual ? "-annual" : ""}`}
            variant="default"
            features={[
              "Jusqu'à 3 biens",
              "Synchronisation iCal Airbnb & Booking.com",
              "Tableau de bord complet",
              "Export CSV",
            ]}
          />

          {/* Pro — highlighted */}
          <PricingCard
            name="Pro"
            badge="Le plus populaire"
            price={prices.pro}
            period={annual ? "/ an" : "/ mois"}
            subPrice={annual ? `soit ${ANNUAL_MONTHLY.pro} / mois` : undefined}
            desc="Pour les hôtes de 4 à 10 biens."
            cta="Choisir Pro"
            href={`/api/checkout?plan=pro${annual ? "-annual" : ""}`}
            variant="featured"
            features={[
              "4 à 10 biens",
              "Tout ce qui est inclus dans Starter",
              "Agenda des réservations iCal en direct",
              "Lien direct Airbnb + Booking.com",
            ]}
          />

          {/* Unlimited */}
          <PricingCard
            name="Unlimited"
            price="Sur devis"
            period=""
            desc="À partir de 11 biens — tarif adapté à votre volume."
            cta="Contacter l'équipe"
            href="mailto:hello@locpilote.com?subject=Demande%20de%20devis%20Unlimited"
            variant="default"
            icon={<Mail size={14} />}
            features={[
              "11 biens et plus, sans limite",
              "Tout ce qui est inclus dans Pro",
              "Devis personnalisé selon votre volume",
              "Onboarding et support dédiés",
            ]}
          />
        </div>

        <p className="relative mt-10 text-center text-xs text-dim">
          Tous les tarifs en euros, TVA incluse. Annulation à tout moment.{" "}
          {annual && (
            <span className="text-brand-500">
              <Zap size={10} className="mr-0.5 inline" />
              Facturation annuelle — 2 mois offerts.
            </span>
          )}
        </p>
      </div>
    </section>
  );
}

type CardVariant = "default" | "featured";

function PricingCard({
  name,
  badge,
  price,
  period,
  subPrice,
  desc,
  cta,
  href,
  variant,
  features,
  icon,
}: {
  name: string;
  badge?: string;
  price: string;
  period: string;
  subPrice?: string;
  desc: string;
  cta: string;
  href: string;
  variant: CardVariant;
  features: string[];
  icon?: React.ReactNode;
}) {
  const featured = variant === "featured";

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-2xl p-8 transition-all duration-300 ${
        featured
          ? "bg-brand-500 text-white shadow-[0_20px_60px_-10px_rgba(99,102,241,0.4)] xl:-mt-4 xl:mb-4"
          : "bg-white border border-border shadow-card hover:shadow-card-md"
      }`}
    >
      {/* Top glow for featured */}
      {featured && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-30"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,255,255,0.8), transparent)",
          }}
        />
      )}

      <div className="relative flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className={`text-sm font-medium ${featured ? "text-white/80" : "text-muted"}`}>
            {name}
          </div>
          {badge && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
              featured ? "bg-white/20 text-white backdrop-blur" : "bg-brand-50 text-brand-600"
            }`}>
              <Sparkles size={10} />
              {badge}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-5">
          <div className="flex items-baseline gap-2">
            <span className={`text-5xl font-semibold tracking-tight ${featured ? "text-white" : "text-fg"}`}>
              {price}
            </span>
            {period && (
              <span className={`text-sm ${featured ? "text-white/60" : "text-muted"}`}>{period}</span>
            )}
          </div>
          {subPrice && (
            <p className={`mt-1 text-xs ${featured ? "text-white/60" : "text-brand-500"}`}>{subPrice}</p>
          )}
        </div>

        <p className={`mt-3 text-sm ${featured ? "text-white/70" : "text-muted"}`}>{desc}</p>

        {/* Features */}
        <ul className="mt-6 space-y-3 flex-1">
          {features.map((f) => (
            <li key={f} className={`flex items-start gap-3 text-sm ${featured ? "text-white/80" : "text-muted"}`}>
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                featured ? "bg-white/20" : "bg-brand-50"
              }`}>
                <Check size={11} className={featured ? "text-white" : "text-brand-500"} />
              </span>
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-8">
          <a
            href={href}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-200 ${
              featured
                ? "bg-white text-brand-600 hover:bg-white/90"
                : "bg-surface text-fg border border-border hover:bg-white"
            }`}
          >
            {icon}
            {cta}
          </a>
        </div>
      </div>
    </div>
  );
}
