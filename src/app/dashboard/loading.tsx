export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar skeleton */}
      <aside className="hidden w-56 shrink-0 border-r border-border bg-[#0B0B0B] p-4 md:block">
        <div className="mb-6 h-7 w-24 animate-pulse rounded-md bg-white/5" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded-lg bg-white/5" />
          ))}
        </div>
      </aside>

      {/* Main content skeleton */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="h-7 w-40 animate-pulse rounded-md bg-white/5" />
          <div className="h-8 w-28 animate-pulse rounded-full bg-white/5" />
        </div>

        {/* KPI cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border border-border bg-card" />
          ))}
        </div>

        {/* Chart + mini card */}
        <div className="grid gap-4 md:grid-cols-[1fr_280px]">
          <div className="h-64 animate-pulse rounded-2xl border border-border bg-card" />
          <div className="h-64 animate-pulse rounded-2xl border border-border bg-card" />
        </div>
      </div>
    </div>
  );
}
