import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Camille D.",
    role: "Hôte · Lisbonne · 2 biens",
    body: "Je pensais gagner 4 000 €/mois. Après avoir rempli mes dépenses dans locpilote, j'ai vu que mon vrai net était à 2 100 €. Inestimable.",
    initials: "CD",
    color: "#22C55E",
  },
  {
    name: "Marco R.",
    role: "Hôte · Milan · 1 bien",
    body: "La synchro iCal m'a pris 20 secondes. La carte de prévision m'a annoncé mon meilleur mois avant même la fin.",
    initials: "MR",
    color: "#4ADE80",
  },
  {
    name: "Sophie L.",
    role: "Hôte · Paris · 4 biens",
    body: "Enfin un tableau de bord qui déduit les frais. Je n'exporte rien, je ne synchronise rien, et je vois tout.",
    initials: "SL",
    color: "#86EFAC",
  },
  {
    name: "Alex V.",
    role: "Hôte · Barcelone · 1 bien",
    body: "J'ai remplacé mes trois tableurs. La carte bénéfice net est le seul chiffre qui m'intéresse.",
    initials: "AV",
    color: "#16A34A",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="border-t border-border/60 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-widest text-brand-500">
            Témoignages
          </span>
          <h2 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">
            Des hôtes qui connaissent
            <br />
            enfin leurs chiffres.
          </h2>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex gap-1 text-brand-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" stroke="none" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm text-muted">
                &laquo;&nbsp;{t.body}&nbsp;&raquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-black"
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
    </section>
  );
}
