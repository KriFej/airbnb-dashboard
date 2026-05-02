"use client";

import { useState } from "react";
import { Check, Mail, Zap } from "lucide-react";

type Billing = "monthly" | "annual";

const MONTHLY = { starter: "9,90 €", pro: "19,90 €" };
const ANNUAL = { starter: "99 €", pro: "199 €" };
const ANNUAL_MONTHLY = { starter: "8,25 €", pro: "16,58 €" };

const COMPARE_FEATURES = [
  { label: "Nombre de biens", free: "1", starter: "3", pro: "10" },
  { label: "Synchro iCal Airbnb & Booking", free: true, starter: true, pro: true },
  { label: "Calcul bénéfice net", free: true, starter: true, pro: true },
  { label: "Export CSV", free: true, starter: true, pro: true },
  { label: "Agenda des réservations", free: false, starter: true, pro: true },
  { label: "Rentabilité brute & nette", free: false, starter: true, pro: true },
  { label: "Multi-biens portefeuille", free: false, starter: false, pro: true },
  { label: "Support prioritaire", free: false, starter: false, pro: true },
];

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const annual = billing === "annual";
  const prices = annual ? ANNUAL : MONTHLY;

  return (
    <section id="pricing" className="border-t border-border py-16 md:py-28">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">Tarifs</span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-fg md:text-5xl">
            Des offres simples,
            <br />sans surprise.
          </h2>
          <p className="mt-4 text-muted">Commencez gratuitement. Passez à la vitesse supérieure quand vous êtes prêt.</p>
        </div>

        {/* Toggle */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-border bg-white p-1 shadow-card">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                !annual ? "bg-fg text-white" : "text-muted hover:text-fg"
              }`}
            >
              Mensuel
            </button>
            <button
              type="button"
              onClick={() => setBilling("annual")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                annual ? "bg-fg text-white" : "text-muted hover:text-fg"
              }`}
            >
              Annuel
              <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-black">
                −2 mois
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <PricingCard
            name="Gratuit"
            price="0 €"
            period=""
            desc="1 bien, toutes les fonctionnalités de base. Sans carte."
            cta="Commencer gratuitement"
            href="/signup"
            featured={false}
            features={["1 bien inclus", "Synchro iCal Airbnb & Booking", "Calcul bénéfice net", "Export CSV"]}
          />
          <PricingCard
            name="Starter"
            price={prices.starter}
            period={annual ? "/ an" : "/ mois"}
            subPrice={annual ? `soit ${ANNUAL_MONTHLY.starter} / mois` : undefined}
            desc="Pour les hôtes avec 2 ou 3 biens."
            cta="Choisir Starter"
            href={`/api/checkout?plan=starter${annual ? "-annual" : ""}`}
            featured={false}
            features={["Jusqu'à 3 biens", "Tout le plan Gratuit", "Agenda des réservations", "Rentabilité brute & nette"]}
          />
          <PricingCard
            name="Pro"
            badge="Le plus populaire"
            price={prices.pro}
            period={annual ? "/ an" : "/ mois"}
            subPrice={annual ? `soit ${ANNUAL_MONTHLY.pro} / mois` : undefined}
            desc="Pour les hôtes de 4 à 10 biens."
            cta="Choisir Pro"
            href={`/api/checkout?plan=pro${annual ? "-annual" : ""}`}
            featured={true}
            features={["Jusqu'à 10 biens", "Tout le plan Starter", "Portefeuille multi-biens", "Support prioritaire"]}
          />
        </div>

        {/* Unlimited */}
        <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-border bg-white p-6 shadow-card">
          <div>
            <div className="text-sm font-bold text-fg">Unlimited — 11 biens et plus</div>
            <p className="mt-1 text-sm text-muted">Devis personnalisé, onboarding et support dédiés.</p>
          </div>
          <a
            href="mailto:hello@locpilote.com?subject=Demande%20devis%20Unlimited"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-fg transition hover:border-border-hover"
          >
            <Mail size={14} /> Contacter l&apos;équipe
          </a>
        </div>

        {/* Comparison table */}
        <div className="mt-12">
          <h3 className="text-center text-lg font-bold text-fg mb-6">Comparer les offres</h3>
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
            {/* Header */}
            <div className="grid grid-cols-4 border-b border-border bg-surface px-6 py-4">
              <div className="text-sm font-semibold text-fg">Fonctionnalité</div>
              {["Gratuit", "Starter", "Pro"].map((p) => (
                <div key={p} className="text-center text-sm font-semibold text-fg">{p}</div>
              ))}
            </div>
            {COMPARE_FEATURES.map((f, i) => (
              <div
                key={f.label}
                className={`grid grid-cols-4 px-6 py-4 ${i % 2 === 0 ? "bg-white" : "bg-surface/50"}`}
              >
                <div className="text-sm text-muted">{f.label}</div>
                {([f.free, f.starter, f.pro] as (boolean | string)[]).map((v, j) => (
                  <div key={j} className="flex justify-center">
                    {typeof v === "boolean" ? (
                      v ? (
                        <Check size={16} className="text-brand-500" />
                      ) : (
                        <span className="text-dim">—</span>
                      )
                    ) : (
                      <span className="text-sm font-semibold text-fg">{v}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-dim">
          Tous les tarifs en euros, TVA incluse. Annulation à tout moment.{" "}
          {annual && <span className="text-brand-600 font-semibold"><Zap size={10} className="mr-0.5 inline" />2 mois offerts avec le plan annuel.</span>}
        </p>
      </div>
    </section>
  );
}

function PricingCard({
  name, badge, price, period, subPrice, desc, cta, href, featured, features,
}: {
  name: string; badge?: string; price: string; period: string; subPrice?: string;
  desc: string; cta: string; href: string; featured: boolean; features: string[];
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl p-8 ${
        featured
          ? "bg-brand-500 text-black shadow-btn-glow ring-2 ring-brand-500"
          : "bg-white border border-border shadow-card"
      }`}
    >
      {badge && (
        <span className={`mb-4 inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${
          featured ? "bg-black/15 text-black" : "bg-brand-500/10 text-brand-700"
        }`}>
          {badge}
        </span>
      )}
      <div className={`text-sm font-semibold ${featured ? "text-black/70" : "text-muted"}`}>{name}</div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className={`text-5xl font-bold tracking-tight ${featured ? "text-black" : "text-fg"}`}>{price}</span>
        {period && <span className={`text-sm ${featured ? "text-black/60" : "text-muted"}`}>{period}</span>}
      </div>
      {subPrice && <p className={`mt-1 text-xs ${featured ? "text-black/60" : "text-brand-600"}`}>{subPrice}</p>}
      <p className={`mt-3 text-sm ${featured ? "text-black/70" : "text-muted"}`}>{desc}</p>

      <ul className="mt-6 flex-1 space-y-3">
        {features.map((f) => (
          <li key={f} className={`flex items-start gap-3 text-sm ${featured ? "text-black/80" : "text-muted"}`}>
            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
              featured ? "bg-black/15" : "bg-brand-500/10"
            }`}>
              <Check size={11} className={featured ? "text-black" : "text-brand-600"} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <a
        href={href}
        className={`mt-8 flex w-full items-center justify-center rounded-xl py-3 text-sm font-bold transition ${
          featured
            ? "bg-black text-white hover:bg-black/80"
            : "bg-surface border border-border text-fg hover:bg-surface/80 hover:border-border-hover"
        }`}
      >
        {cta}
      </a>
    </div>
  );
}
