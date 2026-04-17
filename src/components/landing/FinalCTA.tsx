import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

export function FinalCTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-b from-brand-500/15 via-brand-500/5 to-transparent p-12 text-center md:p-16">
          <div className="pointer-events-none absolute inset-x-0 -bottom-40 h-80 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(34,197,94,0.35),transparent_70%)]" />
          <div className="relative">
            <h2 className="text-4xl font-medium tracking-tight md:text-5xl">
              Start tracking your
              <br />
              real profit today.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Open the dashboard, paste your iCal, fill your expenses. You&apos;ll
              know your true net in under 2 minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                href="/dashboard"
                size="lg"
                icon={<ArrowRight size={16} />}
              >
                Open Dashboard
              </Button>
              <Button href="#features" variant="secondary" size="lg">
                See features
              </Button>
            </div>
            <p className="mt-5 text-xs text-dim">
              Free · No signup · Your data stays on your device
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
