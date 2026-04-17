import { Check } from "lucide-react";
import { Button } from "../ui/Button";

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-border/60 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-widest text-brand-500">
            Pricing
          </span>
          <h2 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">
            Free while we&apos;re young.
          </h2>
          <p className="mt-4 text-muted">
            No credit card. No account. Your data lives in your browser —
            always.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="text-sm font-medium text-muted">Host</div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-medium">€0</span>
              <span className="text-sm text-muted">/ month</span>
            </div>
            <p className="mt-2 text-sm text-muted">
              Everything you need as a solo host.
            </p>
            <Button
              href="/dashboard"
              variant="secondary"
              size="lg"
              className="mt-6 w-full"
            >
              Open Dashboard
            </Button>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "1 property",
                "Airbnb + Booking iCal sync",
                "Real-time net profit",
                "End-of-month forecast",
                "Local-only data",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-white/90">
                  <Check size={16} className="text-brand-500" /> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-brand-500 p-8 text-black">
            <span className="absolute right-6 top-6 rounded-full bg-black/20 px-3 py-1 text-xs font-medium">
              Coming soon
            </span>
            <div className="text-sm font-medium text-black/70">Studio</div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-medium">€9</span>
              <span className="text-sm text-black/70">/ month</span>
            </div>
            <p className="mt-2 text-sm text-black/80">
              For hosts managing multiple properties.
            </p>
            <Button
              href="#faq"
              variant="secondary"
              size="lg"
              className="mt-6 w-full !bg-black !text-white !border-black hover:!bg-black/90"
            >
              Join the waitlist
            </Button>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Unlimited properties",
                "Cloud sync across devices",
                "CSV & PDF export",
                "Email monthly reports",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check size={16} /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
