export function LogoRow() {
  return (
    <section className="border-y border-border/60 bg-surface/50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs uppercase tracking-widest text-dim">
          Trusted by 1,200+ hosts in 38 countries
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
          {LOGOS.map((l) => (
            <span
              key={l}
              className="text-lg font-semibold tracking-tight text-muted/80"
            >
              {l}
            </span>
          ))}
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
