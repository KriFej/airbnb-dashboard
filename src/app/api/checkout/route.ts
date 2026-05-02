import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function getCheckoutUrl(plan: string): string {
  const map: Record<string, string | undefined> = {
    starter: process.env.LEMONSQUEEZY_CHECKOUT_STARTER,
    "starter-annual": process.env.LEMONSQUEEZY_CHECKOUT_STARTER_ANNUAL,
    pro: process.env.LEMONSQUEEZY_CHECKOUT_PRO,
    "pro-annual": process.env.LEMONSQUEEZY_CHECKOUT_PRO_ANNUAL,
  };
  return map[plan] ?? "";
}

export async function GET(req: NextRequest) {
  const plan = req.nextUrl.searchParams.get("plan") ?? "starter";
  const baseUrl = getCheckoutUrl(plan);

  if (!baseUrl) {
    return NextResponse.redirect(new URL("/#pricing", req.url));
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL(`/login?after=checkout&plan=${encodeURIComponent(plan)}`, req.url),
    );
  }

  const checkoutUrl = new URL(baseUrl);
  checkoutUrl.searchParams.set("checkout[custom][user_id]", user.id);
  if (user.email) {
    checkoutUrl.searchParams.set("checkout[email]", user.email);
  }

  return NextResponse.redirect(checkoutUrl.toString());
}
