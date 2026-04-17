"use client";

import {
  Banknote,
  Droplets,
  Home as HomeIcon,
  Percent,
  Sparkles,
  Wifi,
  Zap,
} from "lucide-react";
import { Inputs } from "@/lib/types";
import { NumberInput } from "../ui/Input";

type Props = {
  inputs: Inputs;
  onChange: (patch: Partial<Inputs>) => void;
};

export function InputsPanel({ inputs, onChange }: Props) {
  return (
    <section className="grid gap-5 lg:grid-cols-3">
      {/* Revenus */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-medium text-white">Revenus</h3>
        <p className="text-xs text-muted">Montants bruts par canal.</p>
        <div className="mt-5 space-y-4">
          <NumberInput
            label="Revenu Airbnb"
            value={inputs.airbnb}
            onChange={(v) => onChange({ airbnb: v })}
          />
          <NumberInput
            label="Revenu Booking.com"
            value={inputs.booking}
            onChange={(v) => onChange({ booking: v })}
          />
          <NumberInput
            label="Futur / confirmé"
            value={inputs.future}
            onChange={(v) => onChange({ future: v })}
            icon={<Sparkles size={12} className="text-brand-500" />}
          />
        </div>
      </div>

      {/* Charges */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-medium text-white">Dépenses</h3>
        <p className="text-xs text-muted">Charges mensuelles récurrentes.</p>
        <div className="mt-5 grid grid-cols-2 gap-4">
          <NumberInput
            label="Crédit / loyer"
            value={inputs.credit}
            onChange={(v) => onChange({ credit: v })}
            icon={<Banknote size={12} />}
          />
          <NumberInput
            label="Électricité"
            value={inputs.elec}
            onChange={(v) => onChange({ elec: v })}
            icon={<Zap size={12} />}
          />
          <NumberInput
            label="Eau"
            value={inputs.eau}
            onChange={(v) => onChange({ eau: v })}
            icon={<Droplets size={12} />}
          />
          <NumberInput
            label="Internet"
            value={inputs.internet}
            onChange={(v) => onChange({ internet: v })}
            icon={<Wifi size={12} />}
          />
          <NumberInput
            label="Ménage"
            value={inputs.menage}
            onChange={(v) => onChange({ menage: v })}
            icon={<HomeIcon size={12} />}
          />
        </div>
      </div>

      {/* Frais plateformes */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-medium text-white">Frais de plateforme</h3>
        <p className="text-xs text-muted">Pourcentage prélevé par canal.</p>
        <div className="mt-5 space-y-4">
          <NumberInput
            label="Frais Airbnb"
            value={inputs.airbnbFeePct}
            onChange={(v) => onChange({ airbnbFeePct: v })}
            suffix="%"
            icon={<Percent size={12} />}
          />
          <NumberInput
            label="Frais Booking.com"
            value={inputs.bookingFeePct}
            onChange={(v) => onChange({ bookingFeePct: v })}
            suffix="%"
            icon={<Percent size={12} />}
          />
        </div>
        <div className="mt-6 rounded-xl border border-border bg-[#0E0E0E] p-4">
          <div className="text-[11px] uppercase tracking-widest text-dim">
            Astuce
          </div>
          <p className="mt-1 text-xs text-muted">
            Les hôtes Airbnb paient généralement 3 % (frais partagés) ou
            jusqu&apos;à 15 % (frais hôte). Vérifiez votre compte pour être
            précis.
          </p>
        </div>
      </div>
    </section>
  );
}
