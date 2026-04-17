"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Percent,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { BookingsCalendar } from "@/components/dashboard/BookingsCalendar";
import { BookingsList } from "@/components/dashboard/BookingsList";
import { ForecastCard } from "@/components/dashboard/ForecastCard";
import { ICalImport } from "@/components/dashboard/ICalImport";
import { InputsPanel } from "@/components/dashboard/InputsPanel";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { computeKpis, formatEuro, formatPct } from "@/lib/calc";
import { KEYS, load, loadString, save } from "@/lib/storage";
import { Booking, DEFAULT_INPUTS, Inputs } from "@/lib/types";

const SECTION_IDS = ["overview", "properties", "agenda", "expenses", "settings"];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const [airbnbUrl, setAirbnbUrl] = useState("");
  const [bookingUrl, setBookingUrl] = useState("");
  const [airbnbBookings, setAirbnbBookings] = useState<Booking[]>([]);
  const [bookingBookings, setBookingBookings] = useState<Booking[]>([]);
  const [period, setPeriod] = useState("Ce mois-ci");
  const [active, setActive] = useState("overview");

  // Hydrate from localStorage after mount
  useEffect(() => {
    setInputs(load<Inputs>(KEYS.inputs, DEFAULT_INPUTS));
    setAirbnbUrl(loadString(KEYS.icalAirbnb));
    setBookingUrl(loadString(KEYS.icalBooking));
    try {
      const cached = window.localStorage.getItem(KEYS.bookings);
      if (cached) {
        const parsed = JSON.parse(cached) as {
          airbnb?: Booking[];
          booking?: Booking[];
        };
        if (parsed.airbnb) setAirbnbBookings(parsed.airbnb);
        if (parsed.booking) setBookingBookings(parsed.booking);
      }
    } catch {
      /* ignore */
    }
    setMounted(true);
  }, []);

  // Persist
  useEffect(() => {
    if (mounted) save(KEYS.inputs, inputs);
  }, [inputs, mounted]);
  useEffect(() => {
    if (mounted) save(KEYS.icalAirbnb, airbnbUrl);
  }, [airbnbUrl, mounted]);
  useEffect(() => {
    if (mounted) save(KEYS.icalBooking, bookingUrl);
  }, [bookingUrl, mounted]);
  useEffect(() => {
    if (mounted)
      save(KEYS.bookings, {
        airbnb: airbnbBookings,
        booking: bookingBookings,
      });
  }, [airbnbBookings, bookingBookings, mounted]);

  // Scroll-spy: observe sections and update `active`
  useEffect(() => {
    if (!mounted) return;
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
  }, [mounted]);

  const handleNavigate = (id: string) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const allBookings = useMemo(
    () =>
      [...airbnbBookings, ...bookingBookings].sort((a, b) =>
        a.start.localeCompare(b.start)
      ),
    [airbnbBookings, bookingBookings]
  );

  const kpis = useMemo(() => computeKpis(inputs), [inputs]);

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar active={active} onNavigate={handleNavigate} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title="Vue d'ensemble"
          subtitle="Votre vraie performance, en direct."
          period={period}
          onPeriod={setPeriod}
        />

        <main className="flex-1 space-y-6 p-6 md:p-8">
          {/* KPI row */}
          <section id="overview" className="scroll-mt-24 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Revenu brut"
              value={formatEuro(kpis.grossRevenue)}
              icon={<Wallet size={14} />}
              hint="Airbnb + Booking"
            />
            <KpiCard
              label="Dépenses totales"
              value={formatEuro(kpis.totalExpenses + kpis.platformFees)}
              icon={<Receipt size={14} />}
              hint={`dont ${formatEuro(kpis.platformFees)} de frais`}
              tone="danger"
              delta="−"
            />
            <KpiCard
              label="Bénéfice net"
              value={formatEuro(kpis.netProfit)}
              tone="green"
              delta={period}
              icon={<TrendingUp size={12} />}
              hint="Après frais et dépenses"
            />
            <KpiCard
              label="Ratio frais et coûts"
              value={formatPct(kpis.feesLostPct)}
              icon={<Percent size={14} />}
              hint="du revenu brut"
            />
          </section>

          {/* Biens (placeholder avant Lot C) + iCal + Forecast */}
          <section id="properties" className="scroll-mt-24 grid gap-5 lg:grid-cols-[1fr_360px]">
            <ICalImport
              airbnbUrl={airbnbUrl}
              bookingUrl={bookingUrl}
              onUrlChange={(src, url) =>
                src === "airbnb" ? setAirbnbUrl(url) : setBookingUrl(url)
              }
              onBookingsChange={(src, b) =>
                src === "airbnb"
                  ? setAirbnbBookings(b)
                  : setBookingBookings(b)
              }
              airbnbCount={airbnbBookings.length}
              bookingCount={bookingBookings.length}
            />
            <ForecastCard
              forecast={kpis.forecast}
              netProfit={kpis.netProfit}
            />
          </section>

          {/* Dépenses */}
          <section id="expenses" className="scroll-mt-24">
            <InputsPanel
              inputs={inputs}
              onChange={(patch) => setInputs((prev) => ({ ...prev, ...patch }))}
            />
          </section>

          {/* Agenda */}
          <section id="agenda" className="scroll-mt-24 grid gap-5 lg:grid-cols-[1fr_380px]">
            <BookingsCalendar bookings={allBookings} />
            <BookingsList bookings={allBookings} />
          </section>

          {/* Paramètres */}
          <section id="settings" className="scroll-mt-24 rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-medium text-white">Paramètres</h3>
            <p className="mt-1 text-xs text-muted">
              Gérez votre compte et vos préférences. D&apos;autres réglages
              arrivent bientôt.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
