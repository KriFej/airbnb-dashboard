"use client";

export type ABVariant = "a" | "b";
export type ABTest = "hero" | "pricing";

const COOKIE_PREFIX = "lp_ab_";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getVariant(test: ABTest): ABVariant {
  const cookieName = `${COOKIE_PREFIX}${test}`;
  const existing = getCookie(cookieName);
  if (existing === "a" || existing === "b") return existing;
  const variant: ABVariant = Math.random() < 0.5 ? "a" : "b";
  setCookie(cookieName, variant);
  return variant;
}

export function useABVariant(test: ABTest): ABVariant {
  if (typeof window === "undefined") return "a"; // SSR → toujours A
  return getVariant(test);
}
