"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "locpilote_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 px-4 pb-2 md:bottom-4">
      <div className="mx-auto flex max-w-2xl flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-card-md sm:flex-row sm:items-center sm:gap-4">
        <p className="flex-1 text-xs text-muted">
          Nous utilisons des cookies essentiels pour le fonctionnement de l&apos;application (authentification, session).{" "}
          <Link href="/privacy" className="text-brand-500 hover:underline">
            Politique de confidentialité
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={decline}
            className="h-9 rounded-full border border-border px-4 text-xs text-muted hover:text-fg"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={accept}
            className="h-9 rounded-full bg-brand-500 px-4 text-xs font-medium text-white hover:bg-brand-600"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
