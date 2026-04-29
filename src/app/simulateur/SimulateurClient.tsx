"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Info,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

// ─── Règles fiscales loi Le Meur ───────────────────────────────────────────

const REGIMES = {
  "non-classe": {
    label: "Meublé de tourisme non classé",
    sublabel: "La plupart des Airbnb",
    oldAbattement: 0.5,
    oldPlafond: 77_700,
    newAbattement: 0.3,
    newPlafond: 15_000,
  },
  classe: {
    label: "Meublé de tourisme classé ★",
    sublabel: "Bien avec classement officiel",
    oldAbattement: 0.71,
    oldPlafond: 188_700,
    newAbattement: 0.5,
    newPlafond: 77_700,
  },
  chambre: {
    label: "Chambre d'hôtes",
    sublabel: "Inchangé par la réforme",
    oldAbattement: 0.71,
    oldPlafond: 188_700,
    newAbattement: 0.71,
    newPlafond: 188_700,
  },
} as const;

type TypeBien = keyof typeof REGIMES;

const TMI_OPTIONS = [
  { value: 0, label: "0 % (non imposable)" },
  { value: 11, label: "11 %" },
  { value: 30, label: "30 %" },
  { value: 41, label: "41 %" },
  { value: 45, label: "45 %" },
];

const PS = 0.172; // prélèvements sociaux fixes

