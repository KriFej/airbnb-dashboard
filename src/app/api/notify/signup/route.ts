import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getIp } from "@/lib/rateLimit";

const BRAND = "#EAB308";
const BRAND_DARK = "#CA8A04";

const OWNER_HTML = (email: string, date: string) => `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F6F1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F6F1;padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #E2E1DC;border-radius:16px;overflow:hidden;">
        <tr>
          <td style="background:${BRAND};padding:4px 24px;text-align:center;">
            <span style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#000;">Nouvel inscrit</span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 32px 8px;">
            <p style="margin:0;font-size:22px;font-weight:600;color:#111;">🎉 Nouveau sur locpilote</p>
            <p style="margin:8px 0 0;font-size:14px;color:#6B7280;">Quelqu'un vient de créer un compte.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px;">
            <table cellpadding="0" cellspacing="0" style="background:#F7F6F1;border:1px solid #E2E1DC;border-radius:10px;width:100%;">
              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid #E2E1DC;">
                  <span style="font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:0.08em;">Email</span><br>
                  <span style="font-size:15px;color:${BRAND_DARK};font-weight:500;">${email}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 20px;">
                  <span style="font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:0.08em;">Date</span><br>
                  <span style="font-size:14px;color:#111;">${date}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 32px;">
            <p style="margin:0;font-size:12px;color:#9CA3AF;">locpilote.com · notification automatique</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const WELCOME_HTML = (email: string) => `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F6F1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F6F1;padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #E2E1DC;border-radius:16px;overflow:hidden;">
        <tr>
          <td style="background:${BRAND};padding:40px 32px;text-align:center;">
            <p style="margin:0;font-size:28px;font-weight:700;color:#000;letter-spacing:-0.03em;">locpilote</p>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(0,0,0,0.6);">Votre copilote financier Airbnb</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 32px 24px;">
            <p style="margin:0;font-size:22px;font-weight:600;color:#111;">Bienvenue 👋</p>
            <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#6B7280;">
              Votre compte est créé et prêt à l'emploi. Connectez votre iCal Airbnb, renseignez vos dépenses et découvrez en quelques minutes votre <strong style="color:#111;">vrai bénéfice net</strong>.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 32px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:${BRAND};border-radius:999px;">
                  <a href="https://locpilote.com/login" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:700;color:#000;text-decoration:none;">Accéder à mon tableau de bord →</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 32px;">
            <table cellpadding="0" cellspacing="0" style="background:#F7F6F1;border:1px solid #E2E1DC;border-radius:10px;width:100%;">
              <tr><td style="padding:20px 20px 12px;"><p style="margin:0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#6B7280;">3 étapes pour démarrer</p></td></tr>
              <tr><td style="padding:0 20px 8px;"><p style="margin:0;font-size:13px;color:#374151;line-height:1.5;"><span style="color:${BRAND_DARK};font-weight:700;">1.</span> Ajoutez votre premier bien</p></td></tr>
              <tr><td style="padding:0 20px 8px;"><p style="margin:0;font-size:13px;color:#374151;line-height:1.5;"><span style="color:${BRAND_DARK};font-weight:700;">2.</span> Collez votre lien iCal Airbnb ou Booking.com</p></td></tr>
              <tr><td style="padding:0 20px 20px;"><p style="margin:0;font-size:13px;color:#374151;line-height:1.5;"><span style="color:${BRAND_DARK};font-weight:700;">3.</span> Renseignez vos dépenses mensuelles</p></td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 32px;border-top:1px solid #E2E1DC;">
            <p style="margin:20px 0 0;font-size:12px;color:#9CA3AF;">
              Vous recevez cet email car vous venez de créer un compte sur locpilote.com avec l'adresse <span style="color:#6B7280;">${email}</span>.<br>
              Des questions ? Répondez directement à cet email.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (!rateLimit(`signup:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
  }

  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ ok: true }); // silent reject
    }
    const date = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

    const resendKey = process.env.RESEND_API_KEY;
    const ownerEmail = process.env.OWNER_EMAIL;
    const makeUrl = process.env.MAKE_WEBHOOK_URL;

    if (resendKey) {
      if (ownerEmail) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "locpilote <hello@locpilote.com>",
            to: ownerEmail,
            subject: `Nouvel inscrit — ${email}`,
            html: OWNER_HTML(email, date),
          }),
        });
      }

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "locpilote <hello@locpilote.com>",
          to: email,
          subject: "Bienvenue sur locpilote 🎉",
          html: WELCOME_HTML(email),
        }),
      });
    }

    if (makeUrl) {
      await fetch(makeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, date, event: "inscription" }),
      });
    }
  } catch {
    // ne jamais bloquer l'inscription
  }

  return NextResponse.json({ ok: true });
}
