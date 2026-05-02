"use client";

export type TrackEvent =
  | "signup"
  | "login"
  | "onboarding_completed"
  | "property_added"
  | "ical_connected"
  | "expense_added"
  | "plan_upgraded"
  | "page_view";

export type TrackPayload = Record<string, string | number | boolean | null | undefined>;

export async function track(event: TrackEvent, payload?: TrackPayload) {
  if (typeof window === "undefined") return;
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, payload, url: window.location.pathname }),
    });
  } catch {
    // silencieux
  }
}

export function trackOnce(event: TrackEvent, payload?: TrackPayload) {
  const key = `lp_tracked_${event}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");
  track(event, payload);
}
