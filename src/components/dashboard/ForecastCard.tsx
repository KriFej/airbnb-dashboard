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
    <section className="rounded-2xl border border-border bg-card p-6">
      <header className="flex items-center gap-2">
        <TrendingUp size={16} className="text-brand-500" />
        <h3 className="text-sm font-medium text-white">Prévision fin de mois</h3>
      </header>
      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-4xl font-medium tracking-tight text-brand-500">
          {formatEuro(forecast)}
        </span>
        {gap > 0 && (
          <span className="text-xs text-muted">
            +{formatEuro(gap)} à venir
          </span>
        )}
      </div>
      <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-[#0E0E0E]">
        <div
          className="h-full rounded-full bg-brand-500 transition-[width] duration-500"
          style={{ width: `${ratio}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-muted">
        <span>Réalisé : {formatEuro(netProfit)}</span>
        <span>Projeté : {formatEuro(forecast)}</span>
      </div>
    </section>
  );
}
