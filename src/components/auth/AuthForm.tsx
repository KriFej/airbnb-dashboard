"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Loader2, Mail, Lock, ArrowRight, Eye, EyeOff, Star, TrendingUp, Wallet, Receipt } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "../ui/Logo";

type Mode = "login" | "signup";

function MockKpi({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ${accent ? "bg-brand-500 text-black" : "bg-white border border-border"}`}>
      <div className={`text-[11px] font-semibold ${accent ? "text-black/60" : "text-muted"}`}>{label}</div>
      <div className={`mt-2 text-2xl font-bold tracking-tight ${accent ? "text-black" : "text-fg"}`}>{value}</div>
      <div className={`mt-0.5 text-[11px] ${accent ? "text-black/60" : "text-dim"}`}>{sub}</div>
    </div>
  );
}

const AVATARS = [
  { i: "CD", bg: "#EAB308" }, { i: "MR", bg: "#1C1C1C" },
  { i: "SL", bg: "#FACC15" }, { i: "AV", bg: "#6B7280" },
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
  /* honeypot — doit rester vide */
  const [hp, setHp] = useState("");

  const isSignup = mode === "signup";
  const cta = isSignup ? "Créer mon compte" : "Se connecter";
  const switchLabel = isSignup ? "Déjà un compte ?" : "Pas encore de compte ?";
  const switchHref = isSignup ? "/login" : "/signup";
  const switchCta = isSignup ? "Connexion" : "Créer un compte gratuit";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (hp) return; // bot détecté
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
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-surface p-10 lg:flex lg:w-[460px] lg:shrink-0">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-brand-500/20 blur-[80px]" />
          <div className="absolute bottom-10 left-0 h-48 w-48 rounded-full bg-brand-500/10 blur-[60px]" />
        </div>

        <Link href="/" className="relative"><Logo /></Link>

        <div className="relative space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">locpilote</span>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-fg">
              Votre bénéfice net<br />en 30 secondes.
            </h2>
            <p className="mt-3 text-sm text-muted">
              Connectez votre iCal, entrez vos dépenses — la rentabilité réelle s&apos;affiche instantanément.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MockKpi label="Bénéfice net" value="2 840 €" sub="Ce mois-ci" accent />
            <MockKpi label="Revenu brut" value="4 200 €" sub="Tous biens" />
            <MockKpi label="Dépenses" value="−1 360 €" sub="dont frais plateforme" />
            <MockKpi label="Prévision" value="3 100 €" sub="Fin de mois" />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {AVATARS.map((a) => (
                <span key={a.i} className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ring-2 ring-surface"
                  style={{ background: a.bg, color: a.bg === "#1C1C1C" || a.bg === "#6B7280" ? "#fff" : "#111" }}>
                  {a.i}
                </span>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} fill="#EAB308" stroke="none" />
                ))}
              </div>
              <p className="text-[11px] text-muted">
                <span className="font-semibold text-fg">1 200+</span> hôtes dans 38 pays
              </p>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-dim">© {new Date().getFullYear()} locpilote</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <Link href="/" className="mb-8 lg:hidden"><Logo /></Link>

        <div className="w-full max-w-sm">
          {sentTo ? (
            <div className="rounded-2xl border border-border bg-white p-8 shadow-card-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
                <Mail size={22} />
              </div>
              <h1 className="mt-5 text-2xl font-bold tracking-tight text-fg">Vérifiez votre email</h1>
              <p className="mt-2 text-sm text-muted">
                Un lien de confirmation a été envoyé à{" "}
                <span className="font-semibold text-fg">{sentTo}</span>.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-semibold text-fg hover:bg-surface shadow-card">
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
                  className="inline-flex h-11 items-center gap-2 justify-center rounded-full border border-border px-5 text-sm font-semibold text-muted hover:bg-surface disabled:opacity-60 shadow-card"
                >
                  {resendLoading ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                  {resendDone ? "Email renvoyé !" : "Renvoyer"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-fg">
                  {isSignup ? "Créer un compte" : "Bon retour 👋"}
                </h1>
                <p className="mt-1.5 text-sm text-muted">
                  {isSignup
                    ? "Commencez à suivre votre rentabilité gratuitement."
                    : "Accédez à votre tableau de bord locpilote."}
                </p>
              </div>

              {searchParams.get("error") === "confirm" && !isSignup && (
                <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-500">
                  Lien de confirmation invalide ou expiré. Réessayez.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot — invisible pour les humains */}
                <input
                  type="text"
                  name="website"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }}
                />

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted">Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@exemple.com"
                      className="h-11 w-full rounded-xl border border-border bg-white pl-9 pr-3 text-sm text-fg placeholder:text-dim shadow-card focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs font-semibold text-muted">Mot de passe</label>
                    {!isSignup && (
                      <Link href="/forgot-password" className="text-xs font-semibold text-brand-600 hover:text-brand-500">
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
                      className="h-11 w-full rounded-xl border border-border bg-white pl-9 pr-10 text-sm text-fg placeholder:text-dim shadow-card focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dim hover:text-muted">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {isSignup && (
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-muted">Confirmer le mot de passe</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim" />
                      <input
                        type={showConfirm ? "text" : "password"}
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-11 w-full rounded-xl border border-border bg-white pl-9 pr-10 text-sm text-fg placeholder:text-dim shadow-card focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      />
                      <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dim hover:text-muted">
                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-500">
                    {error}
                    {isSignup && error.includes("existe déjà") && (
                      <> — <Link href="/login" className="underline">Se connecter</Link></>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 text-[15px] font-bold text-black shadow-btn-glow transition hover:bg-brand-400 disabled:opacity-60"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                  {cta}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-muted">
                {switchLabel}{" "}
                <Link href={switchHref} className="font-semibold text-brand-600 hover:text-brand-500">
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
