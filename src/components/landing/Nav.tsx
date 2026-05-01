"use client";

import { useState } from "react";
import { Menu, Monitor, X } from "lucide-react";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { ThemeToggle } from "../ui/ThemeToggle";

const LINKS = [
  { href: "#features", label: "Fonctionnalités" },
  { href: "#pricing", label: "Tarifs" },
  { href: "/simulateur-lmnp", label: "Simulateur LMNP" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [banner, setBanner] = useState(true);

  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-2xl">
      {banner && (
        <div className="flex items-center justify-between gap-3 border-b border-brand-500/20 bg-brand-500/10 px-4 py-2 md:hidden">
          <div className="flex items-center gap-2 text-xs text-brand-300">
            <Monitor size={13} className="shrink-0" />
            <span>Meilleure expérience sur ordinateur.</span>
          </div>
          <button type="button" onClick={() => setBanner(false)} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-brand-400 hover:bg-brand-500/20 hover:text-fg" aria-label="Fermer">
            <X size={13} />
          </button>
        </div>
      )}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-fg transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button href="/login" variant="secondary" size="md">
            Connexion
          </Button>
          <Button href="/signup" size="md">
            Commencer
          </Button>
          {/* Hamburger */}
          <button
            type="button"
            className="ml-1 flex md:hidden items-center justify-center rounded-lg p-2 text-muted hover:text-fg"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="flex flex-col border-t border-border/60 bg-bg px-6 py-4 gap-4 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm text-muted hover:text-fg transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
