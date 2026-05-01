import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide." }, { status: 400 });
    }

    // Resend integration — active une fois RESEND_API_KEY configuré
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      await fetch("https://api.resend.com/audiences/subscribers", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), unsubscribed: false }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
