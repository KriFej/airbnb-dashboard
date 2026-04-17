import {
  Calendar,
  RefreshCw,
  LineChart,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";

const FEATURES = [
  {
    icon: Wallet,
    title: "Real net revenue",
    body: "See exactly what reaches your bank after Airbnb and Booking fees.",
  },
  {
    icon: Receipt,
    title: "Expense split",
    body: "Credit, electricity, water, internet, cleaning — tracked in seconds.",
  },
  {
    icon: RefreshCw,
    title: "iCal sync",
    body: "Paste your iCal URL once. Bookings appear in your calendar automatically.",
  },
  {
    icon: Calendar,
    title: "Visual calendar",
    body: "Month view that highlights occupied nights and upcoming stays.",
  },
  {
    icon: TrendingUp,
    title: "End-of-month forecast",
    body: "Projected profit based on current bookings and future stays.",
  },
  {
    icon: LineChart,
    title: "Multi-platform ready",
    body: "Works with Airbnb, Booking.com and any iCal-compatible source.",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="border-t border-border/60 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-widest text-brand-500">
            Features
          </span>
          <h2 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">
            Everything a host needs,
            <br />
            nothing they don&apos;t.
          </h2>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-border-hover hover:bg-card-hover"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20">
                <Icon size={20} />
              </div>
              <h3 className="mt-5 text-lg font-medium">{title}</h3>
              <p className="mt-2 text-sm text-muted">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
