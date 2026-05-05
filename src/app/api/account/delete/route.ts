import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/resend";

export async function DELETE() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const date = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
  const ownerEmail = process.env.OWNER_EMAIL;
  const makeUrl = process.env.MAKE_WEBHOOK_URL;

  const tasks: Promise<unknown>[] = [];

  if (process.env.RESEND_API_KEY && ownerEmail) {
    tasks.push(
      sendEmail(
        ownerEmail,
        `Désinscription — ${user.email}`,
        `<h2>Désinscription sur locpilote</h2><p><strong>Email :</strong> ${user.email}</p><p><strong>Date :</strong> ${date}</p>`,
      ),
    );
  }

  if (makeUrl) {
    tasks.push(
      fetch(makeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, date, event: "désinscription" }),
      }),
    );
  }

  const results = await Promise.allSettled(tasks);
  for (const r of results) {
    if (r.status === "rejected") console.error("[account/delete]", r.reason);
  }

  return NextResponse.json({ ok: true });
}
