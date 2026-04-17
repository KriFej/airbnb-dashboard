import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "Is locpilote really free?",
    a: "Yes. The Host plan is 100% free and will remain free. No credit card, no signup. A paid Studio plan is coming for multi-property hosts who need cloud sync.",
  },
  {
    q: "How does the iCal integration work?",
    a: "Open your Airbnb or Booking calendar, copy the iCal export URL, paste it in the dashboard. locpilote fetches your bookings (via a CORS proxy if needed) and renders them instantly.",
  },
  {
    q: "Where is my data stored?",
    a: "Only in your browser's localStorage. locpilote has no backend, no database, no analytics. Clear your site data and everything is gone.",
  },
  {
    q: "Does it work with Booking.com?",
    a: "Yes — any calendar source that exports an iCal (.ics) URL is supported: Airbnb, Booking.com, Vrbo, Hostaway, Smoobu, Google Calendar, etc.",
  },
  {
    q: "Can I track multiple properties?",
    a: "The free Host plan is designed for one property. Multi-property support ships with the upcoming Studio plan.",
  },
  {
    q: "How accurate is the net profit number?",
    a: "As accurate as the inputs you provide. locpilote subtracts platform fees (percentage per channel) and fixed monthly expenses. Garbage in, garbage out — fill it seriously.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-t border-border/60 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-xs uppercase tracking-widest text-brand-500">
            FAQ
          </span>
          <h2 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">
            Questions, answered.
          </h2>
        </div>

        <div className="mt-12 divide-y divide-border rounded-2xl border border-border bg-card">
          {FAQS.map((item) => (
            <details key={item.q} className="group px-6 py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4">
                <span className="text-[15px] font-medium text-white">
                  {item.q}
                </span>
                <Plus
                  size={18}
                  className="shrink-0 text-muted transition-transform group-open:rotate-45"
                />
              </summary>
              <p className="mt-3 text-sm text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
