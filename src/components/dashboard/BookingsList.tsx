"use client";

import { differenceInDays, format, isAfter, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Booking } from "@/lib/types";

const SOURCE_STYLES: Record<string, string> = {
  airbnb: "bg-brand-50 text-brand-600 border-brand-200",
  booking: "bg-blue-50 text-blue-600 border-blue-200",
};

export function BookingsList({ bookings }: { bookings: Booking[] }) {
  const now = new Date();
  const upcoming = bookings
    .filter((b) => {
      try { return isAfter(parseISO(b.end), now); } catch { return false; }
    })
    .slice(0, 8);

  return (
    <section className="rounded-2xl border border-border bg-white overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-fg">Prochaines réservations</h3>
          <p className="text-xs text-muted mt-0.5">Séjours à venir</p>
        </div>
      </div>

      {upcoming.length === 0 ? (
        <div className="px-6 py-10 text-center text-sm text-muted">
          Aucune réservation à venir.
          <br />
          <span className="text-xs text-dim">Synchronisez votre iCal pour remplir cette liste.</span>
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-6 py-2 text-[10px] uppercase tracking-widest text-dim">
            <span>Séjour</span>
            <span className="text-right">Arrivée</span>
            <span className="text-right">Durée</span>
            <span className="text-right">Source</span>
          </div>

          {upcoming.map((b) => {
            const start = parseISO(b.start);
            const end = parseISO(b.end);
            const nights = Math.max(differenceInDays(end, start), 1);
            const source = b.source ?? "autre";
            const srcStyle = SOURCE_STYLES[source] ?? "bg-border text-muted border-border";

            return (
              <div
                key={b.uid}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 px-6 py-3 text-sm transition-colors hover:bg-surface"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium text-fg text-sm">
                    {b.summary || "Réservation"}
                  </div>
                  <div className="text-xs text-muted">
                    {format(start, "d MMM", { locale: fr })} → {format(end, "d MMM", { locale: fr })}
                  </div>
                </div>
                <div className="text-right text-xs text-muted whitespace-nowrap">
                  {format(start, "d MMM yyyy", { locale: fr })}
                </div>
                <div className="text-right text-xs text-fg whitespace-nowrap">
                  {nights} nuit{nights > 1 ? "s" : ""}
                </div>
                <div className="text-right">
                  <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${srcStyle}`}>
                    {source}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
