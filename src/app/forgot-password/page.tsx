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
      if (error) {
        setError("Une erreur est survenue, réessayez.");
        return;
      }
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center">
          <Logo />
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8">
          {sent ? (
            <>
              <h1 className="text-2xl font-medium tracking-tight">
                Vérifiez votre email
              </h1>
              <p className="mt-2 text-sm text-muted">
                Si un compte existe pour{" "}
                <span className="text-fg font-medium">{email}</span>, vous recevrez un
                lien pour réinitialiser votre mot de passe.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-fg hover:bg-fg/5"
              >
                Retour à la connexion
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-medium tracking-tight">
                Mot de passe oublié
              </h1>
              <p className="mt-1 text-sm text-muted">
                Entrez votre email, nous vous enverrons un lien de
                réinitialisation.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-xs font-medium text-muted">
                    <Mail size={12} /> Email
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-fg placeholder:text-dim focus:border-brand-500/60 focus:outline-none"
                  />
                </label>

                {error && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-500 text-[15px] font-medium text-black transition-all hover:bg-brand-400 disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <ArrowRight size={16} />
                  )}
                  Envoyer le lien
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-muted">
                <Link href="/login" className="text-brand-400 hover:text-brand-300">
                  Retour à la connexion
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
