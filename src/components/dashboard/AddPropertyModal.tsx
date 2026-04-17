"use client";

import { FormEvent, useEffect, useState } from "react";
import { Building2, Plus, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
};

export function AddPropertyModal({ open, onClose, onCreate }: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!open) setName("");
  }, [open]);

  if (!open) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20">
              <Building2 size={18} />
            </span>
            <div>
              <h3 className="text-base font-medium text-white">
                Nouveau bien
              </h3>
              <p className="text-xs text-muted">
                Donnez-lui un nom pour vous y retrouver.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-muted hover:bg-white/5 hover:text-white"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-muted">
              Nom du bien
            </span>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Appart Paris, Studio Lyon…"
              className="h-11 w-full rounded-xl border border-border bg-[#0E0E0E] px-3 text-sm text-white placeholder:text-dim focus:border-brand-500/60 focus:outline-none"
            />
          </label>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-full border border-border bg-[#0E0E0E] px-4 text-xs font-medium text-white hover:border-border-hover"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-brand-500 px-4 text-xs font-medium text-black hover:bg-brand-400 disabled:opacity-50"
            >
              <Plus size={14} />
              Créer le bien
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
