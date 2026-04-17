import { Check, Mail, Sparkles } from "lucide-react";
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
            Simple plans, priced per property.
          </h2>
          <p className="mt-4 text-muted">
            Start small, scale as your portfolio grows. Every plan includes the
            core dashboard and real-time profit calculations.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-3">
          {/* Starter */}
          <div className="flex flex-col rounded-2xl border border-border bg-card p-8">
            <div className="text-sm font-medium text-muted">Starter</div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-medium tracking-tight">
                €9.90
              </span>
              <span className="text-sm text-muted">/ month</span>
            </div>
            <p className="mt-2 text-sm text-muted">
              For solo hosts with one or two properties.
            </p>
            <Button
              href="/dashboard"
              variant="secondary"
              size="lg"
              className="mt-6 w-full"
            >
              Start with Starter
            </Button>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Up to 2 properties",
                "Airbnb & Booking.com revenue tracking",
                "Full profit dashboard",
                "Data export (CSV / PDF)",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-white/90">
                  <Check
                    size={16}
                    className="mt-0.5 shrink-0 text-brand-500"
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro — highlighted green card */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl bg-brand-500 p-8 text-black shadow-glow md:-mt-4">
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.4) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative flex h-full flex-col">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-black/80">Pro</div>
                <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
                  <Sparkles size={10} /> Most popular
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-5xl font-medium tracking-tight">
                  €19.90
                </span>
                <span className="text-sm text-black/70">/ month</span>
              </div>
              <p className="mt-2 text-sm text-black/80">
                For hosts scaling from 3 to 10 properties.
              </p>
              <Button
                href="/dashboard"
                size="lg"
                className="mt-6 w-full !bg-black !text-white hover:!bg-black/90"
              >
                Start with Pro
              </Button>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "3 to 10 properties",
                  "Everything in Starter",
                  "Live booking agenda synced via iCal",
                  "Direct Airbnb + Booking.com calendar link",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={16} className="mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Enterprise */}
          <div className="flex flex-col rounded-2xl border border-border bg-card p-8">
            <div className="text-sm font-medium text-muted">Enterprise</div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-medium tracking-tight">
                Custom
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">
              From 11 properties and up — tailored to your portfolio.
            </p>
            <Button
              href="mailto:hello@locpilote.app?subject=Enterprise%20quote%20request"
              variant="secondary"
              size="lg"
              className="mt-6 w-full"
              icon={<Mail size={14} />}
            >
              Contact sales
            </Button>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "11+ properties, no limit",
                "Everything in Pro",
                "Custom quote based on your volume",
                "Dedicated onboarding & support",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-white/90">
                  <Check
                    size={16}
                    className="mt-0.5 shrink-0 text-brand-500"
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-dim">
          All prices in EUR, billed monthly. Cancel anytime. VAT may apply.
        </p>
      </div>
    </section>
  );
}
