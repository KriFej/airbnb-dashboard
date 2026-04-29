import { TrendingUp } from "lucide-react";
import { formatEuro } from "@/lib/calc";

type Props = {
  forecast: number;
  netProfit: number;
};

export function ForecastCard({ forecast, netProfit }: Props) {
  const gap = forecast - netProfit;
  const ratio =
    netProfit === 0 ? 0 : Math.min(Math.max((netProfit / forecast) * 100, 0), 100);

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
            <TrendingUp size={14} />
          </div>
          <span className="text-xs font-medium text-muted">Prévision fin de mois</span>
        </div>
        {gap > 0 && (
          <span className="rounded-full bg-brand-500/10 px-2.5 py-1 text-[11px] font-medium text-brand-400">
            +{formatEuro(gap)} à venir
          </span>
        )}
      </div>

      <div className="mt-6">
        <div className="text-4xl font-semibold tracking-tight text-brand-500 xl:text-5xl">
          {formatEuro(forecast)}
        </div>
        <p className="mt-1 text-xs text-muted">net projeté ce mois</p>
      </div>

      <div className="mt-6 space-y-2">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-brand-500 transition-[width] duration-700"
            style={{ width: `${ratio}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted">
          <span>Réalisé : {formatEuro(netProfit)}</span>
          <span className="text-brand-400/70">{Math.round(ratio)}%</span>
          <span>Cible : {formatEuro(forecast)}</span>
        </div>
      </div>
    </div>
  );
}
