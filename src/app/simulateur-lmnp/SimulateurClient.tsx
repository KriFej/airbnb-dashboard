"use client";

import { useState, useMemo } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Info,
  Scale,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  computeLMNP,
  DEFAULT_LMNP_INPUTS,
  formatEuro,
  formatPct,
  TRANCHES_IR,
  type LMNPInputs,
} from "@/lib/lmnp";
import { Button } from "@/components/ui/Button";

type Step = "revenus" | "charges" | "amortissements" | "resultats";

const STEPS: { id: Step; label: string }[] = [
  { id: "revenus", label: "Revenus" },
  { id: "charges", label: "Charges" },
  { id: "amortissements", label: "Amortissements" },
  { id: "resultats", label: "Résultats" },
];

export function SimulateurClient() {
  const [step, setStep] = useState<Step>("revenus");
  const [inputs, setInputs] = useState<LMNPInputs>(DEFAULT_LMNP_INPUTS);

  const patch = (partial: Partial<LMNPInputs>) =>
    setInputs((prev) => ({ ...prev, ...partial }));

  const patchCharges = (partial: Partial<LMNPInputs["charges"]>) =>
    setInputs((prev) => ({ ...prev, charges: { ...prev.charges, ...partial } }));

  const patchAmorti = (partial: Partial<LMNPInputs["amortissements"]>) =>
    setInputs((prev) => ({
      ...prev,
      amortissements: { ...prev.amortissements, ...partial },
    }));

  const result = useMemo(() => computeLMNP(inputs), [inputs]);

  const stepIdx = STEPS.findIndex((s) => s.id === step);
  const canNext = stepIdx < STEPS.length - 1;
  const canPrev = stepIdx > 0;

  const goNext = () => {
    if (canNext) setStep(STEPS[stepIdx + 1].id);
  };
  const goPrev = () => {
    if (canPrev) setStep(STEPS[stepIdx - 1].id);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 md:py-16">
      {/* Header */}
      <div className="text-center">
        <span className="text-xs uppercase tracking-widest text-brand-500">
          Simulateur LMNP 2024
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          Micro-BIC ou Régime Réel ?
        </h1>
        <p className="mt-3 text-muted">
          Entrez vos chiffres — on calcule les deux et on vous dit quoi choisir.
        </p>
      </div>

      {/* Stepper */}
      <div className="mt-10 flex items-center justify-center gap-0">
        {STEPS.map((s, i) => {
          const active = s.id === step;
          const done = i < stepIdx;
          return (
            <div key={s.id} className="flex items-center">
              <button
                type="button"
                onClick={() => setStep(s.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  active
                    ? "bg-brand-500 text-black"
                    : done
                    ? "text-brand-400"
                    : "text-dim"
                }`}
              >
                {done ? (
                  <CheckCircle2 size={13} />
                ) : (
                  <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold ${active ? "bg-black/20" : "bg-fg/10"}`}>
                    {i + 1}
                  </span>
                )}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-8 ${i < stepIdx ? "bg-brand-500/40" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="mt-8">
        {step === "revenus" && (
          <StepCard title="Vos revenus locatifs">
            <div className="grid gap-6 md:grid-cols-2">
              <Field
                label="Revenus Airbnb (bruts annuels)"
                hint="Total affiché sur votre tableau de bord Airbnb, avant commission"
                value={inputs.revenusAirbnb}
                onChange={(v) => patch({ revenusAirbnb: v })}
                suffix="€ / an"
              />
              <Field
                label="Revenus Booking.com (bruts annuels)"
                value={inputs.revenusBooking}
                onChange={(v) => patch({ revenusBooking: v })}
                suffix="€ / an"
              />
              <Field
                label="Commission Airbnb"
                value={inputs.fraisAirbnbPct}
                onChange={(v) => patch({ fraisAirbnbPct: v })}
                suffix="%"
                step={0.5}
                min={0}
                max={20}
              />
              <Field
                label="Commission Booking.com"
                value={inputs.fraisBookingPct}
                onChange={(v) => patch({ fraisBookingPct: v })}
                suffix="%"
                step={0.5}
                min={0}
                max={20}
              />
              <Field
                label="Prix d'acquisition du bien"
                hint="Utilisé pour calculer la rentabilité nette"
                value={inputs.prixAcquisition}
                onChange={(v) => patch({ prixAcquisition: v })}
                suffix="€"
              />
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-fg">Tranche marginale d&apos;imposition (TMI)</label>
                <div className="grid grid-cols-5 gap-2">
                  {TRANCHES_IR.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => patch({ trancheMarginaleIR: t })}
                      className={`rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                        inputs.trancheMarginaleIR === t
                          ? "border-brand-500 bg-brand-500/10 text-brand-400"
                          : "border-border bg-surface text-muted hover:border-border-hover hover:text-fg"
                      }`}
                    >
                      {t}%
                    </button>
                  ))}
                </div>
                <p className="text-xs text-dim">Votre taux d&apos;imposition marginal personnel</p>
              </div>
            </div>
            <ToggleField
              label="Meublé de tourisme classé"
              hint="Abattement 71% (au lieu de 50%) en Micro-BIC. Classement officiel préfectoral."
              checked={inputs.meubleTourismeClasse}
              onChange={(v) => patch({ meubleTourismeClasse: v })}
            />
          </StepCard>
        )}

        {step === "charges" && (
          <StepCard title="Vos charges réelles annuelles" subtitle="Ces charges sont déductibles en Régime Réel uniquement.">
            <div className="grid gap-6 md:grid-cols-2">
              <Field
                label="Intérêts d'emprunt"
                hint="Uniquement les intérêts, pas le capital remboursé"
                value={inputs.charges.interetsEmprunt}
                onChange={(v) => patchCharges({ interetsEmprunt: v })}
                suffix="€ / an"
              />
              <Field
                label="Charges de copropriété"
                hint="Part récupérable et non récupérable"
                value={inputs.charges.chargesCopropriete}
                onChange={(v) => patchCharges({ chargesCopropriete: v })}
                suffix="€ / an"
              />
              <Field
                label="Taxe foncière"
                value={inputs.charges.taxeFonciere}
                onChange={(v) => patchCharges({ taxeFonciere: v })}
                suffix="€ / an"
              />
              <Field
                label="Assurance (PNO + loyer impayé)"
                value={inputs.charges.assurance}
                onChange={(v) => patchCharges({ assurance: v })}
                suffix="€ / an"
              />
              <Field
                label="Travaux d'entretien"
                hint="Réparations, peinture, petits travaux"
                value={inputs.charges.travauxEntretien}
                onChange={(v) => patchCharges({ travauxEntretien: v })}
                suffix="€ / an"
              />
              <Field
                label="Autres charges"
                hint="Frais de gestion, expert-comptable, publicité..."
                value={inputs.charges.autresCharges}
                onChange={(v) => patchCharges({ autresCharges: v })}
                suffix="€ / an"
              />
            </div>
            <div className="mt-4 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Total charges réelles</span>
                <span className="text-lg font-semibold text-brand-400">
                  {formatEuro(
                    inputs.charges.interetsEmprunt +
                    inputs.charges.chargesCopropriete +
                    inputs.charges.taxeFonciere +
                    inputs.charges.assurance +
                    inputs.charges.travauxEntretien +
                    inputs.charges.autresCharges
                  )} / an
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">Les commissions plateformes ({formatEuro((inputs.revenusAirbnb * inputs.fraisAirbnbPct / 100) + (inputs.revenusBooking * inputs.fraisBookingPct / 100))}/an) sont ajoutées automatiquement.</p>
            </div>
          </StepCard>
        )}

        {step === "amortissements" && (
          <StepCard
            title="Amortissements LMNP"
            subtitle="En Régime Réel, vous pouvez amortir le bien, le mobilier et les travaux. C'est souvent ce qui rend le Réel imbattable."
          >
            <div className="grid gap-6 md:grid-cols-3">
              <AmortisseField
                label="Amortissement du bien"
                hint="Valeur du bien hors terrain ÷ 25 ans"
                value={inputs.amortissements.bien}
                onChange={(v) => patchAmorti({ bien: v })}
                exemple={`ex: ${formatEuro(inputs.prixAcquisition * 0.8 / 25)}/an pour un bien à ${formatEuro(inputs.prixAcquisition)}`}
              />
              <AmortisseField
                label="Amortissement mobilier"
                hint="Valeur du mobilier ÷ 7 ans"
                value={inputs.amortissements.mobilier}
                onChange={(v) => patchAmorti({ mobilier: v })}
                exemple="ex: 857 €/an pour 6 000 € de mobilier"
              />
              <AmortisseField
                label="Amortissement travaux"
                hint="Gros travaux ÷ 10 ans"
                value={inputs.amortissements.travaux}
                onChange={(v) => patchAmorti({ travaux: v })}
                exemple="ex: 1 000 €/an pour 10 000 € de travaux"
              />
            </div>
            <div className="mt-4 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Total amortissements annuels</span>
                <span className="text-lg font-semibold text-brand-400">
                  {formatEuro(inputs.amortissements.bien + inputs.amortissements.mobilier + inputs.amortissements.travaux)} / an
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">
                Ces amortissements viennent réduire votre base imposable en Régime Réel — sans impacter votre trésorerie.
              </p>
            </div>
            <div className="mt-4 rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-start gap-3">
                <Info size={15} className="mt-0.5 shrink-0 text-muted" />
                <div className="text-xs text-muted leading-relaxed">
                  <strong className="text-fg">Comment calculer mes amortissements ?</strong><br />
                  Bien : (prix d&apos;achat × 80%) ÷ 25 ans. Mobilier : valeur meubles ÷ 7 ans. Travaux lourds : montant ÷ 10 ans.
                  La valeur du terrain (environ 20% du prix d&apos;achat) n&apos;est pas amortissable.
                </div>
              </div>
            </div>
          </StepCard>
        )}

        {step === "resultats" && (
          <div className="space-y-6">
            {/* Winner banner */}
            <div className={`relative overflow-hidden rounded-2xl p-6 md:p-8 ${
              result.meilleurRegime === "reel"
                ? "bg-brand-500 text-black"
                : "border border-border bg-card"
            }`}>
              {result.meilleurRegime === "reel" && (
                <div className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-20"
                  style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,255,255,0.8), transparent)" }} />
              )}
              <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Zap size={16} className={result.meilleurRegime === "reel" ? "text-black" : "text-brand-500"} fill="currentColor" />
                    <span className={`text-xs font-semibold uppercase tracking-widest ${result.meilleurRegime === "reel" ? "text-black/70" : "text-brand-400"}`}>
                      Recommandation LocFiscal
                    </span>
                  </div>
                  <h2 className={`mt-2 text-2xl font-semibold ${result.meilleurRegime === "reel" ? "text-black" : "text-fg"}`}>
                    {result.meilleurRegime === "reel"
                      ? "Optez pour le Régime Réel"
                      : "Le Micro-BIC est votre meilleur choix"}
                  </h2>
                  <p className={`mt-1 text-sm ${result.meilleurRegime === "reel" ? "text-black/70" : "text-muted"}`}>
                    {result.meilleurRegime === "reel"
                      ? `Vous économisez ${formatEuro(result.economieFiscale)} d'impôts par an vs le Micro-BIC.`
                      : `Vous économisez ${formatEuro(result.economieFiscale)} vs le Régime Réel. Vos charges ne dépassent pas l'abattement.`}
                  </p>
                </div>
                <div className="text-center">
                  <div className={`text-4xl font-semibold ${result.meilleurRegime === "reel" ? "text-black" : "text-brand-500"}`}>
                    {formatEuro(result.economieFiscale)}
                  </div>
                  <div className={`text-xs ${result.meilleurRegime === "reel" ? "text-black/60" : "text-muted"}`}>
                    d&apos;économie annuelle
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison */}
            <div className="grid gap-4 md:grid-cols-2">
              <RegimeCard
                label={result.micro.label}
                baseImposable={result.micro.baseImposable}
                impotRevenu={result.micro.impotRevenu}
                prelevementsSociaux={result.micro.prelevementsSociaux}
                totalImposition={result.micro.totalImposition}
                chargesDeduites={result.micro.chargesDeduites}
                isWinner={result.meilleurRegime === "micro-bic"}
                icon={<Scale size={16} />}
              />
              <RegimeCard
                label={result.reel.label}
                baseImposable={result.reel.baseImposable}
                impotRevenu={result.reel.impotRevenu}
                prelevementsSociaux={result.reel.prelevementsSociaux}
                totalImposition={result.reel.totalImposition}
                chargesDeduites={result.reel.chargesDeduites}
                isWinner={result.meilleurRegime === "reel"}
                icon={<TrendingDown size={16} />}
              />
            </div>

            {/* KPIs */}
            <div className="grid gap-4 sm:grid-cols-3">
              <KpiBox label="Revenus bruts" value={formatEuro(result.revenusBruts)} />
              <KpiBox label="Revenus nets plateformes" value={formatEuro(result.revenusNetsPlateformes)} />
              <KpiBox
                label="Rentabilité brute"
                value={result.rentabiliteBrute ? formatPct(result.rentabiliteBrute) : "—"}
              />
              <KpiBox
                label="Rentabilité nette après impôts"
                value={result.rentabiliteNette ? formatPct(result.rentabiliteNette) : "—"}
                highlight
              />
              <KpiBox label="Total charges réelles" value={formatEuro(result.totalChargesReelles)} />
              <KpiBox label="Total amortissements" value={formatEuro(result.totalAmortissements)} />
            </div>

            {/* Export PDF */}
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
              <div>
                <p className="text-sm font-medium text-fg">Exporter ce récapitulatif</p>
                <p className="mt-0.5 text-xs text-muted">Imprimez ou sauvegardez en PDF pour votre comptable ou votre déclaration.</p>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-brand-400"
              >
                <Download size={14} />
                Exporter PDF
              </button>
            </div>

            {/* CTA */}
            <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-6 text-center">
              <h3 className="text-base font-semibold text-fg">Suivez votre situation sur toute l&apos;année</h3>
              <p className="mt-2 text-sm text-muted">
                Créez un compte pour accéder au tableau de bord fiscal, suivre vos revenus mois par mois et générer votre récapitulatif déclaration.
              </p>
              <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button href="/signup" size="lg" icon={<ArrowRight size={16} />}>
                  Accès complet — 14 jours gratuits
                </Button>
                <Button href="/" variant="secondary" size="lg">
                  Retour à l&apos;accueil
                </Button>
              </div>
              <p className="mt-3 text-xs text-dim">Pro à 79 € / an · Annulation à tout moment</p>
            </div>

            {/* Récapitulatif imprimable — visible uniquement à l'impression */}
            <PrintRecap inputs={inputs} result={result} />
          </div>
        )}
      </div>

      {/* Navigation */}
      {step !== "resultats" && (
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={goPrev}
            disabled={!canPrev}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm text-muted transition-colors hover:border-border-hover hover:text-fg disabled:opacity-30"
          >
            ← Précédent
          </button>
          <button
            type="button"
            onClick={goNext}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-500 px-6 text-sm font-semibold text-black transition-colors hover:bg-brand-400"
          >
            {stepIdx === STEPS.length - 2 ? "Voir les résultats" : "Suivant"} <ArrowRight size={14} />
          </button>
        </div>
      )}
      {step === "resultats" && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setStep("revenus")}
            className="text-xs text-muted underline underline-offset-2 hover:text-fg"
          >
            Modifier mes chiffres
          </button>
        </div>
      )}
    </div>
  );
}

function StepCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <h2 className="text-lg font-semibold text-fg">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      <div className="mt-6 space-y-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  suffix,
  step = 100,
  min = 0,
  max,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-fg">{label}</label>
      {hint && <p className="text-xs text-dim">{hint}</p>}
      <div className="relative">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-11 w-full rounded-xl border border-border bg-surface px-3 pr-16 text-sm text-fg placeholder:text-dim focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/20"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-dim">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function AmortisseField({
  label,
  hint,
  value,
  onChange,
  exemple,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
  exemple: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-fg">{label}</label>
      <p className="text-xs text-muted">{hint}</p>
      <div className="relative">
        <input
          type="number"
          value={value}
          min={0}
          step={100}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-11 w-full rounded-xl border border-border bg-surface px-3 pr-16 text-sm text-fg focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/20"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-dim">
          €/an
        </span>
      </div>
      <p className="text-[11px] text-dim">{exemple}</p>
    </div>
  );
}

function ToggleField({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-surface p-4">
      <div>
        <div className="text-sm font-medium text-fg">{label}</div>
        {hint && <div className="mt-0.5 text-xs text-muted">{hint}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
          checked ? "bg-brand-500" : "bg-fg/10"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function RegimeCard({
  label,
  baseImposable,
  impotRevenu,
  prelevementsSociaux,
  totalImposition,
  chargesDeduites,
  isWinner,
  icon,
}: {
  label: string;
  baseImposable: number;
  impotRevenu: number;
  prelevementsSociaux: number;
  totalImposition: number;
  chargesDeduites: number;
  isWinner: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border p-6 transition-all ${
      isWinner
        ? "border-brand-500/40 bg-brand-500/8"
        : "border-border bg-card"
    }`}>
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 text-sm font-semibold ${isWinner ? "text-brand-400" : "text-fg"}`}>
          {icon}
          {label}
        </div>
        {isWinner && (
          <span className="flex items-center gap-1 rounded-full bg-brand-500/15 px-2.5 py-1 text-[11px] font-medium text-brand-400">
            <TrendingUp size={10} /> Recommandé
          </span>
        )}
      </div>

      <div className="mt-4 space-y-3">
        <Row label="Charges déduites" value={formatEuro(chargesDeduites)} />
        <Row label="Base imposable" value={formatEuro(baseImposable)} highlight />
        <Row label="Impôt sur le revenu" value={formatEuro(impotRevenu)} />
        <Row label="Prélèvements sociaux (17,2%)" value={formatEuro(prelevementsSociaux)} />
        <div className={`mt-2 flex items-center justify-between rounded-xl p-3 ${isWinner ? "bg-brand-500/10" : "bg-fg/5"}`}>
          <span className={`text-sm font-semibold ${isWinner ? "text-brand-400" : "text-fg"}`}>
            Total imposition
          </span>
          <span className={`text-lg font-semibold ${isWinner ? "text-brand-500" : "text-fg"}`}>
            {formatEuro(totalImposition)}
          </span>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between text-sm ${highlight ? "text-fg" : "text-muted"}`}>
      <span>{label}</span>
      <span className={`font-medium ${highlight ? "text-fg" : ""}`}>{value}</span>
    </div>
  );
}

function KpiBox({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "border-brand-500/30 bg-brand-500/8" : "border-border bg-card"}`}>
      <div className="text-xs text-muted">{label}</div>
      <div className={`mt-1 text-xl font-semibold ${highlight ? "text-brand-500" : "text-fg"}`}>{value}</div>
    </div>
  );
}

// ─── Récapitulatif imprimable ─────────────────────────────────────────────────
// Invisible à l'écran, affiché uniquement lors de l'impression (window.print())

function PrintRecap({
  inputs,
  result,
}: {
  inputs: LMNPInputs;
  result: ReturnType<typeof computeLMNP>;
}) {
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const winner = result.meilleurRegime === "reel" ? result.reel : result.micro;
  const loser = result.meilleurRegime === "reel" ? result.micro : result.reel;

  return (
    <div
      id="lmnp-print-recap"
      style={{ display: "none" }}
      aria-hidden="true"
    >
      <style>{`
        #lmnp-print-recap { font-family: system-ui, sans-serif; font-size: 12px; color: #111; }
        #lmnp-print-recap h1 { font-size: 22px; font-weight: 700; margin: 0 0 4px; }
        #lmnp-print-recap h2 { font-size: 14px; font-weight: 600; margin: 20px 0 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
        #lmnp-print-recap table { width: 100%; border-collapse: collapse; }
        #lmnp-print-recap td { padding: 6px 0; border-bottom: 1px solid #f3f4f6; }
        #lmnp-print-recap td:last-child { text-align: right; font-weight: 600; }
        #lmnp-print-recap .winner-box { background: #f0fdf4; border: 2px solid #22c55e; border-radius: 10px; padding: 14px 18px; margin: 16px 0; }
        #lmnp-print-recap .winner-box .label { font-size: 11px; color: #16a34a; text-transform: uppercase; letter-spacing: 0.05em; }
        #lmnp-print-recap .winner-box .amount { font-size: 28px; font-weight: 700; color: #16a34a; }
        #lmnp-print-recap .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        #lmnp-print-recap .regime-box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; }
        #lmnp-print-recap .regime-box.best { border-color: #22c55e; background: #f0fdf4; }
        #lmnp-print-recap .regime-title { font-weight: 700; font-size: 13px; margin-bottom: 8px; }
        #lmnp-print-recap .total-row td { font-weight: 700; font-size: 13px; background: #f9fafb; }
        #lmnp-print-recap .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #9ca3af; }
        #lmnp-print-recap .tag { display: inline-block; background: #dcfce7; color: #15803d; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 99px; margin-left: 8px; }
      `}</style>

      {/* En-tête */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <div>
          <h1>Récapitulatif LMNP 2024</h1>
          <p style={{ color: "#6b7280", margin: 0, fontSize: "11px" }}>
            Généré par LocFiscal · {today}
          </p>
        </div>
        <div style={{ textAlign: "right", fontSize: "11px", color: "#6b7280" }}>
          <div style={{ fontWeight: 700, fontSize: "16px", color: "#111" }}>locfiscal.fr</div>
          <div>Simulateur LMNP 2024</div>
        </div>
      </div>

      {/* Résumé exécutif */}
      <div className="winner-box">
        <div className="label">
          Recommandation LocFiscal
          <span className="tag">
            {result.meilleurRegime === "reel" ? "Régime Réel" : "Micro-BIC"}
          </span>
        </div>
        <div className="amount">{formatEuro(result.economieFiscale)} économisés / an</div>
        <div style={{ fontSize: "11px", color: "#374151", marginTop: "4px" }}>
          vs le régime moins avantageux · TMI {inputs.trancheMarginaleIR}% · {inputs.meubleTourismeClasse ? "Meublé classé (71%)" : "Non classé (50%)"}
        </div>
      </div>

      {/* Données d'entrée */}
      <h2>Revenus et charges déclarés</h2>
      <table>
        <tbody>
          <tr><td>Revenus Airbnb bruts</td><td>{formatEuro(inputs.revenusAirbnb)}</td></tr>
          <tr><td>Revenus Booking.com bruts</td><td>{formatEuro(inputs.revenusBooking)}</td></tr>
          <tr><td>Commissions plateformes</td><td>{formatEuro((inputs.revenusAirbnb * inputs.fraisAirbnbPct / 100) + (inputs.revenusBooking * inputs.fraisBookingPct / 100))}</td></tr>
          <tr><td>Intérêts d'emprunt</td><td>{formatEuro(inputs.charges.interetsEmprunt)}</td></tr>
          <tr><td>Charges de copropriété</td><td>{formatEuro(inputs.charges.chargesCopropriete)}</td></tr>
          <tr><td>Taxe foncière</td><td>{formatEuro(inputs.charges.taxeFonciere)}</td></tr>
          <tr><td>Assurance</td><td>{formatEuro(inputs.charges.assurance)}</td></tr>
          <tr><td>Travaux d'entretien</td><td>{formatEuro(inputs.charges.travauxEntretien)}</td></tr>
          <tr><td>Autres charges</td><td>{formatEuro(inputs.charges.autresCharges)}</td></tr>
          <tr><td>Amortissement bien</td><td>{formatEuro(inputs.amortissements.bien)}</td></tr>
          <tr><td>Amortissement mobilier</td><td>{formatEuro(inputs.amortissements.mobilier)}</td></tr>
          <tr><td>Amortissement travaux</td><td>{formatEuro(inputs.amortissements.travaux)}</td></tr>
          <tr className="total-row">
            <td>Total charges + amortissements</td>
            <td>{formatEuro(result.totalChargesReelles + result.totalAmortissements)}</td>
          </tr>
        </tbody>
      </table>

      {/* Comparaison régimes */}
      <h2>Comparaison des régimes fiscaux</h2>
      <div className="grid2">
        <div className={`regime-box${result.meilleurRegime === "reel" ? " best" : ""}`}>
          <div className="regime-title">
            {result.reel.label}
            {result.meilleurRegime === "reel" && <span className="tag">✓ Recommandé</span>}
          </div>
          <table>
            <tbody>
              <tr><td>Charges déduites</td><td>{formatEuro(result.reel.chargesDeduites)}</td></tr>
              <tr><td>Base imposable</td><td>{formatEuro(result.reel.baseImposable)}</td></tr>
              <tr><td>Impôt sur le revenu</td><td>{formatEuro(result.reel.impotRevenu)}</td></tr>
              <tr><td>Prélèvements sociaux (17,2%)</td><td>{formatEuro(result.reel.prelevementsSociaux)}</td></tr>
              <tr className="total-row"><td>Total imposition</td><td>{formatEuro(result.reel.totalImposition)}</td></tr>
            </tbody>
          </table>
        </div>
        <div className={`regime-box${result.meilleurRegime === "micro-bic" ? " best" : ""}`}>
          <div className="regime-title">
            {result.micro.label}
            {result.meilleurRegime === "micro-bic" && <span className="tag">✓ Recommandé</span>}
          </div>
          <table>
            <tbody>
              <tr><td>Abattement forfaitaire</td><td>{formatEuro(result.micro.chargesDeduites)}</td></tr>
              <tr><td>Base imposable</td><td>{formatEuro(result.micro.baseImposable)}</td></tr>
              <tr><td>Impôt sur le revenu</td><td>{formatEuro(result.micro.impotRevenu)}</td></tr>
              <tr><td>Prélèvements sociaux (17,2%)</td><td>{formatEuro(result.micro.prelevementsSociaux)}</td></tr>
              <tr className="total-row"><td>Total imposition</td><td>{formatEuro(result.micro.totalImposition)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Rentabilité */}
      <h2>Performance globale</h2>
      <table>
        <tbody>
          <tr><td>Revenus bruts annuels</td><td>{formatEuro(result.revenusBruts)}</td></tr>
          <tr><td>Revenus nets (après commissions)</td><td>{formatEuro(result.revenusNetsPlateformes)}</td></tr>
          <tr><td>Total charges réelles</td><td>{formatEuro(result.totalChargesReelles)}</td></tr>
          <tr><td>Total amortissements</td><td>{formatEuro(result.totalAmortissements)}</td></tr>
          <tr><td>Imposition optimale ({winner.label})</td><td>{formatEuro(winner.totalImposition)}</td></tr>
          {result.rentabiliteBrute != null && (
            <tr><td>Rentabilité brute</td><td>{formatPct(result.rentabiliteBrute)}</td></tr>
          )}
          {result.rentabiliteNette != null && (
            <tr className="total-row"><td>Rentabilité nette après impôts</td><td>{formatPct(result.rentabiliteNette)}</td></tr>
          )}
        </tbody>
      </table>

      {/* Pied de page */}
      <div className="footer">
        <strong>Avertissement :</strong> Ce récapitulatif est généré par le simulateur LocFiscal à titre informatif.
        Il ne constitue pas un conseil fiscal ou juridique. Les calculs sont basés sur les données saisies et la législation 2024.
        Consultez un expert-comptable spécialisé LMNP pour votre déclaration officielle.
        <br />locfiscal.fr · hello@locfiscal.fr
      </div>
    </div>
  );
}
