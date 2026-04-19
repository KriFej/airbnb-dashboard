import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { Plan } from "@/lib/plan";

type LSStatus = "active" | "cancelled" | "expired" | "past_due" | "paused" | "unpaid";

function lsStatusToDb(status: LSStatus): string {
  if (status === "active") return "active";
  if (status === "past_due" || status === "unpaid") return "past_due";
  if (status === "cancelled" || status === "expired") return "canceled";
  return "inactive";
}

function variantToPlan(variantId: number): Plan {
  const ids: Record<string, Plan> = {
    [process.env.LEMONSQUEEZY_VARIANT_STARTER ?? ""]: "starter",
    [process.env.LEMONSQUEEZY_VARIANT_STARTER_ANNUAL ?? ""]: "starter",
    [process.env.LEMONSQUEEZY_VARIANT_PRO ?? ""]: "pro",
    [process.env.LEMONSQUEEZY_VARIANT_PRO_ANNUAL ?? ""]: "pro",
  };
  return ids[String(variantId)] ?? null;
}

const HANDLED_EVENTS = new Set([
  "subscription_created",
  "subscription_updated",
  "subscription_cancelled",
  "subscription_expired",
  "subscription_resumed",
  "subscription_paused",
]);

export async function POST(req: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("X-Signature") ?? "";

  const hmac = createHmac("sha256", secret).update(rawBody).digest("hex");
  if (hmac !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: {
    meta: { event_name: string; custom_data?: { user_id?: string } };
    data: { attributes: { status: LSStatus; variant_id: number; ends_at: string | null; user_email: string } };
  };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = payload.meta.event_name;
  if (!HANDLED_EVENTS.has(eventName)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const userId = payload.meta.custom_data?.user_id;
  if (!userId) {
    return NextResponse.json({ error: "No user_id in custom_data" }, { status: 400 });
  }

  const attrs = payload.data.attributes;
  const status = lsStatusToDb(attrs.status);
  const plan = variantToPlan(attrs.variant_id);
  const currentPeriodEnd = attrs.ends_at ?? null;

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { error } = await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      plan,
      status,
      current_period_end: currentPeriodEnd,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    console.error("[LS webhook] Supabase error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
