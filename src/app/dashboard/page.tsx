"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Download,
  Loader2,
  Percent,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { PcBanner } from "@/components/ui/PcBanner";
import { AddPropertyModal } from "@/components/dashboard/AddPropertyModal";
import { OnboardingModal } from "@/components/dashboard/OnboardingModal";
import { BookingsCalendar } from "@/components/dashboard/BookingsCalendar";
import { BookingsList } from "@/components/dashboard/BookingsList";
import { ForecastCard } from "@/components/dashboard/ForecastCard";
import { ICalImport } from "@/components/dashboard/ICalImport";
import { InputsPanel } from "@/components/dashboard/InputsPanel";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PlanBanner } from "@/components/dashboard/PlanBanner";
import { PropertyList } from "@/components/dashboard/PropertyList";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { UpgradeModal } from "@/components/dashboard/UpgradeModal";
import { useAuth } from "@/hooks/useAuth";
import { usePlan } from "@/hooks/usePlan";
import { useProperties } from "@/hooks/useProperties";
import {
  computeAggregateKpis,
  formatEuro,
  formatPct,
} from "@/lib/calc";
import { exportPropertiesToCsv } from "@/lib/csv";
import { canAddProperty } from "@/lib/plan";
import {
  Booking,
  Inputs,
  Property,
  makeProperty,
} from "@/lib/types";

const SECTION_IDS = ["overview", "properties", "settings", "expenses", "agenda"];

