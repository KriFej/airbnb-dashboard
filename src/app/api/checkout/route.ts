import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CHECKOUT_URLS: Record<string, string> = {
  starter: process.env.LEMONSQUEEZY_CHECKOUT_STARTER ?? "",
  pro: process.env.LEMONSQUEEZY_CHECKOUT_PRO ?? "",
};

export async function GET(req: NextRequest) {
  const plan = req.nextUrl.searchParams.get("plan") ?? "starter";
  const baseUrl = CHECKOUT_URLS[plan];

  if (!baseUrl) {
    // URL pas encore configurée → renvoie vers pricing
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
