"use client";

import {
  Calendar,
  Home,
  LogOut,
  LucideIcon,
  Settings,
  Building2,
  Wallet,
  Zap,
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

  const isFree = !planLabel || planLabel === "Gratuit" || planLabel === "Sans offre";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-[220px] shrink-0 border-r border-border bg-surface">
        {/* Logo */}
        <div className="flex h-16 items-center px-5">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3 pt-2">
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-brand-500/12 text-brand-400"
                    : "text-muted hover:bg-fg/5 hover:text-fg"
                }`}
              >
                <Icon
                  size={16}
                  className={isActive ? "text-brand-400" : "text-dim"}
                />
                {item.label}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Upgrade banner for free users */}
        {isFree && (
          <div className="mx-3 mb-3 overflow-hidden rounded-xl bg-brand-500/8 border border-brand-500/20 p-4">
            <div className="flex items-center gap-2 text-brand-400">
              <Zap size={13} fill="currentColor" />
              <span className="text-xs font-semibold">Passer à Pro</span>
            </div>
            <p className="mt-1.5 text-xs text-muted leading-relaxed">
              Jusqu&apos;à 10 biens, synchro automatique et plus.
            </p>
            <Link
              href="/#pricing"
              className="mt-3 flex items-center justify-center rounded-lg bg-brand-500 py-2 text-xs font-semibold text-black transition-colors hover:bg-brand-400"
            >
              Voir les offres
            </Link>
          </div>
        )}

        {/* User */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-black">
              {initials}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="truncate text-xs font-medium text-fg">
                {userEmail ?? "Votre hôte"}
              </div>
              <div className="truncate text-[11px] text-muted">
                {planLabel ?? "Sans offre"}
              </div>
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="text-dim hover:text-fg transition-colors"
                aria-label="Se déconnecter"
              >
                <LogOut size={13} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t border-border bg-surface/95 backdrop-blur">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-[10px] transition-colors ${
                isActive ? "text-brand-400" : "text-dim"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}
