import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "How much does locpilote cost?",
    a: "Three plans: Starter at €9.90/month (1 to 2 properties), Pro at €19.90/month (3 to 10 properties) and Enterprise on quote for 11 properties and up. All plans are monthly, cancel anytime.",
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
    a: "Starter covers 1-2 properties, Pro covers 3-10 with the live iCal-synced booking agenda, and Enterprise is tailored for portfolios of 11+ properties (custom quote).",
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
