"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const STORAGE_KEY = "locpilote_onboarded_v2";

type Answer = { q1?: string; q2?: string; q3?: string };

const QUESTIONS = [
  {
    key: "q1" as const,
    question: "Comment avez-vous découvert locpilote ?",
    options: ["Google / recherche", "Réseaux sociaux", "Bouche à oreille", "Pinterest / blog", "Autre"],
  },
  {
    key: "q2" as const,
    question: "Qu'est-ce qui vous amène ici ?",
    options: [
      "Suivre ma rentabilité",
      "Remplacer mon tableur Excel",
      "Gérer plusieurs biens",
      "Voir l'impact des frais plateforme",
      "Autre",
    ],
  },
  {
    key: "q3" as const,
    question: "Utilisez-vous déjà un outil ?",
    options: ["Non, rien pour l'instant", "Excel / tableur", "Smoobu", "Superhote", "Lodgify / autre"],
  },
];

export function OnboardingModal({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer>({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {}
  }, []);

  const close = (saveAnswers = true) => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
      if (saveAnswers && Object.keys(answers).length > 0) {
        localStorage.setItem("locpilote_onboarding_answers", JSON.stringify(answers));
      }
    } catch {}
    setVisible(false);
    onDone();
  };

  const select = (key: keyof Answer, value: string) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep((s) => s + 1), 200);
    } else {
      setDone(true);
      setTimeout(() => close(true), 1200);
    }
  };

  if (!visible) return null;

  const q = QUESTIONS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-card-lg">

        {/* Progress */}
        <div className="mb-6 flex gap-1.5">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i < step ? "bg-brand-500" : i === step ? "bg-brand-300" : "bg-border"
              }`}
            />
          ))}
        </div>

        {done ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10">
              <CheckCircle2 size={32} className="text-brand-500" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-fg">Parfait, bienvenue !</h2>
            <p className="mt-2 text-sm text-muted">Votre tableau de bord est prêt.</p>
          </div>
        ) : (
          <>
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-600">
              Question {step + 1} / {QUESTIONS.length}
            </div>
            <h2 className="text-xl font-bold text-fg">{q.question}</h2>
            <p className="mt-1 text-sm text-muted">Choisissez une option ci-dessous.</p>

            <div className="mt-6 grid gap-2">
              {q.options.map((opt) => {
                const selected = answers[q.key] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => select(q.key, opt)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold text-left transition-all ${
                      selected
                        ? "border-brand-500 bg-brand-500/10 text-brand-700"
                        : "border-border bg-surface text-fg hover:border-brand-500/50 hover:bg-brand-500/5"
                    }`}
                  >
                    {opt}
                    {selected && <ArrowRight size={14} className="text-brand-500" />}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => close(false)}
              className="mt-5 block w-full text-center text-xs text-dim hover:text-muted transition-colors"
            >
              Passer cette étape
            </button>
          </>
        )}
      </div>
    </div>
  );
}
