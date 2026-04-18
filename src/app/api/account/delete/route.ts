import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function DELETE() {
  // Vérifier la session courante
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Supprimer le compte via le client admin (service role)
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Notifier le propriétaire
  const date = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
  const resendKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.OWNER_EMAIL;
  const makeUrl = process.env.MAKE_WEBHOOK_URL;

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
        subject: `Désinscription — ${user.email}`,
        html: `
          <h2>Désinscription sur locpilote</h2>
          <p><strong>Email :</strong> ${user.email}</p>
          <p><strong>Date :</strong> ${date}</p>
        `,
      }),
    }).catch(() => {});
  }

  if (makeUrl) {
    await fetch(makeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, date, event: "désinscription" }),
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
