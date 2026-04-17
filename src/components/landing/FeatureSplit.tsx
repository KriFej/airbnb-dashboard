import { PlayCircle, TrendingUp } from "lucide-react";
import { Chip } from "../ui/Chip";

export function FeatureSplit() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-medium tracking-tight md:text-5xl">
            Access your real profitability
          </h2>
          <p className="mt-4 text-muted">
            Stop celebrating vanity revenue. Profitly subtracts fees, cleaning,
            utilities and credit, so you see the number that ends up in your
            bank account.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {/* Green feature card — echoes image 1 "Scalability" */}
          <div className="relative overflow-hidden rounded-2xl bg-brand-500 p-8 text-black">
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.5) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1 text-xs font-medium backdrop-blur">
                <TrendingUp size={12} /> Profit-first
              </span>
              <h3 className="mt-40 max-w-md text-2xl font-medium md:text-3xl">
                Built for hosts who want profit, not vanity revenue.
              </h3>
              <p className="mt-3 max-w-md text-sm text-black/70">
                Every KPI, chart and forecast is computed from net numbers —
                after platform fees, after expenses, after everything.
              </p>
            </div>
          </div>

          {/* Dark card with illustration/play button */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/15 via-transparent to-transparent" />
            <div className="relative flex h-full min-h-[360px] flex-col items-center justify-center p-8">
              <button
                type="button"
                className="group flex h-20 w-20 items-center justify-center rounded-full bg-black/70 backdrop-blur border border-white/10 transition-transform hover:scale-105"
                aria-label="Play demo video"
              >
                <PlayCircle size={40} className="text-white" strokeWidth={1.2} />
              </button>
              <p className="mt-6 text-sm text-muted">Watch 90s product tour</p>
              <div className="mt-10 grid w-full max-w-sm grid-cols-3 gap-3">
                <Stat n="€1.8M" l="tracked monthly" />
                <Stat n="38" l="countries" />
                <Stat n="4.9★" l="host rating" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3 text-center">
      <div className="text-lg font-medium text-white">{n}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-dim">
        {l}
      </div>
    </div>
  );
}
