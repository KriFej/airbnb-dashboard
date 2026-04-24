import { Logo } from "../ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted">
              Le tableau de bord de rentabilité pour les hôtes Airbnb et
              Booking qui prennent leurs chiffres au sérieux.
            </p>
          </div>
          <FooterCol
            title="Produit"
            links={[
              { label: "Fonctionnalités", href: "#features" },
              { label: "Tarifs", href: "#pricing" },
              { label: "Tableau de bord", href: "/dashboard" },
            ]}
          />
          <FooterCol
            title="Entreprise"
            links={[
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
        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-dim md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} locpilote. Conçu pour les hôtes, par des hôtes.</p>
          <p>
            Contact&nbsp;:{" "}
            <a
              href="mailto:hello@locpilote.com"
              className="text-muted hover:text-white"
            >
              hello@locpilote.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-widest text-dim">
        {title}
      </div>
      <ul className="mt-4 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="text-muted transition-colors hover:text-white"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
