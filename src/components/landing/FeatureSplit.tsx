import { Scale, SlidersHorizontal, FileText, CheckCircle2 } from "lucide-react";

const BENEFITS = [
  "Comparaison Micro-BIC vs Régime Réel en temps réel",
  "Calcul des amortissements (bien, mobilier, travaux)",
  "Estimation de l'impôt selon votre tranche marginale",
  "Récapitulatif prêt pour votre déclaration 2042-C-PRO",
];

export function FeatureSplit() {
  return (
    <section className="relative border-t border-border/30 py-14 md:py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="text-xs uppercase tracking-widest text-brand-500">
              Optimisation fiscale LMNP
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Le bon régime fiscal<br />en 30 secondes.
            </h2>
            <p className="mt-4 text-muted">
              80 % des hôtes en Micro-BIC pourraient économiser des centaines d&apos;euros en passant au Régime Réel.
              LocFiscal vous dit exactement si c&apos;est votre cas.
            </p>
            <ul className="mt-8 space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-muted">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-500" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/8 via-transparent to-transparent" />
            <div className="relative">
              <span className="text-xs uppercase tracking-widest text-brand-500">
                Exemple concret
              </span>
              <p className="mt-2 text-xs text-muted">Hôte avec 16 000 € de revenus Airbnb · TMI 30 %</p>
              <div className="mt-6 space-y-4">
                <RegimeRow
                  icon={<Scale size={15} />}
                  label="Micro-BIC (50%)"
                  baseImposable="8 000 €"
                  impot="3 776 €"
                  highlight={false}
                />
                <RegimeRow
                  icon={<SlidersHorizontal size={15} />}
                  label="Régime Réel"
                  baseImposable="1 200 €"
                  impot="566 €"
                  highlight={true}
                />
                <div className="mt-2 rounded-xl border border-brand-500/30 bg-brand-500/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-brand-400">Économie avec le Réel</span>
                    <span className="text-xl font-semibold text-brand-500">3 210 €</span>
                  </div>
                  <p className="mt-1 text-xs text-muted">par an, sans changer un seul loyer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 relative flex flex-col justify-center overflow-hidden rounded-2xl bg-brand-500 p-10 text-black md:p-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.4) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1 text-xs font-medium backdrop-blur">
                <FileText size={12} /> Déclaration simplifiée
              </div>
              <h3 className="mt-4 max-w-lg text-2xl font-semibold md:text-3xl">
                Votre récapitulatif LMNP,<br />prêt en 5 minutes.
              </h3>
              <p className="mt-3 max-w-md text-sm text-black/75">
                Revenus, charges, amortissements, base imposable — tout est résumé dans un document clair à joindre à votre déclaration ou à envoyer à votre comptable.
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-1 md:items-end">
              <div className="text-5xl font-semibold">800€+</div>
              <div className="text-sm text-black/75">économisés en moyenne<br />sur les frais de comptable</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function RegimeRow({
  icon,
  label,
  baseImposable,
  impot,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  baseImposable: string;
  impot: string;
  highlight: boolean;
}) {
  return (
    <div className={`flex items-center gap-4 rounded-xl p-4 ${highlight ? "border border-brand-500/30 bg-brand-500/10" : "border border-border bg-surface"}`}>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${highlight ? "bg-brand-500/20 text-brand-400" : "bg-fg/5 text-muted"}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className={`text-sm font-medium ${highlight ? "text-brand-400" : "text-fg"}`}>{label}</div>
        <div className="text-xs text-muted">Base imposable : {baseImposable}</div>
      </div>
      <div className={`text-right text-sm font-semibold ${highlight ? "text-brand-500" : "text-fg"}`}>
        {impot}
        <div className="text-xs font-normal text-muted">d&apos;impôt</div>
      </div>
    </div>
  );
}
