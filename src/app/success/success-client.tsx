"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/hooks/useAuth";
import { usePlan } from "@/hooks/usePlan";
import { PLAN_LABELS, isValidPlan } from "@/lib/plan";

export function SuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const { email, ready: authReady } = useAuth();
  const { setPlan, ready: planReady } = usePlan(email);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (!authReady || !planReady) return;
    if (!email) {
      const qs = planParam ? `?plan=${planParam}&after=success` : "?after=success";
      router.replace(`/login${qs}`);
      return;
    }
    if (isValidPlan(planParam) && !activated) {
      setPlan(planParam);
      setActivated(true);
    }
  }, [authReady, planReady, email, planParam, router, setPlan, activated]);

  if (!authReady || !planReady || !email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-muted">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }

  if (!isValidPlan(planParam)) {
    return (
      <Shell>
        <h1 className="text-2xl font-medium tracking-tight">
          Offre inconnue
        </h1>
        <p className="mt-2 text-sm text-muted">
          Le lien de confirmation est invalide ou expiré.
        </p>
        <Link
          href="/#pricing"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-brand-500 px-5 text-sm font-medium text-black hover:bg-brand-400"
        >
          Voir les offres
          <ArrowRight size={14} />
        </Link>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/30">
        <CheckCircle2 size={30} />
      </div>
      <h1 className="mt-6 text-2xl font-medium tracking-tight">
        Abonnement {PLAN_LABELS[planParam]} activé
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Merci pour votre confiance. Votre offre est désormais active sur votre
        compte <span className="text-white">{email}</span>.
      </p>
      <Link
        href="/dashboard"
        className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-brand-500 px-6 text-[15px] font-medium text-black hover:bg-brand-400"
      >
        Aller au tableau de bord
        <ArrowRight size={16} />
      </Link>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center">
          <Logo />
        </Link>
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center">
          {children}
        </div>
      </div>
    </div>
  );
}
