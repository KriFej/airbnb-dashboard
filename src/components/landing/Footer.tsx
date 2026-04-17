import { Logo } from "../ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted">
              The profit dashboard for Airbnb and Booking hosts who take their
              numbers seriously.
            </p>
            <div className="mt-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-500">
              <svg width="44" height="44" viewBox="0 0 44 44" className="text-black">
                <g fill="currentColor">
                  {Array.from({ length: 16 }).map((_, i) => {
                    const a = (i / 16) * Math.PI * 2;
                    const x1 = 22 + Math.cos(a) * 10;
                    const y1 = 22 + Math.sin(a) * 10;
                    const x2 = 22 + Math.cos(a) * 18;
                    const y2 = 22 + Math.sin(a) * 18;
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>
          <FooterCol
            title="Product"
            links={[
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "#pricing" },
              { label: "Dashboard", href: "/dashboard" },
              { label: "Changelog", href: "#" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { label: "About", href: "#" },
              { label: "Blog", href: "#" },
              { label: "Contact", href: "mailto:hello@locpilote.app" },
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              { label: "Privacy", href: "#" },
              { label: "Terms", href: "#" },
              { label: "Cookies", href: "#" },
            ]}
          />
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-dim md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} locpilote. Built for hosts, by hosts.</p>
          <p>
            Contact:{" "}
            <a
              href="mailto:hello@locpilote.app"
              className="text-muted hover:text-white"
            >
              hello@locpilote.app
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
