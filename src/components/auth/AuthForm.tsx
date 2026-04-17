"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "../ui/Logo";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";
  const title = isSignup ? "Créer un compte" : "Se connecter";
  const cta = isSignup ? "Créer mon compte" : "Se connecter";
  const switchLabel = isSignup
    ? "Déjà un compte ?"
    : "Pas encore de compte ?";
  const switchHref = isSignup ? "/login" : "/signup";
  const switchCta = isSignup ? "Connexion" : "Créer un compte";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSignup) {
        const res = await signup(email, password);
        if (!res.ok) {
          setError(res.error);
          return;
        }
        const plan = searchParams.get("plan");
        const next = plan ? `/login?plan=${plan}` : "/login?created=1";
        router.push(next);
      } else {
        const res = await login(email, password);
        if (!res.ok) {
          setError(res.error);
          return;
        }
        router.push("/dashboard");
      }
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
          <h1 className="text-2xl font-medium tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted">
            {isSignup
              ? "Créez votre compte pour commencer à suivre votre rentabilité."
              : "Accédez à votre tableau de bord locpilote."}
          </p>

          {searchParams.get("created") === "1" && !isSignup && (
            <div className="mt-4 rounded-lg border border-brand-500/30 bg-brand-500/10 px-3 py-2 text-xs text-brand-400">
              Compte créé — vous pouvez maintenant vous connecter.
            </div>
          )}

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
                className="h-11 w-full rounded-xl border border-border bg-[#0E0E0E] px-3 text-sm text-white placeholder:text-dim focus:border-brand-500/60 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-medium text-muted">
                <Lock size={12} /> Mot de passe
              </span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignup ? "6 caractères minimum" : "••••••••"}
                className="h-11 w-full rounded-xl border border-border bg-[#0E0E0E] px-3 text-sm text-white placeholder:text-dim focus:border-brand-500/60 focus:outline-none"
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
              {cta}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted">
            {switchLabel}{" "}
            <Link
              href={switchHref}
              className="text-brand-400 hover:text-brand-300"
            >
              {switchCta}
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-[11px] text-dim">
          Démo — les comptes sont stockés localement dans votre navigateur.
        </p>
      </div>
    </div>
  );
}
