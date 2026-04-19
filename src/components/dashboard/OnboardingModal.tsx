"use client";

import { useEffect, useState } from "react";
import { Building2, CalendarDays, Wallet, X, ArrowRight } from "lucide-react";

const STORAGE_KEY = "locpilote_onboarded";

const STEPS = [
  {
    icon: Building2,
    title: "Ajoutez votre premier bien",
    desc: "Cliquez sur « Ajouter un bien » dans la section Biens et donnez-lui un nom.",
  },
  {
    icon: CalendarDays,
    title: "Connectez votre iCal",
    desc: "Dans Paramètres, collez votre lien iCal Airbnb ou Booking.com pour importer vos réservations automatiquement.",
  },
  {
    icon: Wallet,
    title: "Renseignez vos dépenses",
    desc: "Dans Dépenses, saisissez vos charges mensuelles. Votre bénéfice net s'affiche en temps réel.",
  },
];

export function OnboardingModal({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {}
  }, []);

  const close = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setVisible(false);
    onDone();
  };

  if (!visible) return null;

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <button
          type="button"
          onClick={close}
          aria-label="Fermer"
          className="absolute right-4 top-4 text-dim hover:text-white"
        >
          <X size={16} />
        </button>

        {/* Step indicator */}
        <div className="mb-5 flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-brand-500" : "bg-border"
              }`}
            />
          ))}
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20">
          <Icon size={22} />
        </div>

        <h2 className="mt-4 text-lg font-medium text-white">{current.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{current.desc}</p>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={close}
            className="text-xs text-dim hover:text-muted"
          >
            Passer
          </button>
          <button
            type="button"
            onClick={() => (isLast ? close() : setStep((s) => s + 1))}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-500 px-4 text-sm font-medium text-black hover:bg-brand-400"
          >
            {isLast ? "C'est parti !" : "Suivant"}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
