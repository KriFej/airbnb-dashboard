import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Camille D.",
    role: "Host · Lisbon · 2 properties",
    body: "I thought I was making €4k/month. After plugging my expenses into locpilote I realized my real net was €2.1k. Priceless.",
    initials: "CD",
    color: "#22C55E",
  },
  {
    name: "Marco R.",
    role: "Host · Milan · 1 property",
    body: "The iCal sync took me 20 seconds. The forecast card told me I'd hit my best month ever before it happened.",
    initials: "MR",
    color: "#4ADE80",
  },
  {
    name: "Sophie L.",
    role: "Host · Paris · 4 properties",
    body: "Finally a dashboard that subtracts fees. I export nothing, I sync nothing, and I see everything.",
    initials: "SL",
    color: "#86EFAC",
  },
  {
    name: "Alex V.",
    role: "Host · Barcelona · 1 property",
    body: "Replaced my three spreadsheets. The net profit card is the only number I care about.",
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
            Testimonials
          </span>
          <h2 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">
            Hosts who finally
            <br />
            know their numbers.
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
              <blockquote className="mt-4 flex-1 text-sm text-white/90">
                &ldquo;{t.body}&rdquo;
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
