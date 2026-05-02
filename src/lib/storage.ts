export function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) } as T;
  } catch {
    return fallback;
  }
}

export function loadString(key: string): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

export function save<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      key,
      typeof value === "string" ? value : JSON.stringify(value)
    );
  } catch {
    /* quota or privacy mode — ignore */
  }
}

export const KEYS = {
  inputs: "locpilote:inputs",
  icalAirbnb: "locpilote:ical-airbnb",
  icalBooking: "locpilote:ical-booking",
  bookings: "locpilote:bookings-cache",
};
