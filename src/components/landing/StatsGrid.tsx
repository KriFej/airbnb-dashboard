import { CheckCircle2, Users } from "lucide-react";

export function StatsGrid() {
  return (
    <section className="pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {/* Card 1: Subscription Successful style */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 rounded-full border border-border bg-black/60 p-3 backdrop-blur w-full">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-black">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <div className="text-sm font-medium text-white">
                  Expense recorded
                </div>
                <div className="text-[11px] text-muted">Today, 09:24</div>
              </div>
            </div>
            <h3 className="mt-10 text-xl font-medium">Cost-effectiveness</h3>
            <p className="mt-2 text-sm text-muted">
              Track every recurring charge in one place and instantly see how
              much of your gross revenue is actually eaten up each month.
            </p>
          </div>

          {/* Card 2: 90% with bar chart */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-end gap-1.5 h-24">
              {[35, 55, 25, 70, 40, 85, 50, 75, 40, 90, 60, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-brand-500"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="mt-6 text-6xl font-medium tracking-tight">90%</div>
            <p className="mt-2 text-sm text-muted">
              Less time spent on spreadsheets — your iCal feed and expenses do
              the math, automatically.
            </p>
          </div>

          {/* Card 3: Green Analytics card */}
          <div className="relative overflow-hidden rounded-2xl bg-brand-500 p-6 text-black">
            <div className="flex -space-x-2">
              {["#fca5a5", "#fcd34d", "#93c5fd", "#c4b5fd"].map((c, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-brand-500"
                  style={{ background: c }}
                />
              ))}
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-500 bg-black text-[10px] font-medium text-white">
                +12
              </div>
            </div>
            <p className="mt-4 text-sm text-black/80">
              Our users span across different continents of the world.
            </p>
            <div className="mt-20 flex items-center gap-2">
              <Users size={18} />
              <h3 className="text-xl font-medium">Analytics & Insights</h3>
            </div>
            <p className="mt-2 text-sm text-black/80">
              Monthly forecasts, occupancy rate and net profit — all in one
              clean view.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
