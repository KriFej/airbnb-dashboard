import { Property } from "./types";
import { computePropertyKpis } from "./calc";

function esc(v: string | number): string {
  const s = String(v);
  return s.includes(",") || s.includes('"') || s.includes("\n")
    ? `"${s.replace(/"/g, '""')}"`
    : s;
}

export function exportPropertiesToCsv(properties: Property[]): void {
  const headers = [
    "Bien",
    "Revenu Airbnb (€)",
    "Revenu Booking (€)",
    "Revenu brut (€)",
    "Frais Airbnb (€)",
    "Frais Booking (€)",
    "Total frais plateforme (€)",
    "Crédit / loyer (€)",
    "Électricité (€)",
    "Eau (€)",
    "Internet (€)",
    "Ménage (€)",
    "Total dépenses (€)",
    "Bénéfice net (€)",
    "% coûts / revenu brut",
  ];

  const rows = properties.map((p) => {
    const k = computePropertyKpis(p);
    const i = p.inputs;
    const airbnbFee = (i.airbnb * i.airbnbFeePct) / 100;
    const bookingFee = (i.booking * i.bookingFeePct) / 100;
    return [
      p.name,
      i.airbnb,
      i.booking,
      k.grossRevenue,
      Math.round(airbnbFee),
      Math.round(bookingFee),
      Math.round(k.platformFees),
      i.credit,
      i.elec,
      i.eau,
      i.internet,
      i.menage,
      Math.round(k.totalExpenses),
      Math.round(k.netProfit),
      `${Math.round(k.feesLostPct)} %`,
    ].map(esc);
  });

  const csv = [headers.map(esc), ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `locpilote-export-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
