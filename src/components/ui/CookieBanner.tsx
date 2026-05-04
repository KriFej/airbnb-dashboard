"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "locpilote_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  const accept = () => { localStorage.setItem(STORAGE_KEY, "accepted"); setVisible(false); };
  const decline = () => { localStorage.setItem(STORAGE_KEY, "declined"); setVisible(false); };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 w-[320px] max-w-[calc(100vw-2rem)]">
      <div className="rounded-2xl border border-border bg-white p-5 shadow-lg">
        <p className="text-xs font-semibold text-fg">Vos préférences de cookies</p>
        <p className="mt-1.5 text-xs text-muted leading-relaxed">
          Nous utilisons uniquement des cookies essentiels pour l'authentification. Aucun cookie publicitaire.{" "}
          <Link href="/legal/privacy" className="text-brand-500 hover:underline">En savoir plus</Link>
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={decline}
            className="flex-1 h-9 rounded-xl border border-border text-xs font-medium text-muted hover:bg-surface transition-colors"
          >
            Obligatoires uniquement
          </button>
          <button
            type="button"
            onClick={accept}
            className="flex-1 h-9 rounded-xl border border-brand-500 bg-brand-500 text-xs font-medium text-white hover:bg-brand-600 transition-colors"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
