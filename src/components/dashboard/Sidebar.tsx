"use client";

import {
  BarChart2,
  Calendar,
  HelpCircle,
  Home,
  LogOut,
  LucideIcon,
  Settings,
  Building2,
  Zap,
} from "lucide-react";
import { Logo } from "../ui/Logo";
import Link from "next/link";

type Item = { id: string; icon: LucideIcon; label: string };

const NAV: Item[] = [
  { id: "overview", icon: Home, label: "Vue d'ensemble" },
  { id: "properties", icon: Building2, label: "Mes biens" },
  { id: "agenda", icon: Calendar, label: "Calendrier" },
  { id: "expenses", icon: BarChart2, label: "Analytique" },
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

  const firstName = userEmail ? userEmail.split("@")[0] : "Votre hôte";
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  const isFree = !planLabel || planLabel === "Gratuit" || planLabel === "Sans offre";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-[240px] shrink-0 border-r border-border bg-white">
        {/* Logo */}
        <div className="flex h-16 items-center px-5">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        {/* Main nav */}
        <nav className="flex-1 space-y-1 px-3 pt-2">
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150 ${
                  isActive
                    ? "border border-border bg-surface font-semibold text-fg"
                    : "font-medium text-muted hover:bg-surface hover:text-fg"
                }`}
              >
                <Icon
                  size={16}
                  className={isActive ? "text-brand-500" : "text-dim"}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Upgrade banner for free users */}
        {isFree && (
          <div className="mx-3 mb-3 overflow-hidden rounded-xl bg-brand-tint border border-brand-200 p-4">
            <div className="flex items-center gap-2 text-brand-600">
              <Zap size={13} fill="currentColor" />
              <span className="text-xs font-semibold">Passer à Pro</span>
            </div>
            <p className="mt-1.5 text-xs text-muted leading-relaxed">
              Jusqu&apos;à 10 biens, synchro automatique et plus.
            </p>
            <Link
              href="/#pricing"
              className="mt-3 flex items-center justify-center rounded-lg bg-brand-500 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Voir les offres
            </Link>
          </div>
        )}

        {/* Bottom section */}
        <div className="border-t border-border px-3 py-3 space-y-1">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-surface hover:text-fg transition-colors"
          >
            <HelpCircle size={16} className="text-dim" />
            Aide
          </button>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-surface hover:text-fg transition-colors"
            >
              <LogOut size={16} className="text-dim" />
              Déconnexion
            </button>
          )}
        </div>

        {/* User */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="truncate text-sm font-semibold text-fg">
                {displayName}
              </div>
              <div className="truncate text-[11px] text-muted">
                {planLabel ?? "Sans offre"}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t border-border bg-white/95 backdrop-blur">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-[10px] transition-colors ${
                isActive ? "text-brand-500" : "text-dim"
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
