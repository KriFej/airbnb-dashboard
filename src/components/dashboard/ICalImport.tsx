"use client";

import {
  CheckCircle2,
  Link2,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Booking } from "@/lib/types";
import { fetchICal, parseICS } from "@/lib/ical";

type Source = "airbnb" | "booking";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; count: number; at: string }
  | { kind: "error"; message: string };

type Props = {
  airbnbUrl: string;
  bookingUrl: string;
  onUrlChange: (source: Source, url: string) => void;
  onBookingsChange: (source: Source, bookings: Booking[]) => void;
  airbnbCount: number;
  bookingCount: number;
};

export function ICalImport({
  airbnbUrl,
  bookingUrl,
  onUrlChange,
  onBookingsChange,
  airbnbCount,
  bookingCount,
}: Props) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2">
        <RefreshCw size={16} className="text-brand-500" />
        <h3 className="text-sm font-medium text-white">
          Synchronisation des calendriers iCal
        </h3>
      </div>
      <p className="mt-1 text-xs text-muted">
        Collez l&apos;URL d&apos;export iCal de chaque plateforme — nous les
        récupérons (via proxy si besoin) et fusionnons vos réservations.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <SourceRow
          label="Airbnb"
          placeholder="https://www.airbnb.com/calendar/ical/…"
          accent="text-brand-400"
          dotColor="bg-brand-500"
          url={airbnbUrl}
          onUrl={(u) => onUrlChange("airbnb", u)}
          onBookings={(b) => onBookingsChange("airbnb", b)}
          source="airbnb"
          cachedCount={airbnbCount}
        />
        <SourceRow
          label="Booking.com"
          placeholder="https://ical.booking.com/v1/export?t=…"
          accent="text-blue-300"
          dotColor="bg-blue-400"
          url={bookingUrl}
          onUrl={(u) => onUrlChange("booking", u)}
          onBookings={(b) => onBookingsChange("booking", b)}
          source="booking"
          cachedCount={bookingCount}
        />
      </div>

      <p className="mt-4 text-xs text-dim">
        Astuce : Airbnb → Calendrier → Disponibilité → Exporter. Booking.com →
        Extranet → Calendrier → Synchroniser les calendriers → Exporter.
      </p>
    </section>
  );
}

function SourceRow({
  label,
  placeholder,
  accent,
  dotColor,
  url,
  onUrl,
  onBookings,
  source,
  cachedCount,
}: {
  label: string;
  placeholder: string;
  accent: string;
  dotColor: string;
  url: string;
  onUrl: (u: string) => void;
  onBookings: (b: Booking[]) => void;
  source: Source;
  cachedCount: number;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function sync() {
    if (!url.trim()) {
      setStatus({ kind: "error", message: "Collez d'abord une URL." });
      return;
    }
    setStatus({ kind: "loading" });
    try {
      const text = await fetchICal(url.trim());
      const bookings = parseICS(text, source);
      onBookings(bookings);
      setStatus({
        kind: "success",
        count: bookings.length,
        at: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } catch (e) {
      setStatus({
        kind: "error",
        message: e instanceof Error ? e.message : "Erreur inconnue",
      });
    }
  }

  return (
    <div className="rounded-xl border border-border bg-[#0B0B0B] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dotColor}`} />
          <span className={`text-sm font-medium ${accent}`}>{label}</span>
        </div>
        {cachedCount > 0 && (
          <span className="rounded-full bg-black/60 border border-border px-2 py-0.5 text-[10px] text-muted">
            {cachedCount} réservations
          </span>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <div className="relative flex-1">
          <Link2
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim"
          />
          <input
            type="url"
            value={url}
            onChange={(e) => onUrl(e.target.value)}
            placeholder={placeholder}
            className="h-10 w-full rounded-lg border border-border bg-[#0E0E0E] pl-9 pr-3 text-xs text-white placeholder:text-dim transition-colors focus:border-brand-500/60 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={sync}
          disabled={status.kind === "loading"}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-500 px-3 text-xs font-medium text-black transition-all hover:bg-brand-400 disabled:opacity-60"
        >
          {status.kind === "loading" ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <RefreshCw size={12} />
          )}
          {status.kind === "loading" ? "Synchro…" : "Synchroniser"}
        </button>
      </div>

      <StatusLine status={status} />
    </div>
  );
}

function StatusLine({ status }: { status: Status }) {
  if (status.kind === "success") {
    return (
      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-brand-400">
        <CheckCircle2 size={12} />
        {status.count} réservations synchronisées à {status.at}
      </div>
    );
  }
  if (status.kind === "error") {
    return (
      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-red-400">
        <XCircle size={12} />
        {status.message}
      </div>
    );
  }
  return null;
}
