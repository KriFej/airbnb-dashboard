import { NextRequest, NextResponse } from "next/server";

const BRAND = "#EAB308";
const BRAND_DARK = "#CA8A04";

// Email J+1 : rappel activation si pas encore de bien ajouté
const ACTIVATE_HTML = (email: string) => `
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
            <p style="margin:0;font-size:20px;font-weight:600;color:#111;">Votre tableau de bord vous attend ⏱</p>
            <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#6B7280;">
              Hier vous avez créé votre compte locpilote. Il ne vous reste qu'une chose à faire : ajouter votre premier bien pour voir votre rentabilité réelle.
            </p>
            <p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:#6B7280;">
              Ça prend moins de <strong style="color:#111;">2 minutes</strong>.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 32px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:${BRAND};border-radius:999px;">
                  <a href="https://locpilote.com/dashboard" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:700;color:#000;text-decoration:none;">Ajouter mon premier bien →</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 32px;">
            <table cellpadding="0" cellspacing="0" style="background:#F7F6F1;border-radius:10px;width:100%;border:1px solid #E2E1DC;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0;font-size:13px;color:#374151;line-height:1.6;">
                  💡 <strong>Astuce :</strong> Allez dans Airbnb → Calendrier → Exporter → Copiez le lien iCal. C'est tout ce dont locpilote a besoin pour importer vos réservations automatiquement.
                </p>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 32px;">
            <p style="margin:0;font-size:12px;color:#9CA3AF;">
              Vous recevez cet email car vous avez créé un compte sur locpilote.com avec <span style="color:#6B7280;">${email}</span>.<br>
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
  // Vérification du secret Vercel Cron
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ ok: true, skipped: "no_resend_key" });
  }

  // Récupère les users inscrits il y a entre 20h et 28h (fenêtre J+1)
  // En production, requête Supabase pour trouver ces users
  // Exemple : SELECT email FROM auth.users WHERE created_at BETWEEN now()-interval '28h' AND now()-interval '20h'
  // Ici on expose juste l'endpoint — la logique Supabase s'ajoute quand SUPABASE_SERVICE_KEY est dispo

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const windowEnd = new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString();
  const windowStart = new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString();

  const { data: users, error } = await supabase
    .from("profiles")
    .select("email, activated")
    .eq("activated", false)
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
        subject: "Votre tableau de bord vous attend ⏱",
        html: ACTIVATE_HTML(user.email),
      }),
    });
    sent++;
  }

  return NextResponse.json({ ok: true, sent });
}
