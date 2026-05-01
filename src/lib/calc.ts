import { Inputs, KpiData, Property } from "./types";

export function computeKpis(i: Inputs): KpiData {
  const grossRevenue = i.airbnb + i.booking;
  const platformFees =
    (i.airbnb * i.airbnbFeePct) / 100 + (i.booking * i.bookingFeePct) / 100;
  const totalExpenses = i.credit + i.elec + i.eau + i.internet + i.menage;
  const netProfit = grossRevenue - platformFees - totalExpenses;

  const totalCost = platformFees + totalExpenses;
  const feesLostPct = grossRevenue > 0 ? (totalCost / grossRevenue) * 100 : 0;

  const avgFeePct =
    grossRevenue > 0 ? (platformFees / grossRevenue) * 100 : i.airbnbFeePct;
  const futureNet = i.future * (1 - avgFeePct / 100);
  const forecast = netProfit + futureNet;

  // Rendements annualisés (revenus mensuels × 12 / prix d'acquisition)
  const yieldGross =
    i.prixAchat > 0 ? ((grossRevenue * 12) / i.prixAchat) * 100 : null;
  const yieldNet =
    i.prixAchat > 0 ? ((netProfit * 12) / i.prixAchat) * 100 : null;

  return {
    grossRevenue,
    platformFees,
    totalExpenses,
    netProfit,
    feesLostPct,
    forecast,
    yieldGross,
    yieldNet,
  };
}

export function computePropertyKpis(p: Property): KpiData {
  return computeKpis(p.inputs);
}

export function computeAggregateKpis(properties: Property[]): KpiData {
  const agg: KpiData = {
    grossRevenue: 0,
    platformFees: 0,
    totalExpenses: 0,
    netProfit: 0,
    feesLostPct: 0,
    forecast: 0,
    yieldGross: null,
    yieldNet: null,
  };
  let totalPrixAchat = 0;
  for (const p of properties) {
    const k = computePropertyKpis(p);
    agg.grossRevenue += k.grossRevenue;
    agg.platformFees += k.platformFees;
    agg.totalExpenses += k.totalExpenses;
    agg.netProfit += k.netProfit;
    agg.forecast += k.forecast;
    totalPrixAchat += p.inputs.prixAchat ?? 0;
  }
  const totalCost = agg.platformFees + agg.totalExpenses;
  agg.feesLostPct =
    agg.grossRevenue > 0 ? (totalCost / agg.grossRevenue) * 100 : 0;
  if (totalPrixAchat > 0) {
    agg.yieldGross = ((agg.grossRevenue * 12) / totalPrixAchat) * 100;
    agg.yieldNet = ((agg.netProfit * 12) / totalPrixAchat) * 100;
  }
  return agg;
}

export function formatEuro(n: number): string {
  const rounded = Math.round(n);
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(rounded);
}

export function formatPct(n: number): string {
  return `${Math.round(n)} %`;
}

export function formatYield(n: number | null): string {
  if (n === null) return "—";
  return `${n.toFixed(1).replace(".", ",")} %`;
}
