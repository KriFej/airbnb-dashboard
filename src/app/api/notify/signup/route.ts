import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getIp } from "@/lib/rateLimit";

const OWNER_HTML = (email: string, date: string) => `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #222;border-radius:16px;overflow:hidden;">
        <tr>
          <td style="background:#22c55e;padding:4px 24px;text-align:center;">
            <span style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#000;">Nouvel inscrit</span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 32px 8px;">
            <p style="margin:0;font-size:22px;font-weight:600;color:#fff;">🎉 Nouveau sur locpilote</p>
            <p style="margin:8px 0 0;font-size:14px;color:#888;">Quelqu'un vient de créer un compte.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px;">
            <table cellpadding="0" cellspacing="0" style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:10px;width:100%;">
              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid #2a2a2a;">
                  <span style="font-size:11px;color:#666;text-transform:uppercase;letter-spacing:0.08em;">Email</span><br>
                  <span style="font-size:15px;color:#22c55e;font-weight:500;">${email}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 20px;">
                  <span style="font-size:11px;color:#666;text-transform:uppercase;letter-spacing:0.08em;">Date</span><br>
                  <span style="font-size:14px;color:#ccc;">${date}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 32px;">
            <p style="margin:0;font-size:12px;color:#444;">locpilote.com · notification automatique</p>
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
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #222;border-radius:16px;overflow:hidden;">
        <!-- Header vert -->
        <tr>
          <td style="background:linear-gradient(135deg,#16a34a,#22c55e);padding:40px 32px;text-align:center;">
            <p style="margin:0;font-size:28px;font-weight:700;color:#fff;letter-spacing:-0.03em;">locpilote</p>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.75);">Votre copilote financier Airbnb</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 32px 24px;">
            <p style="margin:0;font-size:22px;font-weight:600;color:#fff;">Bienvenue 👋</p>
            <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#999;">
              Votre compte est créé et prêt à l'emploi. Connectez votre iCal Airbnb, renseignez vos dépenses et découvrez en quelques minutes votre <strong style="color:#fff;">vrai bénéfice net</strong>.
            </p>
          </td>
        </tr>
        <!-- CTA -->
        <tr>
          <td style="padding:0 32px 32px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#22c55e;border-radius:999px;">
                  <a href="https://locpilote.com/login" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:600;color:#000;text-decoration:none;">Accéder à mon tableau de bord →</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Steps -->
        <tr>
          <td style="padding:0 32px 32px;">
            <table cellpadding="0" cellspacing="0" style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:10px;width:100%;">
              <tr><td style="padding:20px 20px 12px;"><p style="margin:0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#666;">3 étapes pour démarrer</p></td></tr>
              <tr>
                <td style="padding:0 20px 8px;">
                  <p style="margin:0;font-size:13px;color:#bbb;line-height:1.5;"><span style="color:#22c55e;font-weight:700;">1.</span> Ajoutez votre premier bien</p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 20px 8px;">
                  <p style="margin:0;font-size:13px;color:#bbb;line-height:1.5;"><span style="color:#22c55e;font-weight:700;">2.</span> Collez votre lien iCal Airbnb ou Booking.com</p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 20px 20px;">
                  <p style="margin:0;font-size:13px;color:#bbb;line-height:1.5;"><span style="color:#22c55e;font-weight:700;">3.</span> Renseignez vos dépenses mensuelles</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:0 32px 32px;border-top:1px solid #1e1e1e;">
            <p style="margin:20px 0 0;font-size:12px;color:#444;">
              Vous recevez cet email car vous venez de créer un compte sur locpilote.com avec l'adresse <span style="color:#666;">${email}</span>.<br>
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
      // Email au propriétaire
      if (ownerEmail) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "locpilote <hello@locpilote.com>",
            to: ownerEmail,
            subject: `Nouvel inscrit — ${email}`,
            html: OWNER_HTML(email, date),
          }),
        });
      }

      // Email de bienvenue à l'utilisateur
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "locpilote <hello@locpilote.com>",
          to: email,
          subject: "Bienvenue sur locpilote 🎉",
          html: WELCOME_HTML(email),
        }),
      });
    }

    // Webhook Make.com → Google Sheet
    if (makeUrl) {
      await fetch(makeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, date, event: "inscription" }),
      });
    }
  } catch {
    // Ne jamais bloquer l'inscription pour une erreur de notification
  }

  return NextResponse.json({ ok: true });
}