function euros(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function calcMicroBic(revenu: number, abattement: number, plafond: number, tmi: number) {
  if (revenu > plafond) return null; // régime réel obligatoire
  const imposable = revenu * (1 - abattement);
  const impot = imposable * (tmi / 100 + PS);
  return { imposable, impot };
}

// ─── Composant principal ───────────────────────────────────────────────────

export function SimulateurClient() {
  const [typeBien, setTypeBien] = useState<TypeBien>("non-classe");
  const [revenu, setRevenu] = useState(20_000);
  const [tmi, setTmi] = useState(30);
  const [charges, setCharges] = useState(8_000);

  const regime = REGIMES[typeBien];

  const result = useMemo(() => {
    const ancien = calcMicroBic(revenu, regime.oldAbattement, regime.oldPlafond, tmi);
    const nouveau = calcMicroBic(revenu, regime.newAbattement, regime.newPlafond, tmi);

    // Régime réel simplifié
    const imposableReel = Math.max(revenu - charges, 0);
    const impotReel = imposableReel * (tmi / 100 + PS);

    return { ancien, nouveau, impotReel, imposableReel };
  }, [revenu, tmi, charges, regime]);

  const impactAnnuel =
    result.ancien && result.nouveau
      ? result.nouveau.impot - result.ancien.impot
      : result.ancien
      ? result.impotReel - result.ancien.impot
      : 0;

  const forceReel = !result.nouveau;
  const unchanged = typeBien === "chambre";

  return (
    <main className="bg-bg">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/30 py-16 md:py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(34,197,94,0.12),transparent_70%)]" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-xs font-medium text-brand-400">
            <Calculator size={12} />
            Gratuit · Sans inscription
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-fg sm:text-4xl md:text-5xl">
            Simulateur loi Le Meur
          </h1>
          <p className="mt-4 text-base text-muted md:text-lg">
            La réforme micro-BIC réduit drastiquement l&apos;abattement et le plafond pour les locations courte durée.
            Calculez combien vous allez payer en plus à partir de 2025.
          </p>
        </div>
      </section>

      {/* Simulator */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">

          {/* ─── Formulaire ─── */}
          <div className="space-y-6">
            {/* Type de bien */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-fg">
                Type de bien
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                {(Object.entries(REGIMES) as [TypeBien, typeof REGIMES[TypeBien]][]).map(([key, r]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTypeBien(key)}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      typeBien === key
                        ? "border-brand-500/60 bg-brand-500/8 ring-1 ring-brand-500/30"
                        : "border-border bg-card hover:border-border-hover"
                    }`}
                  >
                    <div className="text-sm font-medium text-fg">{r.label}</div>
                    <div className="mt-0.5 text-xs text-muted">{r.sublabel}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Revenus annuels */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-fg">
                  Revenus bruts annuels
                </label>
                <span className="text-lg font-semibold text-brand-500">{euros(revenu)}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={200_000}
                step={1000}
                value={revenu}
                onChange={(e) => setRevenu(Number(e.target.value))}
                className="w-full accent-brand-500"
              />
              <div className="mt-1 flex justify-between text-xs text-dim">
                <span>1 000 €</span>
                <span>200 000 €</span>
              </div>
            </div>

            {/* TMI */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-fg">
                Tranche marginale d&apos;imposition (TMI)
              </label>
              <div className="flex flex-wrap gap-2">
                {TMI_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setTmi(o.value)}
                    className={`rounded-full border px-4 py-2 text-sm transition-all ${
                      tmi === o.value
                        ? "border-brand-500/60 bg-brand-500/10 font-semibold text-brand-400"
                        : "border-border bg-card text-muted hover:border-border-hover"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-dim">
                Les prélèvements sociaux (17,2 %) sont ajoutés automatiquement.
              </p>
            </div>

            {/* Charges réelles — pour comparaison régime réel */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-fg">
                  Charges annuelles réelles{" "}
                  <span className="font-normal text-muted">(pour simulation régime réel)</span>
                </label>
                <span className="text-lg font-semibold text-fg">{euros(charges)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.min(revenu, 100_000)}
                step={500}
                value={charges}
                onChange={(e) => setCharges(Number(e.target.value))}
                className="w-full accent-brand-500"
              />
              <p className="mt-1 text-xs text-dim">
                Crédit, charges, ménage, frais de plateforme, assurance…
              </p>
            </div>
          </div>

          {/* ─── Résultats ─── */}
          <div className="space-y-4">

            {unchanged ? (
              <div className="flex items-start gap-3 rounded-2xl border border-brand-500/30 bg-brand-500/8 p-5">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-500" />
                <div>
                  <p className="text-sm font-semibold text-fg">Aucun impact pour vous</p>
                  <p className="mt-1 text-xs text-muted">
                    Les chambres d&apos;hôtes ne sont pas concernées par la réforme loi Le Meur.
                    Votre abattement micro-BIC reste à 71 %.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Comparaison ancien / nouveau */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="text-xs font-medium uppercase tracking-widest text-dim">
                      Avant réforme
                    </div>
                    <div className="mt-3 text-2xl font-semibold text-fg">
                      {result.ancien ? euros(result.ancien.impot) : "—"}
                    </div>
                    <div className="mt-1 text-xs text-muted">
                      Abattement {(regime.oldAbattement * 100).toFixed(0)} %
                    </div>
                    {result.ancien && (
                      <div className="mt-1 text-xs text-dim">
                        Imposable : {euros(result.ancien.imposable)}
                      </div>
                    )}
                  </div>

                  <div className={`rounded-2xl border p-5 ${forceReel ? "border-amber-500/40 bg-amber-500/8" : "border-red-500/30 bg-red-500/8"}`}>
                    <div className="text-xs font-medium uppercase tracking-widest text-dim">
                      Après réforme
                    </div>
                    {forceReel ? (
                      <>
                        <div className="mt-3 text-sm font-semibold text-amber-400">
                          Micro-BIC impossible
                        </div>
                        <div className="mt-1 text-xs text-amber-400/80">
                          Revenus &gt; {euros(regime.newPlafond)}<br />→ Régime réel obligatoire
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mt-3 text-2xl font-semibold text-red-400">
                          {result.nouveau ? euros(result.nouveau.impot) : "—"}
                        </div>
                        <div className="mt-1 text-xs text-muted">
                          Abattement {(regime.newAbattement * 100).toFixed(0)} %
                        </div>
                        {result.nouveau && (
                          <div className="mt-1 text-xs text-dim">
                            Imposable : {euros(result.nouveau.imposable)}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Impact total */}
                <div className={`rounded-2xl p-5 ${impactAnnuel > 0 ? "bg-red-500/10 border border-red-500/30" : "bg-brand-500/10 border border-brand-500/30"}`}>
                  <div className="flex items-center gap-2">
                    {impactAnnuel > 0
                      ? <TrendingDown size={18} className="text-red-400" />
                      : <TrendingUp size={18} className="text-brand-500" />
                    }
                    <span className="text-xs font-semibold uppercase tracking-widest text-dim">
                      Impact annuel
                    </span>
                  </div>
                  <div className={`mt-2 text-4xl font-semibold tracking-tight ${impactAnnuel > 0 ? "text-red-400" : "text-brand-500"}`}>
                    {impactAnnuel > 0 ? "+" : ""}{euros(impactAnnuel)}
                  </div>
                  <div className="mt-1 text-sm text-muted">
                    {impactAnnuel > 0
                      ? `soit ${euros(Math.round(impactAnnuel / 12))} de plus par mois`
                      : "Pas d'augmentation sur votre situation"}
                  </div>
                </div>

                {/* Comparaison régime réel */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-widest text-dim">
                      Régime réel (estimation)
                    </span>
                    {result.impotReel < (result.nouveau?.impot ?? result.ancien?.impot ?? Infinity) && (
                      <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[11px] font-semibold text-brand-400">
                        Potentiellement avantageux
                      </span>
                    )}
                  </div>
                  <div className="mt-3 text-2xl font-semibold text-fg">
                    {euros(result.impotReel)}
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    Basé sur {euros(charges)} de charges déclarées
                  </div>
                  {result.impotReel < (result.nouveau?.impot ?? 999999) && (
                    <p className="mt-3 text-xs text-brand-400">
                      ✓ Avec vos charges actuelles, le régime réel serait plus avantageux que le nouveau micro-BIC.
                    </p>
                  )}
                </div>

                {/* Force réel warning */}
                {forceReel && (
                  <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/8 p-4">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-400" />
                    <p className="text-xs text-amber-300">
                      Vos revenus dépassent le nouveau plafond micro-BIC ({euros(regime.newPlafond)}).
                      Vous devrez obligatoirement passer au régime réel à partir de 2025.
                      Un expert-comptable peut optimiser vos déductions.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* CTA */}
            <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-5">
              <p className="text-sm font-semibold text-fg">
                Suivez votre vrai net en temps réel
              </p>
              <p className="mt-1 text-xs text-muted">
                locpilote calcule votre bénéfice net après frais, charges et impôts — automatiquement depuis votre iCal.
              </p>
              <Link
                href="/signup"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-black transition-colors hover:bg-brand-400"
              >
                <ArrowRight size={14} />
                Essayer gratuitement — 1 bien offert
              </Link>
            </div>

          </div>
        </div>

        {/* Disclaimer légal */}
        <div className="mt-12 flex items-start gap-3 rounded-2xl border border-border bg-card/60 p-5">
          <Info size={16} className="mt-0.5 shrink-0 text-dim" />
          <p className="text-xs leading-relaxed text-dim">
            <span className="font-semibold text-muted">Simulation à titre indicatif uniquement.</span>{" "}
            Les résultats sont des estimations basées sur les règles micro-BIC issues de la loi Le Meur (loi de finances 2024,
            applicable aux revenus 2025). Ils ne constituent pas un conseil fiscal et ne sauraient engager la responsabilité de locpilote.
            Votre situation personnelle (statut LMNP/LMP, charges réelles, amortissements, revenus du foyer…) peut
            significativement modifier le calcul. <strong className="text-muted">Consultez un expert-comptable</strong> pour
            une analyse adaptée à votre situation.
          </p>
        </div>
      </section>
    </main>
  );
}
