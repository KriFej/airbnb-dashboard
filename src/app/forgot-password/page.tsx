"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Loader2, Mail, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/Logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: `${window.location.origin}/auth/reset` },
      );
      if (error) { setError("Une erreur est survenue, réessayez."); return; }
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-10 flex justify-center">
          <Logo />
        </Link>

        {sent ? (
          <div className="rounded-2xl border border-border bg-white p-8 shadow-card text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
              <Mail size={22} />
            </div>
            <h1 className="mt-5 text-2xl font-semibold text-fg">Vérifiez votre email</h1>
            <p className="mt-2 text-sm text-muted">
              Si un compte existe pour{" "}
              <span className="font-medium text-fg">{email}</span>, vous recevrez un lien de réinitialisation.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-fg hover:bg-fg/5"
            >
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-fg">Mot de passe oublié</h1>
              <p className="mt-1.5 text-sm text-muted">Entrez votre email, nous vous enverrons un lien de réinitialisation.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className="h-11 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-sm text-fg placeholder:text-dim focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 text-[15px] font-semibold text-white transition-all hover:bg-brand-600 disabled:opacity-60"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                Envoyer le lien
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-muted">
              <Link href="/login" className="font-medium text-brand-500 hover:text-brand-600">
                ← Retour à la connexion
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
