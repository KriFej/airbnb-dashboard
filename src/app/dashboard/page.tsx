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

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const [icalUrl, setIcalUrl] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [period, setPeriod] = useState("This month");
  const [active, setActive] = useState("overview");

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setInputs(load<Inputs>(KEYS.inputs, DEFAULT_INPUTS));
    setIcalUrl(loadString(KEYS.icalUrl));
    try {
      const cached = window.localStorage.getItem(KEYS.bookings);
      if (cached) setBookings(JSON.parse(cached));
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
    if (mounted) save(KEYS.icalUrl, icalUrl);
  }, [icalUrl, mounted]);
  useEffect(() => {
    if (mounted) save(KEYS.bookings, bookings);
  }, [bookings, mounted]);

  const kpis = useMemo(() => computeKpis(inputs), [inputs]);

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar active={active} onNavigate={setActive} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title="Overview"
          subtitle="Your real performance, live."
          period={period}
          onPeriod={setPeriod}
        />

        <main className="flex-1 space-y-6 p-6 md:p-8">
          {/* KPI row */}
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Gross revenue"
              value={formatEuro(kpis.grossRevenue)}
              icon={<Wallet size={14} />}
              hint="Airbnb + Booking"
            />
            <KpiCard
              label="Total expenses"
              value={formatEuro(kpis.totalExpenses + kpis.platformFees)}
              icon={<Receipt size={14} />}
              hint={`incl. ${formatEuro(kpis.platformFees)} fees`}
              tone="danger"
              delta="−"
            />
            <KpiCard
              label="Net profit"
              value={formatEuro(kpis.netProfit)}
              tone="green"
              delta={period}
              icon={<TrendingUp size={12} />}
              hint="After fees and expenses"
            />
            <KpiCard
              label="Fees & cost ratio"
              value={formatPct(kpis.feesLostPct)}
              icon={<Percent size={14} />}
              hint="of gross revenue"
            />
          </section>

          {/* iCal + Forecast */}
          <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <ICalImport
              url={icalUrl}
              onUrl={setIcalUrl}
              onBookings={setBookings}
              bookingsCount={bookings.length}
            />
            <ForecastCard
              forecast={kpis.forecast}
              netProfit={kpis.netProfit}
            />
          </section>

          {/* Inputs */}
          <InputsPanel
            inputs={inputs}
            onChange={(patch) => setInputs((prev) => ({ ...prev, ...patch }))}
          />

          {/* Calendar + Upcoming */}
          <section className="grid gap-5 lg:grid-cols-[1fr_380px]">
            <BookingsCalendar bookings={bookings} />
            <BookingsList bookings={bookings} />
          </section>
        </main>
      </div>
    </div>
  );
}
