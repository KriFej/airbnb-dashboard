export function LogoRow() {
  return (
    <section className="border-y border-border/30 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-[11px] uppercase tracking-[0.2em] text-dim">
          Utilisé par des hôtes dans 38 pays
        </p>
        <div className="relative mt-8 overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-bg to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-bg to-transparent" />

          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {LOGOS.map((l) => (
              <span
                key={l}
                className="text-sm font-semibold tracking-tight text-muted/40 transition-colors hover:text-muted/70"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const LOGOS = [
  "◈ Stayly",
  "Hostboard",
  "◉ Nido",
  "RentCloud",
  "★ Keystone",
  "Hostmatic",
];
