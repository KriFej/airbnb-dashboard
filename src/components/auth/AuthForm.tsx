"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Loader2, Mail, Lock, ArrowRight, Eye, EyeOff, TrendingUp, Wallet, Receipt, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "../ui/Logo";

type Mode = "login" | "signup";

/* ── Mini KPI mockup cards for the brand panel ── */
function MockKpi({ label, value, sub, green }: { label: string; value: string; sub: string; green?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ${green ? "bg-brand-500 text-white" : "bg-white/5 border border-white/8"}`}>
      <div className={`text-[11px] font-medium ${green ? "text-white/70" : "text-white/50"}`}>{label}</div>
      <div className={`mt-2 text-2xl font-semibold tracking-tight ${green ? "text-white" : "text-white"}`}>{value}</div>
      <div className={`mt-0.5 text-[11px] ${green ? "text-white/60" : "text-white/40"}`}>{sub}</div>
    </div>
  );
}

const AVATARS = [
  { i: "CD", c: "#22C55E" }, { i: "MR", c: "#4ADE80" }, { i: "SL", c: "#16A34A" }, { i: "AV", c: "#86EFAC" }
];

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
    <div className="flex min-h-screen bg-bg">
      {/* ── Brand panel (desktop only) ── */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-white/[0.06] bg-[#080808] p-10 lg:flex lg:w-[480px] lg:shrink-0">
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-500/20 blur-[80px]" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-brand-500/10 blur-[60px]" />
        </div>

        {/* Logo */}
        <Link href="/" className="relative">
          <Logo />
        </Link>

        {/* Center content */}
        <div className="relative space-y-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-500">locpilote</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white">
              Votre bénéfice net<br />en 30 secondes.
            </h2>
            <p className="mt-3 text-sm text-white/50">
              Connectez votre iCal, entrez vos dépenses — la rentabilité réelle s'affiche instantanément.
            </p>
          </div>

          {/* Mock KPI cards */}
          <div className="grid grid-cols-2 gap-3">
            <MockKpi label="Bénéfice net" value="2 840 €" sub="Ce mois-ci" green />
            <MockKpi label="Revenu brut" value="4 200 €" sub="Tous biens" />
            <MockKpi label="Dépenses" value="−1 360 €" sub="dont frais plateforme" />
            <MockKpi label="Prévision" value="3 100 €" sub="Fin de mois" />
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {AVATARS.map((a) => (
                <span key={a.i} className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-black ring-2 ring-[#080808]" style={{ background: a.c }}>
                  {a.i}
                </span>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} fill="#22C55E" stroke="none" />
                ))}
              </div>
              <p className="text-[11px] text-white/40">
                <span className="font-medium text-white/70">1 200+</span> hôtes dans 38 pays
              </p>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-white/25">© {new Date().getFullYear()} locpilote</p>
      </div>

      {/* ── Form panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <Link href="/" className="mb-8 lg:hidden">
          <Logo />
        </Link>

        <div className="w-full max-w-sm">
          {sentTo ? (
            /* Email sent state */
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
              {/* Heading */}
              <div className="mb-8">
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
                {/* Email */}
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

                {/* Password */}
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

                {/* Confirm password */}
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
    </div>
  );
}
