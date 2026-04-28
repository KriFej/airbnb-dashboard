"use client";

import {
  addDays,
  addMonths,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Booking } from "@/lib/types";

type Props = {
  bookings: Booking[];
};

export function BookingsCalendar({ bookings }: Props) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = addDays(start, 41); // 6 weeks
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const booked = useMemo(() => buildBookedMap(bookings), [bookings]);

  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-fg">Calendrier des réservations</h3>
          <p className="text-xs text-muted">
            Nuits occupées en vert — synchronisé depuis vos iCal.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCursor(subMonths(cursor, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted hover:border-border-hover hover:text-fg"
            aria-label="Mois précédent"
          >
            <ChevronLeft size={14} />
          </button>
          <div className="min-w-[110px] text-center text-sm font-medium capitalize">
            {format(cursor, "MMMM yyyy", { locale: fr })}
          </div>
          <button
            type="button"
            onClick={() => setCursor(addMonths(cursor, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted hover:border-border-hover hover:text-fg"
            aria-label="Mois suivant"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-1 text-[11px] uppercase tracking-wider text-dim">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
          <div key={d} className="py-2 text-center">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const key = format(d, "yyyy-MM-dd");
          const state = booked.get(key);
          const outOfMonth = !isSameMonth(d, cursor);
          const today = isSameDay(d, new Date());
          return (
            <div
              key={key}
              className={`relative flex aspect-square flex-col rounded-lg border p-1.5 text-[11px] transition-colors ${
                outOfMonth
                  ? "border-border/40 text-dim"
                  : state
                  ? "border-brand-500/40 bg-brand-500/15 text-fg"
                  : "border-border bg-surface text-fg"
              }`}
            >
              <span className={`${today ? "text-brand-500 font-semibold" : ""}`}>
                {format(d, "d")}
              </span>
              {state && (
                <span
                  className={`mt-auto h-1.5 rounded-full bg-brand-500 ${
                    state === "start"
                      ? "ml-0 mr-0 rounded-r-none"
                      : state === "end"
                      ? "rounded-l-none"
                      : state === "middle"
                      ? "rounded-none"
                      : ""
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

type DayState = "single" | "start" | "middle" | "end";

function buildBookedMap(bookings: Booking[]): Map<string, DayState> {
  const map = new Map<string, DayState>();
  for (const b of bookings) {
    try {
      const start = parseISO(b.start);
      const end = parseISO(b.end);
      // iCal DTEND is exclusive for all-day — last occupied night is end-1
      const nights = eachDayOfInterval({
        start,
        end: addDays(end, -1),
      });
      nights.forEach((d, i) => {
        const key = format(d, "yyyy-MM-dd");
        let state: DayState = "middle";
        if (nights.length === 1) state = "single";
        else if (i === 0) state = "start";
        else if (i === nights.length - 1) state = "end";
        map.set(key, state);
      });
    } catch {
      /* skip bad dates */
    }
  }
  return map;
}
