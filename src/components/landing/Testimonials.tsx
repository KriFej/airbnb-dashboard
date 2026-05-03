import { Star } from "lucide-react";

const FEATURED = {
  name: "Sophie L.",
  role: "Hôte · Paris · 4 biens",
  body: "Enfin un tableau de bord qui déduit les frais. Je n'exporte rien, je ne synchronise rien manuellement, et je vois tout. En 2 minutes j'avais la vraie rentabilité de mes 4 appartements parisiens.",
  initials: "SL",
  color: "#22C55E",
};

const TESTIMONIALS = [
  {
    name: "Camille D.",
    role: "Hôte · Lisbonne · 2 biens",
    body: "Je pensais gagner 4 000 €/mois. Après avoir rempli mes dépenses dans locpilote, j'ai vu que mon vrai net était à 2 100 €. Inestimable.",
    initials: "CD",
    color: "#4ADE80",
  },
  {
    name: "Marco R.",
    role: "Hôte · Milan · 1 bien",
    body: "La synchro iCal m'a pris 20 secondes. La carte de prévision m'a annoncé mon meilleur mois avant même la fin.",
    initials: "MR",
    color: "#86EFAC",
  },
  {
    name: "Alex V.",
    role: "Hôte · Barcelone · 1 bien",
    body: "J'ai remplacé mes trois tableurs. La carte bénéfice net est le seul chiffre qui m'intéresse désormais.",
    initials: "AV",
    color: "#16A34A",
  },
];

function Stars() {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} fill="#22C55E" stroke="none" className="text-brand-500" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="border-t border-border/30 py-14 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-widest text-brand-500">
            Témoignages
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Des hôtes qui connaissent
            <br />
            enfin leurs chiffres.
          </h2>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {/* Featured testimonial */}
          <figure className="relative overflow-hidden rounded-2xl bg-brand-500 p-8 text-white lg:row-span-1">
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.4) 0%, transparent 50%)",
              }}
            />
            <div className="relative">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="white" stroke="none" />
                ))}
              </div>
              <blockquote className="mt-5 text-base leading-relaxed text-white/90">
                &ldquo;{FEATURED.body}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white"
                >
                  {FEATURED.initials}
                </span>
                <div>
                  <div className="text-sm font-semibold">{FEATURED.name}</div>
                  <div className="text-xs text-white/70">{FEATURED.role}</div>
                </div>
              </figcaption>
            </div>
          </figure>

          {/* Other testimonials */}
          <div className="grid gap-4 sm:grid-cols-1 lg:col-span-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-2xl bg-white border border-border p-6 shadow-card"
              >
                <Stars />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                  &ldquo;{t.body}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </span>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
