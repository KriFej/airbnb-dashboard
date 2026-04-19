import { Booking } from "./types";

export async function fetchICal(url: string): Promise<string> {
  if (!url) throw new Error("Empty URL");

  // Try direct fetch first
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const text = await res.text();
      if (text.includes("BEGIN:VCALENDAR")) return text;
    }
  } catch {
    // CORS or network — fall through to proxy
  }

  // Fallback: our own server-side proxy (avoids CORS and allorigins dependency)
  try {
    const proxy = `/api/ical?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxy, { cache: "no-store" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as { error?: string }).error ?? `Proxy HTTP ${res.status}`);
    }
    const text = await res.text();
    if (!text.includes("BEGIN:VCALENDAR")) {
      throw new Error("Response is not a valid iCal file");
    }
    return text;
  } catch (e) {
    throw new Error(
      e instanceof Error
        ? `Could not fetch iCal: ${e.message}`
        : "Could not fetch iCal"
    );
  }
}

/**
 * Parse a subset of iCalendar: VEVENT blocks with SUMMARY, DTSTART, DTEND, UID.
 * Handles all-day (DTSTART;VALUE=DATE:YYYYMMDD) and timestamp (YYYYMMDDTHHMMSSZ) forms.
 * If `forceSource` is provided, tag every booking with that source.
 */
export function parseICS(
  text: string,
  forceSource?: "airbnb" | "booking" | "other"
): Booking[] {
  const unfolded = text.replace(/\r?\n[ \t]/g, "");
  const blocks = unfolded.split("BEGIN:VEVENT").slice(1);
  const bookings: Booking[] = [];

  for (const block of blocks) {
    const end = block.indexOf("END:VEVENT");
    if (end === -1) continue;
    const body = block.slice(0, end);

    const summary = matchLine(body, "SUMMARY") ?? "Reserved";
    const uid = matchLine(body, "UID") ?? cryptoRandom();
    const dtstart = matchDate(body, "DTSTART");
    const dtend = matchDate(body, "DTEND");

    if (!dtstart || !dtend) continue;

    bookings.push({
      uid,
      summary: summary.trim(),
      start: dtstart,
      end: dtend,
      source: forceSource ?? detectSource(summary, uid),
    });
  }

  return bookings.sort((a, b) => a.start.localeCompare(b.start));
}

function matchLine(body: string, key: string): string | null {
  const re = new RegExp(`\\n${key}[^:\\n]*:([^\\n]*)`, "i");
  const m = body.match(re);
  return m ? m[1].trim() : null;
}

function matchDate(body: string, key: string): string | null {
  const re = new RegExp(`\\n${key}[^:\\n]*:([0-9TZ]+)`, "i");
  const m = body.match(re);
  if (!m) return null;
  return toIsoDate(m[1]);
}

function toIsoDate(raw: string): string {
  // Accepts YYYYMMDD or YYYYMMDDTHHMMSSZ
  const y = raw.slice(0, 4);
  const mo = raw.slice(4, 6);
  const d = raw.slice(6, 8);
  return `${y}-${mo}-${d}`;
}

function detectSource(
  summary: string,
  uid: string
): "airbnb" | "booking" | "other" {
  const s = `${summary} ${uid}`.toLowerCase();
  if (s.includes("airbnb")) return "airbnb";
  if (s.includes("booking") || s.includes("bkn")) return "booking";
  return "other";
}

function cryptoRandom(): string {
  return Math.random().toString(36).slice(2, 10);
}
