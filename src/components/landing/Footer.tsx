"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Logo } from "../ui/Logo";

export function Footer() {
  const [newsEmail, setNewsEmail] = useState("");
  const [newsDone, setNewsDone] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!newsEmail) return;
    setNewsLoading(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsEmail }),
      });
      setNewsDone(true);
    } finally {
      setNewsLoading(false);
    }
  }

  return (
    <footer className="border-t border-border/40">
      {/* Newsletter band */}
      <div className="border-b border-border/40 bg-brand-500/[0.04]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-base font-semibold text-fg">Restez informé</h3>
            <p className="mt-1 text-sm text-muted">
              Conseils rentabilité, nouvelles fonctionnalités, actus locpilote.
            </p>
          </div>
          {newsDone ? (
            <div className="flex items-center gap-2 text-sm text-brand-500">
              <CheckCircle2 size={16} /> Inscription confirmée, merci !
            </div>
          ) : (
          <form
            onSubmit={handleNewsletter}
            className="flex w-full max-w-sm gap-2"
          >
            <input
              type="email"
              required
              value={newsEmail}
              onChange={(e) => setNewsEmail(e.target.value)}
              placeholder="votre@email.com"
              className="h-11 flex-1 rounded-xl border border-border bg-surface px-3 text-sm text-fg placeholder:text-dim focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/20 min-w-0"
            />
            <button
              type="submit"
              disabled={newsLoading}
              className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
            >
              <ArrowRight size={14} />
              <span className="hidden sm:inline">S&apos;inscrire</span>
            </button>
          </form>
          )}
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Le tableau de bord de rentabilité pour les hôtes Airbnb et Booking qui prennent leurs chiffres au sérieux.
            </p>
            <p className="mt-4 text-xs text-dim">
              hello@locpilote.com
            </p>
          </div>

          <FooterCol
            title="Produit"
            links={[
              { label: "Fonctionnalités", href: "#features" },
              { label: "Tarifs", href: "#pricing" },
              { label: "Comment ça marche", href: "#how-it-works" },
              { label: "Tableau de bord", href: "/dashboard" },
            ]}
          />
          <FooterCol
            title="Entreprise"
            links={[
              { label: "Témoignages", href: "#testimonials" },
              { label: "FAQ", href: "#faq" },
              { label: "Contact", href: "mailto:hello@locpilote.com" },
            ]}
          />
          <FooterCol
            title="Légal"
            links={[
              { label: "Confidentialité", href: "/legal/privacy" },
              { label: "Conditions d'utilisation", href: "/legal/terms" },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border/40 pt-6 text-xs text-dim md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} locpilote. Conçu pour les hôtes, par des hôtes.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-600">
              1 bien gratuit
            </span>
            <a href="mailto:hello@locpilote.com" className="hover:text-fg transition-colors">
              hello@locpilote.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-widest text-dim">{title}</div>
      <ul className="mt-4 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="text-muted transition-colors hover:text-fg">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
