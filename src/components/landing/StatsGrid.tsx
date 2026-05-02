import { Users, BarChart3, Clock } from "lucide-react";

const STATS = [
  {
    icon: Users,
    label: "Hôtes actifs",
    value: "1 200+",
    sub: "dans 38 pays",
    accent: false,
  },
  {
    icon: BarChart3,
    label: "Frais cachés",
    value: "0 €",
    sub: "Chaque centime visible, catégorisé, déduit.",
    accent: false,
  },
  {
    icon: Clock,
    label: "Mise en route",
    value: "2 min",
    sub: "De l'inscription à votre premier net affiché.",
    accent: true,
  },
];

export function StatsGrid() {
  return (
    <section className="border-t border-border py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {STATS.map(({ icon: Icon, label, value, sub, accent }) => (
            <div
              key={label}
              className={`flex flex-col gap-1 rounded-2xl p-8 ${
                accent
                  ? "bg-brand-500 text-black shadow-btn-glow"
                  : "bg-white border border-border shadow-card"
              }`}
            >
              <div className={`flex items-center gap-2 ${accent ? "text-black/70" : "text-brand-600"}`}>
                <Icon size={16} />
                <span className="text-xs font-semibold uppercase tracking-widest">{label}</span>
              </div>
              <div className={`mt-4 text-5xl font-bold tracking-tight ${accent ? "text-black" : "text-fg"}`}>
                {value}
              </div>
              <p className={`mt-2 text-sm ${accent ? "text-black/70" : "text-muted"}`}>{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
