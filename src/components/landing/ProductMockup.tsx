import { Calendar, Home, PieChart, Settings, Wallet } from "lucide-react";
import { Logo } from "../ui/Logo";

export function ProductMockup() {
  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-brand-500/10 blur-3xl" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-[#0B0B0B] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#2A2A2A]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#2A2A2A]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#2A2A2A]" />
          <div className="ml-4 h-6 flex-1 rounded-md bg-black/60" />
        </div>

        {/* App body */}
        <div className="grid md:grid-cols-[180px_1fr] min-h-[360px] md:min-h-[440px]">
          {/* Sidebar mini */}
          <aside className="hidden md:block border-r border-border bg-[#0B0B0B] p-4">
            <Logo className="mb-6" />
            <nav className="space-y-1 text-xs">
              <Item icon={<Home size={14} />} active>
                Vue d&apos;ensemble
              </Item>
              <Item icon={<Calendar size={14} />}>Agenda</Item>
              <Item icon={<Wallet size={14} />}>Dépenses</Item>
              <Item icon={<PieChart size={14} />}>Biens</Item>
              <Item icon={<Settings size={14} />}>Paramètres</Item>
            </nav>
          </aside>

          {/* Content mini */}
          <div className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Vue d&apos;ensemble</div>
                <div className="text-[11px] text-muted">Avril 2026</div>
              </div>
              <div className="h-7 w-24 rounded-full border border-border bg-black/40" />
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Kpi label="Revenu" value="4 500 €" />
              <Kpi label="Dépenses" value="620 €" />
              <Kpi label="Bénéfice net" value="3 195 €" green />
              <Kpi label="Frais perdus" value="28 %" />
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
              <div className="rounded-xl border border-border bg-[#0E0E0E] p-4">
                <div className="mb-3 text-[11px] text-muted">Réservations</div>
                <div className="flex items-end gap-1.5 h-16">
                  {[40, 65, 30, 80, 55, 95, 70, 90, 45, 85, 60, 100].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-brand-500/80"
                        style={{ height: `${h}%` }}
                      />
                    )
                  )}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-[#0E0E0E] p-4">
                <div className="text-[11px] text-muted">Prévision</div>
                <div className="mt-2 text-2xl font-medium text-brand-500">
                  3 890 €
                </div>
                <div className="text-[11px] text-muted">fin de mois</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Item({
  icon,
  children,
  active,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 ${
        active ? "bg-brand-500/10 text-brand-400" : "text-muted"
      }`}
    >
      {icon}
      {children}
    </div>
  );
}

function Kpi({
  label,
  value,
  green,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        green
          ? "bg-brand-500 border-brand-500 text-black"
          : "bg-[#0E0E0E] border-border"
      }`}
    >
      <div className={`text-[10px] ${green ? "text-black/70" : "text-muted"}`}>
        {label}
      </div>
      <div
        className={`mt-1 text-lg font-medium ${
          green ? "text-black" : "text-white"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
