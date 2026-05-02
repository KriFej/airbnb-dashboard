import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (!rateLimit(`analytics:${ip}`, 60, 60_000)) {
    return NextResponse.json({ ok: true }); // silent drop
  }

  try {
    const body = await req.json();
    const { event, payload, url } = body;

    if (!event || typeof event !== "string") {
      return NextResponse.json({ ok: true });
    }

    const makeUrl = process.env.MAKE_WEBHOOK_URL;
    const posthogKey = process.env.POSTHOG_API_KEY;

    // Forward to Make.com (Google Sheets / Slack)
    if (makeUrl) {
      fetch(makeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event,
          payload,
          url,
          ts: new Date().toISOString(),
          source: "locpilote",
        }),
      }).catch(() => {});
    }

    // PostHog server-side (optionnel)
    if (posthogKey) {
      fetch("https://app.posthog.com/capture/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: posthogKey,
          event,
          properties: { ...(payload ?? {}), $current_url: url },
          timestamp: new Date().toISOString(),
          distinct_id: payload?.email ?? ip ?? "anonymous",
        }),
      }).catch(() => {});
    }
  } catch {
    // ne jamais crasher
  }

  return NextResponse.json({ ok: true });
}
