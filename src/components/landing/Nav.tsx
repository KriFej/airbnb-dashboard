"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";

const LINKS = [
  { href: "#features", label: "Fonctionnalités" },
  { href: "#pricing", label: "Tarifs" },
  { href: "/simulateur", label: "Simulateur" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-border">
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
          <a
            href="/login"
            className="hidden sm:inline-flex items-center px-4 py-2 text-sm text-muted hover:text-fg transition-colors"
          >
            Connexion
          </a>
          <Button href="/signup" size="md">
            Commencer
          </Button>
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
        <nav className="flex flex-col border-t border-border bg-white px-6 py-4 gap-4 md:hidden">
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
          <a href="/login" className="text-sm text-muted hover:text-fg transition-colors">
            Connexion
          </a>
        </nav>
      )}
    </header>
  );
}
