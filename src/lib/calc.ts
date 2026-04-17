import { Inputs, KpiData } from "./types";

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

  return {
    grossRevenue,
    platformFees,
    totalExpenses,
    netProfit,
    feesLostPct,
    forecast,
  };
}

export function formatEuro(n: number): string {
  const rounded = Math.round(n);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(rounded);
}

export function formatPct(n: number): string {
  return `${Math.round(n)}%`;
}
