"use client";

import {
  Calendar,
  Home,
  LogOut,
  LucideIcon,
  Settings,
  Building2,
  Wallet,
} from "lucide-react";
import { Logo } from "../ui/Logo";
import Link from "next/link";

type Item = { id: string; icon: LucideIcon; label: string };

const NAV: Item[] = [
  { id: "overview", icon: Home, label: "Vue d'ensemble" },
  { id: "properties", icon: Building2, label: "Biens" },
  { id: "agenda", icon: Calendar, label: "Agenda" },
  { id: "expenses", icon: Wallet, label: "Dépenses" },
  { id: "settings", icon: Settings, label: "Paramètres" },
];

export function Sidebar({
  active,
  onNavigate,
  userEmail,
  planLabel,
  onLogout,
}: {
  active: string;
  onNavigate: (id: string) => void;
  userEmail?: string;
  planLabel?: string;
  onLogout?: () => void;
}) {
  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : "YO";
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
            {initials}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="truncate text-sm font-medium">
              {userEmail ?? "Votre hôte"}
            </div>
            <div className="truncate text-xs text-muted">
              {planLabel ?? "Sans offre"}
            </div>
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="text-dim hover:text-white"
              aria-label="Se déconnecter"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
