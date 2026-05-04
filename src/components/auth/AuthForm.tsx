"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Loader2, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "../ui/Logo";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup, login, resendConfirmation } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDone, setResendDone] = useState(false);

  const isSignup = mode === "signup";
  const cta = isSignup ? "Créer mon compte" : "Se connecter";
  const switchLabel = isSignup ? "Déjà un compte ?" : "Pas encore de compte ?";
  const switchHref = isSignup ? "/login" : "/signup";
  const switchCta = isSignup ? "Connexion" : "Créer un compte gratuit";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (isSignup && password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      if (isSignup) {
        const res = await signup(email, password);
        if (!res.ok) { setError(res.error); return; }
        setSentTo(email);
      } else {
        const res = await login(email, password);
        if (!res.ok) { setError(res.error); return; }
        const after = searchParams.get("after");
        const plan = searchParams.get("plan");
        if (after === "checkout" && plan) router.push(`/api/checkout?plan=${encodeURIComponent(plan)}`);
        else if (after === "success" && plan) router.push(`/success?plan=${encodeURIComponent(plan)}`);
        else router.push("/dashboard");
      }
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

        {sentTo ? (
          <div className="rounded-2xl border border-border bg-white p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
              <Mail size={22} />
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-fg">Vérifiez votre email</h1>
            <p className="mt-2 text-sm text-muted">
              Un lien de confirmation a été envoyé à{" "}
              <span className="font-medium text-fg">{sentTo}</span>. Cliquez dessus pour activer votre compte.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-fg hover:bg-fg/5">
                Retour à la connexion
              </Link>
              <button
                type="button"
                disabled={resendLoading || resendDone}
                onClick={async () => {
                  setResendLoading(true);
                  await resendConfirmation(sentTo);
                  setResendLoading(false);
                  setResendDone(true);
                }}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-muted hover:bg-fg/5 disabled:opacity-60"
              >
                {resendLoading ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                {resendDone ? "Email renvoyé !" : "Renvoyer l'email"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-fg">
                {isSignup ? "Créer un compte" : "Bon retour 👋"}
              </h1>
              <p className="mt-1.5 text-sm text-muted">
                {isSignup
                  ? "Commencez à suivre votre rentabilité gratuitement."
                  : "Accédez à votre tableau de bord locpilote."}
              </p>
            </div>

            {searchParams.get("error") === "confirm" && !isSignup && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-400">
                Lien de confirmation invalide ou expiré. Réessayez la connexion.
              </div>
            )}

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

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-medium text-muted">Mot de passe</label>
                  {!isSignup && (
                    <Link href="/forgot-password" className="text-xs text-brand-500 hover:text-brand-600">
                      Mot de passe oublié ?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignup ? "6 caractères minimum" : "••••••••"}
                    className="h-11 w-full rounded-xl border border-border bg-surface pl-9 pr-10 text-sm text-fg placeholder:text-dim focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/20"
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dim hover:text-muted">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {isSignup && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 w-full rounded-xl border border-border bg-surface pl-9 pr-10 text-sm text-fg placeholder:text-dim focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/20"
                    />
                    <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dim hover:text-muted">
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-400">
                  {error}
                  {isSignup && error.includes("existe déjà") && (
                    <> — <Link href="/login" className="underline hover:text-red-300">Se connecter</Link></>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 text-[15px] font-semibold text-white transition-all hover:bg-brand-600 disabled:opacity-60"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                {cta}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-muted">
              {switchLabel}{" "}
              <Link href={switchHref} className="font-medium text-brand-500 hover:text-brand-600">
                {switchCta}
              </Link>
            </p>

            {isSignup && (
              <p className="mt-4 text-center text-[11px] text-dim">
                1 bien gratuit · Sans carte bancaire · Annulation à tout moment
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
