import { Logo } from "../ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border/40">
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
