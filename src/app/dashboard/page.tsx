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
  const [airbnbUrl, setAirbnbUrl] = useState("");
  const [bookingUrl, setBookingUrl] = useState("");
  const [airbnbBookings, setAirbnbBookings] = useState<Booking[]>([]);
  const [bookingBookings, setBookingBookings] = useState<Booking[]>([]);
  const [period, setPeriod] = useState("This month");
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

          {/* Inputs */}
          <InputsPanel
            inputs={inputs}
            onChange={(patch) => setInputs((prev) => ({ ...prev, ...patch }))}
          />

          {/* Calendar + Upcoming */}
          <section className="grid gap-5 lg:grid-cols-[1fr_380px]">
            <BookingsCalendar bookings={allBookings} />
            <BookingsList bookings={allBookings} />
          </section>
        </main>
      </div>
    </div>
  );
}
