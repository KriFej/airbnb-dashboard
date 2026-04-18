import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const date = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

    const resendKey = process.env.RESEND_API_KEY;
    const ownerEmail = process.env.OWNER_EMAIL;
    const makeUrl = process.env.MAKE_WEBHOOK_URL;

    // Email au propriétaire via Resend
    if (resendKey && ownerEmail) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "locpilote <onboarding@resend.dev>",
          to: ownerEmail,
          subject: `Nouvel inscrit — ${email}`,
          html: `
            <h2>Nouvel inscrit sur locpilote</h2>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Date :</strong> ${date}</p>
          `,
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
