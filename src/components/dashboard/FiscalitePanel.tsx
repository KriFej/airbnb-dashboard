"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Info, Scale, TrendingDown, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import {
  computeLMNP,
  formatEuro,
  formatPct,
  totalAmortissements,
  totalCharges,
  TRANCHES_IR,
  type LMNPInputs,
} from "@/lib/lmnp";
import type { Property } from "@/lib/types";

export function FiscalitePanel({ properties }: { properties: Property[] }) {
  const [tmi, setTmi] = useState(30);
  const [meubleTourismeClasse, setMeubleTourismeClasse] = useState(false);
  const [amortiBien, setAmortiBien] = useState(4000);
  const [amortiMobilier, setAmortiMobilier] = useState(857);
  const [amortiTravaux, setAmortiTravaux] = useState(0);

  // Aggregate all properties into LMNP inputs
  const lmnpInputs: LMNPInputs = useMemo(() => {
    const totalAirbnb = properties.reduce((s, p) => s + (p.inputs.airbnb ?? 0), 0);
    const totalBooking = properties.reduce((s, p) => s + (p.inputs.booking ?? 0), 0);
    const avgAirbnbFee =
      properties.length > 0
        ? properties.reduce((s, p) => s + (p.inputs.airbnbFeePct ?? 14), 0) / properties.length
        : 14;
    const avgBookingFee =
      properties.length > 0
        ? properties.reduce((s, p) => s + (p.inputs.bookingFeePct ?? 15), 0) / properties.length
        : 15;

    const credit = properties.reduce((s, p) => s + (p.inputs.credit ?? 0), 0);
    const elec = properties.reduce((s, p) => s + (p.inputs.elec ?? 0), 0);
    const eau = properties.reduce((s, p) => s + (p.inputs.eau ?? 0), 0);
    const internet = properties.reduce((s, p) => s + (p.inputs.internet ?? 0), 0);
    const menage = properties.reduce((s, p) => s + (p.inputs.menage ?? 0), 0);
    const prixAchat = properties.reduce((s, p) => s + (p.inputs.prixAchat ?? 0), 0);

    return {
      revenusAirbnb: totalAirbnb * 12,
      revenusBooking: totalBooking * 12,
      fraisAirbnbPct: avgAirbnbFee,
      fraisBookingPct: avgBookingFee,
      charges: {
        interetsEmprunt: credit * 12,
        chargesCopropriete: 0,
        taxeFonciere: 0,
        assurance: 0,
        fraisPlatformes: 0,
        travauxEntretien: (elec + eau + internet + menage) * 12,
        autresCharges: 0,
      },
      amortissements: {
        bien: amortiBien,
        mobilier: amortiMobilier,
        travaux: amortiTravaux,
      },
      trancheMarginaleIR: tmi,
      meubleTourismeClasse,
      prixAcquisition: prixAchat,
    };
  }, [properties, tmi, meubleTourismeClasse, amortiBien, amortiMobilier, amortiTravaux]);

  const result = useMemo(() => computeLMNP(lmnpInputs), [lmnpInputs]);

  const hasData = result.revenusBruts > 0;

  return (
    <section id="fiscalite" className="scroll-mt-24 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-fg">Fiscalité LMNP</h2>
          <p className="text-sm text-muted mt-0.5">
            Estimation basée sur vos revenus et charges déclarés. Données annualisées.
          </p>
        </div>
        <Link
          href="/simulateur-lmnp"
          className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-3 text-xs text-muted hover:border-border-hover hover:text-fg transition-colors"
        >
          Simulateur complet <ArrowRight size={12} />
        </Link>
      </div>

      {!hasData && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <p className="text-sm text-muted">
            Renseignez vos revenus et dépenses dans la section &quot;Biens&quot; pour voir votre analyse fiscale.
          </p>
        </div>
      )}

      {hasData && (
        <>
          {/* Config fiscale */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-medium text-fg mb-4">Paramètres fiscaux</h3>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-xs font-medium text-muted">Tranche marginale (TMI)</label>
                <div className="mt-2 flex gap-1.5 flex-wrap">
                  {TRANCHES_IR.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTmi(t)}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
                        tmi === t
                          ? "border-brand-500 bg-brand-500/10 text-brand-400"
                          : "border-border bg-surface text-muted hover:border-border-hover"
                      }`}
                    >
                      {t}%
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted">Amortissement bien (€/an)</label>
                <input
                  type="number"
                  value={amortiBien}
                  min={0}
                  step={100}
                  onChange={(e) => setAmortiBien(Number(e.target.value))}
                  className="mt-2 h-9 w-full rounded-xl border border-border bg-surface px-3 text-sm text-fg focus:border-brand-500/60 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted">Amortissement mobilier (€/an)</label>
                <input
                  type="number"
                  value={amortiMobilier}
                  min={0}
                  step={100}
                  onChange={(e) => setAmortiMobilier(Number(e.target.value))}
                  className="mt-2 h-9 w-full rounded-xl border border-border bg-surface px-3 text-sm text-fg focus:border-brand-500/60 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted">Meublé classé (71% abattement)</label>
                <button
                  type="button"
                  role="switch"
                  aria-checked={meubleTourismeClasse}
                  onClick={() => setMeubleTourismeClasse((v) => !v)}
                  className={`mt-3 relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    meubleTourismeClasse ? "bg-brand-500" : "bg-fg/10"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                      meubleTourismeClasse ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Winner banner */}
          <div className={`relative overflow-hidden rounded-2xl p-5 ${
            result.meilleurRegime === "reel"
              ? "bg-brand-500 text-black"
              : "border border-border bg-card"
          }`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Zap size={14} fill="currentColor" className={result.meilleurRegime === "reel" ? "text-black" : "text-brand-500"} />
                  <span className={`text-xs font-semibold uppercase tracking-widest ${result.meilleurRegime === "reel" ? "text-black/70" : "text-brand-400"}`}>
                    Recommandation
                  </span>
                </div>
                <p className={`mt-1 text-base font-semibold ${result.meilleurRegime === "reel" ? "text-black" : "text-fg"}`}>
                  {result.meilleurRegime === "reel"
                    ? "Optez pour le Régime Réel"
                    : "Le Micro-BIC est optimal pour vous"}
                </p>
                <p className={`mt-0.5 text-xs ${result.meilleurRegime === "reel" ? "text-black/70" : "text-muted"}`}>
                  Économie fiscale estimée : {formatEuro(result.economieFiscale)} / an
                </p>
              </div>
              <div className={`text-3xl font-semibold shrink-0 ${result.meilleurRegime === "reel" ? "text-black" : "text-brand-500"}`}>
                {formatEuro(result.economieFiscale)}
              </div>
            </div>
          </div>

          {/* Comparison cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <TaxCard
              label={result.micro.label}
              icon={<Scale size={14} />}
              chargesDeduites={result.micro.chargesDeduites}
              baseImposable={result.micro.baseImposable}
              ir={result.micro.impotRevenu}
              ps={result.micro.prelevementsSociaux}
              total={result.micro.totalImposition}
              isWinner={result.meilleurRegime === "micro-bic"}
            />
            <TaxCard
              label={result.reel.label}
              icon={<TrendingDown size={14} />}
              chargesDeduites={result.reel.chargesDeduites}
              baseImposable={result.reel.baseImposable}
              ir={result.reel.impotRevenu}
              ps={result.reel.prelevementsSociaux}
              total={result.reel.totalImposition}
              isWinner={result.meilleurRegime === "reel"}
            />
          </div>

          {/* Rentabilité */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MiniKpi label="Revenus bruts annuels" value={formatEuro(result.revenusBruts)} />
            <MiniKpi label="Nets plateformes" value={formatEuro(result.revenusNetsPlateformes)} />
            <MiniKpi
              label="Rentabilité brute"
              value={result.rentabiliteBrute != null ? formatPct(result.rentabiliteBrute) : "—"}
            />
            <MiniKpi
              label="Rentabilité nette après impôts"
              value={result.rentabiliteNette != null ? formatPct(result.rentabiliteNette) : "—"}
              green
            />
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
            <Info size={14} className="mt-0.5 shrink-0 text-muted" />
            <p className="text-xs text-muted leading-relaxed">
              Ces estimations sont basées sur vos revenus mensuels annualisés. Elles ne tiennent pas compte de votre foyer fiscal complet.
              Pour une optimisation précise, consultez un expert-comptable spécialisé LMNP.
              LocFiscal vous aide à préparer cette conversation et à comprendre votre situation.
            </p>
          </div>
        </>
      )}
    </section>
  );
}

