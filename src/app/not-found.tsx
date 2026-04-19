import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center">
      <Link href="/" className="mb-10">
        <Logo />
      </Link>
      <p className="text-8xl font-medium tracking-tight text-brand-500">404</p>
      <h1 className="mt-4 text-2xl font-medium text-white">Page introuvable</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-white hover:bg-white/5"
      >
        <ArrowLeft size={14} />
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
