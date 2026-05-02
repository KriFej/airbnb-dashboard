"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { propertiesKey } from "@/lib/plan";
import { KEYS } from "@/lib/storage";
import {
  Booking,
  DEFAULT_INPUTS,
  Inputs,
  Property,
  makeProperty,
} from "@/lib/types";

type Row = {
  id: string;
  user_id: string;
  name: string;
  inputs: Inputs;
  airbnb_url: string;
  booking_url: string;
  airbnb_bookings: Booking[];
  booking_bookings: Booking[];
};

function rowToProperty(row: Row): Property {
  return {
    id: row.id,
    name: row.name,
    inputs: { ...DEFAULT_INPUTS, ...(row.inputs ?? {}) },
    airbnbUrl: row.airbnb_url ?? "",
    bookingUrl: row.booking_url ?? "",
    airbnbBookings: row.airbnb_bookings ?? [],
    bookingBookings: row.booking_bookings ?? [],
  };
}

function propertyToRow(p: Property, userId: string): Row {
  return {
    id: p.id,
    user_id: userId,
    name: p.name,
    inputs: p.inputs,
    airbnb_url: p.airbnbUrl,
    booking_url: p.bookingUrl,
    airbnb_bookings: p.airbnbBookings,
    booking_bookings: p.bookingBookings,
  };
}

// Récupère toutes les données localStorage (format actuel + legacy)
// et les transforme en Property[] pour migration vers Supabase.
function readLocalProperties(email: string): Property[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(propertiesKey(email));
    if (raw) {
      const parsed = JSON.parse(raw) as Property[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }

    // Fallback : ancien format mono-bien
    const rawInputs = window.localStorage.getItem(KEYS.inputs);
    const rawAirbnbUrl = window.localStorage.getItem(KEYS.icalAirbnb);
    const rawBookingUrl = window.localStorage.getItem(KEYS.icalBooking);
    const rawBookings = window.localStorage.getItem(KEYS.bookings);
    if (!rawInputs && !rawAirbnbUrl && !rawBookingUrl && !rawBookings) return [];

    const p = makeProperty("Mon bien");
    if (rawInputs) {
      try {
        p.inputs = { ...DEFAULT_INPUTS, ...(JSON.parse(rawInputs) as Inputs) };
      } catch {}
    }
    if (rawAirbnbUrl) p.airbnbUrl = rawAirbnbUrl;
    if (rawBookingUrl) p.bookingUrl = rawBookingUrl;
    if (rawBookings) {
      try {
        const parsed = JSON.parse(rawBookings) as {
          airbnb?: Booking[];
          booking?: Booking[];
        };
        if (parsed.airbnb) p.airbnbBookings = parsed.airbnb;
        if (parsed.booking) p.bookingBookings = parsed.booking;
      } catch {}
    }
    return [p];
  } catch {
    return [];
  }
}

function clearLegacyKeys() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEYS.inputs);
    window.localStorage.removeItem(KEYS.icalAirbnb);
    window.localStorage.removeItem(KEYS.icalBooking);
    window.localStorage.removeItem(KEYS.bookings);
  } catch {}
}

export function useProperties(
  userId: string | null,
  email: string | null,
) {
  const [properties, setPropertiesState] = useState<Property[]>([]);
  const [ready, setReady] = useState(false);
  const supabase = useMemo<SupabaseClient | null>(() => {
    if (typeof window === "undefined") return null;
    return createClient();
  }, []);
  const lastSynced = useRef<Property[]>([]);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Chargement initial : Supabase, avec fallback localStorage pour l'affichage instantané
  useEffect(() => {
    if (!userId || !email || !supabase) {
      setReady(false);
      return;
    }
    let cancelled = false;

    (async () => {
      // 1) Affiche le cache local immédiatement
      const cached = readLocalProperties(email);
      if (cached.length > 0 && !cancelled) setPropertiesState(cached);

      // 2) Fetch Supabase
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (cancelled) return;

      if (error) {
        // En cas d'erreur réseau : on garde le cache local, pas de sync tant que ça ne passe pas
        lastSynced.current = cached;
        setReady(true);
        return;
      }

      const serverProps = (data as Row[]).map(rowToProperty);

      if (serverProps.length === 0 && cached.length > 0) {
        // Migration : localStorage → Supabase
        const rows = cached.map((p) => propertyToRow(p, userId));
        const { error: insertError } = await supabase
          .from("properties")
          .insert(rows);
        if (!insertError) {
          clearLegacyKeys();
          setPropertiesState(cached);
          lastSynced.current = cached;
        } else {
          lastSynced.current = [];
        }
      } else {
        setPropertiesState(serverProps);
        lastSynced.current = serverProps;
        // Rafraîchit le cache local
        try {
          window.localStorage.setItem(
            propertiesKey(email),
            JSON.stringify(serverProps),
          );
        } catch {}
      }

      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, email, supabase]);

  // Sync vers Supabase (debounced 800 ms) + cache local immédiat
  useEffect(() => {
    if (!ready || !userId || !email || !supabase) return;
    const current = properties;
    const synced = lastSynced.current;
    if (JSON.stringify(current) === JSON.stringify(synced)) return;

    // Cache local instantané
    try {
      window.localStorage.setItem(
        propertiesKey(email),
        JSON.stringify(current),
      );
    } catch {}

    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      const currentById = new Map(current.map((p) => [p.id, p]));
      const syncedById = new Map(synced.map((p) => [p.id, p]));

      // Suppressions
      const toDelete: string[] = [];
      for (const id of syncedById.keys()) {
        if (!currentById.has(id)) toDelete.push(id);
      }
      if (toDelete.length > 0) {
        await supabase.from("properties").delete().in("id", toDelete);
      }

      // Upserts (nouveaux + modifiés)
      const toUpsert: Property[] = [];
      for (const p of current) {
        const before = syncedById.get(p.id);
        if (!before || JSON.stringify(before) !== JSON.stringify(p)) {
          toUpsert.push(p);
        }
      }
      if (toUpsert.length > 0) {
        const rows = toUpsert.map((p) => propertyToRow(p, userId));
        await supabase
          .from("properties")
          .upsert(rows, { onConflict: "id" });
      }

      lastSynced.current = current;
    }, 800);
  }, [properties, ready, userId, email, supabase]);

  const setProperties = useCallback(
    (
      updater: Property[] | ((prev: Property[]) => Property[]),
    ) => {
      setPropertiesState((prev) =>
        typeof updater === "function" ? updater(prev) : updater,
      );
    },
    [],
  );

  return { properties, setProperties, ready };
}