function TaxCard({
  label,
  icon,
  chargesDeduites,
  baseImposable,
  ir,
  ps,
  total,
  isWinner,
}: {
  label: string;
  icon: React.ReactNode;
  chargesDeduites: number;
  baseImposable: number;
  ir: number;
  ps: number;
  total: number;
  isWinner: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${isWinner ? "border-brand-500/30 bg-brand-500/8" : "border-border bg-card"}`}>
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 text-sm font-medium ${isWinner ? "text-brand-400" : "text-muted"}`}>
          {icon} {label}
        </div>
        {isWinner && (
          <span className="flex items-center gap-1 rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-medium text-brand-400">
            <TrendingUp size={9} /> Optimal
          </span>
        )}
      </div>
      <div className="mt-4 space-y-2.5 text-sm">
        <div className="flex justify-between text-muted">
          <span>Charges déduites</span>
          <span className="text-fg font-medium">{formatEuro(chargesDeduites)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Base imposable</span>
          <span className="text-fg font-medium">{formatEuro(baseImposable)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>IR estimé</span>
          <span className="text-fg">{formatEuro(ir)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Prélèvements sociaux</span>
          <span className="text-fg">{formatEuro(ps)}</span>
        </div>
        <div className={`flex justify-between rounded-lg p-2.5 ${isWinner ? "bg-brand-500/10" : "bg-fg/5"}`}>
          <span className={`font-semibold ${isWinner ? "text-brand-400" : "text-fg"}`}>Total impôt</span>
          <span className={`font-semibold ${isWinner ? "text-brand-500" : "text-fg"}`}>{formatEuro(total)}</span>
        </div>
      </div>
    </div>
  );
}

function MiniKpi({
  label,
  value,
  green,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 ${green ? "border-brand-500/20 bg-brand-500/5" : "border-border bg-card"}`}>
      <div className="text-xs text-muted">{label}</div>
      <div className={`mt-1 text-xl font-semibold ${green ? "text-brand-500" : "text-fg"}`}>{value}</div>
    </div>
  );
}
