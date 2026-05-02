import { Star } from "lucide-react";

const FEATURED = {
  name: "Sophie L.",
  role: "Hôte · Paris · 4 biens",
  body: "Enfin un tableau de bord qui déduit les frais. Je n'exporte rien, je ne synchronise rien manuellement, et je vois tout. En 2 minutes j'avais la vraie rentabilité de mes 4 appartements parisiens.",
  initials: "SL",
};

const TESTIMONIALS = [
  {
    name: "Camille D.",
    role: "Hôte · Lisbonne · 2 biens",
    body: "Je pensais gagner 4 000 €/mois. Après avoir rempli mes dépenses dans locpilote, j'ai vu que mon vrai net était à 2 100 €. Inestimable.",
    initials: "CD",
  },
  {
    name: "Marco R.",
    role: "Hôte · Milan · 1 bien",
    body: "La synchro iCal m'a pris 20 secondes. La carte de prévision m'a annoncé mon meilleur mois avant même la fin.",
    initials: "MR",
  },
  {
    name: "Alex V.",
    role: "Hôte · Barcelone · 1 bien",
    body: "J'ai remplacé mes trois tableurs. La carte bénéfice net est le seul chiffre qui m'intéresse désormais.",
    initials: "AV",
  },
];

function Stars({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} fill={dark ? "#000" : "#EAB308"} stroke="none" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="border-t border-border py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
            Témoignages
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-fg md:text-5xl">
            Des hôtes qui connaissent
            <br />enfin leurs chiffres.
          </h2>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
          {/* Featured */}
          <figure className="relative overflow-hidden rounded-2xl bg-brand-500 p-8 text-black shadow-btn-glow">
            <Stars dark />
            <blockquote className="mt-5 text-base leading-relaxed text-black/90">
              &ldquo;{FEATURED.body}&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-sm font-bold text-black">
                {FEATURED.initials}
              </span>
              <div>
                <div className="text-sm font-semibold">{FEATURED.name}</div>
                <div className="text-xs text-black/70">{FEATURED.role}</div>
              </div>
            </figcaption>
          </figure>

          {/* Others */}
          {TESTIMONIALS.slice(0, 2).map((t) => (
            <figure key={t.name} className="flex flex-col rounded-2xl bg-white border border-border p-7 shadow-card">
              <Stars />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                &ldquo;{t.body}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-xs font-bold text-fg">
                  {t.initials}
                </span>
                <div>
                  <div className="text-sm font-semibold text-fg">{t.name}</div>
                  <div className="text-xs text-muted">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}

          {/* Last one full width on mobile, 1/3 on desktop */}
          {TESTIMONIALS.slice(2).map((t) => (
            <figure key={t.name} className="flex flex-col rounded-2xl bg-white border border-border p-7 shadow-card lg:col-start-2">
              <Stars />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                &ldquo;{t.body}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-xs font-bold text-fg">
                  {t.initials}
                </span>
                <div>
                  <div className="text-sm font-semibold text-fg">{t.name}</div>
                  <div className="text-xs text-muted">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
