"use client";

import { differenceInDays, format, isAfter, parseISO } from "date-fns";
import { CalendarDays, CalendarRange } from "lucide-react";
import { Booking } from "@/lib/types";

export function BookingsList({ bookings }: { bookings: Booking[] }) {
  const now = new Date();
  const upcoming = bookings
    .filter((b) => {
      try {
        return isAfter(parseISO(b.end), now);
      } catch {
        return false;
      }
    })
    .slice(0, 6);

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <header className="mb-4 flex items-center gap-2">
        <CalendarDays size={16} className="text-brand-500" />
        <h3 className="text-sm font-medium text-white">Upcoming stays</h3>
      </header>

      {upcoming.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">
          No upcoming bookings yet. Sync your iCal to populate this list.
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {upcoming.map((b) => {
            const start = parseISO(b.start);
            const end = parseISO(b.end);
            const nights = Math.max(differenceInDays(end, start), 1);
            return (
              <li
                key={b.uid}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20">
                    <CalendarRange size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {b.summary}
                    </div>
                    <div className="text-xs text-muted">
                      {format(start, "MMM d")} → {format(end, "MMM d, yyyy")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <span className="text-xs text-muted">
                    {nights} {nights > 1 ? "nights" : "night"}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                      b.source === "airbnb"
                        ? "border-brand-500/30 bg-brand-500/10 text-brand-400"
                        : b.source === "booking"
                        ? "border-blue-400/30 bg-blue-400/10 text-blue-300"
                        : "border-border bg-black/60 text-muted"
                    }`}
                  >
                    {b.source ?? "other"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
