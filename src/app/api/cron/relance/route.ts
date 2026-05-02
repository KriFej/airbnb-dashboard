import { NextRequest, NextResponse } from "next/server";

const BRAND = "#EAB308";

// Email J+7 : relance upgrade si toujours sur offre gratuite
const RELANCE_HTML = (email: string) => `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F6F1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F6F1;padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #E2E1DC;border-radius:16px;overflow:hidden;">
        <tr>
          <td style="background:${BRAND};padding:24px 32px;">
            <p style="margin:0;font-size:20px;font-weight:700;color:#000;">locpilote</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 32px 24px;">
            <p style="margin:0;font-size:20px;font-weight:600;color:#111;">Passez à la vitesse supérieure 🚀</p>
            <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#6B7280;">
              Vous utilisez locpilote depuis une semaine. Avec l'offre <strong style="color:#111;">Starter à 9,90 €/mois</strong>, débloquez :
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 24px;">
            <table cellpadding="0" cellspacing="0" style="background:#F7F6F1;border:1px solid #E2E1DC;border-radius:10px;width:100%;">
              <tr><td style="padding:16px 20px 8px;"><p style="margin:0;font-size:13px;color:#374151;">✅ Jusqu'à <strong>3 biens</strong> (au lieu de 1)</p></td></tr>
              <tr><td style="padding:0 20px 8px;"><p style="margin:0;font-size:13px;color:#374151;">✅ Synchronisation <strong>iCal automatique</strong></p></td></tr>
              <tr><td style="padding:0 20px 8px;"><p style="margin:0;font-size:13px;color:#374151;">✅ Prévisions de revenus fin de mois</p></td></tr>
              <tr><td style="padding:0 20px 16px;"><p style="margin:0;font-size:13px;color:#374151;">✅ Support prioritaire</p></td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 32px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:${BRAND};border-radius:999px;">
                  <a href="https://locpilote.com/api/checkout?plan=starter" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:700;color:#000;text-decoration:none;">Passer à Starter — 9,90 €/mois →</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 32px;">
            <p style="margin:0;font-size:12px;color:#9CA3AF;">
              Vous recevez cet email car vous avez un compte locpilote.com avec <span style="color:#6B7280;">${email}</span>.<br>
              <a href="https://locpilote.com/unsubscribe?email=${encodeURIComponent(email)}" style="color:#9CA3AF;">Se désabonner</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ ok: true, skipped: "no_resend_key" });
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Users inscrits entre J-8 et J-6, toujours sur offre gratuite (plan = null)
  const windowEnd = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString();
  const windowStart = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();

  const { data: users, error } = await supabase
    .from("profiles")
    .select("email, plan")
    .is("plan", null)
    .gte("created_at", windowStart)
    .lte("created_at", windowEnd);

  if (error || !users) {
    return NextResponse.json({ ok: true, skipped: "query_error" });
  }

  let sent = 0;
  for (const user of users) {
    if (!user.email) continue;
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "locpilote <hello@locpilote.com>",
        to: user.email,
        subject: "Passez à la vitesse supérieure 🚀",
        html: RELANCE_HTML(user.email),
      }),
    });
    sent++;
  }

  return NextResponse.json({ ok: true, sent });
}
