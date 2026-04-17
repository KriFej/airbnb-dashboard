"use client";

import { RefreshCw, CheckCircle2, Link2, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { Booking } from "@/lib/types";
import { fetchICal, parseICS } from "@/lib/ical";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; count: number; at: string }
  | { kind: "error"; message: string };

type Props = {
  url: string;
  onUrl: (url: string) => void;
  onBookings: (bookings: Booking[]) => void;
  bookingsCount: number;
};

export function ICalImport({ url, onUrl, onBookings, bookingsCount }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function sync() {
    if (!url.trim()) {
      setStatus({ kind: "error", message: "Paste an iCal URL first." });
      return;
    }
    setStatus({ kind: "loading" });
    try {
      const text = await fetchICal(url.trim());
      const bookings = parseICS(text);
      onBookings(bookings);
      setStatus({
        kind: "success",
        count: bookings.length,
        at: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } catch (e) {
      setStatus({
        kind: "error",
        message: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <RefreshCw size={16} className="text-brand-500" />
            <h3 className="text-sm font-medium text-white">
              iCal calendar sync
            </h3>
          </div>
          <p className="mt-1 text-xs text-muted">
            Paste your Airbnb or Booking.com iCal export URL — we fetch it
            (directly or via proxy) and list your bookings.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Link2
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim"
              />
              <input
                type="url"
                value={url}
                onChange={(e) => onUrl(e.target.value)}
                placeholder="https://www.airbnb.com/calendar/ical/…"
                className="h-11 w-full rounded-xl border border-border bg-[#0E0E0E] pl-9 pr-3 text-sm text-white placeholder:text-dim transition-colors focus:border-brand-500/60 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={sync}
              disabled={status.kind === "loading"}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-500 px-5 text-sm font-medium text-black shadow-btn-glow transition-all hover:bg-brand-400 disabled:opacity-60"
            >
              {status.kind === "loading" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              {status.kind === "loading" ? "Syncing…" : "Sync"}
            </button>
          </div>

          <StatusLine status={status} bookingsCount={bookingsCount} />
        </div>
      </div>
    </section>
  );
}

function StatusLine({
  status,
  bookingsCount,
}: {
  status: Status;
  bookingsCount: number;
}) {
  if (status.kind === "success") {
    return (
      <div className="mt-3 flex items-center gap-2 text-xs text-brand-400">
        <CheckCircle2 size={14} />
        Synced {status.count} bookings at {status.at}
      </div>
    );
  }
  if (status.kind === "error") {
    return (
      <div className="mt-3 flex items-center gap-2 text-xs text-red-400">
        <XCircle size={14} />
        {status.message}
      </div>
    );
  }
  if (bookingsCount > 0) {
    return (
      <div className="mt-3 flex items-center gap-2 text-xs text-muted">
        <CheckCircle2 size={14} className="text-brand-500" />
        {bookingsCount} bookings loaded from cache.
      </div>
    );
  }
  return (
    <div className="mt-3 text-xs text-dim">
      Tip: in Airbnb → Calendar → Availability settings → Export calendar.
    </div>
  );
}
