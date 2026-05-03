"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Lock, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/Logo";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) { setError("Les mots de passe ne correspondent pas."); return; }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        const m = error.message.toLowerCase();
        if (m.includes("same password")) setError("Le nouveau mot de passe doit être différent.");
        else if (m.includes("token has expired") || m.includes("otp expired")) setError("Le lien a expiré. Recommencez depuis la page mot de passe oublié.");
        else setError("Une erreur est survenue, réessayez.");
        return;
      }
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-white/[0.06] bg-[#080808] p-10 lg:flex lg:w-[480px] lg:shrink-0">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-500/20 blur-[80px]" />
        </div>
        <Link href="/"><Logo /></Link>
        <div className="relative space-y-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h2 className="text-3xl font-semibold leading-tight text-white">Nouveau mot<br />de passe.</h2>
            <p className="mt-3 text-sm text-white/50">Choisissez un mot de passe solide. Vous serez redirigé vers votre tableau de bord dès la validation.</p>
          </div>
          <ul className="space-y-2 text-sm text-white/40">
            <li className="flex items-center gap-2"><span className="text-brand-500">✓</span> Au moins 6 caractères</li>
            <li className="flex items-center gap-2"><span className="text-brand-500">✓</span> Différent de l&apos;ancien mot de passe</li>
          </ul>
        </div>
        <p className="relative text-xs text-white/25">© {new Date().getFullYear()} locpilote</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <Link href="/" className="mb-8 lg:hidden"><Logo /></Link>
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-fg">Nouveau mot de passe</h1>
            <p className="mt-1.5 text-sm text-muted">Choisissez un nouveau mot de passe pour votre compte locpilote.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Nouveau mot de passe</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim" />
                <input type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6 caractères minimum"
                  className="h-11 w-full rounded-xl border border-border bg-surface pl-9 pr-10 text-sm text-fg placeholder:text-dim focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/20" />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dim hover:text-muted">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim" />
                <input type={showConfirm ? "text" : "password"} required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-border bg-surface pl-9 pr-10 text-sm text-fg placeholder:text-dim focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/20" />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dim hover:text-muted">
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-400">
                {error}{error.includes("expiré") && (<> — <Link href="/forgot-password" className="underline hover:text-red-300">Recommencer</Link></>)}
              </div>
            )}
            <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 text-[15px] font-semibold text-white transition-all hover:bg-brand-600 disabled:opacity-60">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              Enregistrer le mot de passe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