export default function DashboardPage() {
  const router = useRouter();
  const { userId, email, ready: authReady, logout, deleteAccount } = useAuth();
  const { plan, ready: planReady, limit, label: planLabel } = usePlan(email, userId);
  const { properties, setProperties, ready: propsReady } = useProperties(
    userId,
    email,
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [period, setPeriod] = useState("Ce mois-ci");
  const [active, setActive] = useState("overview");
  const [showAdd, setShowAdd] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Sélectionne le premier bien dès que les données sont prêtes
  useEffect(() => {
    if (!propsReady) return;
    if (properties.length > 0 && !selectedId) {
      setSelectedId(properties[0].id);
    }
    if (properties.length === 0 && selectedId) {
      setSelectedId(null);
    }
  }, [propsReady, properties, selectedId]);

  // Scroll-spy
  useEffect(() => {
    if (!propsReady) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: [0, 0.2, 0.4] }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [propsReady]);

  const handleNavigate = (id: string) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Auth redirect
  useEffect(() => {
    if (authReady && !email) router.replace("/login");
  }, [authReady, email, router]);

  const aggregate = useMemo(
    () => computeAggregateKpis(properties),
    [properties]
  );

  const allBookings = useMemo(
    () =>
      properties
        .flatMap((p) => [...p.airbnbBookings, ...p.bookingBookings])
        .sort((a, b) => a.start.localeCompare(b.start)),
    [properties]
  );

  const selected = useMemo(
    () => properties.find((p) => p.id === selectedId) ?? null,
    [properties, selectedId]
  );

  // Sparkline: last 8 weeks of booking count per week
  const revenueSparkline = useMemo(() => {
    if (allBookings.length === 0) return undefined;
    const weeks = 8;
    const now = Date.now();
    const msPerWeek = 7 * 24 * 3600 * 1000;
    return Array.from({ length: weeks }, (_, i) => {
      const weekStart = now - (weeks - i) * msPerWeek;
      const weekEnd = weekStart + msPerWeek;
      return allBookings.filter((b) => {
        const t = new Date(b.start).getTime();
        return t >= weekStart && t < weekEnd;
      }).length;
    });
  }, [allBookings]);

  if (!authReady || !email || !planReady || !propsReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-muted">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const handleTriggerAdd = () => {
    if (canAddProperty(plan, properties.length)) {
      setShowAdd(true);
    } else {
      setShowUpgrade(true);
    }
  };

  const handleCreateProperty = (name: string) => {
    const p = makeProperty(name);
    setProperties((prev) => [...prev, p]);
    setSelectedId(p.id);
    setShowAdd(false);
  };

  const handleDeleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const patchSelectedInputs = (patch: Partial<Inputs>) => {
    if (!selectedId) return;
    setProperties((prev) =>
      prev.map((p) =>
        p.id === selectedId
          ? { ...p, inputs: { ...p.inputs, ...patch } }
          : p
      )
    );
  };

  const patchSelectedIcalUrl = (
    source: "airbnb" | "booking",
    url: string
  ) => {
    if (!selectedId) return;
    setProperties((prev) =>
      prev.map((p) =>
        p.id === selectedId
          ? source === "airbnb"
            ? { ...p, airbnbUrl: url }
            : { ...p, bookingUrl: url }
          : p
      )
    );
  };

  const patchSelectedIcalBookings = (
    source: "airbnb" | "booking",
    bookings: Booking[]
  ) => {
    if (!selectedId) return;
    setProperties((prev) =>
      prev.map((p) =>
        p.id === selectedId
          ? source === "airbnb"
            ? { ...p, airbnbBookings: bookings }
            : { ...p, bookingBookings: bookings }
          : p
      )
    );
  };

  // First name from email
  const firstName = email ? email.split("@")[0].split(".")[0] : null;
  const displayName = firstName
    ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
    : null;

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar
        active={active}
        onNavigate={handleNavigate}
        userEmail={email}
        planLabel={planLabel}
        onLogout={handleLogout}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <PcBanner />
        <Topbar
          title="Vue d'ensemble"
          subtitle="Votre vraie performance, en direct."
          period={period}
          onPeriod={setPeriod}
          plan={planLabel}
        />

        <main className="flex-1 space-y-6 p-4 pb-24 sm:p-6 md:p-8 md:pb-8">
          {/* Greeting + quick stats row */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs text-muted">Bienvenue,</p>
              <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl md:text-4xl">
                {displayName ?? email?.split("@")[0] ?? "votre hôte"} 👋
              </h2>
            </div>
            <div className="flex items-center gap-6 text-right">
              <div>
                <div className="text-2xl font-semibold text-fg md:text-3xl">{properties.length}</div>
                <div className="text-xs text-muted">bien{properties.length > 1 ? "s" : ""}</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="text-2xl font-semibold text-brand-500 md:text-3xl">{formatEuro(aggregate.netProfit)}</div>
                <div className="text-xs text-muted">net ce mois</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="text-2xl font-semibold text-fg md:text-3xl">{allBookings.length}</div>
                <div className="text-xs text-muted">réservation{allBookings.length > 1 ? "s" : ""}</div>
              </div>
            </div>
          </div>

          {/* Overview */}
          <section id="overview" className="scroll-mt-24 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <PlanBanner plan={plan} count={properties.length} limit={limit} />
              {properties.length > 0 && (
                <button
                  type="button"
                  onClick={() => exportPropertiesToCsv(properties)}
                  className="inline-flex shrink-0 h-9 items-center gap-2 rounded-full border border-border bg-card px-3 text-xs text-muted transition-colors hover:border-border-hover hover:text-fg"
                >
                  <Download size={13} />
                  <span className="hidden sm:inline">Exporter CSV</span>
                </button>
              )}
            </div>

            {/* Bento KPI grid */}
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              {/* Bénéfice net — featured, spans 2 cols on xl */}
              <div className="col-span-2 min-h-[140px] xl:col-span-2">
                <KpiCard
                  label="Bénéfice net"
                  value={formatEuro(aggregate.netProfit)}
                  tone="green"
                  delta={period}
                  icon={<TrendingUp size={12} />}
                  hint="Après frais et dépenses"
                  size="lg"
                  sparkline={revenueSparkline}
                />
              </div>
              {/* Revenu brut */}
              <div className="min-h-[140px]">
                <KpiCard
                  label="Revenu brut"
                  value={formatEuro(aggregate.grossRevenue)}
                  icon={<Wallet size={14} />}
                  hint="Tous biens confondus"
                  sparkline={revenueSparkline}
                />
              </div>
              {/* Dépenses */}
              <div className="min-h-[140px]">
                <KpiCard
                  label="Dépenses totales"
                  value={formatEuro(aggregate.totalExpenses + aggregate.platformFees)}
                  icon={<Receipt size={14} />}
                  hint={`dont ${formatEuro(aggregate.platformFees)} de frais`}
                  tone="danger"
                  delta="−"
                  sparkline={revenueSparkline}
                />
              </div>
            </div>
          </section>

          {/* Guide de démarrage — visible uniquement si aucun bien */}
          {propsReady && properties.length === 0 && (
            <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-6">
              <p className="text-sm font-medium text-brand-400">Par où commencer ?</p>
              <ol className="mt-4 space-y-3">
                {[
                  "Cliquez sur « + Ajouter un bien » ci-dessous et donnez-lui un nom.",
                  "Copiez votre lien iCal depuis Airbnb (Calendrier → Exporter) et collez-le dans la section iCal.",
                  "Saisissez vos dépenses mensuelles — votre bénéfice net s'affiche en temps réel.",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-[11px] font-semibold text-brand-400">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Biens + Prévision */}
          <section
            id="properties"
            className="scroll-mt-24 grid gap-5 lg:grid-cols-[1fr_360px]"
          >
            <PropertyList
              properties={properties}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onAddClick={handleTriggerAdd}
              onDelete={handleDeleteProperty}
            />
            <ForecastCard
              forecast={aggregate.forecast}
              netProfit={aggregate.netProfit}
            />
          </section>

          {/* Paramètres iCal */}
          <section id="settings" className="scroll-mt-24 space-y-4">
            <SelectedHeader
              icon={<Building2 size={14} />}
              label="Synchronisation iCal du bien"
              selectedName={selected?.name}
              onChange={setSelectedId}
              properties={properties}
              selectedId={selectedId}
            />
            {selected ? (
              <ICalImport
                plan={plan}
                airbnbUrl={selected.airbnbUrl}
                bookingUrl={selected.bookingUrl}
                onUrlChange={patchSelectedIcalUrl}
                onBookingsChange={patchSelectedIcalBookings}
                airbnbCount={selected.airbnbBookings.length}
                bookingCount={selected.bookingBookings.length}
              />
            ) : (
              <EmptyState>
                Ajoutez un bien pour y connecter un calendrier iCal.
              </EmptyState>
            )}
          </section>

          {/* Dépenses */}
          <section id="expenses" className="scroll-mt-24 space-y-4">
            <SelectedHeader
              icon={<Building2 size={14} />}
              label="Dépenses du bien"
              selectedName={selected?.name}
              onChange={setSelectedId}
              properties={properties}
              selectedId={selectedId}
            />
            {selected ? (
              <InputsPanel
                inputs={selected.inputs}
                onChange={patchSelectedInputs}
              />
            ) : (
              <EmptyState>
                Créez un bien pour saisir ses revenus et ses dépenses.
              </EmptyState>
            )}
          </section>

          {/* Agenda */}
          <section
            id="agenda"
            className="scroll-mt-24 grid gap-5 lg:grid-cols-[1fr_380px]"
          >
            <BookingsCalendar bookings={allBookings} />
            <BookingsList bookings={allBookings} />
          </section>

          {/* Compte */}
          <section className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-sm font-medium text-fg">Compte</h3>
              <p className="mt-1 text-xs text-muted">
                Connecté en tant que <span className="text-fg font-medium">{email}</span>.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-10 items-center rounded-full border border-border bg-surface px-4 text-xs font-medium text-fg hover:border-border-hover"
                >
                  Se déconnecter
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm("Supprimer définitivement votre compte ? Cette action est irréversible.")) return;
                    await deleteAccount();
                    router.replace("/");
                  }}
                  className="inline-flex h-10 items-center rounded-full border border-red-500/30 bg-red-500/10 px-4 text-xs font-medium text-red-400 hover:bg-red-500/20"
                >
                  Supprimer mon compte
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      <AddPropertyModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreate={handleCreateProperty}
      />
      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        plan={plan}
        limit={limit}
      />
      {showOnboarding && (
        <OnboardingModal onDone={() => setShowOnboarding(false)} />
      )}
    </div>
  );
}

function SelectedHeader({
  icon,
  label,
  selectedName,
  onChange,
  properties,
  selectedId,
}: {
  icon: React.ReactNode;
  label: string;
  selectedName?: string;
  onChange: (id: string) => void;
  properties: Property[];
  selectedId: string | null;
}) {
  if (properties.length === 0) return null;
  return (
    <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 md:flex-row md:items-center">
      <div className="flex items-center gap-2 text-sm text-muted">
        <span className="text-brand-400">{icon}</span>
        <span>{label}</span>
        {selectedName && (
          <span className="ml-1 text-fg">· {selectedName}</span>
        )}
      </div>
      <select
        value={selectedId ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-full border border-border bg-surface px-3 text-xs text-fg focus:border-brand-500/60 focus:outline-none"
      >
        {properties.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted">
      {children}
    </div>
  );
}

