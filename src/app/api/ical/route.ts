import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getIp } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const ip = getIp(req);
  if (!rateLimit(`ical:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
  }

  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Only allow http/https
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return NextResponse.json({ error: "Invalid protocol" }, { status: 400 });
  }

  const ALLOWED_HOSTS = [
    "airbnb.com", "www.airbnb.com",
    "booking.com", "www.booking.com",
    "vrbo.com", "www.vrbo.com",
    "homeaway.com", "www.homeaway.com",
    "hostaway.com", "www.hostaway.com",
    "smoobu.com", "www.smoobu.com",
    "calendar.google.com",
    "outlook.live.com", "outlook.office.com",
    "app.guesty.com",
    "app.lodgify.com",
  ];
  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    return NextResponse.json({ error: "Domain not allowed" }, { status: 403 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(url, {
      headers: { "User-Agent": "locpilote-ical-fetcher/1.0" },
      next: { revalidate: 0 },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream HTTP ${res.status}` },
        { status: 502 },
      );
    }

    const text = await res.text();
    if (!text.includes("BEGIN:VCALENDAR")) {
      return NextResponse.json(
        { error: "Not a valid iCal file" },
        { status: 422 },
      );
    }

    return new NextResponse(text, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Fetch failed" },
      { status: 502 },
    );
  }
}
