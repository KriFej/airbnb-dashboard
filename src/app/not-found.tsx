import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-6 text-center">
      {/* Giant background text */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-semibold leading-none tracking-tighter text-fg/[0.03]"
        style={{ fontSize: "clamp(140px, 30vw, 340px)" }}
      >
        404
      </span>

      {/* Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(34,197,94,0.15),transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <Link href="/" className="mb-10">
          <Logo />
        </Link>

        <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-xs font-medium text-brand-400">
          Erreur 404
        </div>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          Page introuvable
        </h1>
        <p className="mt-3 max-w-sm text-sm text-muted">
          Cette page n&apos;existe pas ou a été déplacée. Retournez à l&apos;accueil pour continuer.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-500 px-5 text-sm font-semibold text-black transition-colors hover:bg-brand-400"
          >
            <Home size={14} />
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium text-fg hover:border-border-hover hover:bg-fg/5"
          >
            <ArrowLeft size={14} />
            Mon dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
