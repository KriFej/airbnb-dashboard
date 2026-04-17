"use client";

import {
  Calendar,
  Home,
  LineChart,
  LogOut,
  LucideIcon,
  Settings,
  Wallet,
} from "lucide-react";
import { Logo } from "../ui/Logo";
import Link from "next/link";

type Item = { id: string; icon: LucideIcon; label: string };

const NAV: Item[] = [
  { id: "overview", icon: Home, label: "Overview" },
  { id: "bookings", icon: Calendar, label: "Bookings" },
  { id: "expenses", icon: Wallet, label: "Expenses" },
  { id: "analytics", icon: LineChart, label: "Analytics" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export function Sidebar({
  active,
  onNavigate,
}: {
  active: string;
  onNavigate: (id: string) => void;
}) {
  return (
    <aside className="hidden md:flex md:flex-col w-[240px] shrink-0 border-r border-border bg-surface">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-brand-500/10 text-brand-400"
                  : "text-muted hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-xl bg-card p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-black">
            YO
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="truncate text-sm font-medium">Your host</div>
            <div className="truncate text-xs text-muted">Free plan</div>
          </div>
          <LogOut size={14} className="text-dim" />
        </div>
      </div>
    </aside>
  );
}
